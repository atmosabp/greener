import type { HeaderLink } from "../../types/header";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/logoff";

// Navegação entre páginas
const appLinks: HeaderLink[] = [
  { to: "/home", label: "Visão Geral" },
  { to: "/ranking", label: "Ranking" },
  { to: "/comparison", label: "Comparação" },
];

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <Header
      links={appLinks}
      action={<button className="btn-logout" onClick={() => logout(navigate)}>sair</button>}
      message={<span>Olá, &lt;nome&gt;!</span>}
    />
  );
}