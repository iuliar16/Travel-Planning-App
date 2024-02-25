package com.proiect.tripevolve.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ItineraryDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itinerary_id;
    private Integer user_id;
    private String title;
    private Date startDate;
    private Date endDate;
    private String city;
}
