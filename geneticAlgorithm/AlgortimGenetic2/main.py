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


def timp_in_minute(ora):
    if ora == 'non-stop':
        return 0
    ore, minute = map(int, ora.split(':'))
    return ore * 60 + minute


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


def fitness(ruta, matrice_distantelor, ora_start):
    timp_curent = timp_in_minute(ora_start)
    penalizare_asteptare = 0
    distanta_totala = 0
    penalizare_preferinte = 0

    for i in range(len(ruta) - 1):
        distanta_totala += matrice_distantelor[ruta[i]][ruta[i + 1]]

        locatie = locatii[ruta[i]]
        opentime = timp_in_minute(locatii[ruta[i]]['opentime'])

        if locatie['type'] not in user_preferences['preferredLocations']:
            penalizare_preferinte += 1000

        if timp_curent < opentime:  # daca sosim inainte de deschidere
            penalizare_asteptare += opentime - timp_curent
            timp_curent = opentime  # actualizam timpul curent la ora de deschidere

    fitness_total = distanta_totala + penalizare_preferinte + penalizare_asteptare
    return 1 / (1 + fitness_total)


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
   # print(cea_mai_buna_ruta)

    return cea_mai_buna_ruta


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
        cea_mai_buna_ruta = algoritm_genetic(locatii_ramase, matrice_distantelor, dimensiune_populatie=50,
                                             nr_generatii=100, ora_start='09:00')
        rezultate_zilnice.append(cea_mai_buna_ruta)

        # pt urmatoarea zi rulez din nou algoritmul dar nu iau un calcul locatiile deja alese
        for idx in cea_mai_buna_ruta:
            if idx in locatii_ramase:
                locatii_ramase.remove(idx)

    return rezultate_zilnice


nr_zile = 2
itinerarii_zilnice = ruleaza_algoritm_pe_zile(locatii, nr_zile, matrice_distantelor)
for zi, ruta in enumerate(itinerarii_zilnice, start=1):
    nume_locatii = afiseaza_nume_locatii(ruta, locatii)
    print(f"Ziua {zi}: {' -> '.join(nume_locatii)}")
