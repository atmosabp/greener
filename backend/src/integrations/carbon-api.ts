import type { ApiCarbon } from "../types/carbon";
import type { ServiceTypes } from "../types/services-types";

const urlApi = "https://carbon.unilaunch.org/carbon-intensity/";
const serviceURL = "https://metrics.unilaunch.org/services/";

export interface CarbonApi {
  reqMetrics(serviceId: string): Promise<ApiCarbon | undefined>;
  reqCarbonValue(serviceId: string): Promise<number | undefined>;
  reqRenewablePercent(serviceId: string): Promise<number | undefined>;
}

export class HttpCarbonApi implements CarbonApi {
  async reqMetrics(serviceId: string) {
    try {
      const responseService = await fetch(`https://metrics.unilaunch.org/services/${serviceId}`);
      const data: ServiceTypes = await responseService.json();

      var resp;
      if(data.location){
        resp = await fetch(`${urlApi}${data.location.region_code}`);

        const objMetrics: ApiCarbon = await resp.json();

        return objMetrics;
      }
    } catch (error: any) {
      throw new Error(
        `Ocorreu um erro interno ao buscar as métricas do serviço ${serviceId}.`,
      );
    }
  }

  async reqCarbonValue(serviceId: string): Promise<number|undefined> {
    const respMetrics = await this.reqMetrics(serviceId);

    if (!respMetrics) return;

    if (!respMetrics.carbon_intensity_gco2e_per_kwh) {
      throw new Error(`Ocorreu um erro interno ao capturar a intensidade de carbono do serviço ${serviceId}.`);
    }

    const valueCarbon = respMetrics.carbon_intensity_gco2e_per_kwh;

    return valueCarbon;
  }

  async reqRenewablePercent(serviceId: string): Promise<number|undefined> {
    const respMetrics = await this.reqMetrics(serviceId);

    if (!respMetrics) return;

    if (!respMetrics.renewable_share_percent) {
      throw new Error(`Ocorreu um erro interno ao capturar métricas da porcentagem renovável do serviço ${serviceId}.`);
    }

    const valueRenewable = respMetrics.renewable_share_percent;

    return valueRenewable;
  }
}