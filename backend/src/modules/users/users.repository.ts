import { pool } from "../../db/connections";

async function insertUser(client: any, name: string, email: string, password: string){
    const result = await client.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password`,
        [name, email, password]
    );

    if(result && result.rowCount == 1){
        return result.rows[0];
    }
    return result.rows[0] || null;
}

export async function createUser(name: string, email: string, password: string){
    const client = await pool.connect();

    try{
        await client.query("BEGIN");
        const user = await insertUser(client, name, email, password);

        await client.query("COMMIT");
        return user;
    } catch(error: any){
        if (client) await client.query("ROLLBACK");
        // console.error("Erro no banco: ",error);
        throw new Error(error.message || "Ocorreu um erro ao adicionar o usuário. Tente novamente mais tarde.");
    } 
    finally{
        if (client) client.release();
    }
}