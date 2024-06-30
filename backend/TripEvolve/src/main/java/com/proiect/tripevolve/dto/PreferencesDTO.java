package com.proiect.tripevolve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class PreferencesDTO {
    @JsonProperty("preferredLocations")
    private List<String> preferredLocations;
    private String location;
    private Integer trip_length;
    private String startDate;
    private String endDate;
    private String selectedOption;
    private String placeName;
    private Map<String, Integer> locationPreferences;

}
