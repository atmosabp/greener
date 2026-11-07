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
  let result: ServiceTypes[] | undefined = undefined;
  let fetchedServices: any;

  try {
    result = await reqServices();

    if (!result) return null;

    fetchedServices = await Promise.all(
      result.map(async (service) => {
        const id = service.id!;

        try {
          const [cpu, memory, interval, carbon, renewable, disk, network] =
            await Promise.all([
              reqMetricsCPU(id),
              reqMetricsMemory(id),
              reqInterval(id),
              reqCarbonValue(id),
              reqRenewablePercent(id),
              reqMetricsDisk(id),
              reqMetricsNetwork(id),
            ]);

          const calc = new MetricsCalculator({
            collection_interval_seconds: interval,
            metrics: {
              cpu_percent: cpu,
              memory_gb: memory,
              disk_gb: disk,
              network_gb: network,
            },
            carbon_intensity_gco2e_per_kwh: carbon,
            renewable_share_percent: renewable,
          });

          service.metrics = {
            cpu_percent: cpu,
            memory_gb: memory,
            disk_gb: disk,
            network_gb: network,
            co2e: calc.calculateCO2e() || undefined,
            kwh: calc.calculateKWh() || undefined,
          };
        } catch (e: any) {
          console.error(`Falha no serviço ${id}. Erro: `, e.message);
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
