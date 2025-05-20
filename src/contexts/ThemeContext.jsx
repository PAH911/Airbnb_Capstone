import React, { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Đảm bảo Tailwind dark mode hoạt động song song
    document.documentElement.classList.remove("dark");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
    // Đảm bảo SCSS theme hoạt động
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
