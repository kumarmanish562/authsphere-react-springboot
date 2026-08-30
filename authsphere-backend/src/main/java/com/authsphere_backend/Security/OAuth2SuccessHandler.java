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

    private final JwtService jwtService;

    private final CookieService cookieService;

    private final RefreshTokenRepository refreshTokenRepository;

    private final RoleRepository roleRepository;


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
// GET OAUTH2 USER
// ==========================================================

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();


// ==========================================================
// GET PROVIDER / REGISTRATION ID
// ==========================================================

        String registrationId = "unknown";

        if (authentication instanceof OAuth2AuthenticationToken token) {

            registrationId =
                    token.getAuthorizedClientRegistrationId();
        }


        logger.info(
                "OAuth2 registration provider: {}",
                registrationId
        );

        logger.info(
                "OAuth2 attributes: {}",
                oauth2User.getAttributes()
        );



        // ==========================================================
        // 3. CHECK PROVIDER
        // ==========================================================

        if (!"google".equalsIgnoreCase(registrationId)) {

            throw new IllegalArgumentException(
                    "Unsupported OAuth2 provider: "
                            + registrationId
            );
        }


        // ==========================================================
        // 4. GET GOOGLE USER INFORMATION
        // ==========================================================

        String googleId =
                String.valueOf(
                        oauth2User
                                .getAttributes()
                                .getOrDefault(
                                        "sub",
                                        ""
                                )
                );

        String email =
                String.valueOf(
                        oauth2User
                                .getAttributes()
                                .getOrDefault(
                                        "email",
                                        ""
                                )
                );

        String name =
                String.valueOf(
                        oauth2User
                                .getAttributes()
                                .getOrDefault(
                                        "name",
                                        ""
                                )
                );

        String picture =
                String.valueOf(
                        oauth2User
                                .getAttributes()
                                .getOrDefault(
                                        "picture",
                                        ""
                                )
                );


        logger.info(
                "Google user: email={}, googleId={}",
                email,
                googleId
        );


        // ==========================================================
        // 5. FIND USER OR CREATE USER
        // ==========================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseGet(() -> {

                            logger.info(
                                    "Creating new Google user: {}",
                                    email
                            );

                            // ==================================================
                            // FIND DEFAULT ROLE
                            // ==================================================

                            Role defaultRole =
                                    roleRepository
                                            .findByName("ROLE_USER")
                                            .orElseThrow(() ->
                                                    new IllegalStateException(
                                                            "Default role ROLE_USER not found"
                                                    )
                                            );

                            // ==================================================
                            // CREATE USER
                            // ==================================================

                            User newUser =
                                    User.builder()
                                            .email(email)
                                            .name(name)
                                            .image(picture)
                                            .provider(Provider.GOOGLE)
                                            .roles(Set.of(defaultRole))
                                            .build();

                            // ==================================================
                            // SAVE USER
                            // ==================================================

                            return userRepository.save(newUser);
                        });
        logger.info(
                "Authenticated application user: {}",
                user.getEmail()
        );


        // ==========================================================
        // 6. CHECK USER ENABLED
        // ==========================================================

        if (!user.isEnable()) {

            throw new IllegalStateException(
                    "User account is disabled"
            );
        }


        // ==========================================================
        // 7. CREATE REFRESH TOKEN JTI
        // ==========================================================

        String jti =
                UUID.randomUUID().toString();


        // ==========================================================
        // 8. CREATE REFRESH TOKEN DATABASE RECORD
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


        refreshTokenRepository.save(
                refreshTokenEntity
        );


        // ==========================================================
        // 9. GENERATE ACCESS TOKEN
        // ==========================================================

        String accessToken =
                jwtService.generateAccessToken(
                        user
                );


        // ==========================================================
        // 10. GENERATE REFRESH TOKEN
        // ==========================================================

        String refreshToken =
                jwtService.generateRefreshToken(
                        user,
                        jti
                );


        // ==========================================================
        // 11. ATTACH REFRESH TOKEN COOKIE
        // ==========================================================

        cookieService.attachRefreshCookie(
                response,
                refreshToken,
                jwtService.getRefreshTtlSeconds()
        );


        // ==========================================================
        // 12. PREVENT CACHE
        // ==========================================================

        cookieService.addNoStoreHeaders(
                response
        );


        // ==========================================================
        // 13. RESPONSE
        // ==========================================================

        response.setContentType(
                "application/json"
        );

        response.setStatus(
                HttpServletResponse.SC_OK
        );

        response.getWriter().write(
                """
                {
                    "status": 200,
                    "message": "Google login successful",
                    "accessToken": "%s"
                }
                """.formatted(accessToken)
        );
    }
}