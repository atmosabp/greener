import { EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";
import "./loginForm.css";

function LoginForm() {
  return (
    <div className="form-login">
      <div className="form-field">
        <label htmlFor="email" title="Campo obrigatório.">
          E-mail*
        </label>
        <input type="email" placeholder="Digite seu e-mail..." id="email" />
      </div>
      <div className="form-field">
        <label htmlFor="password" title="Campo obrigatório.">
          Senha*
        </label>
        <div className="password-input">
          <input
            type="password"
            placeholder="Digite sua senha..."
            id="password"
          />
          <EyeClosed />
        </div>
      </div>
      <a href="#" className="forgotten-password">Esqueci minha senha</a> {/* Vamos desenvolver isso? */}
      <Link to="/">Entrar</Link>
    </div>
  );
}

export default LoginForm;
