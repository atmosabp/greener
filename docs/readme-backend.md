<br>
<div align="center">
<img src="../docs/design/logo-greener.svg" width="120">

<br>

# GreenER - Backend

</div>

<br>

<div align="center">

[Sobre](#sobre) - [Tecnologias](#tecnologias-utilizadas) - [Estrutura](#estrutura-de-arquivos) - [Arquitetura](#arquitetura) - [Variáveis de ambiente](#variáveis-de-ambiente) - [Execução](#instruções-para-execução) - [Endpoints](#endpoints) - [Integrações](#integrações-externas) - [Banco de dados](#banco-de-dados) - [Testes](#testes) - [Pendências](#status-e-pendências)

</div>

<br>

## Sobre

O backend do *GreenER* é o servidor responsável por conectar o frontend, o banco de dados e as APIs externas de métricas e de intensidade de carbono.

Ele coleta as métricas de uso (CPU, memória, disco e rede) de cada serviço monitorado, estima o consumo de energia (kWh) e as emissões equivalentes de carbono (CO₂e), e guarda tudo no histórico do banco de dados para que o frontend possa exibir dashboards, comparações e rankings.

<br>

## Tecnologias utilizadas

| Tecnologia | Uso no backend |
| ---------- | -------------- |
| Node.js 24 (imagem Docker) | Ambiente de execução |
| TypeScript 5 | Linguagem, compilada com `tsc` para a pasta `dist/` |
| Express 5 | Servidor HTTP e rotas |
| PostgreSQL (`pg`) | Banco de dados e conexão por *pool* |
| dotenv | Leitura das variáveis de ambiente |
| Jest + Supertest | Testes de integração das rotas |
| Docker / Docker Compose | Execução do backend, banco e frontend em containers |

<br>

## Estrutura de arquivos

```
backend/
├ src/
│ ├ __test__/                 # Testes de integração (Jest + Supertest)
│ │ ├ index.test.ts
│ │ └ README.md
│ ├ config/
│ │ └ env.ts                  # Carrega o .env e exporta as configurações
│ ├ db/
│ │ └ connections.ts          # Pool de conexões com o PostgreSQL
│ ├ integrations/             # Comunicação com as APIs externas
│ │ ├ carbon-api.ts           # Intensidade de carbono e % de energia renovável
│ │ ├ metrics-api.ts          # Métricas de CPU, memória, disco e rede
│ │ └ services-api.ts         # Lista de serviços, disponibilidade e coordenadas
│ ├ modules/
│ │ ├ collections/            # Histórico de coletas (rotas, controller, service, repository)
│ │ ├ users/                  # Usuários (rotas, controller, service, repository)
│ │ ├ index.ts                # Registro das rotas e tratamento de rota inexistente
│ │ └ metrics-calculator.ts   # Cálculos de kWh e CO₂e
│ ├ types/                    # Interfaces TypeScript das APIs externas
│ ├ app.ts                    # Criação do app Express e rota /health
│ └ server.ts                 # Inicialização do servidor
├ Dockerfile
├ jest.config.js
├ package.json
├ tsconfig.json
└ README.md
```

<br>

## Arquitetura

Cada módulo (`users` e `collections`) segue a mesma divisão em camadas, em que cada arquivo tem uma responsabilidade:

```
requisição → routes → controller → service → repository → PostgreSQL
                                                 ↓
                                  integrations (APIs externas) + metrics-calculator
```

| Camada | Responsabilidade |
| ------ | ---------------- |
| `*.routes.ts` | Define os caminhos e métodos HTTP e liga cada um ao seu controller |
| `*.controller.ts` | Lê o `req.body`, chama o service e devolve o status HTTP e o JSON |
| `*.service.ts` | Regras de negócio, como escolher a lógica conforme o `periodType` |
| `*.repository.ts` | Consultas SQL e transações (`BEGIN`, `COMMIT`, `ROLLBACK`) |
| `integrations/` | Requisições às APIs externas |
| `metrics-calculator.ts` | Classe `MetricsCalculator`, que calcula energia e emissão |

<br>

## Variáveis de ambiente

O backend lê o arquivo `.env` que fica na **raiz do projeto** (e não dentro de `backend/`). Para criá-lo, copie o `.env.example` e preencha os campos:

| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta do backend (se não for definida fora do Docker, o servidor usa `3000`) |
| `FRONT_PORT` | Porta do frontend |
| `ENVIRONMENT` | Ambiente de execução (ex.: `dev`) |
| `POSTGRES_HOST` | Com Docker: `greener-database`. Sem Docker: `localhost` |
| `POSTGRES_PORT` | Porta do PostgreSQL (ex.: `5432`) |
| `POSTGRES_DB` | Nome do banco de dados (de preferência `greener_db`) |
| `POSTGRES_USER` | Usuário do banco (geralmente `postgres`) |
| `POSTGRES_PASSWORD` | Senha do banco, definida pelo time |

> **Nota:** usuário, senha e nome do banco precisam ser os mesmos usados quando o container do banco foi criado pela primeira vez, senão a autenticação falha.

<br>

## Instruções para execução
Caso queira utilizar o backend, há instruções para rodar o projeto com e sem Docker no README do projeto. Você pode acessar ele clicando [aqui](https://github.com/atmosabp/greener#instru%C3%A7%C3%B5es-para-execu%C3%A7%C3%A3o).

<br>

### Scripts disponíveis

| Comando | O que faz |
| ------- | --------- |
| `npm run dev` | Inicia o servidor em modo desenvolvimento, com recarga automática (`tsx watch`) |
| `npm run build` | Compila o TypeScript para a pasta `dist/` |
| `npm start` | Executa a versão compilada (`dist/server.js`) |
| `npm test` | Roda os testes com Jest (precisa do banco de dados rodando) |

<br>

## Endpoints

Todas as requisições e respostas usam JSON. Em caso de erro, os controllers respondem com status `400` e o corpo `{ "message": "..." }`. Rotas que não existem respondem `404` com `{ "message": "Rota inexistente!" }`.

<br>

### Geral

| Método | Rota | Descrição | Resposta |
| ------ | ---- | --------- | -------- |
| GET | `/health` | Verifica se o servidor está no ar (usado pelo `healthcheck` do Docker) | `200` `{ "status": "ok" }` |

<br>

### Usuários

| Método | Rota | Descrição | Resposta |
| ------ | ---- | --------- | -------- |
| POST | `/users` | Cadastra um novo usuário | `201` com o usuário criado |
| GET | `/users/get-users` | Lista todos os usuários | `200` |

**Corpo do `POST /users`:**

```json
{
  "name": "Teste",
  "email": "teste@email.com",
  "password": "123456",
  "isAdm": false
}
```

O campo `email` é único no banco: tentar cadastrar um e-mail repetido retorna erro `400`.

<br>

### Coletas (histórico)

| Método | Rota | Descrição | Resposta |
| ------ | ---- | --------- | -------- |
| GET | `/collections/get-history` | Retorna todo o histórico guardado na tabela `minute_data` | `200` |
| POST | `/collections/add-history` | Busca as métricas atuais de um serviço, calcula kWh e CO₂e e grava no histórico | `200` com o registro criado |
| POST | `/collections/service-data` | Consulta o histórico de um serviço em uma data | `200` |
| POST | `/collections/history-data` | Consulta o histórico de todos os serviços em uma data | `200` |

**Parâmetros enviados no corpo das requisições `POST`:**

| Campo | Tipo | Descrição | Usado em |
| ----- | ---- | --------- | -------- |
| `periodType` | `"minute"` \| `"hour"` \| `"month"` | Granularidade do histórico | todas |
| `datePull` | string de data (ex.: `"2026-10-17"`) | Data da coleta ou da consulta | todas |
| `serviceId` | string (ex.: `"billing-api"`) | Identificador do serviço | `add-history` e `service-data` |



> Os serviços precisam existir na tabela `services` para receberem histórico (o `service_id` é uma chave estrangeira). O `schema.sql` já cadastra os serviços padrão: `billing-api`, `checkout-worker`, `recommendation-ai`, `inventory-sync`, `audit-stream`, `email-dispatcher`, `fraud-detector` e `reporting-batch`.

<br>

## Integrações externas

O backend consome três APIs, cada uma com seu arquivo em `src/integrations/`:

| Arquivo | API | Para que serve |
| ------- | --- | -------------- |
| `metrics-api.ts` | `metrics.unilaunch.org/metrics/:serviceId` | Intervalo de coleta e métricas de CPU, memória, disco e rede do serviço |
| `carbon-api.ts` | `carbon.unilaunch.org/carbon-intensity/br-sudeste` | Intensidade de carbono (gCO₂e/kWh) e porcentagem de energia renovável |
| `services-api.ts` | `metrics.unilaunch.org/services` | Lista de serviços, status de disponibilidade e coordenadas de cada serviço |

O status de cada serviço é calculado em `checkServiceAvailiability`:

- `disponivel`: a API de métricas respondeu com sucesso.
- `incompleto`: a API respondeu, mas faltam métricas ou o intervalo de coleta.
- `indisponivel`: a API não respondeu ou retornou erro.

<br>

## Cálculos

Os cálculos são feitos pela classe `MetricsCalculator` (`src/modules/metrics-calculator.ts`) a cada coleta:

| Cálculo | Fórmula |
| ------- | ------- |
| Potência estimada (W) | CPU + memória + disco + rede |
| Energia (kWh) | Potência (W) × intervalo de coleta (h) / 1000 |
| Emissão (CO₂e) | Energia (kWh) × intensidade de carbono (gCO₂e/kWh) |

O detalhamento de todas as fórmulas está em [`docs/calculos.md`](https://github.com/atmosabp/greener/blob/develop/docs/calculos.md).

<br>

## Banco de dados

O banco é o PostgreSQL, está em [`database/schema.sql`](../database/schema.sql). O backend usa as seguintes tabelas:

| Tabela | Conteúdo |
| ------ | -------- |
| `users` | Usuários da plataforma (`name`, `email`, `password`, `is_adm`) |
| `services` | Serviços monitorados, com `max_emitted` e `min_emitted` |
| `minute_data` | Histórico por minuto: CPU, memória, disco, rede, kWh, CO₂e e % renovável |
| `hour_data` | Histórico por hora (mesma estrutura de `minute_data`) |
| `month_data` | Histórico por mês (mesma estrutura de `minute_data`) |

A conexão é feita pelo `Pool` do `pg` em `src/db/connections.ts`, com os dados vindos das variáveis de ambiente.

<br>

## Testes

Os testes ficam em `src/__test__/` e verificam se as rotas conversam corretamente com o banco de dados. Como usam o banco de verdade, o Docker Compose precisa estar rodando:

```bash
docker compose up --build -d
docker compose exec backend npm install
docker compose exec backend npm test
```

O passo a passo completo está em [`src/__test__/README.md`](src/__test__/README.md).

<br>

## Status e pendências

O que ainda está em desenvolvimento no backend:

- A coleta e a consulta de histórico estão completas apenas para `periodType: "minute"`. Os tipos `hour` e `month` ainda são esboços.
- As consultas por serviço (`/collections/service-data`) ainda precisam ser ajustadas para ler as tabelas de histórico.
- As funções de `services-api.ts` (lista de serviços, disponibilidade e coordenadas) já existem, mas ainda não estão expostas em nenhuma rota.
- Usuários: faltam buscar um usuário por id ou e-mail (`/users/user/:id` ainda é um esboço), editar e deletar.
- Ainda não há login/autenticação. A senha é gravada como foi recebida, sem criptografia (hash).
- Os controllers ainda não validam os dados recebidos no corpo das requisições.

---

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
 