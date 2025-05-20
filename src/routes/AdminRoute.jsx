import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/" />;
}
