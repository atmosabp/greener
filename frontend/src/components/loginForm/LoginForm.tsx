// Importações
import { Eye, EyeClosed } from "lucide-react";
import "./LoginForm.css";
import { useState } from "react";
import { type ErrorsLogin } from "../../types/login";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  // Variáveis
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorsLogin>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
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
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ErrorsLogin = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    setApiError("");

    if (newErrors.email || newErrors.password) return;

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Não foi possível realizar o login.");
        return;
      }

      // Armazena o token JWT
      sessionStorage.setItem("token", data.token);

      // Armazena os dados do usuário
      sessionStorage.setItem("user", JSON.stringify(data.user));
      
      navigate("/home");

    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setApiError("Não foi possível conectar ao servidor.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form-login" onSubmit={handleLogin}>
      <div className="form-field">
        <div className="label-row">
          <label htmlFor="email" title="Campo obrigatório">
            {errors.email ? "E-mail" : "Email*"}
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
            {errors.password ? "Senha" : "Senha*"}
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
        {apiError && (
          <p className="error-msg" role="alert">
            {apiError}
          </p>
        )}

        <button
          type="submit"
          className="btn-login"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </form>
  );
}

