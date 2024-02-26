//package com.proiect.tripevolve.controller;
//
//import com.proiect.tripevolve.dto.PreferencesDTO;
//
//import com.proiect.tripevolve.service.interfaces.PreferencesService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//@RestController
//@RequestMapping("/tripEvolve/api/preferences")
//public class PreferencesController {
//
//    private final PreferencesService preferencesService;
//
//    @Autowired
//    PreferencesController(PreferencesService preferencesService) {
//        this.preferencesService = preferencesService;
//    }
//
//    @GetMapping
//    ResponseEntity<?> getAllPreferences() {
//        return new ResponseEntity<>(this.preferencesService.getAll(), HttpStatus.OK);
//
//    }
//
//    @PostMapping
//    ResponseEntity<?> createPreference(@RequestBody PreferencesDTO preferencesDTO) {
//        return new ResponseEntity<>(this.preferencesService.add(preferencesDTO), HttpStatus.CREATED);
//    }
//
//}
