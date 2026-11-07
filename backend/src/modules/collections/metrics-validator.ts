
import type { MetricsTypes } from "../../types/metrics-types";

const EXPECTED_METRICS = [
  "cpu_percent",
  "memory_gb",
  "disk_gb",
  "network_gb",
] as const;

type ExpectedMetric = (typeof EXPECTED_METRICS)[number];

export interface MetricsValidationResult {
  serviceId: string;
  isComplete: boolean;
  missingMetrics: ExpectedMetric[];
  invalidMetrics: ExpectedMetric[];
}

export function validateServiceMetrics(
  serviceId: string,
  response: MetricsTypes | null | undefined,
): MetricsValidationResult {
  const missingMetrics: ExpectedMetric[] = [];
  const invalidMetrics: ExpectedMetric[] = [];

  for (const metric of EXPECTED_METRICS) {
    const value = response?.metrics?.[metric];

    if (value === undefined || value === null) {
      missingMetrics.push(metric);
      continue;
    }

    if (typeof value !== "number" || !Number.isFinite(value)) {
      invalidMetrics.push(metric);
    }
  }

  return {
    serviceId,
    isComplete:
      missingMetrics.length === 0 && invalidMetrics.length === 0,
    missingMetrics,
    invalidMetrics,
  };
}
