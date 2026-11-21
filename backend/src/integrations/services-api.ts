import type { ServiceTypes, MetricsType, CoordinatesTypes } from "../types/services-types";

const serviceURL = "https://metrics.unilaunch.org/services";
const metricsURL = "https://metrics.unilaunch.org/metrics";

export interface ServicesApi {
  reqServices(responseDb: { id: string; name: string }[]): Promise<ServiceTypes[]>;
  checkServiceAvailiability(service: ServiceTypes): Promise<ServiceTypes>;
  reqCoordinates(serviceId: string): Promise<CoordinatesTypes>;
}

export class HttpServicesApi implements ServicesApi {
  async reqServices(
    responseDb: { id: string; name: string }[],
  ): Promise<ServiceTypes[]> {
    try {
      var avaliableList = [];

      for (let i of responseDb) {
        avaliableList.push(
          await this.checkServiceAvailiability({ ...i, status: undefined }),
        );
      }

      return avaliableList;
    } catch (error: any) {
      throw new Error("Ocorreu um erro interno ao listar os serviços. Tente novamente mais tarde.", {cause: error});
    }
  }

  async checkServiceAvailiability(
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

  async reqCoordinates(serviceId: string): Promise<CoordinatesTypes> {
    try {
      const response = await fetch(`${serviceURL}/${serviceId}`);

      if (!response.ok) {
        throw new Error(`Ocorreu um erro ao requisitar os dados do serviço ${serviceId}. Tente novamente mais tarde.`);
      }
      const serviceData: ServiceTypes = await response.json();

      const serviceCoordinate = serviceData.location;

      if (!serviceCoordinate?.latitude || !serviceCoordinate?.longitude) {
        throw new Error(`Não foi possível encontrar as coordenadas do serviço.`);
      }

      return serviceCoordinate;
    } catch (error: any) {
      throw new Error(`Ocoreu um erro interno ao buscar coordenadas do serviço ${serviceId}. Tente novamente.`, {
        cause: error,
      });
    }
  }
}