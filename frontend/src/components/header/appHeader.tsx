import type { HeaderLink } from "../../types/header";
import Header from "./Header";

// Navegação entre páginas
const appLinks: HeaderLink[] = [
  { to: "/home", label: "Visão Geral" },
  { to: "/ranking", label: "Ranking" },
  { to: "/comparison", label: "Comparação" },
];

export default function AppHeader() {
  return (
    <Header
      links={appLinks}
      action={<button className="btn-logout">sair</button>}
      message={<span>Olá, &lt;nome&gt;!</span>}
    />
  );
}