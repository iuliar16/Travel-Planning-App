package com.proiect.tripevolve.repository;

import com.proiect.tripevolve.dto.LocationHoursDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LocationHoursRepository extends JpaRepository<LocationHoursDTO, Integer> {

    @Query("SELECT l FROM Location_hours l WHERE l.location_id=:location_id")
    Optional<LocationHoursDTO> findByLocationId(@Param("location_id") Integer location_id);
}
