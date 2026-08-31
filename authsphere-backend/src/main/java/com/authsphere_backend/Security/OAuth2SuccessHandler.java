package com.authsphere_backend.Security;

import com.authsphere_backend.entities.Provider;
import com.authsphere_backend.entities.RefreshToken;
import com.authsphere_backend.entities.Role;
import com.authsphere_backend.entities.User;
import com.authsphere_backend.repositories.RefreshTokenRepository;
import com.authsphere_backend.repositories.RoleRepository;
import com.authsphere_backend.repositories.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(OAuth2SuccessHandler.class);

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final JwtService jwtService;

    private final CookieService cookieService;

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.auth.frontend.success-redirect}")
    private String frontEndSuccessUrl;

    @Value("${app.auth.frontend.failure-redirect}")
    private String getFrontEndFailureUrl;


    // ==========================================================
    // OAUTH2 LOGIN SUCCESS
    // ==========================================================

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {


        // ==========================================================
        // 1. GET OAUTH2 USER
        // ==========================================================

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();


        // ==========================================================
        // 2. GET PROVIDER / REGISTRATION ID
        // ==========================================================

        String registrationId;

        if (authentication instanceof OAuth2AuthenticationToken token) {

            registrationId =
                    token.getAuthorizedClientRegistrationId();

        } else {

            throw new IllegalStateException(
                    "OAuth2 authentication token not found"
            );
        }


        logger.info(
                "OAuth2 registration provider: {}",
                registrationId
        );

        logger.info(
                "OAuth2 user attributes: {}",
                oauth2User.getAttributes()
        );


        // ==========================================================
        // 3. VARIABLES
        // ==========================================================

        String providerId;
        String email;
        String name;
        String image;

        Provider provider;


        // ==========================================================
        // 4. GOOGLE
        // ==========================================================

        if ("google".equalsIgnoreCase(registrationId)) {

            provider = Provider.GOOGLE;


            // ------------------------------------------------------
            // Google unique user ID
            // Google -> sub
            // ------------------------------------------------------

            providerId =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "sub",
                                            ""
                                    )
                    );


            // ------------------------------------------------------
            // Google email
            // ------------------------------------------------------

            email =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "email",
                                            ""
                                    )
                    );


            // ------------------------------------------------------
            // Google name
            // ------------------------------------------------------

            name =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "name",
                                            ""
                                    )
                    );


            // ------------------------------------------------------
            // Google profile image
            // ------------------------------------------------------

            image =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "picture",
                                            ""
                                    )
                    );
        }


        // ==========================================================
        // 5. GITHUB
        // ==========================================================

        else if ("github".equalsIgnoreCase(registrationId)) {

            provider = Provider.GITHUB;


            // ------------------------------------------------------
            // GitHub unique user ID
            // GitHub -> id
            // ------------------------------------------------------

            providerId =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "id",
                                            ""
                                    )
                    );


            // ------------------------------------------------------
            // GitHub email
            // ------------------------------------------------------

            email =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "email",
                                            ""
                                    )
                    );


            // ------------------------------------------------------
            // GitHub name
            // If name is null -> login
            // ------------------------------------------------------

            name =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "name",
                                            oauth2User
                                                    .getAttributes()
                                                    .getOrDefault(
                                                            "login",
                                                            ""
                                                    )
                                    )
                    );


            // ------------------------------------------------------
            // GitHub profile image
            // ------------------------------------------------------

            image =
                    String.valueOf(
                            oauth2User
                                    .getAttributes()
                                    .getOrDefault(
                                            "avatar_url",
                                            ""
                                    )
                    );
        }


        // ==========================================================
        // 6. UNSUPPORTED PROVIDER
        // ==========================================================

        else {

            throw new IllegalArgumentException(
                    "Unsupported OAuth2 provider: "
                            + registrationId
            );
        }


        // ==========================================================
        // 7. VALIDATE PROVIDER ID
        // ==========================================================

        if (providerId == null
                || providerId.isBlank()
                || "null".equalsIgnoreCase(providerId)) {

            throw new IllegalStateException(
                    "OAuth2 provider ID not found"
            );
        }


        // ==========================================================
        // 8. VALIDATE EMAIL
        // ==========================================================

        if (email == null
                || email.isBlank()
                || "null".equalsIgnoreCase(email)) {

            throw new IllegalStateException(
                    "Email not provided by OAuth2 provider"
            );
        }


        logger.info(
                "OAuth2 provider      : {}",
                provider
        );

        logger.info(
                "OAuth2 provider ID   : {}",
                providerId
        );

        logger.info(
                "OAuth2 email         : {}",
                email
        );

        logger.info(
                "OAuth2 name          : {}",
                name
        );


        // ==========================================================
        // 9. FIND DEFAULT ROLE
        // ==========================================================

        Role defaultRole =
                roleRepository
                        .findByName("ROLE_USER")
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Default role ROLE_USER not found"
                                )
                        );


        // ==========================================================
        // 10. FIND EXISTING USER OR CREATE USER
        // ==========================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseGet(() -> {

                            logger.info(
                                    "Creating new OAuth2 user: {}",
                                    email
                            );


                            // ==================================================
                            // CREATE NEW USER
                            // ==================================================

                            User newUser =
                                    User.builder()
                                            .email(email)
                                            .name(name)
                                            .image(image)
                                            .provider(provider)
                                            .providerId(providerId)
                                            .roles(Set.of(defaultRole))
                                            .enabled(true)
                                            .build();


                            // ==================================================
                            // SAVE NEW USER
                            // ==================================================

                            return userRepository.save(
                                    newUser
                            );
                        });


        logger.info(
                "Authenticated application user: {}",
                user.getEmail()
        );


        // ==========================================================
        // 11. CHECK USER ENABLED
        // ==========================================================

        if (!user.isEnabled()) {

            throw new IllegalStateException(
                    "User account is disabled"
            );
        }


        // ==========================================================
        // 12. CREATE REFRESH TOKEN JTI
        // ==========================================================

        String jti =
                UUID.randomUUID().toString();


        // ==========================================================
        // 13. CREATE REFRESH TOKEN DATABASE RECORD
        // ==========================================================

        Instant now =
                Instant.now();


        RefreshToken refreshTokenEntity =
                RefreshToken.builder()
                        .jti(jti)
                        .user(user)
                        .createdAt(now)
                        .expiresAt(
                                now.plusSeconds(
                                        jwtService
                                                .getRefreshTtlSeconds()
                                )
                        )
                        .revoked(false)
                        .build();


        // ==========================================================
        // 14. SAVE REFRESH TOKEN
        // ==========================================================

        refreshTokenRepository.save(
                refreshTokenEntity
        );


        // ==========================================================
        // 15. GENERATE ACCESS TOKEN
        // ==========================================================

        String accessToken =
                jwtService.generateAccessToken(
                        user
                );


        // ==========================================================
        // 16. GENERATE REFRESH TOKEN
        // ==========================================================

        String refreshToken =
                jwtService.generateRefreshToken(
                        user,
                        jti
                );


        // ==========================================================
        // 17. ATTACH REFRESH TOKEN TO HTTPONLY COOKIE
        // ==========================================================

        cookieService.attachRefreshCookie(
                response,
                refreshToken,
                jwtService.getRefreshTtlSeconds()
        );


        // ==========================================================
        // 18. PREVENT CACHE
        // ==========================================================

        cookieService.addNoStoreHeaders(
                response
        );

        // ==========================================================
        // 19. REDIRECT TO REACT
        // ==========================================================

        response.sendRedirect(
                frontEndSuccessUrl
        );
    }
}