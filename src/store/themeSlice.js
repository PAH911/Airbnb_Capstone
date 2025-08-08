import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);

      // Update document classes for dark mode
      document.documentElement.classList.remove("dark");
      if (action.payload === "dark") {
        document.documentElement.classList.add("dark");
      }

      // Update SCSS theme classes
      document.documentElement.classList.remove("theme-light", "theme-dark");
      document.documentElement.classList.add(`theme-${action.payload}`);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);

      // Update document classes for dark mode
      document.documentElement.classList.remove("dark");
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      }

      // Update SCSS theme classes
      document.documentElement.classList.remove("theme-light", "theme-dark");
      document.documentElement.classList.add(`theme-${newTheme}`);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
