package com.proiect.tripevolve.controller;

import com.proiect.tripevolve.dto.LocationHoursDTO;
import com.proiect.tripevolve.service.interfaces.LocationHoursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/tripEvolve/api/locationHours")
public class LocationHoursController {

    private final LocationHoursService locationHoursService;

    @Autowired
    LocationHoursController(LocationHoursService locationHoursService) {
        this.locationHoursService = locationHoursService;
    }

    @GetMapping
    ResponseEntity<?> getAllLocationsHours() {
        return new ResponseEntity<>(this.locationHoursService.getAll(), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    ResponseEntity<?> getLocationHoursById(@PathVariable Integer id) {
        Optional<LocationHoursDTO> locationHoursDTO = this.locationHoursService.findById(id);
        if (locationHoursDTO.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(locationHoursDTO, HttpStatus.OK);

    }

    @GetMapping("/locationId")
    ResponseEntity<Optional<LocationHoursDTO>> getLocationByLocationId(@RequestParam Integer locationId) {
        Optional<LocationHoursDTO> locationHoursDTO = this.locationHoursService.findByLocationId(locationId);
        return new ResponseEntity<>(locationHoursDTO, HttpStatus.OK);

    }

    @PostMapping
    ResponseEntity<?> createLocationHours(@RequestBody LocationHoursDTO locationHoursDTO) {
        return new ResponseEntity<>(this.locationHoursService.add(locationHoursDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteLocationHoursById(@PathVariable Integer id) {
        this.locationHoursService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

}
