package com.proiect.tripevolve.controller;


import com.proiect.tripevolve.dto.LocationDTO;
import com.proiect.tripevolve.service.interfaces.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/tripEvolve/api/location")
public class LocationController {

    private final LocationService locationService;

    @Autowired
    LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    ResponseEntity<?> getAllLocations() {
        return new ResponseEntity<>(this.locationService.getAll(), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    ResponseEntity<?> getLocationById(@PathVariable Integer id) {
        Optional<LocationDTO> locationDTO = this.locationService.findById(id);
        if (locationDTO.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(locationDTO, HttpStatus.OK);

    }

    @GetMapping("/name")
    ResponseEntity<Optional<LocationDTO>> getLocationByNameAndAddress(@RequestParam String name,@RequestParam String address) {
        System.out.println(name);
        Optional<LocationDTO> locationDTO = this.locationService.findByNameAndAddress(name,address);
        return new ResponseEntity<>(locationDTO, HttpStatus.OK);

    }

    @PostMapping
    ResponseEntity<?> createLocation(@RequestBody LocationDTO locationDTO) {
        return new ResponseEntity<>(this.locationService.add(locationDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteLocationById(@PathVariable Integer id) {
        this.locationService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

}
