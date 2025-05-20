import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// USER
import LoginPage from "../pages/client-customer/LoginPage/LoginPage";
import HomePage from "../pages/client-customer/HomePage/HomePage";
import RoomListPage from "../pages/client-customer/RoomListPage/RoomListPage";
import RoomDetailPage from "../pages/client-customer/RoomDetailPage/RoomDetailPage";
import ProfilePage from "../pages/client-customer/ProfilePage/ProfilePage";

// ADMIN
import Dashboard from "../pages/client-admin/Dashboard/Dashboard";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import CustomerLayout from "../pages/client-customer"; // import layout

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomListPage />} />
        <Route path="room/:id" element={<RoomDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Route */}
      <Route element={<PrivateRoute />}>{/* ... các route khác */}</Route>

      {/* Admin Route */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        {/* More admin routes */}
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
