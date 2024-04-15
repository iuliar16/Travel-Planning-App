package com.proiect.tripevolve.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name="itinerary_locations")
public class ItineraryLocationsDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itinerary_locations_id;
    private Integer location_id;
    private Integer itinerary_id;
    private Integer visit_order;
    private Integer visit_day;
    private LocalTime arrival_hour;
    private LocalTime leave_hour;
}