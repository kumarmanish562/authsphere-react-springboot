package com.authsphere_backend.config;

import com.authsphere_backend.Security.JwtAuthenticationFilter;
import com.authsphere_backend.dtos.ApiError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private AuthenticationSuccessHandler successHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, AuthenticationSuccessHandler successHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .cors(Customizer.withDefaults())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )




                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers(
                                        AppConstants
                                                .AUTH_PUBLIC_URL
                                ).permitAll()
                                .anyRequest().authenticated()
                )

                // ==========================================
                // GOOGLE OAUTH2
                // ==========================================

                .oauth2Login(oauth2 ->
                        oauth2
                                .successHandler(successHandler)
                                .failureHandler(null)
                )

                // ==========================================
                // DISABLE DEFAULT SPRING LOGOUT
                // ==========================================

                .logout(AbstractHttpConfigurer::disable)

                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint(
                                (request, response, authException) -> {

                                    // ==============================================
                                    // HTTP STATUS
                                    // ==============================================

                                    response.setStatus(
                                            HttpStatus.UNAUTHORIZED.value()
                                    );

                                    response.setContentType(
                                            MediaType.APPLICATION_JSON_VALUE
                                    );


                                    // ==============================================
                                    // DEFAULT AUTHENTICATION MESSAGE
                                    // ==============================================

                                    String message =
                                            "Unauthorized Access";


                                    // ==============================================
                                    // CHECK JWT ERROR FROM FILTER
                                    // ==============================================

                                    String jwtError =
                                            (String) request.getAttribute("jwtError");

                                    if (jwtError != null &&
                                            !jwtError.isBlank()) {

                                        message = jwtError;
                                    }


                                    // ==============================================
                                    // CREATE API ERROR
                                    // ==============================================

                                    ApiError apiError =
                                            ApiError.of(
                                                    HttpStatus.UNAUTHORIZED.value(),
                                                    "Unauthorized Access",
                                                    message,
                                                    request.getRequestURI()
                                            );


                                    // ==============================================
                                    // CONVERT OBJECT TO JSON
                                    // ==============================================

                                    ObjectMapper objectMapper =
                                            new ObjectMapper();

                                    response.getWriter().write(
                                            objectMapper.writeValueAsString(
                                                    apiError
                                            )
                                    );
                                }
                        )
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}
