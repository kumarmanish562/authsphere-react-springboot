package com.authsphere_backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "AuthSphere API",
                version = "1.0.0",
                summary = "Authentication and Authorization API",
                description = """
                        AuthSphere provides authentication and authorization
                        APIs using JWT, OAuth2, Google, GitHub, refresh-token
                        rotation, HttpOnly cookies, and role-based authorization.
                        """,
                contact = @Contact(
                        name = "Manish Kumar",
                        url = "https://manishkumar562.com",
                        email = "mk86271217@gmail.com"
                )
        ),

        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Enter your JWT access token"
)
public class APIDocConfig {
}