
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

import type { ErrorsLogin } from "../../types/login";
import type { ToastProps } from "../../types/toast";

const API_URL = import.meta.env.VITE_PORT;

interface LoginFormProps {
  onShowToast: (toast: ToastProps) => void;
}

export default function LoginForm({ onShowToast }: LoginFormProps) {
  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorsLogin>({});
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

    if (newErrors.email || newErrors.password) {
      onShowToast({
        icon: "error",
        title: "Dados obrigatórios",
        message: "Preencha corretamente todos os campos para continuar.",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      // Verifica se a resposta é um JSON válido
      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("INVALID_RESPONSE");
      }

      // Tratamento dos erros HTTP
      if (!response.ok) {
        switch (response.status) {
          case 400:
            onShowToast({
              icon: "error",
              title: "Dados incorretos",
              message: "Verifique os dados informados.",
            });
            break;

          case 401:
            onShowToast({
              icon: "error",
              title: "Dados incorretos",
              message: "E-mail ou senha incorretos.",
            });
            break;

          case 403:
            onShowToast({
              icon: "error",
              title: "Acesso negado",
              message: "Você não tem permissão para acessar esta plataforma.",
            });
            break;

          case 429:
            onShowToast({
              icon: "error",
              title: "Muitas tentativas",
              message: "Aguarde alguns minutos antes de tentar novamente.",
            });
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            onShowToast({
              icon: "error",
              title: "Servidor indisponível",
              message: "Tente novamente mais tarde.",
            });
            break;

          default:
            onShowToast({
              icon: "error",
              title: "Erro ao realizar login",
              message: data?.message || "Não foi possível realizar o login.",
            });
        }

        return;
      }

      // Verifica os dados recebidos
      if (!data?.token || !data?.user) {
        throw new Error("INVALID_RESPONSE");
      }

      // Armazena os dados da sessão
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Redireciona para a página inicial
      navigate("/home");

    } catch (error) {
      console.error("Erro ao realizar login:", error);

      if (
        error instanceof Error &&
        error.message === "INVALID_RESPONSE"
      ) {
        onShowToast({
          icon: "error",
          title: "Resposta inválida",
          message: "O servidor retornou uma resposta inválida. Tente novamente.",
        });
      } else {
        onShowToast({
          icon: "error",
          title: "Falha na conexão",
          message: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        });
      }

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
