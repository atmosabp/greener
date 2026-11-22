import type { ServiceType } from "../../../types/service";
import { port } from "../../../utils/connection";

export type MetricKey =
  | "cpu_percent"
  | "memory_gb"
  | "disk_gb"
  | "network_gb"
  | "co2e"
  | "kwh"
  | "carbon_intensity";

/* Valores numéricos; ausentes quando o backend não conseguiu coletar. */
export type Metrics = Partial<Record<MetricKey, number>>;

export type CompareTarget = "reference" | "average";

function toService(apiService: ServiceType): ServiceType {
  const metrics = apiService.metrics ?? {};

  /* Usa a intensidade enviada pelo backend ou calcula pelo CO₂e / kWh. */
  const intensidade =
    metrics.carbon_intensity ??
    (metrics.co2e && metrics.kwh ? metrics.co2e / metrics.kwh : undefined);

  return {
    id: apiService.id,
    name: apiService.name,
    metrics: {
      kwh: metrics.kwh,
      co2e: metrics.co2e,
      network_gb: metrics.network_gb,
      cpu_percent: metrics.cpu_percent,
      disk_gb: metrics.disk_gb,
      memory_gb: metrics.memory_gb,
      carbon_intensity: intensidade,
    },
    status: "active",
  };
}

export async function fetchServices(): Promise<ServiceType[]> {
  const result = await fetch(
    `http://localhost:${port}/collections/all-service-data`,
  );

  if (!result.ok) {
    throw new Error("Não foi possível buscar os dados dos serviços.");
  }

  const data: ServiceType[] = await result.json();

  return (data ?? []).map(toService);
}

const UNITS: Record<MetricKey, string> = {
  kwh: " kWh",
  co2e: " g CO₂e",
  network_gb: "GB",
  cpu_percent: "%",
  disk_gb: "GB",
  memory_gb: "GB",
  carbon_intensity: "",
};

export function formatNumber(value: number) {
  /* Valores muito pequenos (ex.: kWh por coleta) mantêm casas significativas. */
  const options =
    Math.abs(value) > 0 && Math.abs(value) < 1
      ? { maximumSignificantDigits: 3 }
      : { maximumFractionDigits: 2 };

  return value.toLocaleString("pt-BR", options);
}

// metrica sem valor
export function formatMetric(key: MetricKey, value?: number) {
  if (value === undefined) return "—";

  return `${formatNumber(value)}${UNITS[key]}`;
}

const METRIC_KEYS: MetricKey[] = [
  "cpu_percent",
  "kwh",
  "co2e",
  "carbon_intensity",
  "disk_gb",
  "memory_gb",
  "network_gb",
];

/* Média de cada métrica, ignorando serviços sem o valor. */
export function calculateAverages(services: ServiceType[]): Metrics {
  const averages: Metrics = {};

  for (const key of METRIC_KEYS) {
    let values;
    values = services
      .map((service) => service.metrics && service.metrics[key])
      .filter((value): value is number => value !== undefined);

    if (values.length > 0) {
      averages[key] =
        values.reduce((sum, value) => sum + value, 0) / values.length;
    }
  }

  return averages;
}

/* Maior valor de uma métrica entre os serviços (escala dos medidores). */
export function calculateMax(services: ServiceType[], key: MetricKey) {
  return services.reduce(
    (max, service) =>
      Math.max(max, (service.metrics ? service.metrics[key] : undefined) ?? 0),
    0,
  );
}

/* Diferença percentual do valor em relação à base. */
export function calculateDelta(value?: number, base?: number) {
  if (value === undefined || base === undefined || base === 0) {
    return undefined;
  }

  return ((value - base) / base) * 100;
}

export function carbonLevel(intensity?: number) {
  if (intensity === undefined) return { label: "Indisponível", bar: "0%" };

  /* Escala de 0 a 200 gCO₂e/kWh; acima disso a barra fica cheia. */
  const bar = `${Math.min(intensity / 2, 100)}%`;

  if (intensity < 100) return { label: "Baixo", bar };
  if (intensity < 200) return { label: "Médio", bar };
  return { label: "Alto", bar };
}

export const PERIODS = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
];
