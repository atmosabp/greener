import { Request, Response } from "express";
import {
  addHistory,
  searchHistory,
  searchServiceHistory,
  searchAllHistory,
  getServiceMetrics,
  getAllServicesMetrics
} from "./collections.service";

export async function getHistoryController(_req: Request, res: Response) {
  try {
    const result = await searchAllHistory();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Ocorreu um erro ao buscar o histórico. Tente novamente mais tarde.",
    });
  }
}

export async function addHistoryController(_req: Request, res: Response) {
  try {
    const result = await addHistory(Date.now());
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Ocorreu um erro ao guardar o histórico. Tente novamente mais tarde.",
    });
  }
}

export async function getServiceMetricsController(req: Request, res: Response) {
  const { serviceId } = req.body;

  try {
    const result = await getServiceMetrics(serviceId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Ocorreu um erro ao buscar as métricas do serviço. Tente novamente mais tarde.",
    });
  }
}

export async function getAllServicesDataController(req: Request, res: Response) {
  try {
    const result = await getAllServicesMetrics();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Ocorreu um erro ao buscar as métricas do serviço. Tente novamente mais tarde.",
    });
  }
}

export async function findAllHistoryController(req: Request, res: Response) {
  const { periodType, datePull } = req.body;

  try {
    const result = await searchHistory(periodType, datePull);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Ocorreu um erro ao buscar o histórico. Tente novamente mais tarde.",
    });
  }
}

export async function findServiceHistoryController(req: Request, res: Response) {
  const serviceId = String(req.params.id)
  const { periodType, datePull } = req.body;

  try {
    const result = await searchServiceHistory(periodType, datePull, serviceId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Ocorreu um erro ao buscar o histórico do serviço. Tente novamente mais tarde.",
    });
  }
}
