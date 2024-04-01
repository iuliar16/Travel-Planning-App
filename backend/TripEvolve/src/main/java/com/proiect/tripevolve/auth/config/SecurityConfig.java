package com.proiect.tripevolve.auth.config;

import com.proiect.tripevolve.auth.config.jwt.JWTConfigurer;
import com.proiect.tripevolve.auth.config.jwt.TokenProvider;
import com.proiect.tripevolve.auth.util.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@EnableWebSecurity
@Configuration
@EnableMethodSecurity
public class SecurityConfig{

    private final TokenProvider tokenProvider;

    @Autowired
    public SecurityConfig(TokenProvider tokenProvider)
    {
        this.tokenProvider = tokenProvider;
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    private JWTConfigurer jwtSecurityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider);
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(sess-> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests( auth -> auth
                                .requestMatchers("/api/auth/login").permitAll()
                                .requestMatchers("/api/auth/register").permitAll()
                                //.requestMatchers("/api/auth/elevateToAdmin/*").hasAnyAuthority(Constant.UserRole.ADMIN.value)
                                .requestMatchers("/api/auth/test_admin").hasAnyAuthority(Constant.UserRole.ADMIN.value)
                                .requestMatchers("/api/auth/test_user").hasAnyAuthority(Constant.UserRole.USER.value)
                                .anyRequest().permitAll()
                )
                .httpBasic(Customizer.withDefaults())
                .apply(jwtSecurityConfigurerAdapter());

        return http.build();
    }

}
