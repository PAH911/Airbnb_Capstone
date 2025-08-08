import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  // Lấy user từ redux (chú ý slice name là adminlogin), fallback localStorage
  const user =
    useSelector((state) => state.adminlogin?.user) ||
    JSON.parse(localStorage.getItem("user") || "null");

  console.log(
    "AdminRoute - User from Redux:",
    useSelector((state) => state.adminlogin?.user)
  );
  console.log(
    "AdminRoute - User from localStorage:",
    JSON.parse(localStorage.getItem("user") || "null")
  );
  console.log("AdminRoute - Final user:", user);

  // Chưa đăng nhập thì về /auth
  if (!user) {
    console.log("AdminRoute - No user, redirecting to /auth");
    return <Navigate to="/auth" />;
  }

  // Kiểm tra quyền admin (case-insensitive và nhiều field)
  const userRole = user.role || user.Role || user.ROLE;
  console.log("AdminRoute - User role:", userRole);

  if (!userRole || userRole.toLowerCase() !== "admin") {
    console.log("AdminRoute - Not admin role, redirecting to /auth");
    return <Navigate to="/auth" />;
  }

  console.log("AdminRoute - Admin confirmed, allowing access");
  // Đúng quyền thì cho truy cập các route con
  return <Outlet />;
}
