import { Router } from 'express';
import { createUserController, editUserController, listUserByIdController, listUsersController } from './users.controller';

export const router = Router();

// POST localhost:3000/users
router.post("/", createUserController);

// GET localhost:3000/users/get-users
router.get("/get-users", listUsersController);

// GET localhost:3000/users/:id
router.get("/:id", listUserByIdController);

//TODO: rota para editar usuário
router.patch("/:id", editUserController);
//TODO: rota para deletar usuário com base na seleção feita pelo admin no front

router.get('/teste', (_req, res) => {
    res.send("Essa é a rota teste.");
});

// GET localhost:3000/users/1

/*
Teste de endpoints

Cadastro de usuários:
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "email": "teste@email.com", "password": "123456", "isAdm": true}'

*/