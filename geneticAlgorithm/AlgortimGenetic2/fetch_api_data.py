import json
import requests
import redis

from extract_hours import extract_hours

API_KEY = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw'

redis_host = 'localhost'
redis_port = 6379
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=0)


def calculate_probability(loc_list):
    # print(loc_list)
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
        if max_reviews != 0:
            probabilities = [total / max_reviews for total in ratings_totals]
        else:
            probabilities = [1 for total in ratings_totals]

        for loc, prob in zip(locations, probabilities):
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


def getDesiredPlace_details(place_id):
    url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,photos' \
          f',opening_hours,formatted_address,rating,user_ratings_total,type,geometry,place_id&key={API_KEY} '
    response = requests.get(url)
    # lat, lng, formatted_address, rating, user_ratings_total, type
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


def extract_places(text):
    places = text.split(',')
    places = [place.strip() for place in places]
    return places


def fetch_api_data(destination, user_preferences):
    results = []
    locations = []
    unique_names = set()

    # scot pentru orasul X toate locatiile de care am nevoie
    for preference in user_preferences['preferredLocations']:
        preference_key = f"{destination}_{preference}"
        preference_data = redis_client.get(preference_key)
        if preference_data:
            results.extend(json.loads(preference_data.decode('utf-8')))
        else:
            places = search_places(destination, preference)
            results.extend(places)

            redis_client.set(preference_key, json.dumps(places, ensure_ascii=False))
            redis_client.expire(preference_key, 6 * 30 * 24 * 3600)

    for location in results:
        name = location.get('name')
        if name and name not in unique_names:  # asigur ca nu am locatii duplicate de la api
            unique_names.add(name)
            placeId_key = f"{destination}_placeId"
            placeId_data = redis_client.get(placeId_key)
            if placeId_data:
                place_id = json.loads(placeId_data.decode('utf-8'))
            else:
                place_id = get_place_id(name)
                redis_client.set(placeId_key, json.dumps(place_id, ensure_ascii=False))
                redis_client.expire(placeId_key, 6 * 30 * 24 * 3600)

            if place_id:
                details_key = f"{place_id}_detailsKey"
                details_data = redis_client.get(details_key)
                if details_data:
                    place_details = json.loads(details_data.decode('utf-8'))
                else:
                    place_details = get_place_details(place_id['place_id'])
                    redis_client.set(details_key, json.dumps(place_details, ensure_ascii=False))
                    redis_client.expire(details_key, 6 * 30 * 24 * 3600)

                if place_details:
                    types = location.get('types') if location.get('types') else None
                    for tip in types:
                        if tip in user_preferences['preferredLocations']:
                            type = tip
                            break

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
                        'user_ratings_total': location.get('user_ratings_total', 0),
                        'photo': location.get('photos', [{}]),
                        # 'photo': location.get('photos', [{}])[0].get('photo_reference', 'N/A'),
                        'opening_hours': hours,
                        "type": type,
                        "desired": "false"
                    }
                    locations.append(loc)

            else:
                print("Failed to fetch place details.")

    if user_preferences['place_name']:
        desired_loc = extract_places(user_preferences['place_name'])
        for i in desired_loc:
            id = get_place_id(i)
            # cautam daca locatia aleasa de user exista deja in locatiile alese
            place = [loc for loc in locations if loc['place_id'] == id['place_id']]

            if place:
                place[0]['desired'] = 'true'
            else:
                location = getDesiredPlace_details(id['place_id'])

                types = location.get('types') if location.get('types') else None
                for t in types:
                    if t in user_preferences['preferredLocations']:
                        tip = t
                        break
                try:
                    hours = extract_hours(location['opening_hours']['weekday_text'])
                except Exception as e:
                    print('')
                loc = {
                    'name': location['name'],
                    'place_id': location['place_id'],
                    'lat': location['geometry']['location']['lat'],
                    'long': location['geometry']['location']['lng'],
                    'address': location['formatted_address'],
                    'rating': location.get('rating', 'N/A'),
                    'user_ratings_total': location.get('user_ratings_total', 0),
                    'photo': location.get('photos', [{}]),
                    'opening_hours': hours,
                    "type": tip,
                    'desired': 'true'
                }
                locations.append(loc)

    if not locations:
        destination_parts = destination.split(',')
        new_destination = destination_parts[0].strip()
        return fetch_api_data(new_destination, user_preferences)

    calculate_probability(locations)

    return locations
