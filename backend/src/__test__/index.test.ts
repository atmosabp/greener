import request from "supertest";
import { app } from "../app";
import { pool } from "../db/connections";

import { deleteUserByEmail } from "../modules/users/users.repository"; 

afterAll(async () => {
    await pool.end();
});

describe("cadastro de usuário", () => {
    beforeEach(async () => {
        await deleteUserByEmail("jesttest@test.com");
    });
    it("retorna status 201 caso cadastro seja feito", async () => {
        const response = await request(app).post("/users").send({
            name: "Jest Test", email: "jesttest@test.com", password: "123456", isAdm: false
        });
        //para o teste dar certo, é preciso que a resposta tenha status 201
        //caso contrário, o teste falha
        expect(response.statusCode).toEqual(201);
    });
});