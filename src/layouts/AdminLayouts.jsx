import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/AdminSideBar";
import CustomHeader from "@/components/CustomHeader";
const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", background: "#23272F" }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            background: "#23272F",
            color: "#F4F6F8",
            minHeight: "calc(100vh - 64px)",
            padding: 24,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
