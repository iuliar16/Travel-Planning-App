package com.proiect.tripevolve.notification.service;

import com.proiect.tripevolve.notification.entity.EmailDTO;
import com.proiect.tripevolve.notification.exception.MessageSentException;
import org.springframework.http.ResponseEntity;

public interface IEmailService {
    void sendRegistrationMail(EmailDTO details) throws MessageSentException;

    public void sendEmailConfirmationMail(EmailDTO details, String confirmationToken) throws MessageSentException;


        ResponseEntity<String> sendMailWithAttachment(EmailDTO details) throws  MessageSentException;

    void sendPasswordResetMail(EmailDTO details, String token) throws MessageSentException;

}
