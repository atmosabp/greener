import { Router } from "express";
import {
  addHistoryController,
  findAllHistoryController,
  findServiceHistoryController,
  getAllServicesDataController,
  getHistoryController,
  getServiceMetricsController,
} from "./collections.controller";

export const router = Router();

// Rota de teste para retornar todo o histórico
// GET localhost:3000/collections/get-history
router.get("/get-history", getHistoryController);

// REFACTOR: Rota para adicionar histórico no banco de dados
// POST localhost:3000/collections/add-history
router.post("/add-history", addHistoryController);

// TODO: apenas pega o dado mais recente da api auxiliar e retorna pro frontend (dashboard), sem guardar nada no banco de dados
// POST localhost:3000/collections/service-metrics
router.post("/service-metrics", getServiceMetricsController);

// TODO: rota para retornar todos os serviços e todas as métricas
// POST localhost:3000/collections/all-service-data
router.post("/all-service-data", getAllServicesDataController);

// TODO: rota para retornar histórico de um serviço
// POST localhost:3000/collections/service-history
router.post("/service-history", findServiceHistoryController);

// REVISAR: rota para retornar histórico de todos os serviços (ranking)
// POST localhost:3000/collections/all-service-history
router.post("/all-service-history", findAllHistoryController);

/*
Teste de endpoints

Cadastro de histórico de um serviço:
curl -X POST http://localhost:3000/collections/add-history \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "inventory-sync"}'

Ver histórico de um serviço em específico:
curl -X GET http://localhost:3000/collections/service-history

Ver todo o histórico da data especificada:
curl -X POST http://localhost:3000/collections/all-service-history \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17"}'

*/
