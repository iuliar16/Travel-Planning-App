package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.ItineraryDTO;
import com.proiect.tripevolve.dto.PreferencesDTO;

import java.util.List;
import java.util.Optional;

public interface ItineraryService{
    String generateItinerary(PreferencesDTO preferences);
    List<ItineraryDTO> getAll();
    Optional<ItineraryDTO> findById(Integer itinerary_id);

    Optional<ItineraryDTO> findByUserId(Integer user_id);

    ItineraryDTO add(ItineraryDTO itineraryDTO);
    void deleteById(Integer location_id);
}
