package com.proiect.tripevolve.dto;

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
public class LocationHoursDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer locationHours_id;
    private Integer location_id;
    private String day_of_week;
    private LocalTime openTime;
    private LocalTime closeTime;
}