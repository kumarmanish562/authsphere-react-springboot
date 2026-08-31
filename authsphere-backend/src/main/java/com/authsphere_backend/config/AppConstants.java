package com.authsphere_backend.config;

public final class AppConstants {

    private AppConstants() {
        // Prevent object creation
    }


    // ============================================================
    // ROLES
    // ============================================================

    public static final String USER_ROLE = "USER";

    public static final String ADMIN_ROLE = "ADMIN";


    // ============================================================
    // PUBLIC AUTHENTICATION URLS
    // ============================================================

    public static final String[] AUTH_PUBLIC_URL = {

            "/error",

            // Login / Register / Refresh / Logout
            "/api/m1/auth/**",

            // Swagger / OpenAPI
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };
}