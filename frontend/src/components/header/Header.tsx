import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo-greener-n-text.svg";
import logoText from "../../assets/logo-greener.svg";
import { useEffect, useState } from "react";
import ThemeToggle from "../themeToggle/ThemeToggle";
import type { HeaderProps } from "../../types/header";

export default function Header({ links, action, activeHref }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 481,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 481);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerImage = isMobile ? logoText : logo;
  const closeMenu = () => setOpenMenu(false);

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
          <span>Olá, &lt;nome&gt;!</span>
          <ThemeToggle />
          {action}
        </div>
      </header>
    </>
  );
}
