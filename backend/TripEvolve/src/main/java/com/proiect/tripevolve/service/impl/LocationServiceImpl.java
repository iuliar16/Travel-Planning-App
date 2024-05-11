package com.proiect.tripevolve.service.impl;

import com.proiect.tripevolve.dto.LocationDTO;
import com.proiect.tripevolve.repository.LocationRepository;
import com.proiect.tripevolve.service.interfaces.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public List<LocationDTO> getAll() {
        return locationRepository.findAll();
    }

    @Override
    public Optional<LocationDTO> findById(Integer location_id) {
        return locationRepository.findById(location_id);
    }

    @Override
    public Optional<LocationDTO> findByNameAndAddress(String name, String address) {
        System.out.println(name);
        return locationRepository.findByNameAndAddress(name,address);
    }

    @Override
    public LocationDTO add(LocationDTO locationDTO) {
        Optional<LocationDTO> existingLocation = locationRepository.findByNameAndAddress(locationDTO.getName(),locationDTO.getAddress());
        return existingLocation.orElseGet(() -> locationRepository.save(locationDTO));
    }

    @Override
    public void deleteById(Integer location_id) {
        locationRepository.deleteById(location_id);
    }

}
