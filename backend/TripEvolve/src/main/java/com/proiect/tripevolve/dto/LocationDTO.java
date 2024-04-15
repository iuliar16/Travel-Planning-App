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
    private double lat;
    private double lng;
    private String type;
    private String city;
    private String address;
    private String photo;
}
