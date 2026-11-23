import { MetricsData } from "../../types/metrics-types";
import { ServiceTypes } from "../../types/services-types";
import type { MetricsProps } from "../metrics-calculator";
import type { CarbonApi } from "../../integrations/carbon-api";
import type { MetricsApi } from "../../integrations/metrics-api";
import type { ServicesApi } from "../../integrations/services-api";
import type { CollectionsRepository } from "./collections.repository";
import { PassThrough } from "node:stream";

// Contrato do cálculo de métricas (a classe MetricsCalculator atende a ele).
export interface MetricsCalculation {
  calculateKWh(): number | null;
  calculateCO2e(): number | null;
}

// Função que cria um calculador a partir das métricas. É injetada no service.
export type MetricsCalculatorFactory = (
  metrics: MetricsProps,
) => MetricsCalculation;

export interface ICollectionsService {
  addHistory(serviceId: string): Promise<any>;
  getServiceMetrics(serviceId: string): Promise<any>;
  getAllServicesMetrics(): Promise<any>;
  searchAllHistory(): Promise<any>;
  searchHistory(periodType: string, datePull: any): Promise<any>;
  searchServiceHistory(
    periodType: string,
    datePull: any,
    serviceId: string,
  ): Promise<any>;
}

export class CollectionsService implements ICollectionsService {
  constructor(
    private readonly repository: CollectionsRepository,
    private readonly carbonApi: CarbonApi,
    private readonly metricsApi: MetricsApi,
    private readonly servicesApi: ServicesApi,
    private readonly createCalculator: MetricsCalculatorFactory,
  ) {}

  async addHistory(serviceId: string) {
    const [
      collectionIntervalSeconds,
      carbonIntensity,
      renewablePercent,
      metricsEnergy,
    ] = await Promise.all([
      this.metricsApi.reqInterval(serviceId),
      this.carbonApi.reqCarbonValue(serviceId),
      this.carbonApi.reqRenewablePercent(serviceId),
      this.metricsApi.reqMetrics(serviceId),
    ]);

    const metricsCalculator = this.createCalculator({
      collection_interval_seconds: collectionIntervalSeconds,
      metrics: {
        cpu_percent: metricsEnergy?.cpu_percent,
        memory_gb: metricsEnergy?.memory_gb,
        disk_gb: metricsEnergy?.disk_gb,
        network_gb: metricsEnergy?.network_gb,
      },
      carbon_intensity_gco2e_per_kwh: carbonIntensity,
      renewable_share_percent: renewablePercent,
    });

    const kwh = metricsCalculator.calculateKWh();
    const co2e = metricsCalculator.calculateCO2e();

    const result = await this.repository.addMinuteHistory(
      serviceId,
      metricsEnergy!,
      renewablePercent,
      kwh,
      co2e,
    );

    if (!result) return null;

    return result;
  }

  async getServiceMetrics(serviceId: string) {
    let collectionIntervalSeconds,
      carbonIntensity,
      renewablePercent,
      kwh,
      co2e: number | undefined = undefined;
    let metricsEnergy: MetricsData | undefined = undefined;
    let service: ServiceTypes | undefined = undefined;

    try {
      service = (await this.servicesApi.reqServices(
        await this.repository.findServices(),
      ))!.find((value) => value.id == serviceId);
      [collectionIntervalSeconds, carbonIntensity, renewablePercent] =
        await Promise.all([
          this.metricsApi.reqInterval(serviceId),
          this.carbonApi.reqCarbonValue(serviceId),
          this.carbonApi.reqRenewablePercent(serviceId),
        ]);

      metricsEnergy = await this.metricsApi.reqMetrics(serviceId);

      const metricsCalculator = this.createCalculator({
        collection_interval_seconds: collectionIntervalSeconds,
        metrics: {
          cpu_percent: metricsEnergy?.cpu_percent,
          memory_gb: metricsEnergy?.memory_gb,
          disk_gb: metricsEnergy?.disk_gb,
          network_gb: metricsEnergy?.network_gb,
        },
        carbon_intensity_gco2e_per_kwh: carbonIntensity,
        renewable_share_percent: renewablePercent,
      });

      kwh = metricsCalculator.calculateKWh() || undefined;
      co2e = metricsCalculator.calculateCO2e() || undefined;
    } catch (error: any) {
      console.error(error.message);
    }

    const statusResult = await fetch(
      `https://metrics.unilaunch.org/metrics/${serviceId}`,
    );
    const statusCode = statusResult.status;

    if (statusCode == 404) {
      service ? service.status = "deleted" : PassThrough;
    }
    if (statusCode == 500) {
      service ? service.status = "inactive" : PassThrough;
    }

    const metrics = {
      cpu_percent: metricsEnergy?.cpu_percent,
      memory_gb: metricsEnergy?.memory_gb,
      disk_gb: metricsEnergy?.disk_gb,
      network_gb: metricsEnergy?.network_gb,
      co2e: co2e,
      kwh: kwh,
      renewable_percent: renewablePercent,
      carbon_intensity: carbonIntensity,
    };

    const result = {
      name: service?.name,
      status: service?.status,
      location: service?.location,
      metrics: metrics,
    };

    if (!result) return null;

    return result;
  }

  async getAllServicesMetrics() {
    let result: ServiceTypes[] | undefined = undefined;
    let fetchedServices: any;

    try {
      result = await this.servicesApi.reqServices(
        await this.repository.findServices(),
      );

      if (!result) return null;

      fetchedServices = await Promise.all(
        result.map(async (service) => {
          const id = service.id!;

          try {
            const [metricsEnergy, interval, carbon, renewable] =
              await Promise.all([
                this.metricsApi.reqMetrics(id),
                this.metricsApi.reqInterval(id),
                this.carbonApi.reqCarbonValue(id),
                this.carbonApi.reqRenewablePercent(id),
              ]);

            const calc = this.createCalculator({
              collection_interval_seconds: interval,
              metrics: {
                cpu_percent: metricsEnergy?.cpu_percent,
                memory_gb: metricsEnergy?.memory_gb,
                disk_gb: metricsEnergy?.disk_gb,
                network_gb: metricsEnergy?.network_gb,
              },
              carbon_intensity_gco2e_per_kwh: carbon,
              renewable_share_percent: renewable,
            });

            service.metrics = {
              cpu_percent: metricsEnergy?.cpu_percent,
              memory_gb: metricsEnergy?.memory_gb,
              disk_gb: metricsEnergy?.disk_gb,
              network_gb: metricsEnergy?.network_gb,
              co2e: calc.calculateCO2e() || undefined,
              kwh: calc.calculateKWh() || undefined,
            };
          } catch (e: any) {
            console.error(`Falha no serviço ${id}. Erro:`, e.message);
            service.metrics = {};
          }

          return service;
        }),
      );
    } catch (e: any) {
      console.error(`Ocorreu um erro ao buscar todos os serviços. Erro: ${e.message}`);
    }

    return fetchedServices;
  }

  async searchAllHistory() {
    const result = await this.repository.findHistory();

    if (!result || result.length == 0) return null;

    return result;
  }

  async searchHistory(periodType: string, datePull: any) {
    let result;

    switch (periodType) {
      case "minute":
        result = await this.repository.findMinuteHistory(datePull);
        break;
      case "hour":
        result = await this.repository.findHourHistory(datePull);
        break;
      case "day":
        result = await this.repository.findDayHistory(datePull);
        break;

      case "month":
        result = await this.repository.findMonthHistory(datePull);
        break;
    }

    if (!result) return null;

    return result;
  }

  async searchServiceHistory(
    periodType: string,
    datePull: any,
    serviceId: string,
  ) {
    let result;

    switch (periodType) {
      case "minute":
        result = await this.repository.findServiceMinuteHistory(
          datePull,
          serviceId,
        );
        break;
      case "hour":
        result = await this.repository.findServiceHourHistory(
          datePull,
          serviceId,
        );
        break;
      case "day":
        result = await this.repository.findServiceDayHistory(
          datePull,
          serviceId,
        );
        break;
      case "month":
        result = await this.repository.findServiceMonthHistory(
          datePull,
          serviceId,
        );
        break;
    }

    if (!result) return null;

    return result;
  }
}
