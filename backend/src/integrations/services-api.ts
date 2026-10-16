import type {
  ServiceTypes,
  ServiceStatus,
  MetricsType,
} from "../types/services-types";

const serviceURL = "https://metrics.unilaunch.org/services";
const metricsURL = "https://metrics.unilaunch.org/metrics";

async function reqServices() {
  try {
    const response = await fetch(serviceURL);

    if (response.status == 200) {
      const serviceList: ServiceTypes[] = await response.json();
      var avaliableList = [];
      for (let i of serviceList) {
        avaliableList.push(await checkAvaliabity(i));
      }

      return avaliableList;
    }
  } catch (error: any) {
    throw new Error(error.message | "API não disponível");
  }
}

async function checkServiceAvailiability(service: ServiceTypes): Promise<ServiceTypes> {
  try {
    
    const response = await fetch(metricsURL + `/${service.id}`);
    const metrics: MetricsType = await response.json();
    if (response.ok) {
      service.status = "disponivel";
    }

    if (
      !metrics.collection_interval_seconds ||
      !metrics.metrics ||
      !metrics.metrics.cpu_percent ||
      !metrics.metrics.disk_gb ||
      !metrics.metrics.memory_gb ||
      !metrics.metrics.network_gb
    ) {
      service.status = "incompleto";
    }

    if (!response.ok) {
      service.status = "indisponivel";
    }
  } catch (error: any) {
    service.status = "indisponivel";
  } finally {
    return service;
  }
}

async function teste(){
  console.log(await reqServices())
}

teste()
