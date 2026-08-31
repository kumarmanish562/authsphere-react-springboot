package com.authsphere_backend.Security;

import com.authsphere_backend.helpers.UserHelper;
import com.authsphere_backend.repositories.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


/*
 * ============================================================
 * JWT AUTHENTICATION FILTER
 * ============================================================
 */

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    /*
     * ========================================================
     * DEPENDENCIES
     * ========================================================
     */

    private final JwtService jwtService;

    private final UserRepository userRepository;


    /*
     * ========================================================
     * LOGGER
     * ========================================================
     */

    private static final Logger logger =
            LoggerFactory.getLogger(
                    JwtAuthenticationFilter.class
            );


    /*
     * ========================================================
     * FILTER REQUEST
     * ========================================================
     */

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        /*
         * ====================================================
         * GET AUTHORIZATION HEADER
         * ====================================================
         */

        String header =
                request.getHeader("Authorization");


        /*
         * ====================================================
         * CHECK AUTHORIZATION HEADER
         * ====================================================
         */

        if (header == null || header.isBlank()) {

            logger.debug(
                    "Authorization header missing for {} {}",
                    request.getMethod(),
                    request.getRequestURI()
            );

            filterChain.doFilter(request, response);
            return;
        }


        /*
         * ====================================================
         * CHECK BEARER TOKEN
         * ====================================================
         */

        if (!header.startsWith("Bearer ")) {

            logger.warn(
                    "Invalid Authorization header format for {} {}",
                    request.getMethod(),
                    request.getRequestURI()
            );

            filterChain.doFilter(request, response);
            return;
        }


        /*
         * ====================================================
         * EXTRACT JWT TOKEN
         * ====================================================
         */

        String token =
                header.substring(7).trim();


        if (token.isBlank()) {

            logger.warn(
                    "Bearer token is empty for {} {}",
                    request.getMethod(),
                    request.getRequestURI()
            );

            filterChain.doFilter(request, response);
            return;
        }


        try {


            /*
             * =================================================
             * PARSE AND VERIFY JWT
             * =================================================
             */

            Jws<Claims> parsedToken =
                    jwtService.parse(token);


            Claims claims =
                    parsedToken.getPayload();


            /*
             * =================================================
             * CHECK TOKEN TYPE
             * =================================================
             */

            String tokenType =
                    claims.get(
                            "typ",
                            String.class
                    );


            if (!"access".equals(tokenType)) {

                logger.warn(
                        "Rejected non-access JWT for {} {}",
                        request.getMethod(),
                        request.getRequestURI()
                );

                filterChain.doFilter(request, response);
                return;
            }


            /*
             * =================================================
             * GET USER ID
             * =================================================
             */

            String subject =
                    claims.getSubject();


            if (subject == null || subject.isBlank()) {

                logger.warn(
                        "JWT subject is missing"
                );

                filterChain.doFilter(request, response);
                return;
            }


            UUID userUuid =
                    UserHelper.parseUUID(subject);


            /*
             * =================================================
             * CHECK EXISTING AUTHENTICATION
             * =================================================
             */

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() != null) {

                filterChain.doFilter(request, response);
                return;
            }


            /*
             * =================================================
             * FIND USER
             * =================================================
             */

            userRepository
                    .findById(userUuid)
                    .ifPresentOrElse(
                            user -> {


                                /*
                                 * ==================================
                                 * CHECK USER STATUS
                                 * ==================================
                                 */

                                if (!user.isEnabled()) {

                                    logger.warn(
                                            "Disabled user attempted access: {}",
                                            user.getEmail()
                                    );

                                    return;
                                }


                                /*
                                 * ==================================
                                 * CONVERT ROLES TO AUTHORITIES
                                 * ==================================
                                 */

                                List<GrantedAuthority> authorities =
                                        user.getRoles() == null
                                                ? List.of()
                                                : user.getRoles()
                                                .stream()
                                                .map(role ->
                                                        new SimpleGrantedAuthority(
                                                                role.getName()
                                                        )
                                                )
                                                .collect(Collectors.toList());


                                /*
                                 * ==================================
                                 * CREATE AUTHENTICATION
                                 * ==================================
                                 */

                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                user.getEmail(),
                                                null,
                                                authorities
                                        );


                                /*
                                 * ==================================
                                 * REQUEST DETAILS
                                 * ==================================
                                 */

                                authentication.setDetails(
                                        new WebAuthenticationDetailsSource()
                                                .buildDetails(request)
                                );


                                /*
                                 * ==================================
                                 * SET SECURITY CONTEXT
                                 * ==================================
                                 */

                                SecurityContextHolder
                                        .getContext()
                                        .setAuthentication(
                                                authentication
                                        );


                                /*
                                 * ==================================
                                 * SUCCESS LOG
                                 * ==================================
                                 */

                                logger.debug(
                                        "JWT authentication successful for user: {}",
                                        user.getEmail()
                                );
                            },

                            /*
                             * ==================================
                             * USER NOT FOUND
                             * ==================================
                             */

                            () -> logger.warn(
                                    "JWT user not found: {}",
                                    userUuid
                            )
                    );


        }


        /*
         * ====================================================
         * JWT EXCEPTION HANDLING
         * ====================================================
         */

        catch (ExpiredJwtException e) {

            logger.warn(
                    "JWT authentication failed: token expired"
            );

            request.setAttribute(
                    "jwtError",
                    "Token Expired"
            );

        }

        catch (MalformedJwtException e) {

            logger.warn(
                    "JWT authentication failed: malformed token"
            );

            request.setAttribute(
                    "jwtError",
                    "Invalid Token"
            );

        }

        catch (JwtException e) {

            logger.warn(
                    "JWT authentication failed: invalid token"
            );

            request.setAttribute(
                    "jwtError",
                    "Invalid Token"
            );

        }

        catch (IllegalArgumentException e) {

            logger.warn(
                    "JWT authentication failed: invalid user identifier"
            );

            request.setAttribute(
                    "jwtError",
                    "Invalid Token"
            );

        }

        catch (Exception e) {

            logger.error(
                    "Unexpected error during JWT authentication",
                    e
            );

            request.setAttribute(
                    "jwtError",
                    "Authentication failed"
            );
        }
        /*
         * ====================================================
         * CONTINUE FILTER CHAIN
         * ====================================================
         */

        filterChain.doFilter(
                request,
                response
        );
    }


    /*
     * ========================================================
     * SKIP PUBLIC AUTH ENDPOINTS
     * ========================================================
     */

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {

        String path =
                request.getServletPath();

        return path.equals("/api/m1/auth/login")
                || path.equals("/api/m1/auth/register");
    }
}