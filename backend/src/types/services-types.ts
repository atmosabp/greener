export interface ServiceTypes {
  id?: string;
  name?: string;
  location?: CoordinatesTypes;
  metrics_path?: string;
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

export type ServiceStatus = "disponivel" | "indisponivel" | "incompleto";

export interface MetricsType {
  collection_interval_seconds?: number;
  metrics?: {
    cpu_percent?: number;
    memory_gb?: number;
    disk_gb?: number;
    network_gb?: number;
  };
}
