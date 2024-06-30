package com.proiect.tripevolve.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proiect.tripevolve.dto.ItineraryDTO;
import com.proiect.tripevolve.dto.PreferencesDTO;
import com.proiect.tripevolve.repository.ItineraryRepository;
import com.proiect.tripevolve.service.interfaces.ItineraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItineraryServiceImpl implements ItineraryService {
    @Value("${file.path}")
    private String filePath;

    private final ItineraryRepository itineraryRepository;
    private static final Logger logger = LoggerFactory.getLogger(ItineraryServiceImpl.class);

    @Autowired
    public ItineraryServiceImpl(ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
    }

    public String generateItinerary(PreferencesDTO preferences) {
        try {

            ObjectMapper mapper = new ObjectMapper();
            String preferencesJson = mapper.writeValueAsString(preferences);

            String fetching = "python " + filePath + "/main.py \"" + preferencesJson.replace("\"", "\\\"") + "\"";
            String[] commandToExecute = new String[]{"cmd.exe", "/c", fetching};
            Process p=Runtime.getRuntime().exec(commandToExecute);

            Thread t = new Thread(() -> {
                BufferedReader reader = new BufferedReader(new InputStreamReader(p.getErrorStream()));
                String line;
                StringBuilder output = new StringBuilder();
                try {
                    while ((line = reader.readLine()) != null) {
                        output.append(line).append("\n");
                    }

                    logger.error("Error in buffered reader "+output);
                }catch (IOException e) {
                    e.printStackTrace();
                }
            });
            t.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            t.join();

            int exitVal = p.waitFor();
            logger.info("Exited with error code "+exitVal);

            logger.info("Action completed successfully."+output);
            return output.toString();

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            logger.info("Error while generating schedule", e);
            return "Error while generating schedule: " + e.getMessage();
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
    public ItineraryDTO add(ItineraryDTO itineraryDTO) {return itineraryRepository.save(itineraryDTO);
    }

    @Override
    public void deleteById(Integer itinerary_id) {
        itineraryRepository.deleteById(itinerary_id);
    }

    public List<ItineraryDTO> findFutureItinerariesByUserId(Integer userId) {
        Date currentDate = new Date(); // Get current date
        return itineraryRepository.findFutureItinerariesByUserId(userId, currentDate);
    }

    @Override
    public List<ItineraryDTO> findPastItinerariesByUserId(Integer userId) {
        Date currentDate = new Date(); // Get current date
        return itineraryRepository.findPastItinerariesByUserId(userId, currentDate);
    }

    @Override
    public String generateShareableLink(Integer itineraryId) {
        Optional<ItineraryDTO> itineraryOptional = itineraryRepository.findById(itineraryId);
        if (itineraryOptional.isPresent()) {
            ItineraryDTO itinerary = itineraryOptional.get();
            if (itinerary.getShareableLink() != null) {
                return itinerary.getShareableLink();
            } else {
                String newLink = UUID.randomUUID().toString();
                itinerary.setShareableLink(newLink);
                itineraryRepository.save(itinerary);
                return newLink;
            }
        }
        return null;
    }

    @Override
    public Optional<ItineraryDTO> findByShareableLink(String shareableLink) {
        return itineraryRepository.findByShareableLink(shareableLink);
    }
}
