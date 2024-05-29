package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.ItineraryDTO;
import com.proiect.tripevolve.dto.PreferencesDTO;

import java.util.List;
import java.util.Optional;

public interface ItineraryService{

    String generateItinerary(PreferencesDTO preferences);
    List<ItineraryDTO> getAll();
    Optional<ItineraryDTO> findById(Integer itinerary_id);

    List<ItineraryDTO> findByUserId(Integer user_id);

    ItineraryDTO add(ItineraryDTO itineraryDTO);
    void deleteById(Integer location_id);
    List<ItineraryDTO> findFutureItinerariesByUserId(Integer userId);

    List<ItineraryDTO> findPastItinerariesByUserId(Integer userId);

    String generateShareableLink(Integer itineraryId);
    Optional<ItineraryDTO> findByShareableLink(String shareableLink);
}
