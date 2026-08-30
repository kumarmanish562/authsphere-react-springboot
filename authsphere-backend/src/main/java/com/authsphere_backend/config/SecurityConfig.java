package com.authsphere_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    // ==========================================================
    // SECURITY FILTER CHAIN
    // ==========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ==================================================
                // CSRF
                // ==================================================

                .csrf(csrf -> csrf.disable())


                // ==================================================
                // AUTHORIZATION
                // ==================================================

                .authorizeHttpRequests(authorizeHttpRequests ->
                        authorizeHttpRequests

                                // Public registration API
                                .requestMatchers(
                                        "/api/m1/auth/register"
                                ).permitAll()

                                // Public login API
                                .requestMatchers(
                                        "/api/m1/auth/login"
                                ).permitAll()

                                // Allow Spring error endpoint
                                .requestMatchers(
                                        "/error"
                                ).permitAll()

                                // All remaining APIs require login
                                .anyRequest().authenticated()
                )


                // ==================================================
                // HTTP BASIC
                // ==================================================

                .httpBasic(Customizer.withDefaults());


        return http.build();
    }


    // ==========================================================
    // PASSWORD ENCODER
    // ==========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}