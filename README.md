# 🛡️ AuthSphere

> A modern, secure and futuristic authentication platform built with React.js, Spring Boot, Spring Security, JWT, OAuth 2.0 and MySQL.

AuthSphere is a full-stack authentication application designed to demonstrate how a production-style authentication system can be built using modern frontend and backend technologies.

The application provides secure user registration, login, OAuth authentication, JWT-based authorization, refresh-token management, session monitoring, security controls and API access management.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- Secure password authentication
- JWT-based authentication
- Access token and refresh token support
- Refresh token rotation
- Logout functionality
- Protected routes
- Authentication state management

### 🌐 OAuth 2.0

- Google OAuth login
- GitHub OAuth login
- OAuth success handling
- OAuth failure handling
- Secure authentication callback flow

### 🛡️ Security

- Spring Security integration
- Role-based authorization
- JWT validation
- Refresh token management
- Protected dashboard
- Security monitoring
- Login activity monitoring
- Suspicious login detection
- Session management
- Re-authentication controls

### 👤 User Dashboard

The application provides a dedicated dashboard after successful authentication.

Dashboard sections include:

- Overview
- Profile
- Security
- Sessions
- API Access
- Settings
- About AuthSphere

### 💻 Session Management

Users can:

- View active sessions
- View connected devices
- View browser information
- View approximate login location
- View session activity
- Identify the current device
- Revoke other sessions

### 🔑 API Access

The API Access section provides a central place to manage application credentials.

Features include:

- API key management
- Active/inactive key status
- API key creation
- API key visibility controls
- API key revocation
- Development and production credentials

> API secrets should never be exposed in frontend code or committed to GitHub.

### ⚙️ Account Settings

Users can manage:

- Account information
- Security notifications
- Login activity monitoring
- Location tracking preferences
- Token rotation preferences
- Application appearance

### ℹ️ About AuthSphere

The About section provides information about:

- AuthSphere
- Project architecture
- Security philosophy
- Technology stack
- Project version
- License

---

# 🎨 UI & Design

AuthSphere uses a futuristic security-focused interface.

### Design characteristics

- Dark interface
- Black background
- Glass-like cards
- Rounded UI components
- Subtle borders
- Cyan security accents
- Violet authentication accents
- Green security status indicators
- Responsive dashboard
- Minimal navigation
- Developer-focused visual language

The UI is built using:

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons

---

# 🧱 Project Architecture

```text
                         ┌──────────────────────┐
                         │      AuthSphere      │
                         │      Frontend        │
                         │   React + TypeScript  │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │      AuthSphere      │
                         │       Backend        │
                         │     Spring Boot      │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             Spring Security       JWT             OAuth2
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        MySQL         │
                         │      Database        │
                         └──────────────────────┘
