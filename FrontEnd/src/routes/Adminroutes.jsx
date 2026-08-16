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
import ScheduledInterviewPage from "@/pages/admin/adminPages/ScheduledInterviewPage";
import AdminManageBlogs from "@/pages/admin/adminPages/adminBlog";
import AdminNormalization from "@/pages/admin/adminPages/adminNormalization";
import BackupPage from "@/pages/admin/adminPages/BackupPage";
import UserDetail from "@/pages/admin/userDetail";
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
        <Route
          path="users/:userId/:userType"
          element={<UserDetail />}
        />
        <Route path="jobs" element={<AdminJobManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="applications" element={<AdminApplication />} />
        <Route path="referral-posted" element={<AllReferralPost />} />
        <Route path="manage-referral" element={<ManageReferral />} />
        <Route path="scheduled-interviews" element={<ScheduledInterviewPage />} />
        <Route path="manage-blogs" element={<AdminManageBlogs />} />
        <Route path="normalization-logs" element={<AdminNormalization />} />
        <Route path="*" element={<NotFound />} />
        <Route path="backup" element={<BackupPage />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
