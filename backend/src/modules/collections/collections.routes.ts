import {Router} from 'express';
import {
    findAllHistoryController,
    findServiceHistoryController
} from "./collections.controller";

const router = Router();

router.post("/service-data", findServiceHistoryController);
router.post("/history-data", findAllHistoryController);

router.post('/teste', (_req, _res) => {
    console.log("Passou aqui!");
});