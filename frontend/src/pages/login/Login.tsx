import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import "./login.css"

function Login() {
  return (
    <>
      <header>
        <Link to="/">
          <ChevronLeft />
          Voltar
        </Link>
      </header>
      <main>
        <p>Faça login com seu e-mail coorporativo.</p>

        <ShieldCheck/>
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
