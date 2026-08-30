package com.authsphere_backend.Security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@Getter
public class CookieService {

    private static final Logger logger =
            LoggerFactory.getLogger(CookieService.class);

    private final String refreshTokenCookieName;
    private final boolean cookieHttpOnly;
    private final boolean cookieSecure;
    private final String cookieDomain;
    private final String cookieSameSite;

    public CookieService(

            @Value("${security.jwt.refresh-token-cookie-name}")
            String refreshTokenCookieName,

            @Value("${security.jwt.cookie-http-only}")
            boolean cookieHttpOnly,

            @Value("${security.jwt.cookie-secure}")
            boolean cookieSecure,

            @Value("${security.jwt.cookie-domain}")
            String cookieDomain,

            @Value("${security.jwt.cookie-same-site}")
            String cookieSameSite
    ) {

        this.refreshTokenCookieName = refreshTokenCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookieDomain = cookieDomain;
        this.cookieSameSite = cookieSameSite;
    }


    // ==========================================================
    // ATTACH REFRESH TOKEN COOKIE
    // ==========================================================

    public void attachRefreshCookie(
            HttpServletResponse response,
            String value,
            long maxAge
    ) {

        logger.info(
                "Attaching refresh token cookie: {}",
                refreshTokenCookieName
        );

        ResponseCookie.ResponseCookieBuilder builder =
                ResponseCookie
                        .from(
                                refreshTokenCookieName,
                                value
                        )
                        .httpOnly(cookieHttpOnly)
                        .secure(cookieSecure)
                        .path("/")
                        .maxAge(maxAge)
                        .sameSite(cookieSameSite);


        // ======================================================
        // COOKIE DOMAIN
        // ======================================================

        if (cookieDomain != null &&
                !cookieDomain.isBlank()) {

            builder.domain(cookieDomain);
        }


        // ======================================================
        // BUILD COOKIE
        // ======================================================

        ResponseCookie cookie =
                builder.build();


        logger.info(
                "Refresh token cookie created successfully"
        );


        // ======================================================
        // ADD SET-COOKIE HEADER
        // ======================================================

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );
    }


    // ==========================================================
    // CLEAR REFRESH TOKEN COOKIE
    // ==========================================================

    public void clearRefreshCookie(
            HttpServletResponse response
    ) {

        ResponseCookie.ResponseCookieBuilder builder =
                ResponseCookie
                        .from(
                                refreshTokenCookieName,
                                ""
                        )
                        .httpOnly(cookieHttpOnly)
                        .secure(cookieSecure)
                        .path("/")
                        .maxAge(0)
                        .sameSite(cookieSameSite);


        if (cookieDomain != null &&
                !cookieDomain.isBlank()) {

            builder.domain(cookieDomain);
        }


        ResponseCookie cookie =
                builder.build();


        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );


        logger.info(
                "Refresh token cookie cleared"
        );
    }


    // ==========================================================
    // NO-CACHE / NO-STORE HEADERS
    // ==========================================================

    public void addNoStoreHeaders(
            HttpServletResponse response
    ) {

        response.setHeader(
                HttpHeaders.CACHE_CONTROL,
                "no-store"
        );

        response.setHeader(
                HttpHeaders.PRAGMA,
                "no-cache"
        );
    }
}