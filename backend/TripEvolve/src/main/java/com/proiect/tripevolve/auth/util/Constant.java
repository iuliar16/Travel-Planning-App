package com.proiect.tripevolve.auth.util;

public class Constant {

    public enum UserRole {
        USER(UserAuthorities.USER),
        ADMIN(UserAuthorities.ADMIN);
        public final String value;

        UserRole(String value) {
            this.value = value;
        }

        public static class UserAuthorities {
            private UserAuthorities(){

            }
            public static final String USER = "USER";
            public static final String ADMIN = "ADMIN";
        }
    }
}
