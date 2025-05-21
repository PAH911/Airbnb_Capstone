import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../pages/client-admin/AuthPage/authSlice"; // CHỈNH LẠI PATH NẾU CẦN
import logo from "../assets/images/logo.png";

const { Sider } = Layout;

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") return; // Đã xử lý ở onClick của menu item
    setSelectedKey(key);
    navigate(key);
  };

  const adminMenu = [
    !collapsed
      ? { label: "Giao diện - Người dùng", type: "group" }
      : { type: "divider" },
    { key: "/admin", label: "Trang chủ", icon: <MailOutlined /> },
    {
      key: "sub1",
      label: "Quản lý người dùng",
      icon: <SettingOutlined />,
      children: [
        { key: "/admin/users", label: "Danh sách người dùng" },
      ],
    },
    !collapsed ? { label: "Chức năng", type: "group" } : { type: "divider" },
    {
      key: "sub2",
      label: "Quản lý thông tin vị tr",
      icon: <SettingOutlined />,
      children: [
        { key: "/admin/location", label: "Danh sách vị trí" },
      ],
    },
    !collapsed ? { label: "Hệ thống", type: "group" } : { type: "divider" },
    {
      key: "sub3",
      label: "Tài khoản",
      icon: <UserOutlined />,
      children: [
        { key: "/admin/your-course", label: "Khoá học đã tạo" },
        { key: "/admin/profile", label: "Thông tin cá nhân" },
        { key: "/admin/password", label: "Cập nhật mật khẩu" },
      ],
    },
    {
      key: "logout",
      label: "Đăng xuất",
      danger: true,
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/auth");
      },
    },
  ];

  return (
    <Sider
      breakpoint="md"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: "#23272F",
        color: "#F4F6F8",
        borderRight: "1px solid #252B36",
      }}
    >
      <div className="relative px-4">
        <div className="h-16 flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 object-contain 
              ${collapsed ? "w-10 h-10" : "w-24 md:w-28 lg:w-32"}`}
          />
        </div>
      </div>
      <div style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{
            background: "#23272F",
            color: "#F4F6F8",
            border: "none",
          }}
          items={adminMenu}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
}
