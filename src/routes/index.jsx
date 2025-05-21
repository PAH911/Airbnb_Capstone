import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// PAGE IMPORTS
import LoginPage from "../pages/client-customer/LoginPage/LoginPage";
import HomePage from "../pages/client-customer/HomePage/HomePage";
import RoomListPage from "../pages/client-customer/RoomListPage/RoomListPage";
import RoomDetailPage from "../pages/client-customer/RoomDetailPage/RoomDetailPage";
import ProfilePage from "../pages/client-customer/ProfilePage/ProfilePage";
import Dashboard from "../pages/client-admin/Dashboard/Dashboard";
import CustomerLayout from "../pages/client-customer";

// ----- PROTECTED ROUTE COMPONENTS -----
// Chỉ cho vào khi đã đăng nhập
function PrivateRoute() {
  const { user } = useSelector((state) => state.auth);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

// Chỉ cho vào khi đã đăng nhập và có quyền ADMIN
function AdminRoute() {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/" />;
}

// ----- ROUTE DEFINITION -----
export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Layout */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomListPage />} />
        <Route path="room/:id" element={<RoomDetailPage />} />
        <Route path="profile" element={<PrivateRoute />}>
          <Route index element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        {/* Thêm các route admin khác ở đây */}
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
