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

  calculateKWh(): number {
    if (this.KWh) return this.KWh;
    if (
      !this.metrics.metrics?.cpu_percent ||
      !this.metrics.metrics?.memory_gb ||
      !this.metrics.metrics?.disk_gb ||
      !this.metrics.metrics?.network_gb
    ) {
      throw new Error("Métricas insuficientes para cálculo do KWh.");
    }
    this.W =
      this.metrics.metrics?.cpu_percent! +
      this.metrics.metrics?.memory_gb! +
      this.metrics.metrics?.disk_gb! +
      this.metrics.metrics?.network_gb!;

    this.KWh =
      (this.W * (this.metrics.collection_interval_seconds! / 3600)) / 1000;

    return this.KWh;
  }

  calculateCO2e() {
    if (this.CO2e) {
      return this.CO2e;
    }
    let Kwhconf: number = this.KWh ?? this.calculateKWh();

    if (!Kwhconf || !this.metrics.carbon_intensity_gco2e_per_kwh) {
      throw new Error("Métricas insuficientes para cálculo do CO2e.");
    }

    this.CO2e = Kwhconf * this.metrics.carbon_intensity_gco2e_per_kwh!;

    return this.CO2e;
  }

  calculateIntensity() {
    if (!this.CO2e || !this.KWh) {
      throw new Error("Métricas insuficientes para cálculo.");
    }
    return this.CO2e / this.KWh;
  }

  calculateTotalEmission(tempo_horas: number) {
    if (!this.CO2e) {
      throw new Error("Métricas insuficientes para cálculo.");
    }
    return this.CO2e * tempo_horas;
  }

  calculateTotalUsage(tempo_horas: number) {
    if (!this.KWh) {
      throw new Error("Métricas insuficientes para cálculo.");
    }
    return this.KWh * tempo_horas;
  }

  calculateInterval() {
    if (this.metrics.collection_interval_seconds) {
      return this.metrics.collection_interval_seconds;
    }
    let Kwhconf: number = this.KWh ?? this.calculateKWh();
    if (!this.KWh || !this.W) {
      throw new Error("Métricas insuficientes para cálculo.");
    }

    this.W =
      this.metrics.metrics?.cpu_percent! +
      this.metrics.metrics?.memory_gb! +
      this.metrics.metrics?.disk_gb! +
      this.metrics.metrics?.network_gb!;

    this.metrics.collection_interval_seconds = (this.KWh * this.W) / 1000;

    return this.metrics.collection_interval_seconds;
  }

  getRenewablePercent() {
    if (!this.metrics.renewable_share_percent) {
      throw new Error("Métricas insuficientes para cálculo.");
    }
    return this.metrics.renewable_share_percent;
  }

  getMetrics() {
    let result = null;
    if (this.KWh && this.CO2e){
      result = {metrics: this.metrics, KWh: this.KWh, CO2e: this.CO2e}
    }
    return result;
  }
}
