import { Router } from "express";
import {
  addHistoryController,
  findAllHistoryController,
  findServiceHistoryController,
  getHistoryController,
} from "./collections.controller";

export const router = Router();

// Rota de teste para retornar todo o histórico
// GET localhost:3000/collections/get-history
router.get("/get-history", getHistoryController);

// Rota para adicionar histórico no banco de dados
// POST localhost:3000/collections/add-history
router.post("/add-history", addHistoryController);

//rota para listar apenas os serviços e sua disponibilidade (ativo, inativo ou imcompleto)
// POST localhost:3000/collections/service-data
router.post("/service-data", findServiceHistoryController);

//rota para retornar todos os serviços e todas as métricas
// POST localhost:3000/collections/history-data
router.post("/history-data", findAllHistoryController);

router.get("/teste", (_req, res) => {
  res.send("Passou aqui!");
});

/*
Teste de endpoints

Cadastro de histórico de um serviço:
curl -X POST http://localhost:3000/collections/add-history \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17", "serviceId": "inventory-sync"}'

Ver histórico de um serviço em específico:
curl -X POST http://localhost:3000/collections/service-data \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17", "serviceId": "billing-api"}'

Ver todo o histórico da data especificada:
curl -X POST http://localhost:3000/collections/history-data \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17"}'

*/
