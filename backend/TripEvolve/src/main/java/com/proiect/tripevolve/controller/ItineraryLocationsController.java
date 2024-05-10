package com.proiect.tripevolve.controller;

import com.proiect.tripevolve.dto.ItineraryLocationsDTO;
import com.proiect.tripevolve.service.interfaces.ItineraryLocationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tripEvolve/api/itineraryLocations")
public class ItineraryLocationsController {

    private final ItineraryLocationsService itineraryLocationsService;

    @Autowired
    ItineraryLocationsController(ItineraryLocationsService itineraryLocationsService) {
        this.itineraryLocationsService = itineraryLocationsService;
    }

    @GetMapping
    ResponseEntity<?> getAllItinerariesLocations() {
        return new ResponseEntity<>(this.itineraryLocationsService.getAll(), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    ResponseEntity<?> getItineraryLocationsById(@PathVariable Integer id) {
        Optional<ItineraryLocationsDTO> itineraryLocationsDTO = this.itineraryLocationsService.findById(id);
        if (itineraryLocationsDTO.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(itineraryLocationsDTO, HttpStatus.OK);

    }

    @GetMapping("/itineraryId")
    ResponseEntity<List<ItineraryLocationsDTO>> getByItineraryId(@RequestParam Integer itineraryId) {
        List<ItineraryLocationsDTO> itineraryLocationsDTO = this.itineraryLocationsService.findByItineraryId(itineraryId);
        return new ResponseEntity<>(itineraryLocationsDTO, HttpStatus.OK);

    }

    @PostMapping
    ResponseEntity<?> createItineraryLocations(@RequestBody ItineraryLocationsDTO itineraryLocationsDTO) {

        return new ResponseEntity<>(this.itineraryLocationsService.add(itineraryLocationsDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteById(@PathVariable Integer id) {
        this.itineraryLocationsService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

    @DeleteMapping("/itinerary/{id}")
    ResponseEntity<?> deleteByItineraryId(@PathVariable Integer id) {
        this.itineraryLocationsService.deleteByItineraryId(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
