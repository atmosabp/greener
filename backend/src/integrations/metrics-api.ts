import type { MetricsData, MetricsTypes } from "../types/metrics-types";

const metricsURL = "https://metrics.unilaunch.org/metrics/";

export interface MetricsApi {
  reqInterval(serviceId: string): Promise<number | undefined>;
  reqMetrics(serviceId: string): Promise<MetricsData | undefined>;
  reqMetricsCPU(serviceId: string): Promise<number | undefined>;
  reqMetricsMemory(serviceId: string): Promise<number | undefined>;
  reqMetricsDisk(serviceId: string): Promise<number | undefined>;
  reqMetricsNetwork(serviceId: string): Promise<number | undefined>;
}

export class HttpMetricsApi implements MetricsApi {
  async reqInterval(serviceId: string) {
    try {
      const intResp = await fetch(metricsURL + serviceId);

      if (intResp.ok) {
        const objInterval: MetricsTypes = await intResp.json();

        const interval = objInterval.collection_interval_seconds;
        return interval;
      }
    } catch (error: any) {
      throw new Error(`Não foi possível coletar o intervalo de busca do serviço ${serviceId}.`, {cause: error});
    }
  }

  async reqMetrics(serviceId: string) {
    try {
      const resp = await fetch(metricsURL + serviceId);
      if (resp.ok) {
        const objMetrics: MetricsTypes = await resp.json();

        const metricas = objMetrics.metrics;
        return metricas;
      }
    } catch (error: any) {
      throw new Error(
        `Ocorreu um erro interno ao buscar as métricas do serviço ${serviceId}. Tente novamente.`,
      );
    }
  }

  async reqMetricsCPU(serviceId: string) {
    const respMetrics = await this.reqMetrics(serviceId);

    if (!respMetrics) return;

    if (
      respMetrics.cpu_percent === undefined ||
      respMetrics.cpu_percent === null
    ) {
      throw new Error(`Não foi possivel capturar métricas da CPU do serviço ${serviceId}.`);
    }

    const valueCPU = respMetrics.cpu_percent;
    return valueCPU;
  }

  async reqMetricsMemory(serviceId: string) {
    const respMetrics = await this.reqMetrics(serviceId);

    if (!respMetrics) return;

    if (!respMetrics.memory_gb) {
      throw new Error(`Não foi possivel capturar métricas de memória do serviço ${serviceId}.`);
    }

    const valueMemory = respMetrics.memory_gb;
    return valueMemory;
  }

  async reqMetricsDisk(serviceId: string) {
    const respMetrics = await this.reqMetrics(serviceId);

    if (!respMetrics) return;

    if (!respMetrics.disk_gb) {
      throw new Error(`Não foi possivel capturar métricas de armazenamento do serviço ${serviceId}`);
    }

    const valueDisk = respMetrics.disk_gb;
    return valueDisk;
  }

  async reqMetricsNetwork(serviceId: string) {
    const respMetrics = await this.reqMetrics(serviceId);

    if (!respMetrics) return;

    if (!respMetrics.network_gb) {
      throw new Error(`Não foi possivel capturar métricas de rede do serviço ${serviceId}.`);
    }

    const valueNetwork = respMetrics.network_gb;
    return valueNetwork;
  }
}