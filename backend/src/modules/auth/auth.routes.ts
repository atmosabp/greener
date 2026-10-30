import { Router } from "express";
import {
    loginController,
    currentUserController
} from "./auth.controller";

import { authenticateToken } from "../../middlewares/middleware";

export const router = Router();

// Login
router.post("/login", loginController);

// Verificar sessão
router.get("/me", authenticateToken, currentUserController);

/*
========================================
TESTES DE ENDPOINTS - AUTENTICAÇÃO
========================================

LOGIN:
POST http://localhost:3002/auth/login

CMD:
curl -X POST http://localhost:3002/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@gmail.com\",\"password\":\"admin123\"}"

Resposta esperada:
- Status 200: login realizado.
- Retorna o token JWT e os dados do usuário.
- Status 401: email ou senha incorretos.
*/