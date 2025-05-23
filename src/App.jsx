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
  const { theme: currentTheme } = useContext(ThemeContext);
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token:
            currentTheme === "dark"
              ? {
                  colorPrimary: "#ffb92c",
                  colorTextBase: "#fff",
                  colorBgBase: "#18181c",
                  colorTextLightSolid: "#fff",
                  colorBgContainer: "#23232b",
                  colorBorder: "#31394e",
                }
              : {
                  colorPrimary: "#f43f5e",
                  colorTextBase: "#222",
                  colorBgBase: "#fff",
                  colorTextLightSolid: "#fff",
                  colorBgContainer: "#fff",
                  colorBorder: "#f0f0f0",
                },
          algorithm:
            currentTheme === "dark"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <AppContent />
      </ConfigProvider>
    </ThemeProvider>
  );
}
