import { pool } from "../../db/connections";

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