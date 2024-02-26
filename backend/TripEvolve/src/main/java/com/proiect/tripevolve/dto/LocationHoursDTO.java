package com.proiect.tripevolve.dto;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name="Location_hours")
public class LocationHoursDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer location_hours_id;
    private Integer location_id;
    private String day_of_week;
    private LocalTime openTime;
    private LocalTime closeTime;
}