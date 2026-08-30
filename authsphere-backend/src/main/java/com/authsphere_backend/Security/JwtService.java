package com.authsphere_backend.Security;

import com.authsphere_backend.entities.Role;
import com.authsphere_backend.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
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
@Setter
public class JwtService {

    // ==========================================================
    // JWT CONFIGURATION
    // ==========================================================

    private final SecretKey key;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;


    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-ttl-seconds}") long accessTtlSeconds,
            @Value("${security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds,
            @Value("${security.jwt.issuer}") String issuer
    ) {

        if (secret == null || secret.length() < 64) {
            throw new IllegalArgumentException(
                    "JWT secret must contain at least 64 characters"
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
    // GENERATE ACCESS TOKEN
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
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(
                        Date.from(
                                now.plusSeconds(accessTtlSeconds)
                        )
                )
                .claims(
                        Map.of(
                                "email", user.getEmail(),
                                "roles", roles,
                                "typ", "access"
                        )
                )
                .signWith(
                        key,
                        SignatureAlgorithm.HS512
                )
                .compact();
    }


    // ==========================================================
    // GENERATE REFRESH TOKEN
    // ==========================================================

    public String generateRefreshToken(
            User user,
            String jti
    ) {

        Instant now = Instant.now();

        return Jwts.builder()
                .id(jti)
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(
                        Date.from(
                                now.plusSeconds(refreshTtlSeconds)
                        )
                )
                .claims(
                        Map.of(
                                "typ", "refresh"
                        )
                )
                .signWith(
                        key,
                        SignatureAlgorithm.HS512
                )
                .compact();
    }


    // ==========================================================
    // PARSE AND VERIFY JWT
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
    // CHECK ACCESS TOKEN
    // ==========================================================

    public boolean isAccessToken(String token) {

        Claims claims = parse(token).getPayload();

        return "access".equals(
                claims.get("typ", String.class)
        );
    }


    // ==========================================================
    // CHECK REFRESH TOKEN
    // ==========================================================

    public boolean isRefreshToken(String token) {

        Claims claims = parse(token).getPayload();

        return "refresh".equals(
                claims.get("typ", String.class)
        );
    }


    // ==========================================================
    // GET USER ID
    // ==========================================================

    public UUID getUserId(String token) {

        Claims claims = parse(token).getPayload();

        return UUID.fromString(
                claims.getSubject()
        );
    }


    // ==========================================================
    // GET JWT ID
    // ==========================================================

    public String getJti(String token) {

        Claims claims = parse(token).getPayload();

        return claims.getId();
    }


    // ==========================================================
    // GET USER ROLES
    // ==========================================================

    public List<String> getRoles(String token) {

        Claims claims = parse(token).getPayload();

        return claims.get("roles", List.class);
    }


    // ==========================================================
    // GET USER EMAIL
    // ==========================================================

    public String getEmail(String token) {

        Claims claims = parse(token).getPayload();

        return claims.get("email", String.class);
    }

}
























