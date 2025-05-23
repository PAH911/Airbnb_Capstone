import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Switch, Dropdown, Avatar } from "antd";
import {
  GlobalOutlined,
  MenuOutlined,
  MoonFilled,
  SunFilled,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../pages/client-customer/LoginPage/authSlice";
import { setUser } from "../pages/client-customer/ProfilePage/userSlice";

// Sửa lại các tab menu cho phù hợp với trang đặt phòng online
const menuItems = [
  { key: "home", label: <Link to="/">Trang chủ</Link> },
  { key: "rooms", label: <Link to="/rooms">Phòng</Link> },
  { key: "support", label: <Link to="/support">Hỗ trợ</Link> },
];

export default function Header({ user: userProp }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  // Nếu user chưa có, thử lấy lại từ localStorage (khi reload trang)
  let displayUser = user;
  if (!displayUser && localStorage.getItem("accessToken")) {
    try {
      const userStr = localStorage.getItem("userInfo");
      if (userStr) displayUser = JSON.parse(userStr);
    } catch {}
  }
  const userMenu = [
    {
      key: "profile",
      label: <Link to="/profile">Tài khoản</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: (
        <span
          onClick={() => {
            dispatch(logout());
            dispatch(setUser(null)); // Xóa luôn Redux user
            window.location.href = "/login";
          }}
        >
          Đăng xuất
        </span>
      ),
      icon: <LogoutOutlined />,
    },
  ];
  // Xác định key đang active dựa vào pathname
  const activeKey = (() => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/rooms")) return "rooms";
    if (location.pathname.startsWith("/support")) return "support";
    return "";
  })();
  return (
    <header className="w-full bg-white/95 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo TripNest */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-rose-500 group-hover:scale-110 transition-transform"
            >
              <circle cx="16" cy="16" r="16" fill="currentColor" />
              <path d="M16 8L20 24L16 20L12 24L16 8Z" fill="#fff" />
            </svg>
            <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Trip<span className="text-rose-500">Nest</span>
            </span>
          </span>
        </Link>
        {/* Menu center */}
        <nav className="hidden lg:flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow px-2 py-1 border border-gray-200 dark:border-gray-700 transition-colors ">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`flex items-center px-6 py-2 cursor-pointer transition-all font-semibold text-base relative
                ${
                  activeKey === item.key
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-gray-700 dark:text-gray-200"
                }
                hover:bg-gray-100 hover:rounded-full dark:hover:bg-gray-700
              `}
            >
              {item.label}
              {activeKey === item.key && (
                <span className="absolute left-4 right-4 -bottom-1 h-[4px] bg-gradient-to-r from-rose-400 to-rose-500 rounded-b- animate-fade-in" />
              )}
            </div>
          ))}
        </nav>
        {/* Actions right */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <Switch
            checked={theme === "dark"}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
            checkedChildren={<MoonFilled />}
            unCheckedChildren={<SunFilled />}
            className="bg-gray-200 dark:bg-gray-700 hover:!bg-gray-300 dark:hover:!bg-gray-600"
            title="Toggle dark mode"
          />
          {/* User/Account */}
          {displayUser ? (
            <Dropdown
              menu={{ items: userMenu }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <span className="flex items-center cursor-pointer">
                <Avatar
                  src={displayUser.avatar || undefined}
                  className="bg-rose-500"
                  size="large"
                >
                  {displayUser.name?.[0] || <UserOutlined />}
                </Avatar>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                  {displayUser.name}
                </span>
              </span>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              className="rounded-full px-4 font-semibold bg-rose-500 border-none hover:!bg-rose-600"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          )}
          <Button
            shape="circle"
            icon={<MenuOutlined />}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl border-none lg:hidden text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>
    </header>
  );
}
