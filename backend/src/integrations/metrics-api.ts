import type { MetricsTypes } from "../types/metrics-types";

const metricsURL = "https://metrics.unilaunch.org/metrics/";

export async function reqInterval(serviceId: string) {
  try {
    const intResp = await fetch(metricsURL+serviceId);

    if (intResp.ok) {
      const objInterval: MetricsTypes = await intResp.json();

      const interval = objInterval.collection_interval_seconds;
      return interval;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Não foi possivel buscar o intervalo de busca",
    );
  }
}

export async function reqMetrics(serviceId: string) {
  try {
    const resp = await fetch(metricsURL+serviceId);
    if (resp.ok) {
      const objMetrics: MetricsTypes = await resp.json();

      const metricas = objMetrics.metrics;
      return metricas;
    }
  } catch (error: any) {
    throw new Error(error.message || "Não foi possivel buscar as métricas da API.");
  }
}

export async function reqMetricsCPU(serviceId: string) {
  const respMetrics = await reqMetrics(serviceId);

  if (!respMetrics) return;

  if (
    respMetrics.cpu_percent === undefined ||
    respMetrics.cpu_percent === null
  ) {
    throw new Error("Não foi possivel capturar métricas da CPU");
  }

  const valueCPU = respMetrics.cpu_percent;
  return valueCPU;
}

export async function reqMetricsMemory(serviceId: string) {
  const respMetrics = await reqMetrics(serviceId);

  if (!respMetrics) return;

  if (!respMetrics.memory_gb) {
    throw new Error("Não foi possivel capturar métricas de memory");
  }

  const valueMemory = respMetrics.memory_gb;
  return valueMemory;
}

export async function reqMetricsDisk(serviceId: string) {
  const respMetrics = await reqMetrics(serviceId);

  if (!respMetrics) return;

  if (!respMetrics.disk_gb) {
    throw new Error("Não foi possivel capturar métricas de disk");
  }

  const valueDisk = respMetrics.disk_gb;
  return valueDisk;
}

export async function reqMetricsNetwork(serviceId: string) {
  const respMetrics = await reqMetrics(serviceId);

  if (!respMetrics) return;

  if (!respMetrics.network_gb) {
    throw new Error("Não foi possivel capturar métricas de network");
  }

  const valueNetwork = respMetrics.network_gb;
  return valueNetwork;
}

// pra testar
async function iniciar() {
  const valor = await reqMetricsCPU("email-dispatcher");
  console.log(valor);
}

// iniciar();
