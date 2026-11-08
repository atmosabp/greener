import { useState } from "react";
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

  return (
    <>
      <Header
        links={appLinks}
        action={
          <button className="btn-logout" onClick={() => setShowWarning(true)}>
            Sair
          </button>
        }
        message={<span>Olá, &lt;nome&gt;!</span>}
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
