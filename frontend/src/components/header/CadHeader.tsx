import { useEffect, useState } from "react";
import type { HeaderLink } from "../../types/header";
import Header from "./Header";
import Warning from "../warning/Warning";
import { logout } from "../../utils/logoff";
import { useNavigate } from "react-router-dom";

// Navegação entre páginas
const appLinks: HeaderLink[] = [];

export default function CadHeader() {
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);

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
