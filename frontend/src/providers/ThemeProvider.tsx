import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import type { ThemeMode, ThemeColor } from "../types/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved === "dark" ? "dark" : "light";
  });

  const [palette, setPalette] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem("theme-palette");
    return saved === "blue" ? "blue" : "green";
  });

  function changeMode(mode: ThemeMode) {
    setMode(mode);
    localStorage.setItem("theme-mode", mode);
  }

  function changePalette(palette: ThemeColor) {
    setPalette(palette);
    localStorage.setItem("theme-palette", palette);
  }

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", mode);
    root.setAttribute("data-palette", palette);
  }, [mode, palette]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        palette,
        changeMode,
        changePalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
