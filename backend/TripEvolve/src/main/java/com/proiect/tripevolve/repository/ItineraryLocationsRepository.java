package com.proiect.tripevolve.repository;

import com.proiect.tripevolve.dto.ItineraryLocationsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface ItineraryLocationsRepository extends JpaRepository<ItineraryLocationsDTO, Integer> {

    @Query("SELECT l FROM itinerary_locations l WHERE l.itinerary_id=:itinerary_id ORDER by l.visit_order")
    List<ItineraryLocationsDTO> findByItineraryId(@Param("itinerary_id")Integer itinerary_id);

    @Modifying
    @Query("DELETE FROM itinerary_locations l WHERE l.itinerary_id=:itineraryId")
    void deleteByItineraryId(@Param("itineraryId") Integer itineraryId);
}
