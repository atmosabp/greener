import { Router } from "express";

import { router as authRouter } from "./auth/auth.routes";
import { router as usersRouter } from "./users/users.routes";
import { router as collectionsRouter } from "./collections/collections.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/collections", collectionsRouter);

router.use((_req, res) => {
    res.status(404).json({
        message: "Rota inexistente!"
    });
});