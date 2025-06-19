// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { RoleProvider } from './context/RoleContext/RoleContext'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RoleProvider>
//       <App />
//     </RoleProvider>
 
//   </StrictMode>,
// )

// import React, { StrictMode } from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";

// import { BrowserRouter } from "react-router-dom";
// import { RoleProvider } from "./context/RoleContext/RoleContext";
// import { AuthProvider } from "./context/AuthProvider.jsx";
// import { SocketProvider } from "./context/SocketContext.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <RoleProvider>
//         <AuthProvider>
//           <SocketProvider>
//             <App />
//           </SocketProvider>
//         </AuthProvider>
//       </RoleProvider>
//     </BrowserRouter>
//   </StrictMode>
// );



import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext/RoleContext";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import { Toaster } from 'react-hot-toast'; // Import Toaster for notifications

// Ensure your Google Client ID is available in your frontend's environment variables.
// For Vite, it's typically VITE_GOOGLE_CLIENT_ID.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire application with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <RoleProvider>
          <AuthProvider>
            <SocketProvider>
              <App />
              <Toaster /> {/* Add the Toaster component here */}
            </SocketProvider>
          </AuthProvider>
        </RoleProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);