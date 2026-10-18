import { Router } from 'express';
import { createUserController, listUsersController } from './users.controller';

export const router = Router();

// POST localhost:3000/users
router.post("/", createUserController);

// GET localhost:3000/users/get-users
router.get("/get-users", listUsersController);

router.get('/teste', (_req, res) => {
    res.send("Essa é a rota teste.");
});

// GET localhost:3000/users/1
router.get("/user/:id", (req, res) => {
    res.send("Retorna usuário específico")
});

/*
Teste de endpoints

Cadastro de usuários:
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "email": "teste@email.com", "password": "123456", "isAdm": true}'

*/