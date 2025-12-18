// src/main.jsx
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

// Context providers (now in src/context)
import { RoleProvider } from "@/context/RoleContext/RoleContext";
import { AuthProvider } from "@/context/AuthProvider";
import { SocketProvider } from "@/context/SocketContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <RoleProvider>
              <App />
              <Toaster position="top-right" />
            </RoleProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
