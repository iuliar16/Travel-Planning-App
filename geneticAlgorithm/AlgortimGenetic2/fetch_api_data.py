import json

import requests
import redis

from extract_hours import extract_hours

API_KEY = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw'

redis_host = 'localhost'
redis_port = 6379
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=0)

# def calculate_probability(loc_list):
#     ratings_totals = [loc['user_ratings_total'] for loc in loc_list]
#
#     max_reviews = max(ratings_totals)
#
#     probabilities = [total / max_reviews for total in ratings_totals]
#
#     total_prob = sum(probabilities)
#     normalized_probs = [prob / total_prob for prob in probabilities]
#
#     for loc, prob in zip(loc_list, normalized_probs):
#         loc['score'] = prob
#
#     return loc_list


def calculate_probability(loc_list):
    # grupare locatii dupa tip
    type_groups = {}
    for loc in loc_list:
        loc_type = loc['type']
        if loc_type not in type_groups:
            type_groups[loc_type] = []
        type_groups[loc_type].append(loc)

    # calculare probabilitati pentru fiecare locatie relativ la tipul acesteia
    for loc_type, locations in type_groups.items():
        ratings_totals = [loc['user_ratings_total'] for loc in locations]
        max_reviews = max(ratings_totals) if ratings_totals else 1
        probabilities = [total / max_reviews for total in ratings_totals]
        total_prob = sum(probabilities)
        normalized_probs = [prob / total_prob for prob in probabilities]

        for loc, prob in zip(locations, normalized_probs):
            loc['score'] = prob

    return loc_list


def search_places(city, type):
    url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?query={city}&types={type}&key={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        results = response.json()
        return results.get('results', [])
    else:
        print(f'Error searching for places. Status code: {response.status_code}')
        return None


def get_place_id(place_name):
    url = f'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={place_name}&inputtype=textquery&key={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        place_data = response.json()
        if place_data['status'] == 'OK' and place_data['candidates']:
            place_info = place_data['candidates'][0]
            # print(place_data['candidates'][0])
            return place_info
        else:
            print(f'No results found for place: {place_name}')
            return None
    else:
        print(f'Error searching for place: {place_name}. Status code: {response.status_code}')
        return None


def get_place_details(place_id):
    url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=opening_hours&key={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        place_details = response.json()
        if place_details['status'] == 'OK':
            return place_details['result']
        else:
            print(f'Error retrieving place details. Status: {place_details["status"]}')
            return None
    else:
        print(f'Error retrieving place details. Status code: {response.status_code}')
        return None


def fetch_api_data(destination, user_preferences):
    results = []
    locations = []
    unique_names = set()

    # scot pentru orasul X toate locatiile de care am nevoie
    for preference in user_preferences['preferredLocations']:
        preference_key = f"{destination}_{preference}"
        preference_data = redis_client.get(preference_key)
        if preference_data:
            results.extend(json.loads(preference_data))
        else:
            places = search_places(destination, preference)
            results.extend(places)

            redis_client.set(preference_key, json.dumps(places))
            redis_client.expire(preference_key, 6 * 30 * 24 * 3600)

    for location in results:
        name = location.get('name')
        if name and name not in unique_names: #asigur ca nu am locatii duplicate de la api
            unique_names.add(name)
            placeId_key = f"{destination}_placeId"
            placeId_data = redis_client.get(placeId_key)
            if placeId_data:
                place_id = json.loads(placeId_data)
            else:
                place_id = get_place_id(name)
                redis_client.set(placeId_key, json.dumps(place_id))
                redis_client.expire(placeId_key, 6 * 30 * 24 * 3600)

            if place_id:
                details_key = f"{place_id}_detailsKey"
                details_data = redis_client.get(details_key)
                if details_data:
                    place_details = json.loads(details_data)
                else:
                    place_details = get_place_details(place_id['place_id'])
                    redis_client.set(details_key, json.dumps(place_details))
                    redis_client.expire(details_key, 6 * 30 * 24 * 3600)

                if place_details:
                    type = location.get('types')[0] if location.get('types') else None
                    food = ["food", "meal", "takeaway","meal","bar"]
                    for word in food:
                        if word in type:
                            type = 'restaurant'

                    if type == 'locality' or type == 'cafe':
                        continue
                    try:
                        hours = extract_hours(place_details['opening_hours']['weekday_text'])

                    except Exception as e:
                        print(e)
                        break
                    loc = {
                        'name': location['name'],
                        'place_id': location['place_id'],
                        'lat': location['geometry']['location']['lat'],
                        'long': location['geometry']['location']['lng'],
                        'address': location['formatted_address'],
                        'rating': location.get('rating', 'N/A'),
                        'user_ratings_total': location.get('user_ratings_total', '0'),
                        'photo': location.get('photos', [{}]),
                        # 'photo': location.get('photos', [{}])[0].get('photo_reference', 'N/A'),
                        'opening_hours': hours,
                        "type": type
                    }
                    # if type == 'tourist_attraction':
                    #     print(loc)
                    locations.append(loc)

            else:
                print("Failed to fetch place details.")

    calculate_probability(locations)
    # print(locations)
    return locations


def bayesian_average(R, m, C=4, v=10):
    if R == 0 or m == 0 or R == 'N/A' or m == 'N/A':
        return 0
    bayesian_score = ((C * int(m)) + (int(R) * v)) / (C + v)
    return bayesian_score
