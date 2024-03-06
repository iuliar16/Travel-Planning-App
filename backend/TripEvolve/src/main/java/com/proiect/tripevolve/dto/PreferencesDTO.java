package com.proiect.tripevolve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

//@AllArgsConstructor
//@NoArgsConstructor
//@Getter
//@Setter
//@ToString
//@Entity(name="Preferences")
//public class PreferencesDTO {
//    @EmbeddedId
//    private PreferencesKey preferencesKey;
//
//    @ElementCollection
//    private List<String> preferred_locations;
//
//    @ElementCollection
//    private List<String> preferred_restaurants;
//
//    @ElementCollection
//    private List<String> preferred_transport;
//}
@Getter
@Setter
public class PreferencesDTO {
    @JsonProperty("preferences")
    private List<String> preferences;
}
