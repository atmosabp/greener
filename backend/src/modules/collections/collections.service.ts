import { reqCarbonValue, reqRenewablePercent } from "../../integrations/carbon-api";
import { reqInterval, reqMetrics, reqMetricsCPU, reqMetricsDisk, reqMetricsMemory, reqMetricsNetwork } from "../../integrations/metrics-api";
import { reqServices } from "../../integrations/services-api";
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
} from "./collections.repository";

export async function addHistory(datePull: any) {
  // TODO: fazer com que pegue todos os serviços da lista da API auxiliar, colocar em um json
  // e depois colocar como segundo parâmetro da função abaixo.

  // Provavelmente fazer um for loop que a cada serviço no json
  // chame essa função.

  const result = await addMinuteHistory(datePull, "billing-api");

  if (!result) return null;

  return result;
}

export async function getServiceMetrics(serviceId: string) {
  // TODO: revisar a lógica para retornar TODOS os dados necessários para a tela dashboard
  const result = await reqMetrics(serviceId);

  if (!result) return null;


  return result;
}

export async function getAllServicesMetrics() {
  // TODO: fazer a lógica para retornar TODOS os dados de TODOS os serviços (tela de ranking e tela principal/globo)
  const result = await reqServices();

  for(let service of result){
    const cpu = (await reqMetricsCPU(service.id!));
    const memory = (await reqMetricsMemory(service.id!));
    const collectionIntervalSeconds = (await reqInterval(service.id!));
    const carbonIntensity = (await reqCarbonValue(service.id!));
    const renewablePercent = (await reqRenewablePercent(service.id!));
    const disk = (await reqMetricsDisk(service.id!));
    const network = (await reqMetricsNetwork(service.id!));
    
    const metricsCalculator = new MetricsCalculator({
      collection_interval_seconds: collectionIntervalSeconds,
      metrics: {
        cpu_percent: cpu,
        memory_gb: memory,
        disk_gb: disk,
        network_gb: network,
      },
      carbon_intensity_gco2e_per_kwh: carbonIntensity,
      renewable_share_percent: renewablePercent,
    });

    let kwh;
    let co2e;

    try{
      kwh = metricsCalculator.calculateKWh() || undefined;
      co2e = metricsCalculator.calculateCO2e() || undefined;
    } catch(error: any){
    }

    service.metrics = {cpu_percent: cpu, memory_gb: memory, disk_gb: disk, network_gb: network, co2e: co2e, kwh: kwh}
  }

  if (!result) return null;

  return result;
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
    case "day":
      //trocar função para a correta
      result = await findMinuteHistory(datePull);
      break;
    case "hour":
      result = await findHourHistory(datePull);
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
    case "month":
      result = await findServiceMonthHistory(datePull, serviceId);
      break;
  }

  if (!result) return null;

  return result;
}
