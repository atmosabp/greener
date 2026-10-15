import {Router} from 'express';

const router = Router();

router.get("/services");
router.get("/service/:id");
router.get("/metrics/:service-id");

router.post('/teste', (_req, _res) => {
    console.log("Passou aqui!");
});