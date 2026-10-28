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
import {differenceInDays, differenceInHours, differenceInMonths } from 'date-fns';

export async function addMinuteHistory(datePull: any, serviceId: string) {
  const client = await pool.connect();

  const collectionIntervalSeconds = (await reqInterval(serviceId));
  const carbonIntensity = (await reqCarbonValue(serviceId));
  const renewablePercent = (await reqRenewablePercent(serviceId));
  const cpu = (await reqMetricsCPU(serviceId));
  const memory = (await reqMetricsMemory(serviceId));
  const disk = (await reqMetricsDisk(serviceId));
  const network = (await reqMetricsNetwork(serviceId));

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
    await client.release();
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

// TODO: fazer as seguintes funções para a tarefa TP15 -> Persistir métricas coletadas no banco de dados ==========
// Usar como base a função acima para desenvolver as outras

// ==========================================

export async function findHistory() {
  const result = await pool.query(
    `SELECT * FROM minute_data UNION hour_data UNION month_data`
  );

  return result.rows || [];
}

export async function findServices() {
  const result = await pool.query(
    `SELECT id FROM services`
  );

  return result.rows || [];
}

export async function findMonthHistory(datePull: any) {
  //preciso de um if que detecta de o date pull é um mes antes do atual
  var result 
    if(differenceInMonths(Date(), datePull) < 2){
      result = await pool.query(
        `select 
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from day_data 
          where date_pull <= date_trunc('month',current_timestamp)`,
      );
    }else{
      result = await pool.query(
        `SELECT * FROM month_data WHERE date_pull between $1 and $1 :: timestamp + interval '1 month'`,
        [datePull],
      );
    }
  return result.rows[0] || null;
}

export async function findServiceMonthHistory(
  datePull: any,
  serviceId: string,
) {
  var result 
    if(differenceInMonths(Date(), datePull) < 2){
      result = await pool.query(
        `select 
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from day_data 
          where service_id = $1
          and date_pull <= date_trunc('month',current_timestamp)`,
        [serviceId],
      );
    }else{
      const result = await pool.query(
        `SELECT * FROM month_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '1 month' limit 1`,
        [serviceId, datePull],
      );
    }
  return result.rows[0] || null;
}

export async function findDayHistory(datePull: any) {
  //preciso de um if que detecta de o date pull é um mes antes do atual
  var result 
    if(differenceInDays(Date(), datePull) < 2){
      result = await pool.query(
        `select 
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from hour_data 
          where date_pull <= date_trunc('day',current_timestamp)`,
      );
    }else{
      result = await pool.query(
        `SELECT * FROM day_data WHERE date_pull between $1 and $1 :: timestamp + interval '1 day'`,
        [datePull],
      );
    }
  return result.rows[0] || null;
}

export async function findServiceDayHistory(
  datePull: any,
  serviceId: string,
) {
  var result 
    if(differenceInDays(Date(), datePull) < 2){
      result = await pool.query(
        `select 
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from hour_data 
          where service_id = $1
          and date_pull <= date_trunc('day',current_timestamp)`,
        [serviceId],
      );
    }else{
      const result = await pool.query(
        `SELECT * FROM day_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '1 day' limit 1`,
        [serviceId, datePull],
      );
    }
  return result.rows[0] || null;
}

export async function findHourHistory(datePull: any) {
  var result 
    if(differenceInHours(Date(), datePull) < 2){
      result = await pool.query(
        `select 
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from minute_data 
          where date_pull <= date_trunc('hour',current_timestamp)`,
      );
    }else{
      const result = await pool.query(
        `SELECT * FROM hour_data WHERE date_pull between $1 and $1 :: timestamp + interval '59 minutes'`,
        [datePull],
      );
    }
  return result.rows[0] || null;
}

export async function findServiceHourHistory(datePull: any, serviceId: string) {
  var result 
    if(differenceInHours(Date(), datePull) < 2){
      result = await pool.query(
        `select 
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from minute_data 
          where service_id = $1
          and date_pull <= date_trunc('hour',current_timestamp)`,
        [serviceId],
      );
    }else{
      const result = await pool.query(
        `SELECT * FROM hour_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '59 minutes' limit 1`,
        [serviceId, datePull],);
      }
  
  return result.rows[0] || null;
}

export async function findMinuteHistory(datePull: number) {
  const result = await pool.query(
    `SELECT * FROM minute_data WHERE date_pull between $1 and $1 :: timestamp + interval '59 seconds' limit 1`,
    [datePull],
  );
  return result.rows[0] || null;
}

export async function findServiceMinuteHistory(
  datePull: number,
  serviceId: string,
) {
  const result = await pool.query(
    `SELECT * FROM minute_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '59 seconds'`,
    [serviceId, datePull],
  );
  return result.rows[0] || null;
}

async function teste(){
  const response = await findHourHistory(new Date(2026,10,27,21))
  console.log(await response)
}
teste()