import type { Database } from "../../db/connections";
import type { PoolClient } from "pg";
import type { UserEditValues, User, UserWithPassword } from "../../types/user-types";

export interface UsersRepository {
  findUsers(): Promise<User[]>;
  findUserById(id: number): Promise<User[] | null>;
  findUserByEmail(email: string): Promise<UserWithPassword | null>;
  createUser(
    name: string,
    email: string,
    password: string,
    isAdm: boolean,
  ): Promise<User>;
  updateUser(id: number, newValues: UserEditValues): Promise<User | null>;
  deleteUserById(id: number): Promise<{ id: number } | null>;
  deleteUserByEmail(email: string): Promise<boolean>;
}

export class PgUsersRepository implements UsersRepository {
  constructor(private readonly db: Database) {}

  async findUsers() {
    const result = await this.db.query<User>(`
        SELECT
            id,
            name,
            email,
            is_adm
        FROM users
    `);

    return result.rows || null;
  }

  async findUserById(id: number) {
    const result = await this.db.query<User>(
      `SELECT
            id,
            name,
            email,
            is_adm
        FROM users
        WHERE id = $1`,
      [id],
    );

    if (result && result.rowCount === 1) {
      return result.rows;
    }

    return null;
  }

  async findUserByEmail(email: string) {
    const result = await this.db.query<UserWithPassword>(
      `SELECT id, name, email, password, is_adm
        FROM users
        WHERE email = $1`,
      [email],
    );

    return result.rows[0] || null;
  }

  private async insertUser(
    client: PoolClient,
    name: string,
    email: string,
    password: string,
    isAdm: boolean,
  ) {
    const result = await client.query<User>(
      `INSERT INTO users (name, email, password, is_adm)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, is_adm`,
      [name, email, password, isAdm],
    );

    if (result && result.rowCount == 1) {
      return result.rows[0];
    }
    return result.rows[0] || null;
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    isAdm: boolean,
  ) {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");
      const user = await this.insertUser(client, name, email, password, isAdm);

      await client.query("COMMIT");
      return user;
    } catch (error: any) {
      if (client) await client.query("ROLLBACK");

      // mantém o código do postgres (ex: 23505 = email duplicado) para o controller tratar
      if (error.code) throw error;

      throw new Error(
        error.message ||
          "Ocorreu um erro ao adicionar o usuário. Tente novamente mais tarde.",
      );
    } finally {
      if (client) client.release();
    }
  }

  async updateUser(id: number, newValues: UserEditValues) {
    const fields: string[] = [];
    const values: unknown[] = [];
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

    const result = await this.db.query<User>(
      `UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING id, name, email, is_adm`,
      values,
    );

    return result.rows[0] || null;
  }

  async deleteUserById(id: number) {
    const result = await this.db.query<{ id: number }>(
      `DELETE FROM users
      WHERE id = $1
      RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }

  //função necessária para os testes Jest
  async deleteUserByEmail(email: string): Promise<boolean> {
    const user = await this.db.query(`SELECT id FROM users WHERE email=$1`, [
      email,
    ]);

    if (user.rows.length == 0) return false;

    const userId = user.rows[0].id;

    await this.db.query(`DELETE FROM users WHERE id=$1`, [userId]);

    return true;
  }
}