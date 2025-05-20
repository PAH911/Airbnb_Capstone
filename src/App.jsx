import React from "react";
import { ThemeProvider, ThemeContext } from "./contexts/ThemeContext";
import { useContext } from "react";
import Routes from "./routes";

function AppContent() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`theme-${theme}`}>
      <Routes />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
