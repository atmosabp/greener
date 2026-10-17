import { pool } from "../../db/connections";

export async function findUsers(){
    const result = await pool.query(`SELECT * FROM users`);

    console.log(result)

    return result.rows || null;
}

async function insertUser(client: any, name: string, email: string, password: string, isAdm: boolean){
    const result = await client.query(
        `INSERT INTO users (name, email, password, is_adm)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password, is_adm`,
        [name, email, password, isAdm]
    );

    if(result && result.rowCount == 1){
        return result.rows[0];
    }
    return result.rows[0] || null;
}

export async function createUser(name: string, email: string, password: string, isAdm: boolean){
    const client = await pool.connect();

    try{
        await client.query("BEGIN");
        const user = await insertUser(client, name, email, password, isAdm);

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