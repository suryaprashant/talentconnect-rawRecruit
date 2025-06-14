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

import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext/RoleContext";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RoleProvider>
        <AuthProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AuthProvider>
      </RoleProvider>
    </BrowserRouter>
  </StrictMode>
);
