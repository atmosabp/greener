import type { ApiCarbon } from "../types/carbon";
import type { ServiceTypes } from "../types/services-types";

const urlApi = "https://carbon.unilaunch.org/carbon-intensity/";
const serviceURL = "https://metrics.unilaunch.org/services/";

// Busca a região do serviço (ex.: br-sudeste, us-east) na API de serviços
export async function reqRegionCode(serviceId: string) {
  const resp = await fetch(serviceURL + serviceId);

  if (!resp.ok) {
    throw new Error("Não foi possivel buscar a região do serviço.");
  }

  const service: ServiceTypes = await resp.json();
  const regionCode = service.location?.region_code;

  if (!regionCode) {
    throw new Error("O serviço não possui região cadastrada.");
  }

  return regionCode;
}

export async function reqMetrics(serviceId: string) {
  try {
    const regionCode = await reqRegionCode(serviceId);
    const resp = await fetch(urlApi + regionCode);

    if (resp.ok) {
      const objMetrics: ApiCarbon = await resp.json();

      return objMetrics;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Não foi possivel buscar as métricas da API.",
    );
  }
}

export async function reqCarbonValue(serviceId: string): Promise<number|undefined> {
  const respMetrics = await reqMetrics(serviceId);

  if (!respMetrics) return;

  if (!respMetrics.carbon_intensity_gco2e_per_kwh) {
    throw new Error("Não foi possivel capturar a intensidade de carbono.");
  }

  const valueCarbon = respMetrics.carbon_intensity_gco2e_per_kwh;

  return valueCarbon;
}

export async function reqRenewablePercent(serviceId: string): Promise<number|undefined> {
  const respMetrics = await reqMetrics(serviceId);

  if (!respMetrics) return;

  if (!respMetrics.renewable_share_percent) {
    throw new Error("Não foi possivel capturar métricas da porcentagem renovável.");
  }

  const valueRenewable = respMetrics.renewable_share_percent;

  return valueRenewable;
}
