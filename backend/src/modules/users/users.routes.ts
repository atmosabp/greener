import { Router } from "express";

import {
    createUserController,
    deleteUserByIdController,
    editUserController,
    listUserByIdController,
    listUsersController,
} from "./users.controller";

import {
    authenticateToken,
    requireAdmin
} from "../../middlewares/middleware";

export const router = Router();

// POST localhost:3000/users

router.use(authenticateToken, requireAdmin);

// POST - Criar usuário
router.post("/", createUserController);

// GET localhost:3000/users/get-users
router.get("/get-users", listUsersController);

// GET localhost:3000/users/:id
router.get("/:id", listUserByIdController);

//PATCH localhost:3000/users/:id
router.patch("/:id", editUserController);

//DELETE localhost:3000/users/:id
router.delete("/:id", deleteUserByIdController);
