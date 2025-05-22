import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LoginPage from "../pages/client-customer/LoginPage/LoginPage";
import HomePage from "../pages/client-customer/HomePage/HomePage";
import RoomListPage from "../pages/client-customer/RoomListPage/RoomListPage";
import RoomDetailPage from "../pages/client-customer/RoomDetailPage/RoomDetailPage";
import ProfilePage from "../pages/client-customer/ProfilePage/ProfilePage";
import CustomerLayout from "../pages/client-customer";
import Support from "../pages/client-customer/SupportPage/SupportPage";

import AdminLayout from "@/layouts/AdminLayouts";
import Dashboard from "@/pages/client-admin/Dashboard/Dashboard";
import AdminRoute from "./AdminRoute";
import AuthPage from "@/pages/client-admin/AuthPage/AuthPage";
import UserListPage from "@/pages/client-admin/UserManager/UserManager";
import LocationManager from "@/pages/client-admin/LocationManager/LocationManager";
export default function AppRoutes() {
  return (
    <Routes>
      {/* User/Customer layout */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomListPage />} />
        <Route path="room/:id" element={<RoomDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="support" element={<Support />} />
      </Route>

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Trang đăng nhập admin */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Admin layout BẢO VỆ bởi AdminRoute */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserListPage />} />{" "}
          {/* Thêm dòng này */}
          <Route path="location" element={<LocationManager />} />{" "}
          {/* Thêm dòng này */}
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
