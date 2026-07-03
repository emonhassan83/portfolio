"use client";

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: "light",
    colors: {
        white: "#ffffff",
        grayishWhite: "#ebebeb",
        lightGrey: "#959eac",
        mediumGrey: "#7c8798",
        mediumBlue: "#2f3841",
        darkBlue: "#252d37",
        veryDarkBlue: '#121417',
      },
  });

  const themeSwitchHandler = () => {
    setTheme((theme) => ({
        ...theme,
        mode: theme.mode === "dark" ? "light" : "dark",
      }));
    document.querySelector("html").setAttribute("data-theme", theme.mode);
  };

  const changesThemeBgColor = () => {
    return theme.mode === "dark" ? "bg-gray-800" : "bg-gray-100"
  }

  const changesThemeTextColor = () => {
    return theme.mode === "dark" ? "text-gray-100" : "text-gray-600"
  }

  return (
    <ThemeContext.Provider value={{ theme, themeSwitchHandler, setTheme, changesThemeBgColor, changesThemeTextColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
