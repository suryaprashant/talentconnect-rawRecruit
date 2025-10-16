// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "../components/AdminRoute";
import AdminLogin from "../pages/admin/adminAuth/adminLogin";
import AdminSignup from "../pages/admin/adminAuth/adminSignup";
import AdminDashboard from "../pages/admin/dashboard/adminDashboard";
import NotFound from "@/pages/NotFound";
import AdminSidebar from "../components/layout/AdminSidebar";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      {/* <Route path="/sidebar" element={<AdminSidebar/>}/> */}
      <Route
        path="/*"
        element={
          <AdminRoute>
            <AdminSidebar />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
