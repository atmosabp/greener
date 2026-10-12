import { Link } from "react-router-dom";
import Header from "./Header";
import type { HeaderLink } from "../../types/header";

// Navegação entre seções
const landingLinks: HeaderLink[] = [
  { href: "#general", label: "Visão Geral" },
  { href: "#about", label: "Sobre" },
  { href: "#functions", label: "Funcionalidades" },
];

export default function LandingHeader() {
  return (
    <Header
      links={landingLinks}
      action={
        <Link to="/login" className="btn-logout">
          entrar
        </Link>
      }
    />
  );
}
