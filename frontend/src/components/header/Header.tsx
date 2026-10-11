import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo-greener-n-text.svg";
import logoText from "../../assets/logo-greener.svg";
import { useEffect, useState } from "react";
import ThemeToggle from "../themeToggle/ThemeToggle";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  // Função para pegar tamanho da tela (se é mobile ou não) e mudar a imagem do header.
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerImage = isMobile ? logoText : logo;

  return (
    <>
      <button
        onClick={() => setOpenMenu((prev) => !prev)}
        className="menu-trigger"
      >
        <span />
        <span />
        <span />
      </button>
      <header className={`menu ${openMenu && "active"}`}>
        <img src={headerImage} alt="Logo Greener" className="logo" />
        <div className="menu-links">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Visão Geral
          </NavLink>
          <NavLink
            to="/ranking"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Ranking
          </NavLink>
          <NavLink
            to="/comparison"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Comparação
          </NavLink>
        </div>
        <div className="menu-btns">
          <span>Olá, &lt;nome&gt;!</span>
          <ThemeToggle />
          <button className="btn-logout">sair</button>
        </div>
      </header>
    </>
  );
}
