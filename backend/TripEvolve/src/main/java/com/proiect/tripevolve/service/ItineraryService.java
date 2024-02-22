package com.proiect.tripevolve.service;

import com.proiect.tripevolve.dto.UserPreferencesDTO;

public interface ItineraryService {
    String generateItinerary(UserPreferencesDTO preferences);
}
