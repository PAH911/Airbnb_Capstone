import React from "react";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";
import { useContext } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider, theme } from "antd";

function AppContent() {
  const { theme: currentTheme } = useContext(ThemeContext); // Đổi tên tránh trùng theme
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
