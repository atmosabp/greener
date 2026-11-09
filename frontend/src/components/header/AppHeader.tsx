import type { HeaderLink } from "../../types/header";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../../utils/logoff";
import Warning from "../warning/Warning";

// Navegação entre páginas
const appLinks: HeaderLink[] = [
  { to: "/home", label: "Visão Geral" },
  { to: "/ranking", label: "Ranking" },
  { to: "/comparison", label: "Comparação" },
];

export default function AppHeader() {
  const navigate = useNavigate();

  // Controla a exibição do Warning
  const [showWarning, setShowWarning] = useState(false);

  // Confirma o logout
  const handleLogout = () => {
    logout(navigate);
  };

  const [userName, _setUserName] = useState<string>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "usuário";
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.name || "usuário";
    } catch (e) {
      return "usuário";
    }
  });

  return (
    <>
      <Header
        links={appLinks}
        action={
          <button className="btn-logout" onClick={() => setShowWarning(true)}>
            Sair
          </button>
        }
        message={<span>Olá, {userName}!</span>}
      />

      {showWarning && (
        <Warning
          onConfirm={handleLogout}
          onCancel={() => setShowWarning(false)}
        />
      )}
    </>
  );
}
