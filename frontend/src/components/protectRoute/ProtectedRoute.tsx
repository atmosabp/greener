
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "forbidden" | "error";

export default function ProtectedRoute({
    requireAdmin = false,
}: ProtectedRouteProps) {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const location = useLocation();

    useEffect(() => {
        const controller = new AbortController();

        async function verifyAuthentication() {
            const token = sessionStorage.getItem("token");

            if (!token) {
                setStatus("unauthenticated");
                return;
            }

            try {
                const response = await fetch("http://localhost:3002/auth/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                if (response.status === 401) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    setStatus("unauthenticated");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Não foi possível validar a sessão.");
                }

                const data = await response.json();

                sessionStorage.setItem("user", JSON.stringify(data.user));

                if (requireAdmin && !data.user.isAdm) {
                    setStatus("forbidden");
                    return;
                }

                setStatus("authenticated");

            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                console.error("Erro ao verificar autenticação:", error);
                setStatus("error");
            }
        }

        verifyAuthentication();

        return () => controller.abort();
    }, [requireAdmin]);

    if (status === "loading") {
        return <p>Verificando autenticação...</p>;
    }

    if (status === "unauthenticated") {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (status === "forbidden") {
        return <Navigate to="/home" replace />;
    }

    if (status === "error") {
        return (
            <div>
                <p>Não foi possível verificar sua sessão.</p>
                <button onClick={() => window.location.reload()}>
                    Tentar novamente
                </button>
            </div>
        );
    }

    return <Outlet />;
}