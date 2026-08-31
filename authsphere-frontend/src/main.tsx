import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";

import App from "./App";
import "./index.css";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";

import RootLayout from "./pages/RootLayout";

import Userlayout from "./pages/users/Userlayout";
import Userhome from "./pages/users/Userhome";
import Userprofile from "./pages/users/Userprofile";

import OAuthSuccess from "./pages/OAuthSuccess";

import SecurityPage from "./pages/SecurityPage";
import SessionsPage from "./pages/SessionsPage";
import ApiAccessPage from "./pages/ApiAccessPage";
import SettingsPage from "./pages/SettingsPage";
import AboutDashboardPage from "./pages/AboutPage";

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
        element={<OAuthSuccess />}
      />

    </Routes>

  </BrowserRouter>
);