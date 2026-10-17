import { Router } from "express";
import {
  addHistoryController,
  findAllHistoryController,
  findServiceHistoryController,
} from "./collections.controller";

export const router = Router();

router.post("/add-history", addHistoryController);
router.post("/service-data", findServiceHistoryController);
router.post("/history-data", findAllHistoryController);

router.get("/teste", (_req, res) => {
  res.send("Passou aqui!");
});

/*
Teste de endpoints

Cadastro de histórico de um serviço:
curl -X POST http://localhost:3000/collections/add-history \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17", "serviceId": "billing-api", "metrics": {"cpu_percent": "86", "disk_gb": "2.3", "memory_gb": "9.2", "network_gb": "1.7"}}'

Ver histórico de um serviço em específico:
curl -X POST http://localhost:3000/collections/service-data \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17", "serviceId": "billing-api", "metrics": {"cpu_percent": "86", "disk_gb": "2.3", "memory_gb": "9.2", "network_gb": "1.7"}}'

Ver todo o histórico da data especificada:
curl -X POST http://localhost:3000/collections/history-data \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17", "serviceId": "billing-api", "metrics": {"cpu_percent": "86", "disk_gb": "2.3", "memory_gb": "9.2", "network_gb": "1.7"}}'

*/
