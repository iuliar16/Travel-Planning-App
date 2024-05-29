package com.proiect.tripevolve.auth.util;

public class PasswordValidator {
    public static boolean isValid(String password) {
        if (password.length() < 6) {
            return false;
        }
        boolean hasUppercase = !password.equals(password.toLowerCase());
        boolean hasLowercase = !password.equals(password.toUpperCase());
        boolean hasDigit = password.matches(".*\\d.*");

        return hasUppercase && hasLowercase && hasDigit;
    }
}
