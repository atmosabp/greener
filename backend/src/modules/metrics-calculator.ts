import { PassThrough } from "node:stream";

export interface MetricsProps {
  collection_interval_seconds?: number;
  metrics?: {
    cpu_percent?: number;
    memory_gb?: number;
    disk_gb?: number;
    network_gb?: number;
  };
  carbon_intensity_gco2e_per_kwh?: number;
  renewable_share_percent?: number;
}

export class MetricsCalculator {
  private KWh: number | undefined = undefined;
  private W: number | undefined = undefined;
  private CO2e: number | undefined = undefined;
  private metrics: MetricsProps;

  constructor(metrics: MetricsProps);
  constructor(metrics: MetricsProps, KWh?: number, CO2e?: number)
  constructor(metrics: MetricsProps, KWh?: number, CO2e?: number) {
    this.metrics = metrics;
    if (KWh && CO2e) {
      this.CO2e = CO2e;
      this.KWh = KWh;
    }
  }

  calculateKWh(): number | null{
    if (this.KWh) return this.KWh;
    let result = null
    if (
      this.metrics.metrics?.cpu_percent ||
      this.metrics.metrics?.memory_gb ||
      this.metrics.metrics?.disk_gb ||
      this.metrics.metrics?.network_gb
    ) {
        this.W =
        this.metrics.metrics?.cpu_percent! +
        this.metrics.metrics?.memory_gb! +
        this.metrics.metrics?.disk_gb! +
        this.metrics.metrics?.network_gb!;

      this.KWh =
        (this.W * (this.metrics.collection_interval_seconds! / 3600)) / 1000;

      return this.KWh
    }
    

    return result;
  }

  calculateCO2e() {
    if (this.CO2e) {
      return this.CO2e;
    }
    let result = null
    let Kwhconf: number | null= this.KWh ?? this.calculateKWh();

    if (Kwhconf || this.metrics.carbon_intensity_gco2e_per_kwh) {
      this.CO2e = Kwhconf! * this.metrics.carbon_intensity_gco2e_per_kwh!;
      result = this.CO2e
    }
    return result;
  }

  calculateIntensity() {
    let result = null
    if (this.CO2e || this.KWh) {
      result = this.CO2e! / this.KWh!
    }
    return result;
  }

  calculateTotalEmission(tempo_horas: number) {
    let result = null
    if (this.CO2e) {
      result = this.CO2e * tempo_horas
    }
    return result;
  }

  calculateTotalUsage(tempo_horas: number) {
    let result = null
    if (this.KWh) {
      result = this.KWh * tempo_horas;
    }
    return result
  }

  calculateInterval() {
    if (this.metrics.collection_interval_seconds) {
      return this.metrics.collection_interval_seconds;
    }
    let result = null
    let Kwhconf: number | null = this.KWh ?? this.calculateKWh();
    if (this.KWh || this.W) {
      this.W =
        this.metrics.metrics?.cpu_percent! +
        this.metrics.metrics?.memory_gb! +
        this.metrics.metrics?.disk_gb! +
        this.metrics.metrics?.network_gb!;

      this.metrics.collection_interval_seconds = (this.KWh! * this.W) / 1000;
      result = this.metrics.collection_interval_seconds;
    }  
    return result
  }

  getRenewablePercent() {
    let result = null;
    if (this.metrics.renewable_share_percent) {
      result = this.metrics.renewable_share_percent;
    }
    return result
  }

  getMetrics() {
    let result = null;
    if (this.KWh && this.CO2e){
      result = {metrics: this.metrics, KWh: this.KWh, CO2e: this.CO2e}
    }
    return result;
  }
}
