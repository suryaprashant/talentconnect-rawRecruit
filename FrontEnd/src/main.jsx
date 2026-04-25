import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom"; // Keep this
import { RoleProvider } from "./context/RoleContext/RoleContext";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { AuthContextRole } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from "./context/ChatContext.jsx";
import ReactGA from "react-ga4";
import { HelmetProvider } from "react-helmet-async";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContextRole>
        <HelmetProvider>
          <BrowserRouter> {/* Keep BrowserRouter here */}
            <RoleProvider>
              <AuthProvider>
                <SocketProvider>
                  <ChatProvider>
                    <App />
                    <Toaster />
                  </ChatProvider>
                </SocketProvider>
              </AuthProvider>
            </RoleProvider>
          </BrowserRouter>
        </HelmetProvider>
      </AuthContextRole>
    </GoogleOAuthProvider>
  </>
  // </StrictMode>
);