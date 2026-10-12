import type { ApiErrorResponse, MetricsTypes } from "../types/metrics-types";

const metricsURL = 'https://metrics.unilaunch.org/metrics/billing-api'


async function reqMetrics() {
    const resp = await fetch(metricsURL);

    try {
        if (resp.status === 200) {
            const objMetrics: MetricsTypes = await resp.json();

            const metricas = objMetrics.metrics;
            return metricas
        }
    } catch (erro) {
        const error: ApiErrorResponse = await resp.json();
        throw new Error(error.message || "Não foi possivel buscar a métricas");
    }
}

async function reqMetricsCPU() {
    const respMetrics = await reqMetrics();

    if (!respMetrics) return;

    if (respMetrics.cpu_percent === undefined || respMetrics.cpu_percent === null) {
        throw new Error("Não foi possivel capturar métricas da CPU");
    }

    const valueCPU = respMetrics.cpu_percent;
    return valueCPU
}

async function reqMetricsMemory() {
    const respMetrics = await reqMetrics();

    if (!respMetrics) return;

    if (respMetrics.memory_gb === undefined || respMetrics.memory_gb === null) {
        throw new Error("Não foi possivel capturar métricas de memory");
    }

    const valueMemory = respMetrics.memory_gb;
    return valueMemory
}

async function reqMetricsDisk() {
    const respMetrics = await reqMetrics();

    if (!respMetrics) return;

    if (respMetrics.disk_gb === undefined || respMetrics.disk_gb === null) {
        throw new Error("Não foi possivel capturar métricas de disk");
    }

    const valueDisk = respMetrics.disk_gb;
    return valueDisk
}

async function reqMetricsNetwork() {
    const respMetrics = await reqMetrics();

    if (!respMetrics) return;

    if (respMetrics.network_gb === undefined || respMetrics.network_gb === null) {
        throw new Error("Não foi possivel capturar métricas de network");
    }    

    const valueNetwork = respMetrics.network_gb;
    return valueNetwork
}


// pra testar
async function iniciar() {
    const valor = await reqMetricsNetwork();
    console.log(valor)
}

iniciar();