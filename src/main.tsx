import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SplashProvider } from "./contexts/SplashContext";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/index";
import ClerkProvider from "./providers/ClerkProvider";
import "./sass/index.scss";

// Import and validate environment
import { validateEnv } from "./config/env";

console.log("🚀 App starting...");
const envValid = validateEnv();
console.log("🌍 Environment validation result:", envValid);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider>
      <SplashProvider>
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <AppRouter />
              <Toaster />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </SplashProvider>
    </ClerkProvider>
  </React.StrictMode>
);
