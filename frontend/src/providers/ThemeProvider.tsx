import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import type { ThemeMode, ThemeColor } from "../types/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<"light" | "dark">(
    () =>
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") ?? "light",
  );
  const [palette, setPalette] = useState(
    () => document.documentElement.getAttribute("data-palette") ?? "green",
  );

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
