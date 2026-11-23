import { Request, Response } from "express";
import type { ICollectionsService } from "./collections.service";
import { differenceInHours } from "date-fns";

export interface ICollectionsController {
  getHistory(req: Request, res: Response): Promise<Response>;
  addHistory(req: Request, res: Response): Promise<Response>;
  getServiceMetrics(req: Request, res: Response): Promise<Response>;
  getAllServicesData(req: Request, res: Response): Promise<Response>;
  findAllHistory(req: Request, res: Response): Promise<Response>;
  findServiceHistory(req: Request, res: Response): Promise<Response>;
}

export class CollectionsController implements ICollectionsController {
  constructor(private readonly service: ICollectionsService) {}

  async getHistory(_req: Request, res: Response) {
    try {
      const result = await this.service.searchAllHistory();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message ||
          "Ocorreu um erro interno ao buscar o histórico. Tente novamente mais tarde.",
      });
    }
  }

  async addHistory(req: Request, res: Response) {
    const { serviceId } = req.body;
    try {
      const result = await this.service.addHistory(serviceId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message ||
          "Ocorreu um erro interno ao guardar o histórico. Tente novamente mais tarde.",
      });
    }
  }

  async getServiceMetrics(req: Request, res: Response) {
    const serviceId = req.params.serviceId;

    try {
      const result = await this.service.getServiceMetrics(String(serviceId));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message ||
          "Ocorreu um erro interno ao buscar as métricas do serviço. Tente novamente mais tarde.",
      });
    }
  }

  async getAllServicesData(_req: Request, res: Response) {
    try {
      const result = await this.service.getAllServicesMetrics();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message ||
          "Ocorreu um erro interno ao buscar as métricas do serviço. Tente novamente mais tarde.",
      });
    }
  }

  async findAllHistory(req: Request, res: Response) {
    const { periodType, datePull } = req.body;

    try {
      const date = new Date(datePull);
      if (isNaN(date.getTime())) {
        return res
          .status(400)
          .json({ message: "O padrão da data enviada é inválido." });
      }
      const result = await this.service.searchHistory(periodType, datePull);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message ||
          "Ocorreu um erro interno ao buscar o histórico. Tente novamente mais tarde.",
      });
    }
  }

  async findServiceHistory(req: Request, res: Response) {
    const serviceId = String(req.params.id);
    const { periodType, datePull } = req.body;

    try {
      const date = new Date(datePull);
      if (isNaN(date.getTime())) {
        return res
          .status(400)
          .json({ message: "O padrão da data enviada é inválido." });
      }

      const result = await this.service.searchServiceHistory(
        periodType,
        datePull,
        serviceId,
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message:
          error.message ||
          "Ocorreu um erro interno ao buscar o histórico do serviço. Tente novamente mais tarde.",
      });
    }
  }
}
