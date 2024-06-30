import json
import requests
import redis

from extract_hours import extract_hours

API_KEY = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw'

redis_host = 'localhost'
redis_port = 6379
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=0)

default_opening_hours = {
    "Mo": [{"start": " 09:00", "end": "18:00"}],
    "Tu": [{"start": "09:00", "end": "18:00"}],
    "We": [{"start": " 09:00", "end": " 18:00"}],
    "Th": [{"start": " 09:00", "end": " 18:00"}],
    "Fr": [{"start": " 09:00", "end": " 18:00"}],
    "Sa": [{"start": "09:00", "end": "18:00"}],
    "Su": [{"start": "09:00", "end": "18:00"}],
}

f = open("logFile.txt", "a")


def calculate_probability(loc_list):
    type_groups = {}
    for loc in loc_list:
        loc_type = loc['type']
        if loc_type not in type_groups:
            type_groups[loc_type] = []
        type_groups[loc_type].append(loc)

    for loc_type, locations in type_groups.items():
        ratings_totals = [loc['user_ratings_total'] for loc in locations]
        average_ratings = [loc['rating'] if 'rating' in loc and loc['rating'] != 'N/A' else 1 for loc in locations]

        max_reviews = max(ratings_totals) if ratings_totals else 1
        max_rating = 5

        if max_reviews != 0:
            normalized_reviews = [total / max_reviews for total in ratings_totals]
            normalized_ratings = [rating / max_rating for rating in average_ratings]
        else:
            normalized_reviews = [1 for _ in ratings_totals]
            normalized_ratings = [1 for _ in ratings_totals]

        review_weight = 0.5
        rating_weight = 0.5
        probabilities = [
            review_weight * review + rating_weight * rating
            for review, rating in zip(normalized_reviews, normalized_ratings)
        ]

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
        f.write(f'Error searching for places. Status code: {response.status_code}')
        return None


def get_place_id(place_name):
    url = f'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={place_name}&inputtype=textquery&key={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        place_data = response.json()
        if place_data['status'] == 'OK' and place_data['candidates']:
            place_info = place_data['candidates'][0]
            return place_info
        else:
            f.write(f'No results found for place: {place_name}')
            return None
    else:
        f.write(f'Error searching for place: {place_name}. Status code: {response.status_code}')
        return None


def get_place_details(place_id):
    url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=opening_hours&key={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        place_details = response.json()
        if place_details['status'] == 'OK':
            return place_details['result']
        else:
            f.write(f'Error retrieving place details. Status: {place_details["status"]}')
            return None
    else:
        f.write(f'Error retrieving place details. Status code: {response.status_code}')
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
            f.write(f'Error retrieving place details. Status: {place_details["status"]}')
            return None
    else:
        f.write(f'Error retrieving place details. Status code: {response.status_code}')
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
                    type = "must-see"
                    types = location.get('types') if location.get('types') else None
                    for tip in types:
                        if tip in user_preferences['preferredLocations']:
                            type = tip
                            break

                    try:
                        hours = extract_hours(place_details['opening_hours']['weekday_text'])

                    except Exception as e:
                        f.write(str(e))
                        hours = default_opening_hours

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
                f.write("Failed to fetch place details.")

    if not locations:
        destination_parts = destination.split(',')
        new_destination = destination_parts[0].strip()
        f.write("The api did not work for this destination, trying to split the name of the city" + str(destination_parts))
        return fetch_api_data(new_destination, user_preferences)

    if user_preferences['place_name']:
        desired_loc = extract_places(user_preferences['place_name'])
        for i in desired_loc:
            id = get_place_id(i)
            # cautam daca locatia aleasa de user exista deja in locatiile alese
            if id is not None:
                place = [loc for loc in locations if loc['place_id'] == id['place_id']]

                if place:
                    place[0]['desired'] = 'true'
                else:
                    location = getDesiredPlace_details(id['place_id'])
                    if location is not None:
                        tip = "must-see"
                        types = location.get('types') if location.get('types') else None
                        for t in types:
                            if t in user_preferences['preferredLocations']:
                                tip = t
                                break
                        try:
                            hours = extract_hours(location['opening_hours']['weekday_text'])
                        except Exception as e:
                            f.write(str(e))
                            hours = default_opening_hours
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


    calculate_probability(locations)

    return locations
