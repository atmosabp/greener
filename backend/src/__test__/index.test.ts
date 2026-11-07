import request from "supertest";
import { app } from "../app";
import { pool } from "../db/connections";

// ============= Testes para Users ================

import { deleteUserByEmail } from "../modules/users/users.repository"; 
import { validateServiceMetrics } from "../modules/collections/metrics-validator";
import { ServiceTypes } from "../types/services-types";
import { compareServiceLists } from "../modules/collections/service-list-diff";

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

//TODO: teste de validação de métricas de serviço específico
describe("validateServiceMetrics", () => {
  it("retorna o ID do serviço e aceita métricas iguais a zero", () => {
    const result = validateServiceMetrics("service-123", {
      collection_interval_seconds: 60,
      metrics: {
        cpu_percent: 0,
        memory_gb: 0,
        disk_gb: 0,
        network_gb: 0,
      },
    });

    expect(result).toEqual({
      serviceId: "service-123",
      isComplete: true,
      missingMetrics: [],
      invalidMetrics: [],
    });
  });

  it("identifica o serviço quando faltam métricas", () => {
    const result = validateServiceMetrics("service-456", {
      collection_interval_seconds: 60,
      metrics: { cpu_percent: 0 },
    });

    expect(result.serviceId).toBe("service-456");
    expect(result.isComplete).toBe(false);
    expect(result.missingMetrics).toEqual([
      "memory_gb",
      "disk_gb",
      "network_gb",
    ]);
  });
});

// Cria um serviço padrão para evitar repetir a mesma estrutura nos testes.
function makeService(
  id: string, // Identificador usado para relacionar o serviço entre as listas.
  overrides: Partial<Omit<ServiceTypes, "id">> = {}, // Permite substituir ou acrescentar campos específicos do teste.
): ServiceTypes {
  return {
    id, // Define o ID que a função de comparação usa como chave.
    name: `Serviço ${id}`, // Nome padrão; pode ser substituído em overrides.
    metrics_path: `/metrics/${id}`, // Caminho padrão das métricas do serviço.
    status: "active", // Estado padrão para satisfazer o tipo ServiceTypes.
    ...overrides, // Aplica os campos personalizados por último, substituindo os padrões.
  };
}

//TODO: teste de alterações na lista de serviços
describe("comparação de listas de serviços", () => {
  // Testa que a ordem dos serviços não causa alterações quando os dados são iguais.
  it("retorna listas vazias caso não haja alterações", () => {
    const first = makeService("service-1");
    const second = makeService("service-2");

    // Compara as mesmas referências em ordem diferente.
    const result = compareServiceLists([first, second], [second, first]);

    // Nenhum serviço deve ser adicionado, removido ou atualizado.
    expect(result).toEqual({ added: [], removed: [], updated: [] });
  });

  // Testa as três classificações: serviço novo, removido e atualizado.
  it("identifica serviços adicionados, removidos e alterados", () => {
    // Estado anterior do serviço que será atualizado.
    const previous = makeService("service-1", {
      name: "Nome anterior",
      metrics_path: "/metrics/old",
      location: { country: "Brasil", city: "São Paulo" },
    });
    // Serviço mantido sem mudanças nas duas listas.
    const unchanged = makeService("service-2");
    // Serviço que aparece somente na lista anterior.
    const removed = makeService("service-3");
    // Estado atual do serviço: nome, caminho e localização foram alterados.
    const current = makeService("service-1", {
      name: "Nome atual",
      metrics_path: "/metrics/new",
      location: { country: "Brasil", city: "Rio de Janeiro" },
    });
    // Serviço que aparece somente na lista atual.
    const added = makeService("service-4");

    // Passa os estados anterior e atual para comparação.
    const result = compareServiceLists(
      [previous, unchanged, removed],
      [current, unchanged, added],
    );

    // Confirma que cada serviço foi classificado corretamente e que os três campos alterados foram registrados.
    expect(result.added).toEqual([added]);
    expect(result.removed).toEqual([removed]);
    expect(result.updated).toEqual([
      {
        id: "service-1",
        previous,
        current,
        changedFields: ["name", "metrics_path", "location"],
      },
    ]);
  });

  // Testa que ausência de localização e objeto de localização vazio são tratados como equivalentes.
  it("não considera localização vazia uma alteração", () => {
    const previous = makeService("service-1");
    const current = makeService("service-1", { location: {} });

    const result = compareServiceLists([previous], [current]);

    // Como os demais dados são iguais, nenhuma atualização deve ser relatada.
    expect(result.updated).toEqual([]);
  });

  // Testa a validação que impede comparar serviços sem identificador.
  it("retorna erro caso um serviço não tenha ID", () => {
    const serviceWithoutId = { name: "Sem ID", status: "active" } as ServiceTypes;

    // A comparação deve falhar com a mensagem definida para esse caso.
    expect(() => compareServiceLists([serviceWithoutId], [])).toThrow(
      "Serviço encontrado sem ID.",
    );
  });

  // Testa a validação que impede IDs repetidos na mesma lista.
  it("retorna erro caso existam IDs duplicados", () => {
    const first = makeService("duplicate");
    const second = makeService("duplicate", {
      name: "Outro serviço duplicado",
    });

    // A criação do mapa deve interromper a comparação e informar o ID duplicado.
    expect(() => compareServiceLists([first, second], [])).toThrow(
      "ID de serviço duplicado: duplicate",
    );
  });
});