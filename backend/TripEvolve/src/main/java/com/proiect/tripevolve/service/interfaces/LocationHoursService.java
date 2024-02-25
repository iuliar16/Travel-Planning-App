package com.proiect.tripevolve.service.interfaces;

import com.proiect.tripevolve.dto.LocationDTO;
import com.proiect.tripevolve.dto.LocationHoursDTO;

import java.util.List;
import java.util.Optional;

public interface LocationHoursService {
    List<LocationHoursDTO> getAll();
    Optional<LocationHoursDTO> findById(Integer locationHours_id);

    Optional<LocationHoursDTO> findByLocationId(Integer location_id);

    LocationHoursDTO add(LocationHoursDTO locationHoursDTO);
    void deleteById(Integer locationHours_id);
}
