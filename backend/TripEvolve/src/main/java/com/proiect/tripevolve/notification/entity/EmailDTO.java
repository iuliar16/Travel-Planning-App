package com.proiect.tripevolve.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class EmailDTO {

    private String recipient;
    private String msgBody;
    private String subject;
    private String attachment;

}