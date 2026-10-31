import { Link } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import "./Login.css";
import logo from "../../assets/logo-greener-n-text.svg";
import logoFull from "../../assets/logo-greener.svg";
import logoText from "../../assets/greener-text.svg";
import trees from "../../assets/footer.png";
import treesMobile from "../../assets/footer-mobile.png";
import LoginForm from "../../components/loginForm/LoginForm";
import { useEffect, useState } from "react";
import ThemeToggle from "../../components/themeToggle/ThemeToggle";
import Loading from "../../components/loading/Loading";
import Toast from "../../components/toast/Toast";
import Warning from "../../components/warning/Warning";

export default function Login() {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const footerImage = isMobile ? treesMobile : trees;

  return (
    <>
      {/*Lógica de isLoading aqui  */}
      {/* <Loading /> */}
      {/* Lógica de success ou error  */}
      <Toast icon="success" title="oi" message="teste teste"/>
      {/* Lógica para modal de tem certeza? */}
     {/* <Warning variant="logout" /> */}
      <header>
        <div className="header-btns">
          <Link to="/" className="btn-back">
            <ChevronLeft />
            <span>Voltar ao início</span>
          </Link>
          <ThemeToggle />
        </div>
        <a href="/" className="brand" aria-label="Greener">
          <img className="brand-logo" src={logo} alt="" />
          <span className="brand-text-wrap">
            <img className="brand-text" src={logoText} alt="Greener" />
          </span>
        </a>
      </header>
      <main className="login">
        <img src={logoFull} alt="Logo Greener" className="logo" />
        <span>Faça login com seu e-mail corporativo.</span>
        <LoginForm />
        <div className="info-txt">
          <div className="safe-warning">
            <ShieldCheck fill="var(--primary-dark)" />
            <p>
              Seus dados são processados de acordo com a LGPD,{" "}
              <br className="desktop-break" />
              estão seguros conosco.
            </p>
          </div>
          <p>
            Ainda não possui conta? <br />
            Peça a um funcionário com acesso administrativo <br />
            da sua empresa para te adicionar!
          </p>
        </div>
      </main>
      <footer className="login-footer">
        <img
          src={footerImage}
          alt={isMobile ? "Árvores em versão mobile" : "Árvores"}
        />
        <p className="copyright">Desenvolvido por Atmos &copy; 2026</p>
      </footer>
    </>
  );
}
