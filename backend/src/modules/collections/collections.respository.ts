import { pool } from "../../db/connections";
import { MetricsCalculator } from "../metrics-calculator";
import {
  reqInterval,
  reqMetricsCPU,
  reqMetricsDisk,
  reqMetricsMemory,
  reqMetricsNetwork,
} from "../../integrations/metrics-api";
import { reqCarbonValue, reqRenewablePercent } from "../../integrations/carbon-api";

export async function addMinuteHistory(datePull: any, serviceId: string) {
  const client = await pool.connect();

  const collectionIntervalSeconds = (await reqInterval(serviceId)) || 2;
  const carbonIntensity = (await reqCarbonValue(serviceId)) || 5;
  const renewablePercent = (await reqRenewablePercent(serviceId)) || 5;
  const cpu = (await reqMetricsCPU(serviceId)) || 91.1;
  const memory = (await reqMetricsMemory(serviceId)) || 9;
  const disk = (await reqMetricsDisk(serviceId)) || 2.3;
  const network = (await reqMetricsNetwork(serviceId)) || 5;

  const metricsCalculator = new MetricsCalculator({
    collection_interval_seconds: collectionIntervalSeconds,
    metrics: {
      cpu_percent: cpu,
      memory_gb: memory,
      disk_gb: disk,
      network_gb: network,
    },
    carbon_intensity_gco2e_per_kwh: carbonIntensity,
    renewable_share_percent: renewablePercent,
  });

  const metrics = { cpu, memory, disk, network, renewablePercent };

  const kwh = metricsCalculator.calculateKWh();
  const co2e = metricsCalculator.calculateCO2e();

  try {
    await client.query("BEGIN");
    const result = await insertMinuteHistory(
      client,
      datePull,
      serviceId,
      metrics,
      kwh,
      co2e,
    );

    await client.query("COMMIT");
    return result;
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");
    throw new Error(error.message || "Não foi possível registrar o histórico.");
  } finally{
    client.release();
  }
}

async function insertMinuteHistory(
  client: any,
  datePull: any,
  serviceId: string,
  metrics: any,
  kwh: number,
  co2e: number,
) {
  const result = await client.query(
    `INSERT INTO minute_data (date_pull, service_id, cpu_percentage, disk_gb, memory_gb, network_gb, kwh, co2e, renewable_percent)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, date_pull, service_id, cpu_percentage, disk_gb, memory_gb, network_gb, kwh, co2e, renewable_percent`,
    [
      datePull,
      serviceId,
      Number(metrics.cpu),
      Number(metrics.disk),
      Number(metrics.memory),
      Number(metrics.network),
      kwh,
      co2e,
      Number(metrics.renewablePercent),
    ],
  );

  return result.rows[0] || null;
}

export async function addHourHistory(datePull: any) {
  const result = await pool.query(`SELECT FROM hour_data WHERE date_pull = ?`, [
    datePull,
  ]);
  return result.rows[0] || null;
}

async function insertHourHistory(datePull: any) {
  const result = await pool.query(`SELECT FROM hour_data WHERE date_pull = ?`, [
    datePull,
  ]);
  return result.rows[0] || null;
}

export async function addMonthHistory(datePull: any) {
  const result = await pool.query(
    `SELECT FROM month_data WHERE date_pull = ?`,
    [datePull],
  );
  return result.rows[0] || null;
}

async function insertMonthHistory(datePull: any) {
  const result = await pool.query(
    `SELECT FROM month_data WHERE date_pull = ?`,
    [datePull],
  );
  return result.rows[0] || null;
}

export async function findHistory() {
  const result = await pool.query(
    `SELECT * FROM minute_data`
  );

  return result.rows || [];
}

export async function findMonthHistory(datePull: any) {
  const result = await pool.query(
    `SELECT * FROM month_data WHERE date_pull = ?`,
    [datePull],
  );
  return result.rows[0] || null;
}

export async function findServiceMonthHistory(
  datePull: any,
  serviceId: string,
) {
  const result = await pool.query(
    `SELECT * FROM services WHERE service_id = ? and date_pull = ?`,
    [serviceId, datePull],
  );
  return result.rows[0] || null;
}

export async function findHourHistory(datePull: any) {
  const result = await pool.query(
    `SELECT * FROM hour_data WHERE date_pull = ?`,
    [datePull],
  );
  return result.rows[0] || null;
}

export async function findServiceHourHistory(datePull: any, serviceId: string) {
  const result = await pool.query(
    `SELECT * FROM services WHERE service_id = ? and date_pull = ?`,
    [serviceId, datePull],
  );
  return result.rows[0] || null;
}

export async function findMinuteHistory(datePull: number) {
  const result = await pool.query(
    `SELECT * FROM minute_data WHERE date_pull = ?`,
    [datePull],
  );
  return result.rows[0] || null;
}

export async function findServiceMinuteHistory(
  datePull: number,
  serviceId: string,
) {
  const result = await pool.query(
    `SELECT * FROM services WHERE service_id = ? and date_pull = ?`,
    [serviceId, datePull],
  );
  return result.rows[0] || null;
}
