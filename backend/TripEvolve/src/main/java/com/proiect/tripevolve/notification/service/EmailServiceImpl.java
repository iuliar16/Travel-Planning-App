package com.proiect.tripevolve.notification.service;

import com.proiect.tripevolve.notification.entity.EmailDTO;
import com.proiect.tripevolve.notification.exception.MessageSentException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
public class EmailServiceImpl implements IEmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("tripevolvecontrol@gmail.com")
    private String sender;

    @Override
    public void sendRegistrationMail(EmailDTO details) throws MessageSentException {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText("Welcome! Thank you for register.");
            mailMessage.setSubject("Successfully registered");
            javaMailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("Eroare  " + e.getMessage());
            throw new MessageSentException("Eroare la trimiterea email-ului.");
        }
    }

    @Override
    public ResponseEntity<String> sendMailWithAttachment(EmailDTO details) throws MessageSentException {

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(details.getRecipient());

            String htmlBodyWithImage = "<html><body><h3>Welcome! Thank you for register..</h3>"
                    + "<img src='cid:imageId'></body></html>";

            mimeMessageHelper.setText(htmlBodyWithImage, true);
            mimeMessageHelper.setSubject("Successfully registered");


            String imagePath = "static/images/img.png";


            ClassPathResource imageResource = new ClassPathResource(imagePath);


            if (imageResource.exists()) {

                javaMailSender.send(mimeMessage);
                return new ResponseEntity<>("{\"success\": true, \"message\": \"E-mail trimis cu succes!\"}", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("{\"success\": false, \"message\": \"Imaginea nu există: " + imagePath + "\"}", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            System.err.println("Eroare " + e.getMessage());

            return new ResponseEntity<>("{\"success\": false, \"message\": \"Eroare la trimiterea email-ului cu atașament.\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public void sendPasswordResetMail(EmailDTO details, String token) throws MessageSentException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;

        try {
            mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(details.getRecipient());


            String resetLink = "http://localhost:4200/reset-pass?token="+token;
            String messageText = "Click <a href='" + resetLink + "'>aici</a> pentru a reseta parola.";


            mimeMessageHelper.setText(messageText, true);
            mimeMessageHelper.setSubject("Resetare parola");

            javaMailSender.send(mimeMessage);

        } catch (Exception e) {
            System.err.println("Eroare  " + e.getMessage());
            throw new MessageSentException("Eroare la trimiterea email-ului pentru resetarea parolei.");
        }
    }
    @Override
    public void sendNewTestNotification(EmailDTO details, String testName) throws MessageSentException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(details.getRecipient());

            String htmlBody = "<html><body><h3>Bună ziua!</h3>"
                    + "<p>Am adăugat un nou test pe platforma QuizMatrix pentru a-ți testa cunoștințele.</p>"
                    + "<p>Noul test se numește: <strong>" + testName + "</strong></p>"

                    + "<p>Te invităm să îl accesezi și să îți verifici cunoștințele.</p>"
                    + "<p>Mulțumim că folosești QuizMatrix!</p></body></html>";

            mimeMessageHelper.setText(htmlBody, true);
            mimeMessageHelper.setSubject("Nou test adăugat: " + testName);

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("Eroare " + e.getMessage());
            throw new MessageSentException("Eroare la trimiterea notificării pentru noul test.");
        }
    }


}
