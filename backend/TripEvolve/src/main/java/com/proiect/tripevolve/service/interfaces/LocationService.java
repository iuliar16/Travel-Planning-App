package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.LocationDTO;

import java.util.List;
import java.util.Optional;

public interface LocationService {
    List<LocationDTO> getAll();
    Optional<LocationDTO> findById(Integer location_id);

    Optional<LocationDTO> findByName(String name);

    LocationDTO add(LocationDTO locationDTO);
    void deleteById(Integer location_id);
}
