import type { HeaderLink } from "../../types/header";
import Header from "./Header";

// Navegação entre páginas
const appLinks: HeaderLink[] = [];

export default function CadHeader() {
  return (
    <Header
      links={appLinks}
      action={<button className="btn-logout">sair</button>}
      message={<span>Olá, &lt;nome&gt;!</span>}
    />
  );
}
