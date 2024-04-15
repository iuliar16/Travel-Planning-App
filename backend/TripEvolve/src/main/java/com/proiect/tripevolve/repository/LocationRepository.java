package com.proiect.tripevolve.repository;

import com.proiect.tripevolve.dto.LocationDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<LocationDTO, Integer> {
    @Query("SELECT l FROM Location l WHERE l.name=:name")
    Optional<LocationDTO> findByName(@Param("name") String name);
}
