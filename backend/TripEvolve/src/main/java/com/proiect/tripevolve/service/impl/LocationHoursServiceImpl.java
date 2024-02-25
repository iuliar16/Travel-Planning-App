package com.proiect.tripevolve.service.impl;

import com.proiect.tripevolve.dto.LocationHoursDTO;
import com.proiect.tripevolve.repository.LocationHoursRepository;
import com.proiect.tripevolve.service.interfaces.LocationHoursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationHoursServiceImpl implements LocationHoursService {
    private final LocationHoursRepository locationHoursRepository;

    @Autowired
    public LocationHoursServiceImpl(LocationHoursRepository locationHoursRepository) {
        this.locationHoursRepository = locationHoursRepository;
    }

    @Override
    public List<LocationHoursDTO> getAll() {
        return locationHoursRepository.findAll();
    }

    @Override
    public Optional<LocationHoursDTO> findById(Integer locationHours_id) {
        return locationHoursRepository.findById(locationHours_id);
    }

    @Override
    public Optional<LocationHoursDTO> findByLocationId(Integer location_id) {
        return locationHoursRepository.findByLocationId(location_id);
    }

    @Override
    public LocationHoursDTO add(LocationHoursDTO locationHoursDTO) {
        return locationHoursRepository.save(locationHoursDTO);
    }

    @Override
    public void deleteById(Integer locationHours_id) {
        locationHoursRepository.deleteById(locationHours_id);
    }
}
