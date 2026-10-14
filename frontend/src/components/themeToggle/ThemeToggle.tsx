import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";
import useTheme from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { mode, palette, changeMode, changePalette } = useTheme();

  return (
    <div className="toggle-theme">
      <button
        className="btn-theme"
        onClick={() => changeMode(mode === "light" ? "dark" : "light")}
        title={`Mudar para o tema ${mode === "light" ? "escuro" : "claro"}`}
        aria-label="Alternar modo claro e escuro"
      >
        <div className={`toggle ${mode}`}>
          {mode === "light" ? <Sun size={18} /> : <Moon size={18} />}
        </div>
      </button>

      <div className="themes-wrapper">
        <div className="themes">
          <button
            className={`theme primary ${palette === "green" && "selected"}`}
            onClick={() => changePalette("green")}
          />

          <button
            className={`theme secondary ${palette === "blue" && "selected"}`}
            onClick={() => changePalette("blue")}
          />
        </div>
      </div>
    </div>
  );
}
