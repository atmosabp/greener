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

export async function findHistory(){
    const result = await pool.query(
        `SELECT 
            md.id AS minute_id,
            md.service_id AS minute_service_id,
            md.date_pull AS minute_date,
            md.cpu_percentage,
            md.disk_gb,
            md.memory_gb,
            md.network_gb,

            hd.id AS hour_id,
            hd.service_id AS hour_service_id,
            hd.date_pull AS hour_date,
            hd.kwh AS hour_kwh,
            hd.co2e AS hour_co2e,
            
            mod.id AS month_id,
            mod.service_id AS month_service_id,
            mod.date_pull AS month_date,
            mod.kwh AS month_kwh,
            mod.co2e AS month_co2e
        FROM minute_data md
        FULL OUTER JOIN hour_data hd ON md.service_id = hd.service_id
        FULL OUTER JOIN month_data mod ON COALESCE(md.service_id, hd.service_id) = mod.service_id`
    );
    
    return result.rows || [];
};

export async function findMonthHistory(datePull: any){
    const result = await pool.query(
        `SELECT * FROM month_data WHERE date_pull = ?`, 
        [datePull]
    );
    return result.rows[0] || null;
};

export async function findServiceMonthHistory(datePull: any, serviceId: string){
    const result = await pool.query(
        `SELECT * FROM services WHERE service_id = ? and date_pull = ?`, 
        [serviceId, datePull]
    );
    return result.rows[0] || null;
};

export async function findHourHistory(datePull: any){
    const result = await pool.query(
        `SELECT * FROM hour_data WHERE date_pull = ?`, [datePull]
    );
    return result.rows[0] || null;
};

export async function findServiceHourHistory(datePull: any, serviceId: string){
    const result = await pool.query(
        `SELECT * FROM services WHERE service_id = ? and date_pull = ?`, 
        [serviceId, datePull]
    );
    return result.rows[0] || null;
};

export async function findMinuteHistory(datePull: number){
    const result = await pool.query(
        `SELECT * FROM minute_data WHERE date_pull = ?`, 
        [datePull]
    );
    return result.rows[0] || null;
};

export async function findServiceMinuteHistory(datePull: number, serviceId: string){
    const result = await pool.query(
        `SELECT * FROM services WHERE service_id = ? and date_pull = ?`, 
        [serviceId, datePull]
    );
    return result.rows[0] || null;
};
