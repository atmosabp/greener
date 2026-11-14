import {
  findServices,
  addNewService,
} from "../modules/collections/collections.repository";
import { connection } from "../config/env";

const serviceApiUrl = "https://metrics.unilaunch.org/services";
const pullTimer: number = 60000;

export async function historyWorker() {
  console.log("Worker ativado");
  while (true) {
    await sleep(pullTimer);
    await fetchServices();
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchServices() {
  try {
    const responseDb = await findServices();
    const responseApi = await fetch(serviceApiUrl);
    const responseApiContent = await responseApi.json();

    verifyService(responseDb, responseApiContent);
    for (let i of responseDb) {
      fetchMetricsAddHistory(i.id);
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

async function fetchMetricsAddHistory(serviceId: string) {
  try {
    const result = await fetch(
      `http://localhost:${connection.ports}/collections/add-history`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: serviceId }),
      },
    );
  } catch (e: any) {
    console.error(e.message);
  }
}

async function verifyService(dbList: any[], apiList: any[]) {
  for (let i of apiList) {
    let verifyed: boolean = false;
    for (let j of dbList) {
      if (i.id == j.id) {
        verifyed = true;
        break;
      }
    }
    if (!verifyed) {
      try {
        addNewService(i.id, i.name);
        fetchMetricsAddHistory(i.id);
      } catch (e: any) {
        console.error(e.message);
      }
    }
  }
}
