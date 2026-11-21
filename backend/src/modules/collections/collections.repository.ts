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
  addHourHistory(datePull: any): Promise<any>;
  addMonthHistory(datePull: any): Promise<any>;
  findHistory(): Promise<any[]>;
  findServices(): Promise<ServiceRow[]>;
  findMonthHistory(datePull: Date): Promise<any>;
  findServiceMonthHistory(datePull: any, serviceId: string): Promise<any>;
  findDayHistory(datePull: Date): Promise<any>;
  findServiceDayHistory(datePull: Date, serviceId: string): Promise<any>;
  findHourHistory(datePull: Date): Promise<any>;
  findMinuteHistory(datePull: Date): Promise<any>;
  findServiceHourHistory(datePull: Date, serviceId: string): Promise<any>;
  findServiceMinuteHistory(datePull: number, serviceId: string): Promise<any>;
}

export class PgCollectionsRepository implements CollectionsRepository {
  constructor(private readonly db: Database) {}

  // As métricas e os cálculos (kwh e co2e) agora chegam prontos do service.
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
      throw new Error(error.message || "Não foi possível registrar o histórico.");
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

  private async insertService(serviceId: string, name: string, client: PoolClient) {
    const result = await client.query(
      `INSERT INTO services (id,name,max_emited,min_emited) VALUES
      ($1,$2,0, 99999)
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

  // Funções que ainda serão feitas ==========

  async addHourHistory(datePull: any) {
    const result = await this.db.query(
      `SELECT FROM hour_data WHERE date_pull = $1`,
      [datePull],
    );
    return result.rows[0] || null;
  }

  private async insertHourHistory(datePull: any) {
    const result = await this.db.query(
      `SELECT FROM hour_data WHERE date_pull = $1`,
      [datePull],
    );
    return result.rows[0] || null;
  }

  async addMonthHistory(datePull: any) {
    const result = await this.db.query(
      `SELECT FROM month_data WHERE date_pull = $1`,
      [datePull],
    );
    return result.rows[0] || null;
  }

  private async insertMonthHistory(datePull: any) {
    const result = await this.db.query(
      `SELECT FROM month_data WHERE date_pull = $1`,
      [datePull],
    );
    return result.rows[0] || null;
  }

  // ==========================================

  async findHistory() {
    const result = await this.db.query(
      `SELECT * FROM hour_data where service_id = 'billing-api'`,
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
    var result;
    if (differenceInMonths(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM month_data WHERE date_pull between $1 and $1 :: timestamp + interval '1 month'`,
        [datePull],
      );
    }
    return result.rows[0] || null;
  }

  async findServiceMonthHistory(datePull: any, serviceId: string) {
    var result;
    if (differenceInMonths(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM month_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '1 month' limit 1`,
        [serviceId, datePull],
      );
    }
    return result.rows[0] || null;
  }

  async findDayHistory(datePull: Date) {
    //preciso de um if que detecta de o date pull é um mes antes do atual
    var result;
    if (differenceInDays(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM day_data WHERE date_pull between $1 and $1 :: timestamp + interval '1 day'`,
        [datePull],
      );
    }
    return result.rows[0] || null;
  }

  async findServiceDayHistory(datePull: Date, serviceId: string) {
    var result;
    if (differenceInDays(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM day_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '1 day' limit 1`,
        [serviceId, datePull],
      );
    }
    return result.rows[0] || null;
  }

  async findHourHistory(datePull: Date) {
    var result;
    if (differenceInHours(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM hour_data WHERE date_pull between $1 and $1 :: timestamp + interval '59 minutes'`,
        [datePull],
      );
    }
    return result.rows[0] || null;
  }

  async findMinuteHistory(datePull: Date) {
    var result;
    if (differenceInHours(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM hour_data WHERE date_pull between $1 and $1 :: timestamp + interval '59 minutes'`,
        [datePull],
      );
    }
    return result.rows[0] || null;
  }

  async findServiceHourHistory(datePull: Date, serviceId: string) {
    var result;
    if (differenceInHours(Date(), datePull) < 2) {
      result = await this.db.query(
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
      result = await this.db.query(
        `SELECT * FROM hour_data WHERE service_id = $1 and date_pull between $2 and $2 :: timestamp + interval '59 minutes' limit 1`,
        [serviceId, datePull],
      );
    }

    return result.rows[0] || null;
  }

  async findServiceMinuteHistory(datePull: number, serviceId: string) {
    const result = await this.db.query(
      `SELECT * FROM services WHERE service_id = $1 and date_pull = $2`,
      [serviceId, datePull],
    );
    return result.rows[0] || null;
  }
}