import React, { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider, theme } from "antd";
import { setUser } from "@/pages/client-customer/ProfilePage/userSlice";

function AppContent() {
  const { theme: currentTheme } = useContext(ThemeContext); // Đổi tên tránh trùng theme
  const dispatch = useDispatch();

  // Hydrate user Redux từ localStorage khi app vừa load
  useEffect(() => {
    const userStr = localStorage.getItem("userInfo");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.id) {
          dispatch(setUser(userObj));
        }
      } catch {
        localStorage.removeItem("userInfo");
      }
    }
  }, [dispatch]);

  return (
    <div className={`theme-${currentTheme}`}>
      <Routes />
      {/* ToastContainer ở cuối AppContent là tối ưu */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      {/* Nếu muốn dùng dark theme cho AntD, bọc ConfigProvider ở đây luôn */}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#ffb92c",
            colorBgContainer: "#212836",
            colorText: "#F4F6F8",
          },
        }}
      >
        <AppContent />
      </ConfigProvider>
    </ThemeProvider>
  );
}
