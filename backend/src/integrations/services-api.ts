import type {
  ServiceTypes,
  MetricsType,
  CoordinatesTypes,
} from "../types/services-types";

const serviceURL = "https://metrics.unilaunch.org/services";
const metricsURL = "https://metrics.unilaunch.org/metrics";

export async function reqServices(): Promise<ServiceTypes[]> {
  try {
    const response = await fetch(serviceURL);

    if (!response.ok) {
      throw new Error(`Erro na requisição de dados`);
    }

    const serviceList: ServiceTypes[] = await response.json();
    var avaliableList: ServiceTypes[] = [];

    for (let i of serviceList) {
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
      service.status = "inactive";
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

async function teste() {
  console.log(await reqServices());
}

// teste();
