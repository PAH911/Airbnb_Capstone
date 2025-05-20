import React from "react";
import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <>
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
    </>
  );
}
