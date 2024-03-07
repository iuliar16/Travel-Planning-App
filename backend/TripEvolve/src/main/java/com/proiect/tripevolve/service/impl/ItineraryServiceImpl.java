package com.proiect.tripevolve.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proiect.tripevolve.dto.ItineraryDTO;
import com.proiect.tripevolve.dto.PreferencesDTO;
import com.proiect.tripevolve.repository.ItineraryRepository;
import com.proiect.tripevolve.service.interfaces.ItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Optional;

@Service
public class ItineraryServiceImpl implements ItineraryService {
    private final ItineraryRepository itineraryRepository;

    @Autowired
    public ItineraryServiceImpl(ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
    }

    public String generateItinerary(PreferencesDTO preferences) {
        try {
            System.out.println(preferences);

            ObjectMapper mapper = new ObjectMapper();
            String preferencesJson = mapper.writeValueAsString(preferences);
            System.out.println(preferencesJson);
            String fetching = "python " + "C:\\Users\\Iulia\\Licenta-2024\\geneticAlgorithm\\AlgortimGenetic2\\main.py \"" + preferencesJson.replace("\"", "\\\"") + "\"";
            System.out.println(fetching);
            String[] commandToExecute = new String[]{"cmd.exe", "/c", fetching};
            System.out.println(preferencesJson.replace("\"", "\\\""));
            Process p=Runtime.getRuntime().exec(commandToExecute);
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            int exitCode = p.waitFor();
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            System.out.println(output);

            return output.toString();

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "eroare la executarea scriptului: " + e.getMessage();
        }
    }


    @Override
    public List<ItineraryDTO> getAll() {
        return itineraryRepository.findAll();
    }

    @Override
    public Optional<ItineraryDTO> findById(Integer location_id) {
        return itineraryRepository.findById(location_id);
    }

    @Override
    public List<ItineraryDTO> findByUserId(Integer user_id) {
        return itineraryRepository.findByUserId(user_id);
    }

    @Override
    public ItineraryDTO add(ItineraryDTO locationDTO) {
        return itineraryRepository.save(locationDTO);
    }

    @Override
    public void deleteById(Integer itinerary_id) {
        itineraryRepository.deleteById(itinerary_id);
    }
}
