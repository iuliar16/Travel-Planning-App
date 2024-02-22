package com.proiect.tripevolve.controller;

import com.proiect.tripevolve.dto.UserPreferencesDTO;
import com.proiect.tripevolve.service.ItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itinerary")
public class ItineraryController {

    @Autowired
    private ItineraryService itineraryService;

    @PostMapping("/generate-schedule")
    public String generateItinerary(@RequestBody UserPreferencesDTO preferences) {
        return itineraryService.generateItinerary(preferences);
    }
}
