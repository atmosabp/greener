import { pool } from "../../db/connections";
import { MetricsCalculator } from "../metrics-calculator";
import {
  reqInterval,
  reqMetrics,
} from "../../integrations/metrics-api";
import {
  reqCarbonValue,
  reqRenewablePercent,
} from "../../integrations/carbon-api";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
} from "date-fns";

export async function addMinuteHistory( serviceId: string) {
  const client = await pool.connect();

  const collectionIntervalSeconds = await reqInterval(serviceId);
  const carbonIntensity = await reqCarbonValue(serviceId);
  const renewablePercent = await reqRenewablePercent(serviceId);
  const metricsEnergy = await reqMetrics(serviceId);

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
      kwh,
      co2e,
    );

    await client.query("COMMIT");
    return result;
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");
    console.log(error)
    throw new Error(error.message || "Não foi possível registrar o histórico.");
    
  } finally {
    await client.release();
  }
}

export async function addNewService(serviceId:string,name:string){
  const client = await pool.connect();
     try {
    await client.query("BEGIN");
    const result = await insertService(
      serviceId,
      name,
      client
    );

    await client.query("COMMIT");
    return result;
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");
    throw new Error(error.message || "Não foi possível registrar o novo serviço.");
  } finally{
    await client.release();
  }
}

async function insertService(serviceId:string,name:string, client:any){
  const result = await client.query(
      `INSERT INTO services (id,name,max_emited,min_emited) VALUES
      ($1,$2,0, 99999)
    RETURNING id,name`,
    [serviceId,
      name
    ]
  );
  return result.rows[0] || null;

}

async function insertMinuteHistory(
  client: any,
  serviceId: string,
  metrics: any,
  kwh: number | null,
  co2e: number | null,
) {
  const result = await client.query(
    `INSERT INTO minute_data ( service_id, cpu_percentage, disk_gb, memory_gb, network_gb, kwh, co2e, renewable_percent)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, date_pull, service_id, cpu_percentage, disk_gb, memory_gb, network_gb, kwh, co2e, renewable_percent`,
    [
      serviceId  ,
      (Number(metrics.cpu_percent)) ? Number(metrics.cpu_percent) : null,
      (Number(metrics.disk_gb)) ?  Number(metrics.disk_gb) : null,
      (Number(metrics.memory_gb)) ? Number(metrics.memory_gb) : null,
      (Number(metrics.network_gb)) ? Number(metrics.network_gb) : null,
      (kwh) ? kwh : null,
      (co2e) ? co2e : null,
      (Number(metrics.renewablePercent)) ? Number(metrics.renewablePercent) : null,
    ],
  );
  return result.rows[0] || null;
}

// Funções que ainda serão feitas ==========

export async function addHourHistory(datePull: any) {
  const result = await pool.query(
    `SELECT FROM hour_data WHERE date_pull = $1`,
    [datePull],
  );
  return result.rows[0] || null;
}

async function insertHourHistory(datePull: any) {
  const result = await pool.query(
    `SELECT FROM hour_data WHERE date_pull = $1`,
    [datePull],
  );
  return result.rows[0] || null;
}

export async function addMonthHistory(datePull: any) {
  const result = await pool.query(
    `SELECT FROM month_data WHERE date_pull = $1`,
    [datePull],
  );
  return result.rows[0] || null;
}

async function insertMonthHistory(datePull: any) {
  const result = await pool.query(
    `SELECT FROM month_data WHERE date_pull = $1`,
    [datePull],
  );
  return result.rows[0] || null;
}

// ==========================================

export async function findHistory() {
  const result = await pool.query(
    `SELECT * FROM minute_data`,
  );

  return result.rows || [];
}

export async function findServices() {
  const result = await pool.query(`SELECT id, name FROM services`);

  return result.rows || [];
}

export async function findMonthHistory(datePull: Date) {
  //preciso de um if que detecta de o date pull é um mes antes do atual
  var result;
  if (differenceInMonths(Date(), datePull) < 2) {
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
  } else {
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
  var result;
  if (differenceInMonths(Date(), datePull) < 2) {
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
  } else {
    result = await pool.query(
      `SELECT * FROM month_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '1 month' limit 1`,
      [serviceId, datePull],
    );
  }
  return result.rows[0] || null;
}

export async function findDayHistory(datePull: Date) {
  //preciso de um if que detecta de o date pull é um mes antes do atual
  var result;
  if (differenceInDays(Date(), datePull) < 2) {
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
  } else {
    result = await pool.query(
      `SELECT * FROM day_data WHERE date_pull between $1 and $1 :: timestamp + interval '1 day'`,
      [datePull],
    );
  }
  return result.rows[0] || null;
}

export async function findServiceDayHistory(datePull: Date, serviceId: string) {
  var result;
  if (differenceInDays(Date(), datePull) < 2) {
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
  } else {
    result = await pool.query(
      `SELECT * FROM day_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '1 day' limit 1`,
      [serviceId, datePull],
    );
  }
  return result.rows[0] || null;
}

export async function findHourHistory(datePull: Date) {
  var result;
  if (differenceInHours(Date(), datePull) < 2) {
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
  } else {
    result = await pool.query(
      `SELECT * FROM hour_data WHERE date_pull between $1 and $1 :: timestamp + interval '59 minutes'`,
      [datePull],
    );
  }
  return result.rows[0] || null;
}

export async function findMinuteHistory(datePull: Date) {
  var result;
  if (differenceInHours(Date(), datePull) < 2) {
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
  } else {
    result = await pool.query(
      `SELECT * FROM hour_data WHERE date_pull between $1 and $1 :: timestamp + interval '59 minutes'`,
      [datePull],
    );
  }
  return result.rows[0] || null;
}

export async function findServiceHourHistory(
  datePull: Date,
  serviceId: string,
) {
  var result;
  if (differenceInHours(Date(), datePull) < 2) {
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
  } else {
    result = await pool.query(
      `SELECT * FROM hour_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '59 minutes' limit 1`,
      [serviceId, datePull],
    );
  }

  return result.rows[0] || null;
}

// export async function findMinuteHistory(datePull: Date) {
//   const result = await pool.query(
//     `SELECT * FROM services WHERE service_id = $1 and date_pull = $2`,
//     [serviceId, datePull],
//   );
//   return result.rows[0] || null;
// }

export async function findServiceMinuteHistory(
  datePull: number,
  serviceId: string,
) {
  const result = await pool.query(
    `SELECT * FROM services WHERE service_id = $1 and date_pull = $2`,
    [serviceId, datePull],
  );
  return result.rows[0] || null;
}
