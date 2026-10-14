import "./Footer.css";
import logo from "../../assets/logo-greener.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-landing">
      <div className="content">
        <div className="footer-logo">
          <img src={logo} alt="Logo GreenER" />
        </div>
        <div className="footer-topics">
          <nav>
            <span>Tópicos</span>
            <a href="">Início</a>
            <a href="">Missão</a>
            <a href="">Funcionalidades</a>
            <a href="">Resultado</a>
          </nav>
          <nav>
            <span>Redes sociais</span>
            <a href="">
             Instagram
            </a>
            <a href=""> 
             Linkedin
            </a>
            <a href="">
             E-mail
            </a>
          </nav>
          <nav>
            <span>Acessar serviço</span>
            <Link to="/login">Fazer login</Link>
          </nav>
        </div>
      </div>
      <div className="copyright">
        <p>Desenvolvido por <span>Atmos</span> @ 2026</p>
      </div>
    </footer>
  );
}
