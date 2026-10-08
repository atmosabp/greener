import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import "./login.css";
import logo from "../../assets/logo-greener-n-text.svg";
import logoText from "../../assets/greener-text.svg";
import LoginForm from "../../components/loginForm/LoginForm";

function Login() {
  return (
    <>
      <header>
        <Link to="/" className="btn-back">
          <ChevronLeft />
          <span>Voltar ao início</span>
        </Link>
        <a href="/" className="brand" aria-label="Greener">
          <img className="brand-logo" src={logo} alt="" />
          <span className="brand-text-wrap">
            <img className="brand-text" src={logoText} alt="Greener" />
          </span>
        </a>
      </header>
      <main>
        <p>Faça login com seu e-mail coorporativo.</p>
        <LoginForm />
        <ShieldCheck />
        <p>
          Seus dados são processados de acordo com a LGPD, estão seguros
          conosco.
        </p>
        <p>
          Ainda não possui conta? Peça a um funcionário com acesso
          administrativo da sua empresa para te adicionar!
        </p>
        <p className="copyright">Desenvolvido por Atmos &copy; 2026</p>
      </main>
    </>
  );
}

export default Login;
