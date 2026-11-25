package com.authsphere_backend.apikey.security;

import com.authsphere_backend.apikey.entity.ApiKey;
import com.authsphere_backend.apikey.repository.ApiKeyRepository;
import com.authsphere_backend.user.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-Key";

    private final ApiKeyRepository apiKeyRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String rawKey = request.getHeader(API_KEY_HEADER);

            if (rawKey != null && !rawKey.isBlank()) {
                String keyHash = sha256(rawKey.trim());
                Optional<ApiKey> match = apiKeyRepository.findByKeyHashAndActiveTrue(keyHash);

                if (match.isPresent()) {
                    ApiKey apiKey = match.get();
                    boolean notExpired = apiKey.getExpiresAt() == null
                            || apiKey.getExpiresAt().isAfter(Instant.now());

                    User user = apiKey.getUser();
                    if (notExpired && user != null && user.isEnabled() && user.isAccountNonLocked()) {
                        apiKey.setLastUsedAt(Instant.now());
                        apiKeyRepository.save(apiKey);

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        user.getAuthorities()
                                );
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
