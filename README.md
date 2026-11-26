# 🛡️ AuthSphere

> A production-grade, full-stack authentication and identity security platform built with **React 19**, **TypeScript**, **Tailwind CSS**, **Spring Boot 4**, **Spring Security**, **JWT**, **OAuth 2.0**, and **MySQL**.

AuthSphere implements a complete enterprise authentication lifecycle featuring **feature-wise (package-by-feature)** architecture on both the backend and frontend, stateless JWT access tokens, `HttpOnly` rotating refresh tokens, TOTP 2FA with backup recovery codes, real-time device session management, `X-API-Key` developer authentication, dynamic security scoring, audit logging, and an admin console.

---

## ✨ Implemented Features

### 🔐 Core Authentication & Token Lifecycle
- **User Registration & Login**: BCrypt password hashing, `@Valid` DTO validation, and automatic `ROLE_USER` assignment via `DataInitializer`.
- **Stateless JWT + Rotating Refresh Tokens**: `HS512` signed access tokens (`JwtService`) paired with DB-backed rotating refresh tokens stored in `HttpOnly` cookies (`CookieService`).
- **XSS-Hardened In-Memory Access Token**: Frontend Zustand store (`authStore.ts`) keeps `accessToken` strictly in memory (excluded from `localStorage` via `partialize`) and silently hydrates it from the `HttpOnly` cookie on page reload.
- **Concurrent 401 Refresh Queue**: Axios interceptors (`ApiClient.ts`) automatically queue concurrent `401` requests during an active refresh and retry them seamlessly.
- **Forgot Password & Email Verification**: Tokenized password reset (`15m` TTL) and email verification (`24h` TTL) via `EmailService` (supports SMTP or dev console fallback).

### 🌐 OAuth 2.0
- **Google & GitHub Login**: Automatic user provisioning, GitHub private-email fallback, session tracking, audit logging, and dedicated `/auth/success` and `/auth/failure` UI flows.

### 🔑 Two-Factor Authentication (TOTP + Backup Codes)
- **Google Authenticator / Authy Support**: RFC 6238 `HmacSHA1` TOTP secret generation, QR code setup modal, and 6-digit verification (`TotpService`).
- **Single-Use Backup Recovery Codes**: Generates 8 BCrypt-hashed recovery codes (`XXXX-XXXX`) upon 2FA activation.

### 🛡️ Rate Limiting, Lockout & Security Center
- **IP Rate Limiting**: `RateLimitFilter` restricts `/login`, `/register`, and `/forgot-password` to 15 requests/minute per IP (`429 Too Many Requests`).
- **Brute-Force Lockout**: Locks accounts for 15 minutes after 5 consecutive failed login attempts.
- **Dynamic Security Score & Audit Trail**: Real-time score calculation (`SecurityServiceImpl`) and `audit_logs` tracking (`LOGIN`, `OAUTH_LOGIN`, `LOGOUT`, `TOKEN_REFRESH`, `PASSWORD_CHANGE`, `API_KEY_CREATED`, `API_KEY_REVOKED`, `SESSION_REVOKED`, `ACCOUNT_LOCKED`, etc.).

### 💻 Device & Session Management
- Tracks active sessions in `user_sessions` with IP address, browser, OS, device type, approximate location, and refresh token JTI.
- View all active devices and remotely revoke individual sessions or all other sessions (simultaneously revoking their refresh tokens).

### 🔧 Developer API Keys (`X-API-Key`)
- Generate `as_live_` and `as_test_` keys using `SecureRandom`.
- Only **SHA-256** hashes are stored in `api_keys`; the plain-text secret is displayed **once** on creation.
- Live `ApiKeyAuthenticationFilter` authenticates external REST requests via the `X-API-Key` header and updates `lastUsedAt`.

### 👤 Account Profile, Settings & Admin Console
- **Profile & Settings**: Update display name, change password (with current-password verification), persist notification/tracking/rotation preferences in `user_settings`, and delete own account.
- **Admin Console (`/dashboard/admin`)**: Role-gated (`ROLE_ADMIN`) dashboard displaying system metrics, user directory, lock/unlock controls, enable/disable toggles, role management, and system-wide audit logs.
- **Scheduled Cleanup**: `@Scheduled` hourly job (`TokenCleanupScheduler`) purges expired/revoked refresh tokens, verification tokens, and stale sessions.

---

## 🧱 Feature-Wise Project Architecture

### Backend (`authsphere-backend/src/main/java/com/authsphere_backend/`)
```text
├── AuthsphereBackendApplication.java
├── admin/          (controller, dto, service)
├── apikey/         (controller, dto, entity, repository, security, service)
├── auth/           (controller, dto, entity, repository, security, service)
├── common/         (config, dtos, exceptions, helpers, scheduler, service)
├── security/       (controller, dto, entity, repository, service)
├── session/        (controller, dto, entity, repository, service)
└── user/           (controller, dto, entity, repository, service)
```

### Frontend (`authsphere-frontend/src/`)
```text
├── App.tsx
├── main.tsx
├── components/ui/  (shadcn/ui primitives)
├── hooks/
├── lib/
└── features/
    ├── admin/      (models, pages, services)
    ├── apikeys/    (models, pages, services)
    ├── auth/       (components, models, pages, services, store)
    ├── common/     (components, config, layouts)
    ├── public/     (pages)
    ├── security/   (models, pages, services)
    ├── sessions/   (models, pages, services)
    └── user/       (models, pages, services)
```

---

## 📡 Key REST API Endpoints (`/api/m1`)

| Module | Method & Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` | Core authentication & token lifecycle |
| **Recovery** | `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/verify-email` | Password reset & email verification |
| **User** | `GET /users/me`, `PUT /users/profile`, `PUT /users/change-password`, `GET/PUT /users/settings`, `DELETE /users/me` | Profile, password, settings & deletion |
| **Sessions** | `GET /sessions`, `DELETE /sessions/{id}`, `DELETE /sessions/other` | Active device listing & revocation |
| **API Keys** | `POST /api-keys`, `GET /api-keys`, `DELETE /api-keys/{id}` | API key creation, listing & revocation |
| **Security** | `GET /security/overview`, `POST /security/two-factor/setup`, `POST /security/two-factor/verify`, `PUT /security/two-factor` | Security score, audit logs & TOTP 2FA |
| **Admin** | `GET /admin/stats`, `GET /admin/users`, `PUT /admin/users/{id}/unlock`, `PUT /admin/users/{id}/status`, `PUT /admin/users/{id}/role` | Admin console (`ROLE_ADMIN` only) |

> Interactive API docs available at `http://localhost:8083/swagger-ui.html`.

---

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)
Starts **MySQL 8.4** (`3306`), **Spring Boot Backend** (`8083`), and **React + Nginx Frontend** (`5173`):
```powershell
docker compose up --build
```

### Option 2: Run Locally

#### 1. Backend (`authsphere-backend`)
Ensure MySQL is running on `localhost:3306` (configured in `src/main/resources/application-dev.yaml`), then run:
```powershell
cd authsphere-backend
.\mvnw.cmd spring-boot:run
```

#### 2. Frontend (`authsphere-frontend`)
Create `authsphere-frontend/.env` (see `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8083/api/m1
VITE_BASE_URL=http://localhost:8083
```
Then install and start:
```powershell
cd authsphere-frontend
npm install
npm run dev
```

---

## ⚙️ Optional Environment Variables

| Variable | Purpose |
| :--- | :--- |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | MySQL connection settings |
| `JWT_SECRET` | 64+ character secret for `HS512` JWT signing |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 credentials |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth 2.0 credentials |
| `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` | SMTP server for real email delivery |
| `COOKIE_SECURE` | Set `true` in HTTPS production environments |

---

## 🧪 Testing & Production Builds

```powershell
# Backend integration tests (runs against H2 in-memory DB via test profile)
cd authsphere-backend
.\mvnw.cmd test

# Frontend TypeScript check + Vite production build
cd authsphere-frontend
npm run build
```
