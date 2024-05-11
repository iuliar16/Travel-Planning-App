package com.proiect.tripevolve.repository;

import com.proiect.tripevolve.dto.LocationDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<LocationDTO, Integer> {
    @Query("SELECT l FROM Location l WHERE l.name=:name AND l.address=:address")
    Optional<LocationDTO> findByNameAndAddress(@Param("name") String name,@Param("address") String address);
}
