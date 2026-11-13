import {
  reqCarbonValue,
  reqRenewablePercent,
} from "../../integrations/carbon-api";
import {
  reqInterval,
  reqMetrics
} from "../../integrations/metrics-api";
import { reqServices } from "../../integrations/services-api";
import { MetricsData } from "../../types/metrics-types";
import { ServiceTypes } from "../../types/services-types";
import { MetricsCalculator } from "../metrics-calculator";
import {
  addMinuteHistory,
  findMinuteHistory,
  findHourHistory,
  findMonthHistory,
  findServiceMinuteHistory,
  findServiceHourHistory,
  findServiceMonthHistory,
  findHistory,
  findDayHistory,
  findServiceDayHistory,
} from "./collections.repository";

export async function addHistory(serviceId: string) {
  // TODO: fazer com que pegue todos os serviços da lista da API auxiliar, colocar em um json
  // e depois colocar como segundo parâmetro da função abaixo.

  // Provavelmente fazer um for loop que a cada serviço no json
  // chame essa função.

  const result = await addMinuteHistory(serviceId);

  if (!result) return null;

  return result;
}

export async function getServiceMetrics(serviceId: string) {
  let 
    collectionIntervalSeconds,
    carbonIntensity,
    renewablePercent,
    kwh,
    co2e: number | undefined = undefined;
  let metricsEnergy : MetricsData | undefined = undefined
  let service: ServiceTypes | undefined = undefined;

  try {
    service = (await reqServices()).find((value) => value.id == serviceId);
    const [collectionIntervalSeconds,carbonIntensity,renewablePercent] =
    await Promise.all([
      reqInterval(serviceId),
      reqCarbonValue(serviceId),
      reqRenewablePercent(serviceId),
    ])

    metricsEnergy = await reqMetrics(serviceId);
    
    const metricsCalculator = new MetricsCalculator({
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

export async function getAllServicesMetrics() {
  let result: ServiceTypes[] | undefined = undefined;
  let fetchedServices: any;

  try {
    result = await reqServices();

    if (!result) return null;

    fetchedServices = await Promise.all(
      result.map(async (service) => {
        const id = service.id!;

        try {
          const [metricsEnergy, interval, carbon, renewable] =
            await Promise.all([
              reqMetrics(id),
              reqInterval(id),
              reqCarbonValue(id),
              reqRenewablePercent(id)
            ]);

          const calc = new MetricsCalculator({
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
    // console.error(e.message);
  }

  return fetchedServices;
}

export async function searchAllHistory() {
  const result = await findHistory();

  if (!result || result.length == 0) return null;

  return result;
}

export async function searchHistory(periodType: string, datePull: any) {
  let result;

  switch (periodType) {
    case "minute":
      result = await findMinuteHistory(datePull);
      break;
    case "hour":
      result = await findHourHistory(datePull);
      break;
    case "day":
      result = await findDayHistory(datePull);
      break;

    case "month":
      result = await findMonthHistory(datePull);
      break;
  }

  if (!result) return null;

  return result;
}

export async function searchServiceHistory(
  periodType: string,
  datePull: any,
  serviceId: string,
) {
  let result;

  switch (periodType) {
    case "minute":
      result = await findServiceMinuteHistory(datePull, serviceId);
      break;
    case "hour":
      result = await findServiceHourHistory(datePull, serviceId);
      break;
    case "day":
      result = await findServiceDayHistory(datePull, serviceId);
      break;
    case "month":
      result = await findServiceMonthHistory(datePull, serviceId);
      break;
  }

  if (!result) return null;

  return result;
}
