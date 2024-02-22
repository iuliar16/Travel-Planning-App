package com.proiect.tripevolve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserPreferencesDTO {
    @JsonProperty("preferredLocations")
    private List<String> preferredLocations;
}
