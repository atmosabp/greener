import type { NavigateFunction } from "react-router-dom";

export function logout(navigate: NavigateFunction) {
    // Remove o token JWT da sessão
    sessionStorage.removeItem("token");

    // Remove os dados do usuário
    localStorage.removeItem("user");

    // Redireciona para o login, substituindo a página atual no histórico
    navigate("/", { replace: true });
}
