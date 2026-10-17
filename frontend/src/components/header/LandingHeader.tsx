import { Link } from "react-router-dom";
import Header from "./Header";
import type { HeaderLink } from "../../types/header";

// Navegação entre seções
const landingLinks: HeaderLink[] = [
  { href: "#about", label: "O que é" },
  { href: "#mission", label: "Missão" },
  { href: "#functions", label: "Funcionalidades" },
  { href: "#results", label: "Resultado" },
];

export default function LandingHeader() {
  return (
    <Header
      links={landingLinks}
      action={
        <Link to="/login" className="btn-logout">
          login 
        </Link>
      }
    />
  );
}
