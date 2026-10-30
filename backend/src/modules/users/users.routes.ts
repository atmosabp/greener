import { Router } from "express";

import {
    createUserController,
    deleteUserByIdController,
    editUserController,
    listUserByIdController,
    listUsersController,
} from "./users.controller";

export const router = Router();

// POST - Criar usuário
router.post("/", createUserController);

// GET - Listar todos os usuários
router.get("/get-users", listUsersController);

// GET - Consultar usuário por ID
router.get("/:id", listUserByIdController);

// PATCH - Atualizar usuário
router.patch("/:id", editUserController);

// DELETE - Excluir usuário
router.delete("/:id", deleteUserByIdController);

/*
========================================
TESTES DE ENDPOINTS - USUÁRIOS
========================================

IMPORTANTE:
Antes de testar, inicie o backend:

npm run dev

Os comandos abaixo devem ser executados em outro terminal CMD.

----------------------------------------
1. CADASTRAR USUÁRIO - POST
----------------------------------------

POST http://localhost:3002/users/

curl -X POST http://localhost:3002/users/ -H "Content-Type: application/json" -d "{\"name\":\"Usuário Teste\",\"email\":\"teste@greener.com\",\"password\":\"123456\",\"isAdm\":false}"

----------------------------------------
2. LISTAR TODOS OS USUÁRIOS - GET
----------------------------------------

GET http://localhost:3002/users/get-users

curl -X GET http://localhost:3002/users/get-users

----------------------------------------
3. BUSCAR USUÁRIO POR ID - GET
----------------------------------------

GET http://localhost:3002/users/:id

Exemplo com ID 2:

curl -X GET http://localhost:3002/users/2

----------------------------------------
4. EDITAR USUÁRIO - PATCH
----------------------------------------

PATCH http://localhost:3002/users/:id

É possível enviar apenas os campos que deseja alterar.

Exemplo:

curl -X PATCH http://localhost:3002/users/2 -H "Content-Type: application/json" -d "{\"name\":\"Usuário Atualizado\"}"

Exemplo alterando vários campos:

curl -X PATCH http://localhost:3002/users/2 -H "Content-Type: application/json" -d "{\"name\":\"Novo Nome\",\"email\":\"novo@greener.com\",\"password\":\"novaSenha123\",\"isAdm\":false}"

----------------------------------------
5. EXCLUIR USUÁRIO - DELETE
----------------------------------------

DELETE http://localhost:3002/users/:id

Exemplo com ID 2:

curl -X DELETE http://localhost:3002/users/2

========================================
*/