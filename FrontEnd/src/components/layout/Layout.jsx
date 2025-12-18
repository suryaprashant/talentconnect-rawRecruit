// src/components/layout/Layout.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const LayoutDepthContext = createContext(0);

export default function Layout({ children }) {
  const depth = useContext(LayoutDepthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // If Layout is accidentally nested, do NOT render another sidebar/header.
  if (depth > 0) {
    return <>{children ?? <Outlet />}</>;
  }

  const nextDepth = useMemo(() => depth + 1, [depth]);

  return (
    <LayoutDepthContext.Provider value={nextDepth}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar open={sidebarOpen} />

        <div className="flex-1 flex flex-col">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
          />

          <main className="flex-1 p-4 md:p-6">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </LayoutDepthContext.Provider>
  );
}
