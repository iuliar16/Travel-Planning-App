package com.proiect.tripevolve.controller;

import com.proiect.tripevolve.dto.ItineraryDTO;
import com.proiect.tripevolve.dto.PreferencesDTO;
import com.proiect.tripevolve.service.interfaces.ItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    ResponseEntity<List<ItineraryDTO>> getItinerariesByUserId(@RequestParam Integer userId) {
        List<ItineraryDTO> itineraryDTO = this.itineraryService.findByUserId(userId);
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

    @GetMapping("/userId/{id}/future")
    public ResponseEntity<List<ItineraryDTO>> getFutureItinerariesForUser(@PathVariable Integer id) {
        List<ItineraryDTO> futureItineraries = itineraryService.findFutureItinerariesByUserId(id);
        return new ResponseEntity<>(futureItineraries, HttpStatus.OK);
    }

    @GetMapping("/userId/{id}/past")
    public ResponseEntity<List<ItineraryDTO>> getPastItinerariesForUser(@PathVariable Integer id) {
        List<ItineraryDTO> pastItineraries = itineraryService.findPastItinerariesByUserId(id);
        return new ResponseEntity<>(pastItineraries, HttpStatus.OK);
    }

    @PostMapping("/{id}/generate-shareable-link")
    public ResponseEntity<String> generateShareableLink(@PathVariable Integer id) {
        String link = itineraryService.generateShareableLink(id);
        if (link != null) {
            return ResponseEntity.ok("http://localhost:4200/trip/" + link);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Itinerary not found");
    }

    @GetMapping("/share/{shareableLink}")
    public ResponseEntity<ItineraryDTO> getItineraryByShareableLink(@PathVariable String shareableLink) {
        Optional<ItineraryDTO> itineraryOptional = itineraryService.findByShareableLink(shareableLink);
        return itineraryOptional.map(itineraryDTO -> new ResponseEntity<>(itineraryDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
