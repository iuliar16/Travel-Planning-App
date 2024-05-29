package com.proiect.tripevolve.dto;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity(name="Itinerary")
public class ItineraryDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itinerary_id;
    private Integer user_id;
    private String title;
    private Date startDate;
    private Date endDate;
    private String city;
    private Integer tripLength;
    private String photo;

    @Column(unique = true)
    private String shareableLink;
}
