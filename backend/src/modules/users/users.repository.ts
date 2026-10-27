import { error } from "node:console";
import { pool } from "../../db/connections";
import { Client } from "pg";
import { UserEditValues } from "../../types/user-types";

export async function findUsers() {
  const result = await pool.query(`SELECT * FROM users`);

  return result.rows || null;
}

export async function findUserById(id: number) {
  const result = await pool.query(
    `SELECT 
        id,
        name, 
        email, 
        password, 
        is_adm 
        FROM users 
        WHERE id=$1`,
    [id],
  );

  if (result && result.rowCount == 1) {
    return result.rows;
  } else {
    return null;
  }
}

async function insertUser(
  client: any,
  name: string,
  email: string,
  password: string,
  isAdm: boolean,
) {
  const result = await client.query(
    `INSERT INTO users (name, email, password, is_adm)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password, is_adm`,
    [name, email, password, isAdm],
  );

  if (result && result.rowCount == 1) {
    return result.rows[0];
  }
  return result.rows[0] || null;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  isAdm: boolean,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const user = await insertUser(client, name, email, password, isAdm);

    await client.query("COMMIT");
    return user;
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");
    // console.error("Erro no banco: ",error);
    throw new Error(
      error.message ||
        "Ocorreu um erro ao adicionar o usuário. Tente novamente mais tarde.",
    );
  } finally {
    if (client) client.release();
  }
}

export async function updateUser(id: number, newValues: UserEditValues) {
  const fields: string[] = [];
  const values = [];
  let paramIndex = 1;
  
  if (newValues.name) {
    fields.push(`name = $${paramIndex}`);
    values.push(newValues.name);
    paramIndex++;
  }
  if (newValues.email) {
    fields.push(`email = $${paramIndex}`);
    values.push(newValues.email);
    paramIndex++;
  }
  if (newValues.password) {
    fields.push(`password = $${paramIndex}`);
    values.push(newValues.password);
    paramIndex++;
  }
  if (newValues.isAdm != undefined) {
    fields.push(`is_adm = $${paramIndex}`);
    values.push(newValues.isAdm);
    paramIndex++;
  }
  values.push(id);

  if (!fields.length || fields.length === 0) {
    return null;
  }

  const result = await pool.query(
    `UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteUserById(id: number) {
  const result = await pool.query(
    `DELETE FROM users
      WHERE id = $1
      RETURNING id`,
    [id],
  );

  return result.rows[0] || null;
}

//função necessária para os testes Jest
export async function deleteUserByEmail(email: string): Promise<boolean> {
  const user = await pool.query(`SELECT id FROM users WHERE email=$1`, [email]);

  if ((await user.rows.length) == 0) return false;

  const userId = user.rows[0].id;

  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

  return true;
}
