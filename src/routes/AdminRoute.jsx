import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  // Lấy user từ redux hoặc localStorage (đề phòng reload mất redux)
  const user = useSelector((state) => state.adminlogin.user) || JSON.parse(localStorage.getItem("user"));

  // Chưa đăng nhập thì đá về /auth
  if (!user) return <Navigate to="/auth" />;

  // Đã đăng nhập nhưng không phải ADMIN thì cũng đá về /auth
  // SỬA ĐOẠN NÀY cho chắc chắn (không phân biệt hoa thường)
  if (!user.role || user.role.toLowerCase() !== "admin") return <Navigate to="/auth" />;

  // Đúng quyền thì render các route con (dashboard, ...etc)
  return <Outlet />;
}
