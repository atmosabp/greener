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

router.use(authenticateToken, requireAdmin);

// POST localhost:PORT/users
router.post("/", createUserController);

// GET localhost:PORT/users/get-users
router.get("/get-users", listUsersController);

// GET localhost:PORT/users/:id
router.get("/:id", listUserByIdController);

// PATCH localhost:PORT/users/:id
router.patch("/:id", editUserController);

// DELETE localhost:PORT/users/:id
router.delete("/:id", deleteUserByIdController);
