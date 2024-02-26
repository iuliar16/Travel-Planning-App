package com.proiect.tripevolve.repository;

import com.proiect.tripevolve.dto.ItineraryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItineraryRepository extends JpaRepository<ItineraryDTO, Integer> {
    @Query("SELECT l FROM Itinerary l WHERE l.user_id=:user_id")
    List<ItineraryDTO> findByUserId(@Param("user_id")Integer user_id);
}
