package com.proiect.tripevolve.notification.service;

import com.proiect.tripevolve.notification.entity.EmailDTO;
import com.proiect.tripevolve.notification.exception.MessageSentException;
import org.springframework.http.ResponseEntity;

public interface IEmailService {
    void sendRegistrationMail(EmailDTO details) throws MessageSentException;


    ResponseEntity<String> sendMailWithAttachment(EmailDTO details) throws  MessageSentException;

    void sendPasswordResetMail(EmailDTO details, String token) throws MessageSentException;

    void sendNewTestNotification(EmailDTO details, String testName) throws MessageSentException;
}
