package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.ItineraryLocationsDTO;

import java.util.List;
import java.util.Optional;

public interface ItineraryLocationsService {
    List<ItineraryLocationsDTO> getAll();
    Optional<ItineraryLocationsDTO> findById(Integer locationHours_id);

    List<ItineraryLocationsDTO> findByItineraryId(Integer itinerary_id);

    ItineraryLocationsDTO add(ItineraryLocationsDTO locationHoursDTO);
    void deleteById(Integer locationHours_id);
}
