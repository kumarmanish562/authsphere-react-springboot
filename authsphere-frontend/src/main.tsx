import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";

import App from "./App";
import "./index.css";

import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";
import ServicesPage from "./features/public/pages/ServicesPage";
import AboutPage from "./features/public/pages/AboutPage";

import RootLayout from "./features/common/layouts/RootLayout";

import Userlayout from "./features/common/layouts/DashboardLayout";
import Userhome from "./features/user/pages/OverviewPage";
import Userprofile from "./features/user/pages/ProfilePage";

import OAuthSuccess from "./features/auth/pages/OAuthSuccess";
import OAuthFailure from "./features/auth/pages/OAuthFailure";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";

import SecurityPage from "./features/security/pages/SecurityPage";
import SessionsPage from "./features/sessions/pages/SessionsPage";
import ApiAccessPage from "./features/apikeys/pages/ApiAccessPage";
import SettingsPage from "./features/user/pages/SettingsPage";
import AboutDashboardPage from "./features/public/pages/AboutPage";

createRoot(
  document.getElementById("root")!
).render(

  <BrowserRouter>

    <Routes>

      {/* =================================================
          PUBLIC
      ================================================= */}

      <Route element={<RootLayout />}>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

      </Route>


      {/* =================================================
          DASHBOARD
      ================================================= */}

      <Route
        path="/dashboard"
        element={<Userlayout />}
      >

        <Route
          index
          element={<Userhome />}
        />

        <Route
          path="profile"
          element={<Userprofile />}
        />

        <Route
          path="security"
          element={<SecurityPage />}
        />

        <Route
          path="sessions"
          element={<SessionsPage />}
        />

        <Route
          path="api"
          element={<ApiAccessPage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />

        <Route
          path="about"
          element={<AboutDashboardPage />}
        />

      </Route>


      {/* =================================================
          OAUTH
      ================================================= */}

      <Route
        path="/auth/success"
        element={<OAuthSuccess />}
      />

      <Route
        path="/auth/failure"
        element={<OAuthFailure />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />

    </Routes>

  </BrowserRouter>
);