import "./Footer.css";
import logo from "../../assets/logo-greener.svg";
import Trees from "../../assets/landing-footer.png";
import TreesMobile from "../../assets/tree-landing.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const footerImage = isMobile ? TreesMobile : Trees;

  return (
    <footer className="footer-landing">
      <div className="content">
        <div className="footer-logo">
          <img src={logo} alt="Logo GreenER" />
        </div>

        <div className="footer-topics">
          <nav>
            <span>Tópicos</span>
            <a href="#about">O que é</a>
            <a href="#mission">Missão</a>
            <a href="#functions">Funcionalidades</a>
            <a href="#results">Resultados</a>
          </nav>

          <nav>
            <span>Redes sociais</span>
            <a href="https://www.instagram.com/unilaunchorg/" target="_blank">
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/unilaunch/home/"
              target="_blank"
            >
              LinkedIn
            </a>
            <a href="mailto:unilaunch.org@gmail.com">E-mail</a>
          </nav>

          <nav>
            <span>Acessar serviço</span>
            <Link to="/login">Fazer login</Link>
          </nav>
        </div>
      </div>

      <div className="copyright">
        <a href="https://github.com/atmosabp/greener" target="_blank">
          Desenvolvido por <span>Atmos</span> © 2026
        </a>
      </div>

      <div className="trees trees-left" aria-hidden="true">
        <img src={footerImage} />
      </div>
      <div className="trees trees-right" aria-hidden="true">
        <img src={footerImage} />
      </div>
    </footer>
  );
}
