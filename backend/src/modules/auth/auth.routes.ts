import { Router } from "express";
import { loginController } from "./auth.controller";

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

export const router = Router();

router.post("/login", loginController);