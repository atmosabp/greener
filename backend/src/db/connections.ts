import { Pool } from "pg";
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
