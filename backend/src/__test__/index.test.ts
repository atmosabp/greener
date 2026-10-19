import request from "supertest";
import { app } from "../app";
import { pool } from "../db/connections";


//=======================================================Testes para Users=============================================================
import { deleteUserByEmail } from "../modules/users/users.repository"; 

afterAll(async () => {
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
        //para o teste dar certo, é preciso que a resposta tenha status 201
        //caso contrário, o teste falha
        expect(response.statusCode).toEqual(201);
    });
});

describe("consulta todos os usuários", () => {
    it("retorna status 200 caso a consulta seja feita", async () => {
        const response = await request(app).get("/users/get-users").send();
        expect(response.statusCode).toEqual(200);
    });
});

