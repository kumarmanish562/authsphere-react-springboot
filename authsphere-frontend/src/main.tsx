import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import "./index.css";
import LoginPage from "./pages/LoginPage.js";
import SignupPage from "./pages/SignupPage.js";
import ServicesPage from "./pages/ServicesPage.js";
import AboutPage from "./pages/AboutPage.js";
import RootLayout from "./pages/RootLayout";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<RootLayout/>} >
      <Route index element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup"  element={<SignupPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage/>} /> 
      </Route>
    </Routes>
  </BrowserRouter>
);