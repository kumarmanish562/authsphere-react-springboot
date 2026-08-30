package com.authsphere_backend.Security;

import com.authsphere_backend.entities.Role;
import com.authsphere_backend.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Getter
public class JwtService {

    private final SecretKey key;

    private final long accessTtlSeconds;

    private final long refreshTtlSeconds;

    private final String issuer;


    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-ttl-seconds}")
            long accessTtlSeconds,
            @Value("${security.jwt.refresh-ttl-seconds}")
            long refreshTtlSeconds,
            @Value("${security.jwt.issuer}")
            String issuer
    ) {

        if (secret == null || secret.length() < 64) {
            throw new IllegalArgumentException(
                    "JWT secret must contain at least 64 characters"
            );
        }

        if (accessTtlSeconds <= 0) {
            throw new IllegalArgumentException(
                    "Access token TTL must be greater than 0"
            );
        }

        if (refreshTtlSeconds <= 0) {
            throw new IllegalArgumentException(
                    "Refresh token TTL must be greater than 0"
            );
        }

        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.accessTtlSeconds = accessTtlSeconds;

        this.refreshTtlSeconds = refreshTtlSeconds;

        this.issuer = issuer;
    }


    // ==========================================================
    // ACCESS TOKEN
    // ==========================================================

    public String generateAccessToken(User user) {

        Instant now = Instant.now();

        List<String> roles =
                user.getRoles() == null
                        ? List.of()
                        : user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .toList();

        return Jwts.builder()

                .id(UUID.randomUUID().toString())

                .subject(
                        user.getId().toString()
                )

                .issuer(issuer)

                .issuedAt(
                        Date.from(now)
                )

                .expiration(
                        Date.from(
                                now.plusSeconds(
                                        accessTtlSeconds
                                )
                        )
                )

                .claims(
                        Map.of(
                                "email",
                                user.getEmail(),

                                "roles",
                                roles,

                                "typ",
                                "access"
                        )
                )

                .signWith(
                        key,
                        SignatureAlgorithm.HS512
                )

                .compact();
    }


    // ==========================================================
    // REFRESH TOKEN
    // ==========================================================

    public String generateRefreshToken(
            User user,
            String jti
    ) {

        Instant now = Instant.now();

        return Jwts.builder()

                .id(jti)

                .subject(
                        user.getId().toString()
                )

                .issuer(issuer)

                .issuedAt(
                        Date.from(now)
                )

                .expiration(
                        Date.from(
                                now.plusSeconds(
                                        refreshTtlSeconds
                                )
                        )
                )

                .claims(
                        Map.of(
                                "typ",
                                "refresh"
                        )
                )

                .signWith(
                        key,
                        SignatureAlgorithm.HS512
                )

                .compact();
    }


    // ==========================================================
    // PARSE JWT
    // ==========================================================

    public Jws<Claims> parse(String token) {

        return Jwts
                .parser()
                .verifyWith(key)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token);
    }


    // ==========================================================
    // GET USER ID
    // ==========================================================

    public UUID getUserId(String token) {

        Claims claims =
                parse(token).getPayload();

        return UUID.fromString(
                claims.getSubject()
        );
    }


    // ==========================================================
    // GET JTI
    // ==========================================================

    public String getJti(String token) {

        Claims claims =
                parse(token).getPayload();

        return claims.getId();
    }


    // ==========================================================
    // GET TOKEN TYPE
    // ==========================================================

    public String getTokenType(String token) {

        Claims claims =
                parse(token).getPayload();

        return claims.get(
                "typ",
                String.class
        );
    }


    // ==========================================================
    // CHECK ACCESS TOKEN
    // ==========================================================

    public boolean isAccessToken(String token) {

        return "access".equals(
                getTokenType(token)
        );
    }


    // ==========================================================
    // CHECK REFRESH TOKEN
    // ==========================================================

    public boolean isRefreshToken(String token) {

        return "refresh".equals(
                getTokenType(token)
        );
    }


    // ==========================================================
    // GET EMAIL
    // ==========================================================

    public String getEmail(String token) {

        Claims claims =
                parse(token).getPayload();

        return claims.get(
                "email",
                String.class
        );
    }


    // ==========================================================
    // GET ROLES
    // ==========================================================

    public List<String> getRoles(String token) {

        Claims claims =
                parse(token).getPayload();

        return claims.get(
                "roles",
                List.class
        );
    }
}