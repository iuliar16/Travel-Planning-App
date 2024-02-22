package com.proiect.tripevolve.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proiect.tripevolve.dto.UserPreferencesDTO;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class ItineraryServiceImpl implements ItineraryService {

    public String generateItinerary(UserPreferencesDTO preferences) {
        try {

            ObjectMapper mapper = new ObjectMapper();
            String preferencesJson = mapper.writeValueAsString(preferences);
            String fetching = "python " + "C:\\Users\\Iulia\\Licenta-2024\\geneticAlgorithm\\AlgortimGenetic2\\main.py \"" + preferencesJson.replace("\"", "\\\"") + "\"";
            String[] commandToExecute = new String[]{"cmd.exe", "/c", fetching};

            Process p=Runtime.getRuntime().exec(commandToExecute);
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = p.waitFor();
            if (exitCode == 0) {
                return output.toString();
            } else {
                return "eroare la citire " + exitCode;
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "eroare la executarea scriptului: " + e.getMessage();
        }
    }
}
