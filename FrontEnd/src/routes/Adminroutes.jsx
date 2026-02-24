// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "../components/AdminRoute";
import AdminLogin from "../pages/admin/adminAuth/adminLogin";
import AdminSignup from "../pages/admin/adminAuth/adminSignup";
import AdminDashboard from "../pages/admin/dashboard/adminDashboard";
import AdminUserManagement from "../pages/admin/adminPages/adminUserManagement";
import AdminJobManagement from "../pages/admin/adminPages/adminJobManagement";
import AdminApplication from "../pages/admin/adminPages/adminApplication";
import AdminSettings from "../pages/admin/adminPages/adminSetting"
import NotFound from "@/pages/NotFound";
import AdminSidebar from "../components/layout/AdminSidebar";
import AllReferralPost from "@/pages/admin/adminPages/AllReferralPost";
import ManageReferral from "@/pages/admin/adminPages/ManageReferral";

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
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="jobs" element={<AdminJobManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="applications" element={<AdminApplication />} />
        <Route path="referral-posted" element={<AllReferralPost />} />
        <Route path="manage-referral" element={<ManageReferral/>}/>
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
