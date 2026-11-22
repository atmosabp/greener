import { Router } from "express";

import type { IUsersController } from "./users.controller";

import {
    authenticateToken,
    requireAdmin
} from "../../middlewares/middleware";

export function usersRoutes(controller: IUsersController) {
    const router = Router();

    router.use(authenticateToken, requireAdmin);

    // POST localhost:PORT/users
    router.post("/", (req, res) => controller.createUser(req, res));

    // GET localhost:PORT/users/get-users
    router.get("/get-users", (req, res) => controller.listUsers(req, res));

    // GET localhost:PORT/users/:id
    router.get("/:id", (req, res) => controller.listUserById(req, res));

    // PATCH localhost:PORT/users/:id
    router.patch("/:id", (req, res) => controller.editUser(req, res));

    // DELETE localhost:PORT/users/:id
    router.delete("/:id", (req, res) => controller.deleteUserById(req, res));

    return router;
}