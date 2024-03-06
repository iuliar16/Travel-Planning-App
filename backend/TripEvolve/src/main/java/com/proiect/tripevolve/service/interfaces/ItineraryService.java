package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.ItineraryDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

public interface ItineraryService{
    String generateItinerary(@RequestBody List<String> preferencess);
    List<ItineraryDTO> getAll();
    Optional<ItineraryDTO> findById(Integer itinerary_id);

    List<ItineraryDTO> findByUserId(Integer user_id);

    ItineraryDTO add(ItineraryDTO itineraryDTO);
    void deleteById(Integer location_id);
}
