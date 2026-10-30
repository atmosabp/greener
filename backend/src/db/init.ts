
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcrypt";
import { pool } from "./connections";
import { admin } from "../config/env";

async function initializeDatabase() {
    try {
        console.log("Inicializando banco de dados...");

        const sqlPath = path.resolve(
            __dirname,
            "../../../database/schema.sql"
        );

        const sql = fs.readFileSync(sqlPath, "utf-8");

        await pool.query(sql);

        const name = admin.name;
        const email = admin.email;
        const password = admin.password;

        if (!name || !email || !password) {
            throw new Error(
                "As configurações do administrador estão incompletas no .env."
            );
        }

        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingAdmin.rowCount === 0) {
            const passwordHash = await bcrypt.hash(password, 12);

            await pool.query(
                `INSERT INTO users (name, email, password, is_adm)
                VALUES ($1, $2, $3, TRUE)`,
                [name, email, passwordHash]
            );

            console.log("Administrador criado com sucesso!");
        } else {
            console.log("Administrador já cadastrado.");
        }

        console.log("Banco de dados inicializado com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar banco:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

initializeDatabase();
