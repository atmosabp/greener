import request from "supertest";
import { app } from "../app";
import { pool } from "../db/connections";
import { connection, admin } from "../config/env";

import { deleteUserByEmail } from "../modules/users/users.repository";

let token: string = "";
let userId: number = 0;
const serviceList = [
  "billing-api",
  "checkout-worker",
  "recommendation-ai",
  "inventory-sync",
  "audit-stream",
  "email-dispatcher",
  "fraud-detector",
  "reporting-batch",
];

// ============= Testes para Users e Auth ================

afterAll(async () => {
  await deleteUserByEmail("jesttest@test.com");
  await pool.end();
});

describe("login de usuário", () => {
  beforeEach(async () => {
    await deleteUserByEmail("jesttest@test.com");
  });
  it("retorna status 200 caso o login seja feito", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: admin.email ? admin.email.trim() : "",
        password: admin.password ? admin.password.trim() : "",
      });

    token = response.body.token;

    expect(response.statusCode).toEqual(200);
  });
});

describe("cadastro de usuário", () => {
  beforeEach(async () => {
    await deleteUserByEmail("jesttest@test.com");
  });
  it("retorna status 201 caso o cadastro seja feito", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jest Test",
        email: "jesttest@test.com",
        password: "123456",
        isAdm: false,
      });

      userId = response.body.id;

    expect(response.statusCode).toEqual(201);
  });
});

describe("consulta todos os usuários", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .get("/users/get-users")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.statusCode).toEqual(200);
  });
});

describe("consulta um usuário específico", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.statusCode).toEqual(200);
  });
});

describe("editar dados de um usuário", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jest Test1",
        password: "1234568",
      });
    expect(response.statusCode).toEqual(200);
  });
});

describe("deletar um usuário", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.statusCode).toEqual(200);
  });
});

// ============= Testes para Collections (Métricas) ================

describe("consulta todos os serviços", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .get("/collections/all-service-data")
      .send();

    expect(response.statusCode).toEqual(200);
  });
});

describe("consulta métricas de um serviço", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .get(`/collections/service-metrics/${serviceList[Math.floor(Math.random() * (serviceList.length-1))]}`)
      .send();

    expect(response.statusCode).toEqual(200);
  });
});

describe("adiciona métricas atuais de um serviço no histórico", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app)
      .post("/collections/add-history")
      .send({ serviceId: serviceList[Math.floor(Math.random() * (serviceList.length-1))] });

    expect(response.statusCode).toEqual(200);
  });
});

describe("consulta todo o histórico (teste para worker)", () => {
  it("retorna status 200 caso a consulta seja feita", async () => {
    const response = await request(app).get("/collections/get-history").send();
    expect(response.statusCode).toEqual(200);
  });
});
