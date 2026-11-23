import type { Database } from "../../db/connections";
import type { PoolClient } from "pg";
import type { MetricsData } from "../../types/metrics-types";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
} from "date-fns";

export interface ServiceRow {
  id: string;
  name: string;
}

export interface CollectionsRepository {
  addMinuteHistory(
    serviceId: string,
    metrics: MetricsData,
    renewablePercent: number | undefined,
    kwh: number | null,
    co2e: number | null,
  ): Promise<any>;
  addNewService(serviceId: string, name: string): Promise<any>;
  findHistory(): Promise<any[]>;
  findServices(): Promise<ServiceRow[]>;
  findMonthHistory(datePull: Date | string): Promise<any>;
  findServiceMonthHistory(
    datePull: Date | string,
    serviceId: string,
  ): Promise<any>;
  findDayHistory(datePull: Date | string): Promise<any>;
  findServiceDayHistory(
    datePull: Date | string,
    serviceId: string,
  ): Promise<any>;
  findHourHistory(datePull: Date | string): Promise<any>;
  findMinuteHistory(datePull: Date | string): Promise<any>;
  findServiceHourHistory(
    datePull: Date | string,
    serviceId: string,
  ): Promise<any>;
  findServiceMinuteHistory(
    datePull: Date | string,
    serviceId: string,
  ): Promise<any>;
}

export class PgCollectionsRepository implements CollectionsRepository {
  constructor(private readonly db: Database) {}

  async addMinuteHistory(
    serviceId: string,
    metrics: MetricsData,
    renewablePercent: number | undefined,
    kwh: number | null,
    co2e: number | null,
  ) {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");
      const result = await this.insertMinuteHistory(
        client,
        serviceId,
        metrics,
        renewablePercent,
        kwh,
        co2e,
      );

      await client.query("COMMIT");
      return result;
    } catch (error: any) {
      if (client) await client.query("ROLLBACK");
      console.error(error.message || "Não foi possível registrar o histórico.");
    } finally {
      client.release();
    }
  }

  async addNewService(serviceId: string, name: string) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const result = await this.insertService(serviceId, name, client);

      await client.query("COMMIT");
      return result;
    } catch (error: any) {
      if (client) await client.query("ROLLBACK");
      throw new Error(
        error.message || "Não foi possível registrar o novo serviço.",
      );
    } finally {
      client.release();
    }
  }

  private async insertService(
    serviceId: string,
    name: string,
    client: PoolClient,
  ) {
    const result = await client.query(
      `INSERT INTO services (id,name,max_emited,min_emited) VALUES
        ($1,$2,0,99999)
      RETURNING id,name`,
      [serviceId, name],
    );
    return result.rows[0] || null;
  }

  private async insertMinuteHistory(
    client: PoolClient,
    serviceId: string,
    metrics: MetricsData,
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

  //função
  async findHistory() {
    const result = await this.db.query(
      `SELECT * FROM minute_data where service_id = 'billing-api'`,
    );

    return result.rows || [];
  }

  async findServices() {
    const result = await this.db.query<ServiceRow>(
      `SELECT id, name FROM services`,
    );
    return result.rows || [];
  }

  async findMonthHistory(datePull: Date) {
    //preciso de um if que detecta de o date pull é um mes antes do atual
    var result = await this.db.query(
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

  async findServiceMonthHistory(datePull: Date | string, serviceId: string) {
    var result = await this.db.query(
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

  async findDayHistory(datePull: Date | string) {
    var result = await this.db.query(
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

  async findServiceDayHistory(datePull: Date | string, serviceId: string) {
    var result = await this.db.query(
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

  async findHourHistory(datePull: Date | string) {
    let result;
    
    if (differenceInHours(Date(), datePull) < 2) {
      result = await this.db.query(
        `select 
          name,
          service_id as id,
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from minute_data 
          inner join services as s on service_id = s.id
          where date_pull <= date_trunc('hour',current_timestamp)
          group by name, service_id`
      );
    } else {
      result = await this.db.query(
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
    }

    return result.rows || null;
  }

  async findServiceHourHistory(datePull: Date | string, serviceId: string) {
    let result;
    if(differenceInHours(Date(), datePull) < 2){
      result = await this.db.query(
        `select 
          name,
          service_id as id,
          AVG(co2e) as co2e,
          AVG(kwh) as kwh,
          AVG(cpu_percentage) as cpu_percentage,
          AVG(memory_gb) as memory_gb,
          AVG(disk_gb) as disk_gb,
          AVG(network_gb) as network_gb,
          AVG(renewable_percent) as renewable_percent
          from minute_data 
          inner join services as s on service_id = s.id
          where service_id = $1
          and date_pull <= date_trunc('hour',current_timestamp)
          group by name, service_id`,
        [serviceId],
      );
    } else {
      result = await this.db.query(
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
    }

    return result.rows[0] || null;
  }

  async findMinuteHistory(datePull: Date | string) {
    var result = await this.db.query(
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

  async findServiceMinuteHistory(datePull: Date | string, serviceId: string) {
    const result = await this.db.query(
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
}
