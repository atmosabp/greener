import { Router } from "express";
import type { IAuthController } from "./auth.controller";

import { authenticateToken } from "../../middlewares/middleware";

export function authRoutes(controller: IAuthController) {
    const router = Router();

    // Login - http://localhost:PORT/auth/login
    router.post("/login", (req, res) => controller.login(req, res));

    // Verificar sessão - http://localhost:PORT/auth/me
    router.get("/me", authenticateToken, (req, res) => controller.currentUser(req, res));

    return router;
}

/*
LOGIN:
POST http://localhost:3002/auth/login

CMD:
curl -X POST http://localhost:3002/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@email.com\",\"password\":\"123456\"}"

Resposta esperada:
- Status 200: login realizado.
- Retorna o token JWT e os dados do usuário.
- Status 401: email ou senha incorretos.
*/