package com.proiect.tripevolve.notification.controller;

import com.proiect.tripevolve.notification.entity.EmailDTO;
import com.proiect.tripevolve.notification.entity.ErrorDTO;
import com.proiect.tripevolve.notification.exception.MessageSentException;
import com.proiect.tripevolve.notification.service.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(value = "http://localhost:4200", allowCredentials = "true")
public class EmailController {

    @Autowired
    private IEmailService emailService;


    @PostMapping("/sendRegisterMail")
    public ResponseEntity<?> sendRegisterMail(@RequestBody EmailDTO details) {

        try {
            emailService.sendRegistrationMail(details);
            return  ResponseEntity.status(HttpStatus.OK).body("Mail-ul a fost trimis cu succes");
        } catch (MessageSentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDTO(e.getMessage()));

        }


    }

    @PostMapping("/sendMailWithAttachment")
    public ResponseEntity<?> sendMailWithAttachment(@RequestBody EmailDTO details) {
        try {
            emailService.sendMailWithAttachment(details);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (MessageSentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDTO(e.getMessage()));

        }
    }


}
