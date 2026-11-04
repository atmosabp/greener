export interface ServiceTypes {
  id?: string;
  name?: string;
  location?: CoordinatesTypes;
  metrics_path?: string;
  metrics?: ServiceMetricsType;
  status: ServiceStatus | undefined;
}

export interface CoordinatesTypes {
    region_code?: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

export type ServiceStatus = "active" | "incomplete" | "inactive";

export interface MetricsType {
  collection_interval_seconds?: number;
  metrics?: ServiceMetricsType;
}

interface ServiceMetricsType {
  cpu_percent?: number;
  memory_gb?: number;
  disk_gb?: number;
  network_gb?: number;
  co2e?: number;
  kwh?: number;
}
