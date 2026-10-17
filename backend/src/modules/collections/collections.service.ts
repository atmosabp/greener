import {
  addMinuteHistory,
  addHourHistory,
  addMonthHistory,
  findMinuteHistory,
  findHourHistory,
  findMonthHistory,
  findServiceMinuteHistory,
  findServiceHourHistory,
  findServiceMonthHistory,
  findHistory,
} from "./collections.respository";

export async function addHistory(periodType: string, serviceId: string, datePull: any, metrics: object) {
  let result;

  switch (periodType) {
    case "minute":
      result = await addMinuteHistory(datePull, serviceId, metrics);
      break;
    case "hour":
      result = await addHourHistory(datePull);
      break;
    case "month":
      result = await addMonthHistory(datePull);
      break;
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
