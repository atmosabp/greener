import { createContext } from "react";
import type { ThemeMode, ThemeColor } from "../types/theme";

export interface ThemeContextValue {
  mode: ThemeMode;
  palette: ThemeColor;
  changeMode: (mode: ThemeMode) => void;
  changePalette: (palette: ThemeColor) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
