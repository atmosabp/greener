import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { connection } from "../config/env";

let config;
config = {
  host: connection.database.host,
  user: connection.database.user,
  password: connection.database.password,
  database: connection.database.database,
  port: connection.database.port ? Number(connection.database.port) : undefined
};

export const pool = new Pool(config);

// Contrato de acesso ao banco recebido pelos repositórios por injeção de dependência.
// O Pool do "pg" já atende a esse contrato.
export interface Database {
  query<T extends QueryResultRow = any>(
    sql: string,
    values?: unknown[],
  ): Promise<QueryResult<T>>;
  // Necessário para as transações (BEGIN / COMMIT / ROLLBACK).
  connect(): Promise<PoolClient>;
}