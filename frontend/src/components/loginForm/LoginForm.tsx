
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

  // Validação do e-mail
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Este campo é obrigatório*";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Digite um e-mail válido*";

    return undefined;
  };

  // Validação da senha
  const validatePassword = (value: string) => {
    if (!value) return "Este campo é obrigatório*";

    return undefined;
  };

  // Função do login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Evita múltiplas requisições simultâneas
    if (isLoading) return;

    // Validação dos campos
    const newErrors: ErrorsLogin = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    setApiError("");

    // Impede o envio se houver erros
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

      // Verifica se a resposta da API é um JSON válido
      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("INVALID_RESPONSE");
      }

      // Tratamento dos erros retornados pelo servidor
      if (!response.ok) {
        switch (response.status) {
          case 400:
            setApiError("Verifique os dados informados.");
            break;

          case 401:
            setApiError("E-mail ou senha incorretos.");
            break;

          case 403:
            setApiError(
              "Você não tem permissão para acessar esta plataforma."
            );
            break;

          case 429:
            setApiError(
              "Muitas tentativas de login. Aguarde alguns minutos."
            );
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            setApiError(
              "O servidor está indisponível. Tente novamente mais tarde."
            );
            break;

          default:
            setApiError(
              data?.message || "Não foi possível realizar o login."
            );
        }

        return;
      }

      // Verifica se o servidor retornou os dados necessários
      if (!data?.token || !data?.user) {
        throw new Error("INVALID_RESPONSE");
      }

      // Armazena o token JWT
      sessionStorage.setItem("token", data.token);

      // Armazena os dados do usuário
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Redireciona para a página inicial
      navigate("/home");

    } catch (error) {
      console.error("Erro ao realizar login:", error);

      if (
        error instanceof Error &&
        error.message === "INVALID_RESPONSE"
      ) {
        setApiError(
          "O servidor retornou uma resposta inválida. Tente novamente."
        );
      } else {
        setApiError(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
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
            {errors.email ? "E-mail" : "E-mail*"}
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
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email) {
              setErrors((p) => ({ ...p, email: undefined }));
            }

            if (apiError) setApiError("");
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
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "password-error" : undefined
            }
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password) {
                setErrors((p) => ({ ...p, password: undefined }));
              }

              if (apiError) setApiError("");
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
            aria-label={
              showPassword ? "Ocultar senha" : "Mostrar senha"
            }
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

      {/* Link para recuperação de senha */}
      <div className="form-link password">
        <a href="#" className="forgotten-password">
          Esqueci minha senha
        </a>
      </div>

      {/* Mensagem de erro da API */}
      <div className="form-link">
        {apiError && (
          <p className="error-msg" role="alert">
            {apiError}
          </p>
        )}

        {/* Botão de login */}
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
