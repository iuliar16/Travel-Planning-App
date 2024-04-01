package com.proiect.tripevolve.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UserRegisterDTO {
    private String password;
    private String firstname;
    private String lastname;
    private String email;
}
