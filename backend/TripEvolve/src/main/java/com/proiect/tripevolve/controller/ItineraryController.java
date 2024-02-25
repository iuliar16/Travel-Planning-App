package com.proiect.tripevolve.controller;

import com.proiect.tripevolve.dto.ItineraryDTO;
import com.proiect.tripevolve.dto.PreferencesDTO;
import com.proiect.tripevolve.service.interfaces.ItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/tripEvolve/api/itinerary")
public class ItineraryController {

    private ItineraryService itineraryService;

    @Autowired
    ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }


    @PostMapping("/generate-schedule")
    public String generateItinerary(@RequestBody PreferencesDTO preferences) {
        return itineraryService.generateItinerary(preferences);
    }
    @GetMapping
    ResponseEntity<?> getAllItineraries() {
        return new ResponseEntity<>(this.itineraryService.getAll(), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    ResponseEntity<?> getItineraryById(@PathVariable Integer id) {
        Optional<ItineraryDTO> itineraryDTO = this.itineraryService.findById(id);
        if (itineraryDTO.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(itineraryDTO, HttpStatus.OK);

    }

    @GetMapping("/userId")
    ResponseEntity<Optional<ItineraryDTO>> getItineraryByUserId(@RequestParam Integer userId) {
        Optional<ItineraryDTO> itineraryDTO = this.itineraryService.findByUserId(userId);
        return new ResponseEntity<>(itineraryDTO, HttpStatus.OK);

    }

    @PostMapping
    ResponseEntity<?> createItinerary(@RequestBody ItineraryDTO itineraryDTO) {
        return new ResponseEntity<>(this.itineraryService.add(itineraryDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteItineraryById(@PathVariable Integer id) {
        this.itineraryService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }
}
