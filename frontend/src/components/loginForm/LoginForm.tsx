// Importações
import { Eye, EyeClosed } from "lucide-react";
import "./loginForm.css";
import { useState } from "react";
import { type ErrorsLogin } from "../../types/login";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  // Variáveis
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorsLogin>({});
  const navigate = useNavigate();

  // Função de validação de email (tratamento do campo)
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Este campo é obrigatório*";

    // regex para verificar se é de fato um email. Exemplo: @tanana.com
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Digite um e-mail válido*";
    return undefined;
  };

  // Função de validação de senha (tratamento do campo)
  const validatePassword = (value: string) => {
    // depois de criptografar, ainda vai ser string?
    if (!value) return "Este campo é obrigatório*";
    if (value.length < 6) return "Mínimo de 6 caracteres*";
    return undefined;
  };

  // Função do login
  // React.FormEvent<HYMLFormElement> -> isso aqui foi pq o typescript pediu
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); // Evita que o browser recarregue a página após submissão..

    const newErrors: ErrorsLogin = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    // se algum erro existir, retorna aqui
    if (newErrors.email || newErrors.password) return;

    // Depois adicionar aqui o login e etc
    navigate("/teste");
  };

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <div className="form-field">
        <div className="label-row">
          <label htmlFor="email" title="Campo obrigatório">
            E-mail*
          </label>
          {errors.email && (
            <span id="email-error" className="error-msg">
              {errors.email}
            </span>
          )}
        </div>
        <input
          type="email"
          id="email"
          placeholder="Digite seu e-mail..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          onBlur={() =>
            setErrors((p) => ({ ...p, email: validateEmail(email) }))
          }
          className={errors.email ? "input-error" : ""}
        />
      </div>

      <div className="form-field">
        <div className="label-row">
          <label htmlFor="password" title="campo obrigatório.">
            Senha*
          </label>
          {errors.password && (
            <span id="password-error" className="error-msg">
              {errors.password}
            </span>
          )}
        </div>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Digite sua senha..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
            onBlur={() =>
              setErrors((p) => ({ ...p, password: validatePassword(password) }))
            }
            className={errors.password ? "input-error" : ""}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            className="btn-eye"
            aria-label="Segure para mostrar a senha"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
      </div>

      <div className="form-link password">
        <a href="#" className="forgotten-password">
          Esqueci minha senha
        </a>
      </div>

      <div className="form-link">
        <button type="submit" className="btn-login">
          Entrar
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
