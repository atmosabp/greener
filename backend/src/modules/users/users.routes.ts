import { Router } from "express";
import {
  createUserController,
  deleteUserByIdController,
  editUserController,
  listUserByIdController,
  listUsersController,
} from "./users.controller";

export const router = Router();

// POST localhost:3000/users
router.post("/", createUserController);

// GET localhost:3000/users/get-users
router.get("/get-users", listUsersController);

// GET localhost:3000/users/:id
router.get("/:id", listUserByIdController);

//PATCH localhost:3000/users/:id
router.patch("/:id", editUserController);

//DELETE localhost:3000/users/:id
router.delete("/:id", deleteUserByIdController);

/*
Teste de endpoints

Cadastro de usuários:
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "email": "teste@email.com", "password": "123456", "isAdm": true}'

Editar usuário (pode ter entre um e todos os campos):
curl -X PATCH http://localhost:3000/users/9 \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste2", "email": "teste@email.com", "password": "123456", "isAdm": false}'

Deletar usuário:
curl -X DELETE http://localhost:3000/users/1

*/
