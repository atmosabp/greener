import { Eye, EyeClosed } from "lucide-react";
import "./LoginForm.css";
import { useState } from "react";
import { type ErrorsLogin } from "../../types/login";
import { useNavigate } from "react-router-dom";
import Toast from "../toast/Toast";

import "./LoginForm.css";

const port = import.meta.env.VITE_PORT;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorsLogin>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Validação do e-mail
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Este campo é obrigatório*";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Digite um e-mail válido*";
    }

    return undefined;
  };

  // Validação da senha
  const validatePassword = (value: string) => {
    if (!value) return "Este campo é obrigatório*";

    return undefined;
  };

  // Função de login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    // Validação dos campos
    const newErrors: ErrorsLogin = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    setApiError("");

    if (newErrors.email || newErrors.password) {
      return <Toast icon="error" title="Dados obrigatórios" message="Preencha corretamente todos os campos para continuar." />;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:${port}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      // Verifica se a resposta é um JSON válido
      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("INVALID_RESPONSE");
      }

      // Tratamento dos erros HTTP
      if (!response.ok) {
        setApiError(data.message || "Não foi possível realizar o login.");
        return;
      }

      // Verifica os dados recebidos
      if (!data?.token || !data?.user) {
        throw new Error("INVALID_RESPONSE");
      }

      sessionStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/home");

      navigate("/home");
    } catch (error: any) {
      console.error("Erro ao realizar login:", error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form-login" onSubmit={handleLogin} noValidate>

      {/* Campo de e-mail */}
      <div className="form-field">
        <div className="label-row">
          <label htmlFor="email" title="Campo obrigatório">
            E-mail*
          </label>
          {errors.email && (
              <span id="email-error" className="error-msg">
                {errors.email}
              </span>
            ) && (
              <Toast
                icon="error"
                title="Informações incorretas"
                message={errors.email}
              />
            )}
        </div>

        <input
          type="email"
          id="email"
          placeholder="Digite seu e-mail..."
          value={email}
          autoComplete="email"
          aria-invalid={!!errors.email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email) {
              setErrors((p) => ({ ...p, email: undefined }));
            }
          }}
          onBlur={() =>
            setErrors((p) => ({
              ...p,
              email: validateEmail(email),
            }))
          }
          className={errors.email ? "input-error" : ""}
        />
      </div>

      {/* Campo de senha */}
      <div className="form-field">
        <div className="label-row">
          <label htmlFor="password" title="Campo obrigatório">
            Senha*
          </label>
          {errors.password && (
              <span id="password-error" className="error-msg">
                {errors.password}
              </span>
            ) && (
              <Toast
                icon="error"
                title="Informações incorretas"
                message={errors.password}
              />
            )}
        </div>

        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Digite sua senha..."
            value={password}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password) {
                setErrors((p) => ({ ...p, password: undefined }));
              }
            }}
            onBlur={() =>
              setErrors((p) => ({
                ...p,
                password: validatePassword(password),
              }))
            }
            className={errors.password ? "input-error" : ""}
          />

          <button
            type="button"
            className="btn-eye"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
            onBlur={() => setShowPassword(false)}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
      </div>

      {/* Recuperação de senha */}
      <div className="form-link password">
        <a href="#" className="forgotten-password">
          Esqueci minha senha
        </a>
      </div>

      {/* Botão de login */}
      <div className="form-link">
        {apiError && (
            <p className="error-msg" role="alert">
              {apiError}
            </p>
          ) && (
            <Toast
              icon="error"
              title="Erro"
              message={apiError}
            />
          )}

        <button type="submit" className="btn-login" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>

    </form>
  );
}
