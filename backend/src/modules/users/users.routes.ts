import { Router } from 'express';
import { createUserController } from './users.controller';

export const router = Router();

// POST localhost:3000/users
router.post("/", createUserController);

// GET localhost:3000/users/users
router.get("/users", (req, res) => {
    res.send("Lista de usuários")
});

// GET localhost:3000/users/1
router.get("/user/:id", (req, res) => {
    res.send("Retorna usuário específico")
});

router.get('/teste', (_req, res) => {
    res.send("Essa é a rota teste.");
});

/*Esse é o teste para cadastro de usuários:

curl -X POST http://localhost:3000/users/   -H "Content-Type: application/json"   -d '{"name": "Teste", "email": "teste@email.com", "password": "123456"}'

*/