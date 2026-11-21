import { Router } from "express";
import type { ICollectionsController } from "./collections.controller";

export function collectionsRoutes(controller: ICollectionsController) {
  const router = Router();

  // Rota de teste para retornar todo o histórico
  // GET localhost:PORT/collections/get-history
  router.get("/get-history", (req, res) => controller.getHistory(req, res));

  // Tota para adicionar histórico no banco de dados
  // POST localhost:PORT/collections/add-history
  router.post("/add-history", (req, res) => controller.addHistory(req, res));

  // Apenas pega o dado mais recente da api auxiliar e retorna pro frontend (dashboard), sem guardar nada no banco de dados
  // GET localhost:PORT/collections/service-metrics/:serviceId
  router.get("/service-metrics/:serviceId", (req, res) =>
    controller.getServiceMetrics(req, res),
  );

  // Rota para retornar todos os serviços e todas as métricas
  // GET localhost:PORT/collections/all-service-data
  router.get("/all-service-data", (req, res) =>
    controller.getAllServicesData(req, res),
  );

  // Tota para retornar histórico de um serviço
  // POST localhost:PORT/collections/service-history/:id
  router.post("/service-history", (req, res) =>
    controller.findServiceHistory(req, res),
  );

  // Tota para retornar histórico de todos os serviços (ranking)
  // POST localhost:PORT/collections/all-service-history
  router.post("/all-service-history", (req, res) =>
    controller.findAllHistory(req, res),
  );

  return router;
}

/*
Teste de endpoints

Cadastro de histórico de um serviço:
curl -X POST http://localhost:PORT/collections/add-history \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "inventory-sync"}'

Ver todo o histórico da data especificada:
curl -X POST http://localhost:PORT/collections/all-service-history \
  -H "Content-Type: application/json" \
  -d '{"periodType": "minute", "datePull": "2026-10-17"}'

*/