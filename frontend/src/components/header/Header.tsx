import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo-greener-n-text.svg";
import logoText from "../../assets/logo-greener.svg";
import { useEffect, useState } from "react";
import ThemeToggle from "../themeToggle/ThemeToggle";
import type { HeaderProps } from "../../types/header";

export default function Header({
  links,
  action,
  message,
  activeHref,
}: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 1024,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);

      if (window.innerWidth > 1024) setOpenMenu(false); // Para evitar bug de travar
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerImage = isMobile ? logoText : logo;
  const closeMenu = () => setOpenMenu(false);

  return (
    <>
      {/* Tablet: barra fixa sempre visível - Celular: só o botão (fixo no canto) */}
      <div className="tablet-bar">
        <img src={logo} alt="Logo Greener" className="trigger-logo" />
        <div className="trigger-btns">
          {message}
          <ThemeToggle />
          {action}
        </div>
        <button
          type="button"
          className="menu-trigger"
          aria-label={openMenu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={openMenu}
          aria-controls="main-menu"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    {/* Para ficar escuro */}
      <div
        className={`scrim ${openMenu ? "show" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className={`menu ${openMenu ? "active" : ""}`}>
        <img src={headerImage} alt="Logo Greener" className="logo" />
        <nav className="menu-links">
          {links.map((link) =>
            "to" in link ? (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={activeHref === link.href ? "active" : ""}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="menu-btns">
          {message}
          <ThemeToggle />
          {action}
        </div>
      </header>
    </>
  );
}
