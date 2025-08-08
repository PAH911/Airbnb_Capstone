import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  Typography,
  Divider,
  Space,
  Button,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../pages/client-admin/AuthPage/authSlice";

const { Header } = Layout;
const { Text } = Typography;

export default function CustomHeader({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const generateBreadcrumbs = () => {
    const pathArray = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [
      {
        title: <HomeOutlined style={{ color: "white" }} />,
        href: "/admin",
      },
    ];
    pathArray.forEach((path, index) => {
      const href = `/${pathArray.slice(0, index + 1).join("/")}`;
      const breadcrumbTitle = {
        dashboard: "Trang chủ",
        users: "Quản lý người dùng",
        location: "Quản lý vị trí",
        rooms: "Quản lý phòng",
        comments: "Quản lý bình luận",
      };
      breadcrumbs.push({
        title: (
          <span style={{ color: "white" }}>
            {breadcrumbTitle[path] || path}
          </span>
        ),
        href,
      });
    });
    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();
  const avatarSrc = user?.picture ?? null;

  const userMenuItems = [
    {
      key: "avatar",
      label: (
        <div className="w-44">
          <Space direction="horizontal" size="small">
            <Avatar
              size={50}
              src={avatarSrc}
              icon={!avatarSrc ? <UserOutlined /> : undefined}
            />
            <div className="flex flex-col">
              <Text strong>
                {user?.full_name || user?.name || "Người dùng"}
              </Text>
              <Text type="secondary">{user?.role || "Vai trò"}</Text>
            </div>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
        </div>
      ),
    },
    {
      key: "profile",
      label: "Thông tin",
      icon: <InfoCircleOutlined />,
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "change-password",
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      onClick: () => navigate("/admin/password"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/auth");
      },
    },
    { type: "divider" },
    {
      key: "version",
      label: "Anh Huy - 2025",
      disabled: true,
      style: { textAlign: "center" },
    },
  ];

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#252B36",
        color: "#F4F6F8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #23272F",
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 18, color: "white" }}
        />
        <Breadcrumb
          items={breadcrumbItems}
          style={{
            color: "white",
          }}
          separator={<span style={{ color: "white" }}>/</span>}
          className="custom-breadcrumb"
        />
      </div>
      <Dropdown
        menu={{ items: userMenuItems }}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <Avatar
            size="default"
            src={avatarSrc}
            icon={!avatarSrc ? <UserOutlined /> : undefined}
          />
        </div>
      </Dropdown>
    </Header>
  );
}
