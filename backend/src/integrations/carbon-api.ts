import type { ApiCarbon } from "../types/carbon";
import { ServiceTypes } from "../types/services-types";

const urlApi = "https://carbon.unilaunch.org/carbon-intensity/";

export async function reqMetrics(serviceId: string) {
  try {
    const responseService = await fetch(`https://metrics.unilaunch.org/services/${serviceId}`);
    const data: ServiceTypes = await responseService.json();

    var resp;
    if(data.location){
      resp = await fetch(`${urlApi}${data.location.region_code}`);

      const objMetrics: ApiCarbon = await resp.json();

      console.log(objMetrics)

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
    throw new Error("Não foi possivel capturar métricas da CPU.");
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
