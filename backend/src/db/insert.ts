import { admin } from "../config/env";
import bcrypt from "bcrypt";
import { pool } from "./connections";

async function insertAdmin(): Promise<void> {
    try {
        // Recupera os dados do administrador das variáveis de ambiente
        const name = admin.name;
        const email = admin.email;
        const password = admin.password;

        // Verifica se todas as variáveis foram configuradas
        if (!name || !email || !password) {
            throw new Error(
                "As variáveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD precisam estar configuradas."
            );
        }

        // Verifica se o administrador já está cadastrado
        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingAdmin.rowCount && existingAdmin.rowCount > 0) {
            console.log("Usuário administrador já cadastrado.");
            return;
        }

        // Gera o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o administrador no banco
        await pool.query(
            `INSERT INTO users (name, email, password, is_adm)
            VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, true]
        );

        console.log("Usuário administrador cadastrado com sucesso.");

    } catch (error) {
        console.error("Erro ao cadastrar usuário administrador:", error);
        process.exitCode = 1;
    }
}

export async function runInsert(): Promise<void> {
    await insertAdmin();
}
