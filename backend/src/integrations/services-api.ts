import type {
  ServiceTypes,
  MetricsType,
  CoordinatesTypes,
} from "../types/services-types";
import { findServices } from "../modules/collections/collections.repository";

const serviceURL = "https://metrics.unilaunch.org/services";

export async function reqServices(): Promise<ServiceTypes[]> {
  try {
    const responseDb = await findServices();

    let startTime = Date.now(); //para calcular tempo total da operação

    const responseApi = await fetch(serviceURL);
    const data = await responseApi.json();

    let apiServiceList = [];

    for (let service of data) {
      apiServiceList.push(service.id);
    }

    for (let service of responseDb) {
      if (apiServiceList.includes(String(service.id))) {
        service.status = "active";
        for (let i in data) {
          if (service.id == data[i].id) {
            service.location = data[i].location;
            delete data[i];
            break;
          }
        }
        continue;
      }
      service.status = "inactive";
      
      const statusResult = await fetch(`https://metrics.unilaunch.org/metrics/${service.id}`);
      if(statusResult.status == 404){
        service.status = "deleted";
      }
    }

    let totalTime = Date.now() - startTime; //tempo total da requisição

    return responseDb;
  } catch (error: any) {
    throw new Error(error.message || "API não disponível.");
  }
}

async function teste(){
  await reqServices();
}

teste();
