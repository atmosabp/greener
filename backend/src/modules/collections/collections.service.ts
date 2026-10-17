import {
  findMinuteHistory,
  findHourHistory,
  findMonthHistory,
  findServiceMinuteHistory,
  findServiceHourHistory,
  findServiceMonthHistory,
} from "./collections.respository";

import  {MetricsCalculator,type MetricsProps} from "../metrics-calculator"

export async function searchHistory(periodType: string, datePull: any) {
  let result;

  switch (periodType){
    case "minute":
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
  const metricsCalculator = new MetricsCalculator(
    {
      metrics: {
        cpu_percent: result.cpu_percentage,
        memory_gb: result.memory_gb,
        disk_gb: result.disk_gb,
        network_gb: result.network_gb,
      },
      renewable_share_percent: result.renewable_percent,
    },
    result.kwh,
    result.co2e,
  );
  
  return metricsCalculator.getMetrics() || null;
}


export async function searchServiceHistory(periodType: string, datePull: any, serviceId: string) {
  let result;

  switch (periodType){
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