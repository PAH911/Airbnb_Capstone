import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  // Lấy user từ redux, fallback localStorage (nếu cần)
  const user =
    useSelector((state) => state.auth?.user) ||
    JSON.parse(localStorage.getItem("user"));

  // Chưa đăng nhập thì về /auth
  if (!user) return <Navigate to="/auth" />;

  // Nếu đã login mà không phải admin thì cũng về /auth
  if (!user.role || user.role.toLowerCase() !== "admin")
    return <Navigate to="/auth" />;

  // Đúng quyền thì cho truy cập các route con
  return <Outlet />;
}
