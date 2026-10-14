import { ThemeContext } from "../contexts/ThemeContext";
import { useContext } from "react";

export default function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme deve ser utilizado dentro do ThemeProvider.");
    }
    return context;

}