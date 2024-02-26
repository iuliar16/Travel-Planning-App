//package com.proiect.tripevolve.service.impl;
//
//import com.proiect.tripevolve.dto.PreferencesDTO;
//import com.proiect.tripevolve.repository.PreferencesRepository;
//import com.proiect.tripevolve.service.interfaces.PreferencesService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class PreferencesServiceImpl implements PreferencesService {
//    private final PreferencesRepository preferencesRepository;
//
//    @Autowired
//    public PreferencesServiceImpl(PreferencesRepository preferencesRepository) {
//        this.preferencesRepository = preferencesRepository;
//    }
//
//    @Override
//    public List<PreferencesDTO> getAll() {
//        return preferencesRepository.findAll();
//    }
//
//    @Override
//    public PreferencesDTO add(PreferencesDTO preferencesDTO) {
//        return preferencesRepository.save(preferencesDTO);
//    }
//
//}
