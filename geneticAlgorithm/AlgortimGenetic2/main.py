import json
import math
import os
import random
import sys

if len(sys.argv) > 1:
    preferences_str = sys.argv[1]
    user_preferences = json.loads(preferences_str)
else:
    user_preferences = {
        "preferredLocations": ["museum", "park", "church"],
    }

tipuri_spendtime = {
    "museum": 120,
    "zoo": 180,
    "park": 90,
    "shopping mall": 120,
    "church": 60,
}
def timp_in_minute(ora):
    if ora == 'non-stop':
        return 0
    ore, minute = map(int, ora.split(':'))
    return ore * 60 + minute

def initializare_populatie(dimensiune_populatie, n, locatii_ramase):
    populatie = [random.sample(locatii_ramase, n) for _ in range(dimensiune_populatie)]
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

def fitness(ruta, matrice_distantelor, ora_start, colecteaza_orar=False):
    timp_curent = timp_in_minute(ora_start)
    orar = []

    #parametri de care se tine cont in calcularea fitness-ului
    penalizare_inchidere = 0
    penalizare_asteptare = 0
    distanta_totala = 0
    penalizare_preferinte = 0

    for i in range(len(ruta) - 1):
        distanta_totala += matrice_distantelor[ruta[i]][ruta[i + 1]]

        locatie = locatii[ruta[i]]
        opentime = timp_in_minute(locatii[ruta[i]]['opentime'])
        closetime = timp_in_minute(locatii[ruta[i]]['closetime'])
        spendtime = tipuri_spendtime.get(locatie['type'], 60)

        if locatie['type'] not in user_preferences['preferredLocations']:
            penalizare_preferinte += 1000

        if timp_curent < opentime:  # daca sosim inainte de deschidere
            penalizare_asteptare += opentime - timp_curent
            timp_curent = opentime  # actualizam timpul curent la ora de deschidere

        if timp_curent > closetime:
            penalizare_inchidere += 1000

        if timp_curent + spendtime > closetime:  # daca spendtime depaseste ora de inchidere
            penalizare_inchidere += 500

        if colecteaza_orar:
            ora_sosire = f"{int(timp_curent) // 60:02d}:{int(timp_curent)  % 60:02d}"
            timp_curent += spendtime
            ora_plecare = f"{int(timp_curent)  // 60:02d}:{int(timp_curent)  % 60:02d}"
            orar.append((ruta[i], ora_sosire, ora_plecare, int(matrice_timp_mers[ruta[i]][ruta[i + 1]])))
            timp_curent -= spendtime

        timp_deplasare = matrice_timp_mers[ruta[i]][ruta[i + 1]]
        timp_curent += timp_deplasare

        timp_curent += spendtime

    # procesez ultima locatie separat
    locatie = locatii[ruta[len(ruta) - 1]]
    opentime = timp_in_minute(locatii[ruta[i]]['opentime'])
    closetime = timp_in_minute(locatii[ruta[i]]['closetime'])
    spendtime = tipuri_spendtime.get(locatie['type'], 60)
    if locatie['type'] not in user_preferences['preferredLocations']:
        penalizare_preferinte += 1000

    if timp_curent < opentime:  # daca sosim inainte de deschidere
        penalizare_asteptare += opentime - timp_curent
        timp_curent = opentime  # actualizam timpul curent la ora de deschidere

    if timp_curent > closetime:
        penalizare_inchidere += 1500

    if timp_curent + spendtime > closetime:  # daca spendtime depaseste ora de inchidere
        penalizare_inchidere += 500
    if colecteaza_orar:
        ora_sosire = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
        timp_curent += spendtime
        ora_plecare = f"{int(timp_curent) // 60:02d}:{int(timp_curent) % 60:02d}"
        orar.append((ruta[len(ruta) - 1], ora_sosire, ora_plecare,-1))
        print(orar)

    fitness_total = distanta_totala + penalizare_preferinte + penalizare_asteptare + penalizare_inchidere
    if colecteaza_orar:
        return 1 / (1 + fitness_total), orar
    else:
        return 1 / (1 + fitness_total)


def algoritm_genetic(locatii, matrice_distantelor, dimensiune_populatie, nr_generatii, ora_start):
    lungime_locatii = len(locatii)
    populatie = initializare_populatie(dimensiune_populatie, min(5, lungime_locatii), locatii)
    for generatie in range(nr_generatii):
        # sortare populatie dupa fitness
        populatie = sorted(populatie, key=lambda ruta: fitness(ruta, matrice_distantelor, ora_start), reverse=True)

        # selectie
        parinti = populatie[:dimensiune_populatie // 2]

        urmasi = []
        while len(urmasi) < dimensiune_populatie - len(parinti):
            parinte1, parinte2 = random.sample(parinti, 2)
            copil1, copil2 = crossover(parinte1, parinte2)
            mutatie(copil1, 0.2)
            mutatie(copil2, 0.2)
            urmasi.extend([copil1, copil2])

        populatie = parinti + urmasi

    # determin cea mai buna ruta
    cea_mai_buna_ruta = populatie[0]

    _, orar_cea_mai_buna_ruta = fitness(cea_mai_buna_ruta, matrice_distantelor, ora_start, colecteaza_orar=True)
    return cea_mai_buna_ruta, orar_cea_mai_buna_ruta
   # return cea_mai_buna_ruta


dir_path = os.path.dirname(os.path.realpath(__file__))
locations_file_path = os.path.join(dir_path, 'locations.json')

with open(locations_file_path, 'r') as file:
    data = json.load(file)

locatii = data['places']
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


def afiseaza_nume_locatii(ruta, locatii):
    nume_locatii = [locatii[idx]['name'] for idx in ruta]
    return nume_locatii


def ruleaza_algoritm_pe_zile(locatii, nr_zile, matrice_distantelor):
    locatii_ramase = list(range(len(locatii)))
    rezultate_zilnice = []

    for _ in range(nr_zile):
        cea_mai_buna_ruta, orar_cea_mai_buna_ruta = algoritm_genetic(locatii_ramase, matrice_distantelor,
                                                                     dimensiune_populatie=50, nr_generatii=100,
                                                                     ora_start='09:00')
        rezultate_zilnice.append((cea_mai_buna_ruta, orar_cea_mai_buna_ruta))


        # pt urmatoarea zi rulez din nou algoritmul dar nu iau un calcul locatiile deja alese
        for idx in cea_mai_buna_ruta:
            if idx in locatii_ramase:
                locatii_ramase.remove(idx)

    return rezultate_zilnice
def afiseaza_itinerarii(itinerarii_zilnice, locatii):
    for zi, (ruta, orar) in enumerate(itinerarii_zilnice, start=1):
        print(f"Ziua {zi}:")
        for locatie_idx, ora_sosire, ora_plecare,timp in orar:
            nume_locatie = locatii[locatie_idx]['name']
            if timp != -1:
                print(f"{nume_locatie} intre {ora_sosire} si {ora_plecare}. Mergi {timp} minute pana la:  ")
            else:
                print(f"{nume_locatie} intre {ora_sosire} si {ora_plecare}")
        print("\n")


nr_zile = 2
itinerarii_zilnice = ruleaza_algoritm_pe_zile(locatii, nr_zile, matrice_distantelor)
afiseaza_itinerarii(itinerarii_zilnice, locatii)



