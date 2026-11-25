package com.authsphere_backend;

import com.authsphere_backend.auth.dto.LoginRequest;
import com.authsphere_backend.auth.dto.RegisterRequest;
import com.authsphere_backend.apikey.dto.CreateApiKeyRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldRejectUnauthenticatedProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/m1/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectInvalidRegistrationPayload() throws Exception {
        RegisterRequest invalid = RegisterRequest.builder()
                .name("")
                .email("not-an-email")
                .password("123")
                .build();

        mockMvc.perform(post("/api/m1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    void fullAuthSessionsApiKeysAndSecurityFlow() throws Exception {
        String email = "prodtest@authsphere.dev";
        String password = "StrongPassword123!";

        // 1. Register
        RegisterRequest reg = RegisterRequest.builder()
                .name("Prod Test User")
                .email(email)
                .password(password)
                .build();

        mockMvc.perform(post("/api/m1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.password").doesNotExist());

        // 2. Login
        LoginRequest login = new LoginRequest(email, password);
        MvcResult loginResult = mockMvc.perform(post("/api/m1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String accessToken = loginJson.get("accessToken").asText();

        // 3. Access /users/me
        mockMvc.perform(get("/api/m1/users/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));

        // 4. Verify active session created
        mockMvc.perform(get("/api/m1/sessions")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].active").doesNotExist())
                .andExpect(jsonPath("$[0].ipAddress").isNotEmpty());

        // 5. Create & list API key
        CreateApiKeyRequest keyReq = new CreateApiKeyRequest("CI Pipeline", "LIVE", "read,write", 30);
        mockMvc.perform(post("/api/m1/api-keys")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(keyReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.plainTextKey").isNotEmpty());

        // 6. Security overview
        mockMvc.perform(get("/api/m1/security/overview")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.securityScore").isNumber())
                .andExpect(jsonPath("$.recentActivity").isArray());
    }
}
