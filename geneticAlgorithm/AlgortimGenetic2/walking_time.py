import googlemaps
from datetime import datetime

gmaps = googlemaps.Client(key='AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw')

def calculate_walking_time(origin, destination):
    now = datetime.now()
    directions_result = gmaps.directions(origin,
                                         destination,
                                         mode="walking",
                                         departure_time=now)
    if directions_result:
        # Extract walking duration from the response
        walking_time = directions_result[0]['legs'][0]['duration']['text']
        # Convert walking time to minutes
        walking_time_minutes = int(walking_time.split()[0])
        return walking_time_minutes
    else:
        return None




