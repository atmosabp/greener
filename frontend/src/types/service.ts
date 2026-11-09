export interface CoordinatesType {
  region_code?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface MetricsType {
  cpu_percent: number;
  memory_gb: number;
  disk_gb: number;
  network_gb: number;
  co2e: number;
  kwh: number;
  renewable_percent?: number;
  carbon_intensity?: number;
}
