package com.proiect.tripevolve.service.impl;

import com.proiect.tripevolve.dto.ItineraryLocationsDTO;
import com.proiect.tripevolve.repository.ItineraryLocationsRepository;
import com.proiect.tripevolve.service.interfaces.ItineraryLocationsService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItineraryLocationsServiceImpl implements ItineraryLocationsService {
    private final ItineraryLocationsRepository itineraryLocationsRepository;

    @Autowired
    public ItineraryLocationsServiceImpl(ItineraryLocationsRepository itineraryLocationsRepository) {
        this.itineraryLocationsRepository = itineraryLocationsRepository;
    }

    @Override
    public List<ItineraryLocationsDTO> getAll() {
        return itineraryLocationsRepository.findAll();
    }

    @Override
    public Optional<ItineraryLocationsDTO> findById(Integer itineraryLocation_id) {
        return itineraryLocationsRepository.findById(itineraryLocation_id);
    }

    @Override
    public List<ItineraryLocationsDTO> findByItineraryId(Integer itinerary_id) {
        return itineraryLocationsRepository.findByItineraryId(itinerary_id);
    }

    @Override
    public ItineraryLocationsDTO add(ItineraryLocationsDTO itineraryLocationsDTO) {
        return itineraryLocationsRepository.save(itineraryLocationsDTO);
    }

    @Override
    public void deleteById(Integer id) {
        itineraryLocationsRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteByItineraryId(Integer itineraryId) {
        itineraryLocationsRepository.deleteByItineraryId(itineraryId);
    }

}
