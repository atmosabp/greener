import { pool } from "../../db/connections";
import { MetricsCalculator } from "../metrics-calculator";
import { reqInterval, reqMetrics } from "../../integrations/metrics-api";
import {
  reqCarbonValue,
  reqRenewablePercent,
} from "../../integrations/carbon-api";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
} from "date-fns";

export async function addMinuteHistory(serviceId: string) {
  const client = await pool.connect();

  const [
    collectionIntervalSeconds,
    carbonIntensity,
    renewablePercent,
    metricsEnergy,
  ] = await Promise.all([
    reqInterval(serviceId),
    reqCarbonValue(serviceId),
    reqRenewablePercent(serviceId),
    reqMetrics(serviceId),
  ]);

  const metricsCalculator = new MetricsCalculator({
    collection_interval_seconds: collectionIntervalSeconds,
    metrics: {
      cpu_percent: metricsEnergy?.cpu_percent,
      memory_gb: metricsEnergy?.memory_gb,
      disk_gb: metricsEnergy?.disk_gb,
      network_gb: metricsEnergy?.network_gb,
    },
    carbon_intensity_gco2e_per_kwh: carbonIntensity,
    renewable_share_percent: renewablePercent,
  });

  const kwh = metricsCalculator.calculateKWh();
  const co2e = metricsCalculator.calculateCO2e();

  try {
    await client.query("BEGIN");
    const result = await insertMinuteHistory(
      client,
      serviceId,
      metricsEnergy,
      renewablePercent,
      kwh,
      co2e,
    );

    await client.query("COMMIT");
    return result;
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");

    throw new Error(error.message || "Não foi possível registrar o histórico.");
  } finally {
    await client.release();
  }
}

export async function addNewService(serviceId: string, name: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await insertService(serviceId, name, client);

    await client.query("COMMIT");
    return result;
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");
    throw new Error(
      error.message || "Não foi possível registrar o novo serviço.",
    );
  } finally {
    await client.release();
  }
}

async function insertService(serviceId: string, name: string, client: any) {
  const result = await client.query(
    `INSERT INTO services (id,name,max_emited,min_emited) VALUES
      ($1,$2,0, 99999)
    RETURNING id,name`,
    [serviceId, name],
  );
  return result.rows[0] || null;
}

async function insertMinuteHistory(
  client: any,
  serviceId: string,
  metrics: any,
  renewable_percent: number | undefined,
  kwh: number | null,
  co2e: number | null,
) {
  const result = await client.query(
    `INSERT INTO minute_data ( service_id, cpu_percentage, disk_gb, memory_gb, network_gb, kwh, co2e, renewable_percent)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      serviceId,
      Number(metrics.cpu_percent) ? Number(metrics.cpu_percent) : null,
      Number(metrics.disk_gb) ? Number(metrics.disk_gb) : null,
      Number(metrics.memory_gb) ? Number(metrics.memory_gb) : null,
      Number(metrics.network_gb) ? Number(metrics.network_gb) : null,
      kwh ? kwh : null,
      co2e ? co2e : null,
      Number(renewable_percent) ? Number(renewable_percent) : null,
    ],
  );
  return result.rows[0] || null;
}

export async function findHistory() {
  const result = await pool.query(
    `SELECT * FROM minute_data where service_id = 'billing-api'`,
  );

  return result.rows || [];
}

export async function findServices() {
  const result = await pool.query(`SELECT id, name FROM services`);

  return result.rows || [];
}

export async function findMonthHistory(datePull: Date) {
  //preciso de um if que detecta de o date pull é um mes antes do atual
  var result = await pool.query(
    `SELECT name,
        service_id as id,
        AVG(co2e) as co2e,
        AVG(kwh) as kwh,
        AVG(cpu_percentage) as cpu_percentage,
        AVG(memory_gb) as memory_gb,
        AVG(disk_gb) as disk_gb,
        AVG(network_gb) as network_gb,
        AVG(renewable_percent) as renewable_percent
        FROM month_data
        inner join services as s on service_id = s.id
        WHERE date_pull between $1 :: timestamptz - interval '27 days' and $1 :: timestamptz + interval '1 month'
        group by name, service_id`,
    [datePull],
  );
  
  return result.rows || null;
}

export async function findServiceMonthHistory(
  datePull: any,
  serviceId: string,
) {
  var result = await pool.query(
    `SELECT 
        name,
        service_id as id,
        AVG(co2e) as co2e,
        AVG(kwh) as kwh,
        AVG(cpu_percentage) as cpu_percentage,
        AVG(memory_gb) as memory_gb,
        AVG(disk_gb) as disk_gb,
        AVG(network_gb) as network_gb,
        AVG(renewable_percent) as renewable_percent
      FROM month_data 
      inner join services as s on service_id = s.id
      WHERE service_id = $1 and date_pull between $2 :: timestamptz - interval '27 days' and $2 :: timestamptz + interval '1 month' 
      group by name, service_id
      limit 1`,
    [serviceId, datePull],
  );
  
  return result.rows[0] || null;
}

export async function findDayHistory(datePull: Date) {
  var result = await pool.query(
    `SELECT name,
        service_id as id,
        AVG(co2e) as co2e,
        AVG(kwh) as kwh,
        AVG(cpu_percentage) as cpu_percentage,
        AVG(memory_gb) as memory_gb,
        AVG(disk_gb) as disk_gb,
        AVG(network_gb) as network_gb,
        AVG(renewable_percent) as renewable_percent
        FROM day_data 
        inner join services as s on service_id = s.id
        WHERE date_pull between $1 :: timestamptz - interval '23 hours' and $1 :: timestamptz + interval '1 day'
        group by name, service_id`,
    [datePull],
  );
  
  return result.rows || null;
}

export async function findServiceDayHistory(datePull: Date, serviceId: string) {
  var result = await pool.query(
    `SELECT name,
        service_id as id,
        AVG(co2e) as co2e,
        AVG(kwh) as kwh,
        AVG(cpu_percentage) as cpu_percentage,
        AVG(memory_gb) as memory_gb,
        AVG(disk_gb) as disk_gb,
        AVG(network_gb) as network_gb,
        AVG(renewable_percent) as renewable_percent
        FROM day_data 
        inner join services as s on service_id = s.id
        WHERE service_id = $1 and date_pull between $2 :: timestamptz - interval '23 hours' and $2 :: timestamptz + interval '1 day' 
        group by name, service_id
        limit 1`,
    [serviceId, datePull],
  );

  return result.rows || null;
}

export async function findHourHistory(datePull: Date) {
  var result = await pool.query(
    `SELECT 
        name,
        service_id as id,
        AVG(co2e) as co2e,
        AVG(kwh) as kwh,
        AVG(cpu_percentage) as cpu_percentage,
        AVG(memory_gb) as memory_gb,
        AVG(disk_gb) as disk_gb,
        AVG(network_gb) as network_gb,
        AVG(renewable_percent) as renewable_percent 
        FROM hour_data 
        inner join services as s on service_id = s.id
        WHERE date_pull between $1 :: timestamptz - interval '59 minutes' and $1 :: timestamptz + interval '59 minutes' 
        group by name, service_id`,
    [datePull],
  );
  
  return result.rows || null;
}

export async function findServiceHourHistory(
  datePull: Date,
  serviceId: string,
) {
  var result = await pool.query(
    `SELECT 
        name,
        service_id as id,
        AVG(co2e) as co2e,
        AVG(kwh) as kwh,
        AVG(cpu_percentage) as cpu_percentage,
        AVG(memory_gb) as memory_gb,
        AVG(disk_gb) as disk_gb,
        AVG(network_gb) as network_gb,
        AVG(renewable_percent) as renewable_percent
        FROM hour_data h
        inner join services as s on service_id = s.id
        WHERE service_id = $1 and date_pull between $2 :: timestamptz - interval '59 minutes' and $2 :: timestamptz + interval '59 minutes' 
        group by name, service_id
        limit 1`,
    [serviceId, datePull],
  );

  return result.rows[0] || null;
}

export async function findMinuteHistory(datePull: Date) {
  var result;

  result = await pool.query(
    `SELECT 
        name,
        service_id as id,
        date_pull,
        co2e as co2e,
        kwh as kwh,
        cpu_percentage as cpu_percentage,
        memory_gb as memory_gb,
        disk_gb as disk_gb,
        network_gb as network_gb,
        renewable_percent as renewable_percent
        FROM minute_data 
        inner join services as s on service_id = s.id
        WHERE date_pull between $1 :: timestamptz - interval '58 seconds' and $1 :: timestamptz + interval '59 seconds'
        group by name, service_id, co2e, kwh, cpu_percentage, memory_gb, disk_gb, network_gb, renewable_percent, date_pull
        `,
    [datePull],
  );

  return result.rows || null;
}

export async function findServiceMinuteHistory(
  datePull: Date,
  serviceId: string,
) {
  //busca o horário exato buscado (já que o histórico é guardado pontualmente)
  const result = await pool.query(
    `SELECT
        s.name,
        m.service_id AS id,
        m.date_pull,
        m.co2e,
        m.kwh,
        m.cpu_percentage,
        m.memory_gb,
        m.disk_gb,
        m.network_gb,
        m.renewable_percent
        FROM minute_data m
        INNER JOIN services s ON m.service_id = s.id
        WHERE m.service_id = $1
          AND m.date_pull BETWEEN $2::timestamptz - interval '30 seconds'
          AND $2::timestamptz + interval '30 seconds'
        ORDER BY ABS(EXTRACT(EPOCH FROM (m.date_pull - $2::timestamptz))) ASC
        LIMIT 1`,
      [serviceId, datePull],
  );
  return result.rows[0] || null;
}
