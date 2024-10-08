import math
import random
import sys
import time
from extract_hours import *
from fetch_api_data import *

sys.stdout.reconfigure(encoding="utf-8")

MIN_LOCATIONS_PER_DAY = 5
WALKING_SPEED = 4
THRESHOLD_WALKING_DISTANCE = 2
CAR_SPEED = 30

start_time = time.time()

default_opening_hours = {
    "Mo": [{"start": " 09:00", "end": "18:00"}],
    "Tu": [{"start": "09:00", "end": "18:00"}],
    "We": [{"start": " 09:00", "end": " 18:00"}],
    "Th": [{"start": " 09:00", "end": " 18:00"}],
    "Fr": [{"start": " 09:00", "end": " 18:00"}],
    "Sa": [{"start": "09:00", "end": "18:00"}],
    "Su": [{"start": "09:00", "end": "18:00"}],
}

categorii_locatii = ["restaurant", "museum", "spa", "shopping_mall", "zoo", "place_of_worship",
                     "casino", "park", "tourist_attraction"]

tipuri_spendtime = {
    "spa": 120,
    "museum": 120,
    "zoo": 180,
    "park": 60,
    "casino": 120,
    "shopping_mall": 120,
    "place_of_worship": 60,
    "restaurant": 90,
    "tourist_attraction": 120,
}
mapare_destinatii = {
    'Must-see Attractions': 'tourist_attraction',
    'Museums': 'museum',
    'Parks': 'park',
    'Zoo': 'zoo',
    'Wellness and Spas': 'spa',
    'Places of worship': 'place_of_worship',
    'Casino': 'casino',
    'Shopping Malls': 'shopping_mall',
}
reverse_mapare_destinatii = {v: k for k, v in mapare_destinatii.items()}
if len(sys.argv) > 1:
    preferences_str = sys.argv[1]
    prefs = json.loads(preferences_str)
    preferinte = prefs['preferredLocations']
    location = prefs['location']
    placeName = prefs['placeName']
    percentages = prefs['locationPreferences']

    option = prefs['selectedOption']
    if option == 'length':
        trip_length = prefs['trip_length']
    else:
        startDate = prefs['startDate']
        endDate = prefs['endDate']
        a = datetime.strptime(startDate, '%Y-%m-%d')
        b = datetime.strptime(endDate, '%Y-%m-%d')
        delta = b - a
        trip_length = delta.days + 1

    preferences = [mapare_destinatii[pref] for pref in preferinte]
    preferences.append('restaurant')

    if option == 'length':
        user_preferences = {"preferredLocations": preferences,
                            "location": location,
                            "trip_length": trip_length,
                            "place_name": placeName,
                            "percentages": percentages}
    else:
        user_preferences = {"preferredLocations": preferences,
                            "location": location,
                            "trip_length": trip_length,
                            "start_date": startDate,
                            "place_name": placeName,
                            "percentages": percentages
                            }

else:
    option = 'dates'
    user_preferences = {
        "preferredLocations": ["restaurant", "place_of_worship"],
        "location": "Iasi, Romania",
        "trip_length": 1,
        "start_date": "2024-03-03",
        # "place_name": "Eiffel Tower, 'Conciergerie', 'Arc De Triomphe'",
        "place_name": "",
        "percentages": {'Places of worship': 30}
        # "percentages": {'Museums': 81, 'Parks': 79,
        #                 'Casino': 30, 'Shopping Malls': 50, 'Places of worship': 30, 'Zoo': 55, 'Wellness and Spas': 35}
    }
if option == "dates":
    start_date = user_preferences['start_date']
    start = datetime.strptime(start_date, '%Y-%m-%d')

destination = user_preferences['location']
trip_length = user_preferences['trip_length']

locatii = fetch_api_data(destination, user_preferences)

percentages = user_preferences['percentages']

# In cazul in care sunt prea putine locatii alese pentru numarul de zile
if trip_length > 1:
    required_locations = (trip_length -1) * 10
else:
    required_locations = 30

if len(locatii) <= required_locations:
    remaining_categories = [category for category in categorii_locatii if category not in user_preferences['preferredLocations']]
    additional_categories = remaining_categories[:required_locations - len(locatii) // len(user_preferences['preferredLocations'])]

    for category in additional_categories:
        cat = reverse_mapare_destinatii[category]
        percentages[cat] = 1
    user_preferences['preferredLocations'] = ['museum','restaurant','spa', 'shopping_mall', 'zoo', 'place_of_worship', 'casino', 'park', 'tourist_attraction']

    locatii = fetch_api_data(destination, user_preferences)

procente_preferinte = {}
for key, value in percentages.items():
    if key in mapare_destinatii:
        transformed_key = mapare_destinatii[key]
        procente_preferinte[transformed_key] = value

def timp_in_minute(ora):
    if ora == 'non-stop':
        return 0
    ore, minute = map(int, ora.split(':'))
    return ore * 60 + minute


def get_locationsPerDay(nr_days, nr_locs):
    if nr_days <= nr_locs:
        return nr_locs // nr_days
    return 1


def initializare_populatie(dimensiune_populatie, nr_max_locatii, locatii_ramase, day_number):
    populatie = []
    for _ in range(dimensiune_populatie):
        restaurant_list = []
        non_restaurant_list = []
        must_see_list = []

        for loc_id in locatii_ramase:

            if locatii[loc_id]['type'] == 'tourist_attraction':
                must_see_list.append(loc_id)
                locatii[loc_id]['visited'] = 0

            if locatii[loc_id]['type'] == 'restaurant':
                restaurant_list.append(loc_id)
                locatii[loc_id]['visited'] = 0
            else:
                non_restaurant_list.append(loc_id)
                locatii[loc_id]['visited'] = 0

        # locatiile cu mai multe recenzii vor aparea mai des in populatia initiala
        scores = []
        for loc_id in non_restaurant_list:
            scores.append(locatii[loc_id]['score'])

        # random.choices simplu da solutii care contin acelasi id de mai multe ori deci ma asigur ca id-urile sunt unice
        individ = []
        while len(individ) < nr_max_locatii:
            choice = random.choices(non_restaurant_list, weights=scores, k=nr_max_locatii)[0]

            if choice not in individ:
                individ.append(choice)

        total = timp_in_minute('9:00')

        for i, locatie_idx in enumerate(individ):
            locatie = locatii[locatie_idx]
            timp_petrecut = tipuri_spendtime.get(locatie['type'], 60)
            timp_deplasare = matrice_timp_mers[individ[i - 1]][locatie_idx] if i > 0 else 0
            total += timp_petrecut + timp_deplasare

            #  pastrez doar primele locatii
            if total > timp_in_minute('16:00') and len(individ[:i]) > 3:
                individ = individ[:i]
                break

        pos = len(individ) // 2
        pos2 = len(individ) // 2 + 1
        pos3 = len(individ) - 1

        mini = float('inf')
        mini3 = float('inf')

        lunch = restaurant_list[0]
        dinner = restaurant_list[0]

        for rest in restaurant_list:
            if locatii[rest]['visited'] == 0 and locatii[rest]['type'] == 'restaurant':
                timp_deplasare1 = matrice_timp_mers[individ[pos]][rest]
                timp_deplasare2 = matrice_timp_mers[individ[pos2]][rest]

                if timp_deplasare1 + timp_deplasare2 < mini:
                    mini = timp_deplasare1 + timp_deplasare2
                    lunch = rest

        for rest in restaurant_list:
            timp_deplasare3 = matrice_timp_mers[individ[pos3]][rest]

            if timp_deplasare3 < mini3 and rest != lunch:
                mini3 = timp_deplasare3
                dinner = rest

        individ.insert(pos+1, lunch)
        individ.insert(pos3 + 2, dinner)

        populatie.append(individ)

    return populatie


def crossover(parent1, parent2, prob_crossover):
    crossover_point = random.randint(0, min(len(parent1) - 1, len(parent2) - 1))

    if random.random() < prob_crossover:
        child1 = parent1[:crossover_point] + [loc for loc in parent2[crossover_point:] if
                                              loc not in parent1[:crossover_point]]
        child2 = parent2[:crossover_point] + [loc for loc in parent1[crossover_point:] if
                                              loc not in parent2[:crossover_point]]

        return child1, child2
    else:
        return parent1, parent2


def swap_mutation(ruta, probabilitate_mutatie):
    if random.random() < probabilitate_mutatie and len(ruta) >= 2:
        idx1, idx2 = random.sample(range(len(ruta)), 2)
        ruta[idx1], ruta[idx2] = ruta[idx2], ruta[idx1]

def randomReset_mutation(ruta, locatii_ramase, probabilitate_mutatie):
    if random.random() < probabilitate_mutatie:
        idx = random.randint(0, len(ruta) - 1)
        newGene = random.sample(range(len(locatii_ramase)), 1)

        while newGene[0] not in ruta:
            ruta[idx] = newGene[0]
            newGene = random.sample(range(len(locatii_ramase)), 1)


def calcul_distanta(lat1, lon1, lat2, lon2):
    R = 6371.0
    # Conversie din grade in radiani
    lat1_rad = math.radians(float(lat1))
    lon1_rad = math.radians(float(lon1))
    lat2_rad = math.radians(float(lat2))
    lon2_rad = math.radians(float(lon2))

    delta_lat = lat2_rad - lat1_rad
    delta_lon = lon2_rad - lon1_rad

    # 6371=raza medie a Pamantului in km
    # distance = math.sqrt(delta_lat ** 2 + delta_lon ** 2) * 6371
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance


def normalizare_restaurante(ruta, timp_curent):
    penalizare_ore = 0
    # for i in range(len(ruta) - 1):
    #     locatie = locatii[ruta[i]]
    #     if locatie['type'] == 'restaurant':
    #         # penalizez primul restaurant gasit pentru a ma asigura ca e la pranz
    #         if not 12 * 60 <= timp_curent <= 15 * 60:
    #             penalizare_ore += 9500
    #     break

    if len(ruta)>2:
        locatie = locatii[ruta[2]]
        if locatie['type'] != 'restaurant':
            penalizare_ore += 5500
    k = 0
    for i in range(len(ruta)):
        locatie = locatii[ruta[i]]
        if locatie['type'] == 'restaurant':
            k += 1

    if k != 2:
        penalizare_ore += 5500

    # prima locatie din zi nu ar trebui sa fie un restaurant
    if locatii[ruta[0]]['type'] == 'restaurant':
        penalizare_ore += 5500

    for i in range(len(ruta) - 2):
        if locatii[ruta[i]]['type'] == 'restaurant' and locatii[ruta[i + 1]]['type'] == 'restaurant':
            penalizare_ore += 5500

    if locatii[ruta[len(ruta) - 2]]['type'] == 'restaurant' and locatii[ruta[len(ruta) - 1]][
        'type'] == 'restaurant':
        penalizare_ore += 5500

    if locatii[ruta[len(ruta) - 1]]['type'] != 'restaurant':
        penalizare_ore += 5500

    return penalizare_ore


def get_opening_hours(zi, timp_curent, hours):
    g = 0
    opentime = timp_in_minute('9:00')
    closetime = timp_in_minute('21:00')

    if zi in hours:
        for hours_range in hours[zi]:
            if not (is_format0(hours_range['start']) and is_format0(
                    hours_range['end'])):  # daca parserul ia niste date gresit
                hours_range['start'] = '09:00'
                hours_range['end'] = '21:00'

            start_time = timp_in_minute(hours_range['start'])
            end_time = timp_in_minute(hours_range['end'])
            if start_time <= timp_curent < end_time:  # verific daca ma aflu in oricare interval de functionare al locatiei din ziua respectiva
                opentime = timp_in_minute(hours_range['start'])
                closetime = timp_in_minute(hours_range['end'])
                g = 1
                break
    return g, opentime, closetime


must_see_locations = user_preferences['place_name']


def fitness(ruta, day_number, ora_start, zi, total_days, must_see_locations, colecteaza_orar=False):
    timp_curent = timp_in_minute(ora_start)
    orar = []

    # parametri de care se tine cont in calcularea fitness-ului
    closeTime_penalty = 0
    waiting_penalty = 0
    distanta_totala = 0
    penalizare_restaurant = 0
    penalizare_nr_locatii = 0
    penalizare_ora_final = 0
    penalizare_mers = 0
    penalizare_ore_functionare = 0
    penalizare_percentage = 0
    penalizare_ratings = 0
    penalizare_nume = 0

    if len(ruta) < 5:
        penalizare_nr_locatii += 10000

    must_see_included = sum(1 for idx in ruta if locatii[idx]['desired'] == 'true')
    must_see_left = len(must_see_locations) - must_see_included
    remaining_days = total_days - day_number

    beta = math.ceil(must_see_left / remaining_days)
    alpha = must_see_included
    penalty = max(0, beta - alpha) * 1000

    for i in range(len(ruta) - 1):
        distanta_totala += matrice_distantelor[ruta[i]][ruta[i + 1]] * 10

        locatie = locatii[ruta[i]]
        spendtime = tipuri_spendtime.get(locatie['type'], 60)

        if locatie['type'] in procente_preferinte:
            value = procente_preferinte[locatie['type']]
            penalizare_percentage += (100 - value) * 10

        penalizare_ratings -= locatie['user_ratings_total']
        if locatie['user_ratings_total'] == 0 or locatie['rating'] == 'N/A':
            penalizare_ratings += 10000

        if locatie['name'] == destination:
            penalizare_nume += 10000
        g, opentime, closetime = get_opening_hours(zi, timp_curent, locatie['opening_hours'])

        if g == 0:  # locatia este pusa in solutie astfel incat se afla in afara orelor de functionare
            penalizare_ore_functionare = 9000

        if timp_curent < opentime:  # daca sosim inainte de deschidere
            waiting_penalty += (opentime - timp_curent) * 1000
            timp_curent = opentime  # actualizam timpul curent la ora de deschidere

        if timp_curent > closetime:
            closeTime_penalty += 800

        if timp_curent + spendtime > closetime:  # daca spendtime depaseste ora de inchidere
            closeTime_penalty += 800

        # penalizare restaurant
        penalizare_restaurant = normalizare_restaurante(ruta, timp_curent)

        if colecteaza_orar:
            lat = locatie['lat']
            long = locatie['long']
            address = locatie['address']
            photo = locatie['photo']
            type = locatie['type']
            rating = locatie['rating']
            nr_reviews = locatie['user_ratings_total']

            nume_locatie = locatii[ruta[i]]['name']

            ora_sosire = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
            timp_curent += spendtime
            ora_plecare = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"

            orar.append((ruta[i], nume_locatie, ora_sosire, ora_plecare, int(matrice_timp_mers[ruta[i]][ruta[i + 1]]),
                         lat, long, address, photo, type, rating, nr_reviews))
            timp_curent -= spendtime

        timp_deplasare = matrice_timp_mers[ruta[i]][ruta[i + 1]]
        if timp_deplasare > 20:
            penalizare_mers += 200

        timp_curent += timp_deplasare

        timp_curent += spendtime

    ####### procesez ultima locatie separat

    locatie = locatii[ruta[len(ruta) - 1]]
    spendtime = tipuri_spendtime.get(locatie['type'], 60)

    g, opentime, closetime = get_opening_hours(zi, timp_curent, locatie['opening_hours'])
    if g == 0:  # locatia este pusa in solutie astfel incat se afla in afara orelor de functionare
        penalizare_ore_functionare = 9000

    if locatie['type'] in procente_preferinte:
        value = procente_preferinte[locatie['type']]
        penalizare_percentage += 100 - value

    if locatie['name'] == destination:
        penalizare_nume += 10000

    penalizare_ratings -= locatie['user_ratings_total']

    if timp_curent < opentime:  # daca sosim inainte de deschidere
        waiting_penalty += opentime - timp_curent
        timp_curent = opentime  # actualizam timpul curent la ora de deschidere

    if timp_curent > closetime:
        closeTime_penalty += 200

    if timp_curent + spendtime > closetime:  # daca spendtime depaseste ora de inchidere
        closeTime_penalty += 200

    if colecteaza_orar:
        lat = locatie['lat']
        long = locatie['long']
        address = locatie['address']
        photo = locatie['photo']
        type = locatie['type']
        rating = locatie['rating']
        nr_reviews = locatie['user_ratings_total']
        nume_locatie = locatii[ruta[len(ruta) - 1]]['name']

        ora_sosire = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
        timp_curent += spendtime
        ora_plecare = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
        orar.append((ruta[len(ruta) - 1], nume_locatie, ora_sosire, ora_plecare, -1, lat, long, address, photo, type,
                     rating, nr_reviews))

    if timp_curent < timp_in_minute('19:00'):
        penalizare_ora_final = 10000
    fitness_total = distanta_totala + waiting_penalty + \
                    closeTime_penalty + penalizare_restaurant + penalizare_nr_locatii + penalizare_ora_final \
                    + penalizare_mers + penalizare_ore_functionare + penalizare_percentage + penalty + penalizare_nume
    if colecteaza_orar:
        return 1 / (1 + fitness_total), orar
    else:
        return 1 / (1 + fitness_total)


def algoritm_genetic(locatii_ramase, day_number, dimensiune_populatie, nr_generatii, ora_start, zi, total_days,
                     must_see_locations):
    lungime_locatii = len(locatii_ramase)
    populatie = initializare_populatie(dimensiune_populatie, min(6, lungime_locatii), locatii_ramase, day_number)

    for generatie in range(nr_generatii):
        # sortare populatie dupa fitness
        sorted_populatie = sorted(populatie,
                                  key=lambda ruta: fitness(ruta, day_number, ora_start, zi, total_days,
                                                           must_see_locations),
                                  reverse=True)

        elitism_count = int(0.1 * dimensiune_populatie)
        elitism = sorted_populatie[:elitism_count]

        # selectie
        parinti = sorted_populatie[:dimensiune_populatie // 2]

        urmasi = []
        while len(urmasi) < dimensiune_populatie - len(parinti):
            parinte1, parinte2 = random.sample(parinti, 2)
            copil1, copil2 = crossover(parinte1, parinte2, 0.7)

            swap_mutation(copil1, 0.2)
            swap_mutation(copil2, 0.2)
            # randomReset_mutation(copil1,locatii_ramase, 0.2)
            # randomReset_mutation(copil2,locatii_ramase, 0.2)
            urmasi.extend([copil1, copil2])

        populatie = elitism + urmasi

    # determin cea mai buna ruta
    cea_mai_buna_ruta = sorted_populatie[0]

    best_fitness, orar_cea_mai_buna_ruta = fitness(cea_mai_buna_ruta, day_number, ora_start, zi, total_days,
                                                   must_see_locations,
                                                   colecteaza_orar=True)

    return best_fitness, cea_mai_buna_ruta, orar_cea_mai_buna_ruta

# locatii = data['places']
numar_locatii = len(locatii)

# MATRICEA DISTANTELOR
matrice_distantelor = [[0 for _ in range(numar_locatii)] for _ in range(numar_locatii)]
for i in range(numar_locatii):
    for j in range(numar_locatii):
        if i != j:
            matrice_distantelor[i][j] = calcul_distanta(locatii[i]['lat'], locatii[i]['long'], locatii[j]['lat'],
                                                        locatii[j]['long'])

# MATRICEA TIMPULUI DE MERS PE JOS INTRE LOCATII

def calculeaza_timp_mers(distanta_km):
    if distanta_km <= THRESHOLD_WALKING_DISTANCE:
        return (distanta_km / WALKING_SPEED) * 60
    else:
        return (distanta_km / CAR_SPEED) * 60


matrice_timp_mers = []
for rand in matrice_distantelor:
    rand_timp = [calculeaza_timp_mers(distanta) for distanta in rand]
    matrice_timp_mers.append(rand_timp)


# pentru cand se da doar durata calatoriei
def runAlgorithm_tripLength(locatii):
    locatii_ramase = list(range(len(locatii)))

    days_of_week = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    all_results = []
    for start_day in days_of_week:
        start_date = find_first_day_of_week(start_day)
        rezultate_zilnice = runAlgorithm_dates(locatii_ramase,
                                                                                  start_date)
        all_results.append((start_day, rezultate_zilnice))

    best_result = min(all_results, key=lambda x: sum(fit[0] for fit in x[1]))

    return best_result


# pentru cand se da ziua de start
def runAlgorithm_dates(locatii, start_date):
    locatii_ramase = list(range(len(locatii)))
    rezultate_zilnice = []

    start_day_of_trip = start_date.strftime("%a")  # Mon/Tue/Sun..
    start_day_of_trip = start_day_of_trip[:-1]

    days_of_week = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    start_day_index = days_of_week.index(start_day_of_trip)
    current_day_index = start_day_index
    for day_number in range(trip_length):
        current_day = days_of_week[current_day_index]
        best_fitness, cea_mai_buna_ruta, orar_cea_mai_buna_ruta = algoritm_genetic(
            locatii_ramase,
            day_number,
            dimensiune_populatie=200,
            nr_generatii=100,
            ora_start='10:00', zi=current_day, total_days=trip_length, must_see_locations=must_see_locations)
        rezultate_zilnice.append((best_fitness, cea_mai_buna_ruta, orar_cea_mai_buna_ruta))

        current_day_index = (current_day_index + 1) % 7

        # pt urmatoarea zi rulez din nou algoritmul dar nu iau un calcul locatiile deja alese
        for idx in cea_mai_buna_ruta:
            if idx in locatii_ramase:
                locatii_ramase.remove(idx)

    return rezultate_zilnice


def combine_json_strings(json_strings):
    combined_json = []
    for json_str in json_strings:
        combined_json.extend(json.loads(json_str))
    return combined_json


def afiseaza_itinerarii(itinerarii_zilnice):
    all_orar_json = []
    for zi, (fit, ruta, orar) in enumerate(itinerarii_zilnice, start=1):
        order = 1
        orar_dicts = []
        for item in orar:
            orar_dicts.append({
                'id': item[0],
                'name': item[1],
                'arrival_hour': item[2],
                'leave_hour': item[3],
                'duration': item[4],
                'lat': item[5],
                'lng': item[6],
                'address': item[7],
                'photo': item[8],
                'type': item[9],
                'rating': item[10],
                "nr_reviews": item[11],
                'day': zi,
                'order': order,
            })
            order = order + 1

        orar_json = json.dumps(orar_dicts, ensure_ascii=False, indent=2)
        all_orar_json.append(orar_json)

    combined_orar_json = combine_json_strings(all_orar_json)
    combined_orar_json_str = json.dumps(combined_orar_json, ensure_ascii=False, indent=2)
    print(combined_orar_json_str)


def afiseaza_itinerariu_best_day(best_rez):
    all_orar_json = []
    ziua, rezultate_zi = best_rez

    for zi, (fit, ruta, orar) in enumerate(rezultate_zi, start=1):
        order = 1
        orar_dicts = []
        for item in orar:
            orar_dicts.append({
                'id': item[0],
                'name': item[1],
                'arrival_hour': item[2],
                'leave_hour': item[3],
                'duration': item[4],
                'lat': item[5],
                'lng': item[6],
                'address': item[7],
                'photo': item[8],
                'type': item[9],
                'rating': item[10],
                "nr_reviews": item[11],
                'day': zi,
                'best_start': ziua,
                'order': order,
            })
            order = order + 1

        orar_json = json.dumps(orar_dicts, ensure_ascii=False, indent=2)
        all_orar_json.append(orar_json)

    combined_orar_json = combine_json_strings(all_orar_json)
    combined_orar_json_str = json.dumps(combined_orar_json, ensure_ascii=False, indent=2)
    print(combined_orar_json_str)


if option == 'dates':
    itinerarii_zilnice = runAlgorithm_dates(locatii, start)
    afiseaza_itinerarii(itinerarii_zilnice)
else:
    best_rez = runAlgorithm_tripLength(locatii)
    afiseaza_itinerariu_best_day(best_rez)
