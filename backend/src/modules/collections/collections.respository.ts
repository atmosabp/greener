import { pool } from "../../db/connections";
import { MetricsData } from "../../types/metrics-types";

export async function addMinuteHistory(datePull: any, serviceId: string, metrics: MetricsData){
    //TODO: add cálculos de co2e e kwh aqui após adicionar calculadora métricas

    const result = await pool.query(
        `INSERT INTO minute_data (date_pull, service_id, cpu_percentage, disk_gb, memory_gb, network_gb)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING id, date_pull, service_id, cpu_percentage, disk_gb, memory_gb, network_gb`, 
        [datePull, serviceId, metrics.cpu_percent, metrics.disk_gb, metrics.memory_gb, metrics.network_gb]
    );
    return result.rows[0] || null;
};

export async function addHourHistory(datePull: any){
    const result = await pool.query(
        `SELECT FROM month_data WHERE date_pull = ?`, 
        [datePull]
    );
    return result.rows[0] || null;
};

export async function addMonthHistory(datePull: any){
    const result = await pool.query(
        `SELECT FROM month_data WHERE date_pull = ?`, 
        [datePull]
    );
    return result.rows[0] || null;
};

export async function findMonthHistory(datePull: any){
    const result = await pool.query(
        `SELECT FROM month_data WHERE date_pull = ?`, 
        [datePull]
    );
    return result.rows[0] || null;
};

export async function findServiceMonthHistory(datePull: any, serviceId: string){
    const result = await pool.query(
        `SELECT FROM services WHERE service_id = ? and date_pull = ?`, 
        [serviceId, datePull]
    );
    return result.rows[0] || null;
};

export async function findHourHistory(datePull: any){
    const result = await pool.query(
        `SELECT FROM hour_data WHERE date_pull = ?`, [datePull]
    );
    return result.rows[0] || null;
};

export async function findServiceHourHistory(datePull: any, serviceId: string){
    const result = await pool.query(
        `SELECT FROM services WHERE service_id = ? and date_pull = ?`, 
        [serviceId, datePull]
    );
    return result.rows[0] || null;
};

export async function findMinuteHistory(datePull: number){
    const result = await pool.query(
        `SELECT FROM minute_data WHERE date_pull = ?`, 
        [datePull]
    );
    return result.rows[0] || null;
};

export async function findServiceMinuteHistory(datePull: number, serviceId: string){
    const result = await pool.query(
        `SELECT FROM services WHERE service_id = ? and date_pull = ?`, 
        [serviceId, datePull]
    );
    return result.rows[0] || null;
};
