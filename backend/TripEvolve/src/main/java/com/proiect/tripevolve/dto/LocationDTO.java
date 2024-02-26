package com.proiect.tripevolve.dto;

import lombok.*;
import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name="Location")
public class LocationDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer location_id;
    private String name;
    private String place_id;
    private double latitude;
    private double longitude;
    private String type;
    private String city;
    private String address;
    private Integer spendtime;
    private String description;
}
