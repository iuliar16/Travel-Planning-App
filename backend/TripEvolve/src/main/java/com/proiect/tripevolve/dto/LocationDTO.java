package com.proiect.tripevolve.dto;

import lombok.*;
import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class LocationDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer location_id;
    private String place_id;
    private double latitude;
    private double longitude;
    private String type;
    private String city;
}
