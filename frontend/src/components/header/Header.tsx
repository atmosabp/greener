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

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = Math.max(window.scrollY, 0); // iOS tem "bounce" com valor negativo

      // histerese: liga em 80, desliga em 20.
      // Com um limite só, o header encolhe, a altura muda, o scroll se
      // ajusta e ele fica piscando entre os dois estados.
      setScrolled((prev) => (y > 80 ? true : y < 20 ? false : prev));

      // direção: ignora movimentos pequenos para não tremer
      const delta = y - lastY;
      if (Math.abs(delta) > 8) {
        setHidden(delta > 0 && y > 120); // desceu e já passou do topo
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update); // no máximo 1 cálculo por frame
    };

    update(); // estado correto se a página carregar já rolada
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const floatClasses = `${scrolled ? "is-scrolled" : ""} ${
    hidden && !openMenu ? "is-hidden" : ""
  }`;

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

      <header
        id="main-menu"
        className={`menu ${openMenu ? "active" : ""} ${floatClasses}`}
      >
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
