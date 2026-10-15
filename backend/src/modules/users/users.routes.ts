import {Router} from 'express';

const router = Router();

router.post("/");
router.get("/users");
router.get("/user/:id");


router.post('/teste', (_req, _res) => {
    console.log("Passou aqui!");
});