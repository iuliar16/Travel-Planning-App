import math
import random
import sys
import time

from extract_hours import *
from fetch_api_data import *

sys.stdout.reconfigure(encoding="utf-8")

start_time = time.time()

default_opening_hours = {
    "Mo": [{"start": " 09:00", "end": "21:00"}],
    "Tu": [{"start": "09:00", "end": "21:00"}],
    "We": [{"start": " 09:00", "end": " 21:00"}],
    "Th": [{"start": " 09:00", "end": " 21:00"}],
    "Fr": [{"start": " 09:00", "end": " 21:00"}],
    "Sa": [{"start": "09:00", "end": "21:00"}],
    "Su": [{"start": "09:00", "end": "21:00"}],
}

categorii_locatii = ["restaurant", "museum", "spa", "shopping_mall", "zoo", "place_of_worship",
                     "night_club", "casino", "park","tourist_attraction"]

tipuri_spendtime = {
    "spa": 120,
    "museum": 120,
    "zoo": 180,
    "park": 90,
    "casino": 120,
    "shopping_mall": 120,
    "place_of_worship": 60,
    "restaurant": 120,
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
if len(sys.argv) > 1:
    preferences_str = sys.argv[1]
    prefs = json.loads(preferences_str)
    preferinte = prefs['preferredLocations']
    location = prefs['location']

    option = prefs['selectedOption']
    if option == 'length':
        trip_length = prefs['trip_length']
    else:
        startDate = prefs['startDate']
        endDate = prefs['endDate']
        a = datetime.strptime(startDate, '%Y-%m-%d')
        b = datetime.strptime(endDate, '%Y-%m-%d')
        delta = b - a
        trip_length = delta.days

    preferences = [mapare_destinatii[pref] for pref in preferinte]
    preferences.append('restaurant')

    if option == 'length':
        user_preferences = {"preferredLocations": preferences,
                            "location": location,
                            "trip_length": trip_length}
    else:
        user_preferences = {"preferredLocations": preferences,
                            "location": location,
                            "trip_length": trip_length,
                            "start_date": startDate}

else:
    option = 'length'
    user_preferences = {
        "preferredLocations": ["restaurant", "shopping_mall", "park"],
        "location": "Iasi",
        "trip_length": 1,
        "start_date": "2024-03-03"
    }
if option == "dates":
    start_date = user_preferences['start_date']
    start = datetime.strptime(start_date, '%Y-%m-%d')

destination = user_preferences['location']
trip_length = user_preferences['trip_length']


locatii = fetch_api_data(destination, user_preferences)


def timp_in_minute(ora):
    if ora == 'non-stop':
        return 0
    ore, minute = map(int, ora.split(':'))
    return ore * 60 + minute


def initializare_populatie(dimensiune_populatie, nr_max_locatii, locatii_ramase):
    populatie = []
    for _ in range(dimensiune_populatie):
        individ = random.sample(locatii_ramase, nr_max_locatii)
        total = timp_in_minute('9:00')

        for i, locatie_idx in enumerate(individ):
            locatie = locatii[locatie_idx]
            timp_petrecut = tipuri_spendtime.get(locatie['type'], 60)
            timp_deplasare = matrice_timp_mers[individ[i - 1]][locatie_idx] if i > 0 else 0
            total += timp_petrecut + timp_deplasare

            #  pastrez doar primele locatii
            if total > timp_in_minute('21:00') and len(individ[:i]) > 5:
                individ = individ[:i]
                break

        # verific daca s-au generat fix 2 restaurante in lista
        restaurante = [loc for loc in individ if locatii[loc]['type'] == 'restaurant']

        if len(restaurante) != 2:
            # daca nu am fix 2 restaurante, le inlocuiesc
            for i in range(len(individ)):
                if locatii[individ[i]]['type'] == 'restaurant' and len(restaurante) != 2:
                    restaurante.remove(individ[i])
                    while True:
                        noua_locatie = random.choice(locatii_ramase)
                        if noua_locatie not in individ and locatii[noua_locatie]['type'] != 'restaurant':
                            individ[i] = noua_locatie
                            break
        # caut ultimul restaurant si il pun pe ultimul loc
        if restaurante:
            ultimul_restaurant = [idx for idx, val in enumerate(individ) if val in restaurante][-1]
            individ[-1], individ[ultimul_restaurant] = individ[ultimul_restaurant], individ[-1]

        populatie.append(individ)

    return populatie


def crossover(parinte1, parinte2):
    punct_crossover = random.randint(0, len(parinte1) - 1)
    copil1 = parinte1[:punct_crossover] + [locatie for locatie in parinte2 if locatie not in parinte1[:punct_crossover]]
    copil2 = parinte2[:punct_crossover] + [locatie for locatie in parinte1 if locatie not in parinte2[:punct_crossover]]
    return copil1, copil2


def mutatie(ruta, probabilitate_mutatie):
    if random.random() < probabilitate_mutatie:
        idx1, idx2 = random.sample(range(len(ruta)), 2)
        ruta[idx1], ruta[idx2] = ruta[idx2], ruta[idx1]


def calcul_distanta(lat1, lon1, lat2, lon2):
    # Conversie din grade in radiani
    lat1_rad = math.radians(float(lat1))
    lon1_rad = math.radians(float(lon1))
    lat2_rad = math.radians(float(lat2))
    lon2_rad = math.radians(float(lon2))

    delta_lat = lat2_rad - lat1_rad
    delta_lon = lon2_rad - lon1_rad

    # 6371=raza medie a Pamantului in km
    distance = math.sqrt(delta_lat ** 2 + delta_lon ** 2) * 6371

    return distance


def normalizare_restaurante(ruta, timp_curent):
    penalizare_ore = 0
    for i in range(len(ruta) - 1):
        locatie = locatii[ruta[i]]
        if locatie['type'] == 'restaurant':
            # restaurantul de seara e sigur pe ultima pozitie, penalizez doar primul restaurant gasit pentru a ma asigura ca e la pranz
            if not 12 * 60 <= timp_curent <= 15 * 60:
                penalizare_ore = 1000
        break

    # prima locatie din zi nu ar trebui sa fie un restaurant
    if locatii[ruta[0]]['type'] == 'restaurant':
        penalizare_ore += 200

    for i in range(len(ruta) - 2):
        if locatii[ruta[i]]['type'] == 'restaurant' and locatii[ruta[i + 1]]['type'] == 'restaurant':
            penalizare_ore += 500

    if locatii[ruta[len(ruta) - 2]]['type'] == 'restaurant' and locatii[ruta[len(ruta) - 1]][
        'type'] == 'restaurant':
        penalizare_ore += 500

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


def fitness(ruta, matrice_distantelor, ora_start, zi, colecteaza_orar=False):
    timp_curent = timp_in_minute(ora_start)
    orar = []

    # parametri de care se tine cont in calcularea fitness-ului
    penalizare_inchidere = 0
    penalizare_asteptare = 0
    distanta_totala = 0
    penalizare_preferinte = 0
    penalizare_restaurant = 0
    penalizare_nr_locatii = 0
    penalizare_ora_final = 0
    penalizare_mers = 0
    penalizare_ore_functionare = 0
    if len(ruta) < 5:
        penalizare_nr_locatii = 500
    for i in range(len(ruta) - 1):
        distanta_totala += matrice_distantelor[ruta[i]][ruta[i + 1]] * 10

        locatie = locatii[ruta[i]]
        spendtime = tipuri_spendtime.get(locatie['type'], 60)

        g, opentime, closetime = get_opening_hours(zi, timp_curent, locatie['opening_hours'])

        if g == 0:  # locatia este pusa in solutie astfel incat se afla in afara orelor de functionare
            penalizare_ore_functionare = 1000

        if timp_curent < opentime:  # daca sosim inainte de deschidere
            penalizare_asteptare += opentime - timp_curent
            timp_curent = opentime  # actualizam timpul curent la ora de deschidere

        if timp_curent > closetime:
            penalizare_inchidere += 50

        if timp_curent + spendtime > closetime:  # daca spendtime depaseste ora de inchidere
            penalizare_inchidere += 50

        # penalizare preferinte
        if locatie['type'] not in user_preferences['preferredLocations']:
            penalizare_preferinte += 100

        # penalizare restaurant
        penalizare_restaurant = normalizare_restaurante(ruta, timp_curent)

        if colecteaza_orar:
            lat= locatie['lat']
            long= locatie['long']
            address=locatie['address']
            photo=locatie['photo']
            nume_locatie = locatii[ruta[i]]['name']

            ora_sosire = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
            timp_curent += spendtime
            ora_plecare = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"

            orar.append((ruta[i], nume_locatie, ora_sosire, ora_plecare, int(matrice_timp_mers[ruta[i]][ruta[i + 1]]), lat, long, address, photo))
            timp_curent -= spendtime

        timp_deplasare = matrice_timp_mers[ruta[i]][ruta[i + 1]]
        if timp_deplasare > 20:
            penalizare_mers += 1000

        timp_curent += timp_deplasare

        timp_curent += spendtime

    # procesez ultima locatie separat
    locatie = locatii[ruta[len(ruta) - 1]]
    spendtime = tipuri_spendtime.get(locatie['type'], 60)

    g, opentime, closetime = get_opening_hours(zi, timp_curent, locatie['opening_hours'])
    if g == 0:  # locatia este pusa in solutie astfel incat se afla in afara orelor de functionare
        penalizare_ore_functionare = 200

    if locatie['type'] not in user_preferences['preferredLocations']:
        penalizare_preferinte += 200

    if timp_curent < opentime:  # daca sosim inainte de deschidere
        penalizare_asteptare += opentime - timp_curent
        timp_curent = opentime  # actualizam timpul curent la ora de deschidere

    if timp_curent > closetime:
        penalizare_inchidere += 50

    if timp_curent + spendtime > closetime:  # daca spendtime depaseste ora de inchidere
        penalizare_inchidere += 25

    if colecteaza_orar:
        lat = locatie['lat']
        long = locatie['long']
        address = locatie['address']
        photo = locatie['photo']
        nume_locatie = locatii[ruta[len(ruta) - 1]]['name']

        ora_sosire = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
        timp_curent += spendtime
        ora_plecare = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
        orar.append((ruta[len(ruta) - 1], nume_locatie, ora_sosire, ora_plecare, -1, lat, long, address, photo))
        # print(orar)

    if timp_curent < timp_in_minute('20:00'):
        penalizare_ora_final = 500
    fitness_total = distanta_totala + penalizare_preferinte + penalizare_asteptare + \
                    penalizare_inchidere + penalizare_restaurant + penalizare_nr_locatii + penalizare_ora_final \
                    + penalizare_mers + penalizare_ore_functionare
    if colecteaza_orar:
        return 1 / (1 + fitness_total), orar
    else:
        return 1 / (1 + fitness_total)


def algoritm_genetic(locatii, matrice_distantelor, dimensiune_populatie, nr_generatii, ora_start, zi):
    lungime_locatii = len(locatii)
    populatie = initializare_populatie(dimensiune_populatie, min(10, lungime_locatii), locatii)

    for generatie in range(nr_generatii):
        # sortare populatie dupa fitness
        sorted_populatie = sorted(populatie, key=lambda ruta: fitness(ruta, matrice_distantelor, ora_start, zi),
                                  reverse=True)

        # selectie
        parinti = sorted_populatie[:dimensiune_populatie // 2]

        urmasi = []
        while len(urmasi) < dimensiune_populatie - len(parinti):
            parinte1, parinte2 = random.sample(parinti, 2)
            copil1, copil2 = crossover(parinte1, parinte2)
            mutatie(copil1, 0.2)
            mutatie(copil2, 0.2)
            urmasi.extend([copil1, copil2])

        sorted_populatie = parinti + urmasi

    # determin cea mai buna ruta
    cea_mai_buna_ruta = sorted_populatie[0]

    best_fitness, orar_cea_mai_buna_ruta = fitness(cea_mai_buna_ruta, matrice_distantelor, ora_start, zi,
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
VITEZA_MEDIE_MERS = 4  # Viteza medie de mers pe jos în km/h


def calculeaza_timp_mers(distanta_km):
    return (distanta_km / VITEZA_MEDIE_MERS) * 60


matrice_timp_mers = []
for rand in matrice_distantelor:
    rand_timp = [calculeaza_timp_mers(distanta) for distanta in rand]
    matrice_timp_mers.append(rand_timp)


# pentru cand se da doar durata calatoriei
def ruleaza_algoritm_pe_zile_trip_length(locatii, matrice_distantelor):
    locatii_ramase = list(range(len(locatii)))

    days_of_week = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    all_results = []
    for start_day in days_of_week:
        start_date = find_first_day_of_week(start_day)
        rezultate_zilnice = ruleaza_algoritm_pe_zile_start_day(locatii_ramase, matrice_distantelor, start_date)
        all_results.append((start_day, rezultate_zilnice))

    best_result = min(all_results, key=lambda x: sum(fit[0] for fit in x[1]))

    return best_result


# pentru cand se da ziua de start
def ruleaza_algoritm_pe_zile_start_day(locatii, matrice_distantelor, start_date):
    locatii_ramase = list(range(len(locatii)))
    rezultate_zilnice = []

    start_day_of_trip = start_date.strftime("%a")  # Mon/Tue/Sun..
    start_day_of_trip = start_day_of_trip[:-1]

    days_of_week = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    start_day_index = days_of_week.index(start_day_of_trip)
    current_day_index = start_day_index
    for _ in range(trip_length):
        current_day = days_of_week[current_day_index]
        best_fitness, cea_mai_buna_ruta, orar_cea_mai_buna_ruta = algoritm_genetic(locatii_ramase, matrice_distantelor,
                                                                                   dimensiune_populatie=1000,
                                                                                   nr_generatii=200,
                                                                                   ora_start='09:00', zi=current_day)
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
                'day': zi
            })
        orar_json = json.dumps(orar_dicts, ensure_ascii=False, indent=2)
        all_orar_json.append(orar_json)

    combined_orar_json = combine_json_strings(all_orar_json)
    combined_orar_json_str = json.dumps(combined_orar_json, ensure_ascii=False, indent=2)
    print(combined_orar_json_str)


def afiseaza_itinerariu_best_day(best_rez):
    all_orar_json = []
    ziua, rezultate_zi = best_rez

    for zi, (fit, ruta, orar) in enumerate(rezultate_zi, start=1):
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
                'day': zi,
                'best_start': ziua,
            })
        orar_json = json.dumps(orar_dicts, ensure_ascii=False, indent=2)
        all_orar_json.append(orar_json)

    combined_orar_json = combine_json_strings(all_orar_json)
    combined_orar_json_str = json.dumps(combined_orar_json, ensure_ascii=False, indent=2)
    print(combined_orar_json_str)


if option == 'dates':
    itinerarii_zilnice = ruleaza_algoritm_pe_zile_start_day(locatii, matrice_distantelor, start)
    afiseaza_itinerarii(itinerarii_zilnice)
else:
    best_rez = ruleaza_algoritm_pe_zile_trip_length(locatii, matrice_distantelor)
    # afiseaza_itinerarii(best_rez)
    afiseaza_itinerariu_best_day(best_rez)

end_time = time.time()
execution_time =end_time -  start_time
# print("Execution time:",execution_time)



