import request from "supertest";
import { app } from "../app";
import { pool } from "../db/connections";

// ============= Testes para Users ================

import { deleteUserByEmail } from "../modules/users/users.repository"; 

afterAll(async () => {
    await deleteUserByEmail("jesttest@test.com");
    await pool.end();
});

describe("cadastro de usuário", () => {
    beforeEach(async () => {
        await deleteUserByEmail("jesttest@test.com");
    });
    it("retorna status 201 caso o cadastro seja feito", async () => {
        const response = await request(app).post("/users").send({
            name: "Jest Test", email: "jesttest@test.com", password: "123456", isAdm: false
        });
        expect(response.statusCode).toEqual(201);
    });
});

describe("consulta todos os usuários", () => {
    it("retorna status 200 caso a consulta seja feita", async () => {
        const response = await request(app).get("/users/get-users").send();
        expect(response.statusCode).toEqual(200);
    });
});

// TODO: teste de consultar usuário específico

// TODO: teste de editar usuário

// TODO: teste de deletar usuário


// ============= Testes para Collections (Métricas) ================

// TODO: teste de ver métrica atual de serviço específico

// TODO: teste de listar disponibilidade dos serviços 

// TODO: teste de adicionar histórico atual de serviço específico

// TODO: teste de ver histórico de serviço específico

// TODO: teste de ver todo o histórico de uma tabela
