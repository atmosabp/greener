import { Router } from 'express';
import { router as usersRouter } from "./users/users.routes"
// import { router as collectionsRouter } from "./collections/collections.routes";

export const router = Router();

router.use("/users", usersRouter);
// router.use("/collections", collections);

router.use((_req, res) => {
    res.status(404).json({message: "Rota inexistente"});
});