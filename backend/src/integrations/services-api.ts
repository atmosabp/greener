import type { ServiceTypes, MetricsType, CoordinatesTypes } from "../types/services-types";
import {findServices} from "../modules/collections/collections.repository"

const serviceURL = "https://metrics.unilaunch.org/services";
const metricsURL = "https://metrics.unilaunch.org/metrics";

export async function reqServices(): Promise<ServiceTypes[]> {
  try {
    const responseDb = await findServices();

    var avaliableList = [];

    for (let i of responseDb) {
      avaliableList.push(await checkServiceAvailiability(i));
    }

    return avaliableList;
  } catch (error: any) {
    throw new Error(error.message || "API não disponível.");
  }
}

export async function checkServiceAvailiability(
  service: ServiceTypes,
): Promise<ServiceTypes> {
  try {
    const response = await fetch(`${metricsURL}/${service.id}`);
    const metrics: MetricsType = await response.json();

    const responseApi = await fetch(serviceURL);
    const data = await responseApi.json();

    for(let i in data){
      if (service.id == data[i].id){
        service.location = data[i].location;
        break;
      }
    }

    if (response.ok) {
      service.status = "active";
    }

    if (
      !metrics.collection_interval_seconds ||
      !metrics.metrics ||
      !metrics.metrics.cpu_percent ||
      !metrics.metrics.disk_gb ||
      !metrics.metrics.memory_gb ||
      !metrics.metrics.network_gb
    ) {
      service.status = "incomplete";
    }

    if (!response.ok) {
      service.status = "inactive";
    }
    
  } catch (error: any) {
    service.status = "inactive";
  } finally {
    return service;
  }
}

export async function reqCoordinates(serviceId: string): Promise<CoordinatesTypes> {
  try {
    const response = await fetch(`${serviceURL}/${serviceId}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição de dados`);
    }
    const serviceData: ServiceTypes = await response.json();

    const serviceCoordinate = serviceData.location;

    if (!serviceCoordinate?.latitude || !serviceCoordinate?.longitude) {
      throw new Error(`Não foi possível encontrar as coordenadas`);
    }

    return serviceCoordinate;
  } catch (error: any) {
    throw new Error(`Erro ao buscar coordenadas: ${error.message}`, {
      cause: error,
    });
  }
}
