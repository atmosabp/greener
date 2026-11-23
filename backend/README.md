<br>
<div align="center">
<img src="../docs/design/logo-greener.svg" width="120">

<br>

# GreenER - Backend

</div>

<br>

<div align="center">

[Sobre](#sobre) - [Tecnologias](#tecnologias-utilizadas) - [Estrutura](#estrutura-de-arquivos) - [Arquitetura](#arquitetura) - [Autenticação](#autenticação-e-permissões) - [Variáveis de ambiente](#variáveis-de-ambiente) - [Execução](#instruções-para-execução) - [Endpoints](#endpoints) - [Integrações](#integrações-externas) - [Worker](#worker-de-histórico) - [Cálculos](#cálculos) - [Banco de dados](#banco-de-dados) - [Testes](#testes) - [Pendências](#status-e-pendências)

</div>

<br>

## Sobre

O backend do *GreenER* é o servidor responsável por conectar o frontend, o banco de dados e as APIs externas de métricas e de intensidade de carbono.

Ele coleta as métricas de uso (CPU, memória, disco e rede) de cada serviço monitorado, estima o consumo de energia (kWh) e as emissões equivalentes de carbono (CO₂e), e guarda tudo no histórico do banco de dados para que o frontend possa exibir dashboards, comparações e rankings.

Além disso, ele cuida da **autenticação** (login com token JWT) e do **gerenciamento de usuários**, que só pode ser feito por administradores.

<br>

## Tecnologias utilizadas

| Tecnologia | Uso no backend |
| ---------- | -------------- |
| Node.js 24 (imagem Docker) | Ambiente de execução |
| TypeScript 5 | Linguagem, compilada com `tsc` para a pasta `dist/` |
| Express 5 | Servidor HTTP e rotas |
| PostgreSQL | Banco de dados e conexão por *pool* |
| bcrypt | Criptografia (*hash*) das senhas dos usuários |
| jsonwebtoken | Criação e verificação dos tokens de login (JWT) |
| cors | Controle de quais origens podem acessar o servidor |
| date-fns | Cálculo de diferença entre datas nas consultas de histórico |
| dotenv | Leitura das variáveis de ambiente |
| tsx | Execução do TypeScript em desenvolvimento, com recarga automática |
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
│ │ └ env.ts                  # Carrega o .env e exporta as configurações (banco e administrador)
│ ├ db/
│ │ ├ connections.ts          # Pool de conexões com o PostgreSQL
│ │ ├ init.ts                 # Script que cria as tabelas (schema.sql) e o administrador
│ │ └ insert.ts               # Cadastra o administrador quando o servidor inicia
│ ├ integrations/             # Comunicação com as APIs externas
│ │ ├ carbon-api.ts           # Intensidade de carbono e % de energia renovável
│ │ ├ metrics-api.ts          # Métricas de CPU, memória, disco e rede
│ │ └ services-api.ts         # Lista de serviços, disponibilidade e coordenadas
│ ├ middlewares/
│ │ └ middleware.ts           # authenticateToken e requireAdmin
│ ├ modules/
│ │ ├ auth/                   # Login e verificação de sessão (rotas, controller, service)
│ │ ├ collections/            # Métricas e histórico de coletas (rotas, controller, service, repository)
│ │ ├ users/                  # Usuários (rotas, controller, service, repository)
│ │ ├ index.ts                # Registro das rotas e tratamento de rota inexistente
│ │ └ metrics-calculator.ts   # Classe MetricsCalculator (kWh, CO₂e, intensidade...)
│ ├ types/                    # Interfaces TypeScript das APIs externas e dos usuários
│ ├ worker/
│ │ └ worker.ts               # Coleta automática do histórico a cada minuto
│ ├ app.ts                    # Criação do app Express, CORS e rota /health
│ └ server.ts                 # Inicialização do servidor, do administrador e do worker
├ Dockerfile
├ jest.config.js
├ package.json
├ tsconfig.json
└ README.md
```

<br>

## Arquitetura

Cada módulo (`auth`, `users` e `collections`) segue a mesma divisão em camadas, em que cada arquivo tem uma responsabilidade:

```
requisição → routes → controller → service → repository → PostgreSQL
                                                 ↓
                        integrations (APIs externas) + metrics-calculator
```

<br>

| Camada | Responsabilidade |
| ------ | ---------------- |
| `*.routes.ts` | Define os caminhos e métodos HTTP, liga cada um ao seu controller e aplica os middlewares de proteção |
| `*.controller.ts` | Valida o que chegou em `req.body` e `req.params`, chama o service e devolve o status HTTP e o JSON |
| `*.service.ts` | Regras de negócio, como gerar o hash da senha, montar o token ou escolher a lógica conforme o `periodType` |
| `*.repository.ts` | Consultas SQL e transações (`BEGIN`, `COMMIT`, `ROLLBACK`) |
| `integrations/` | Requisições às APIs externas |
| `middlewares/` | Funções executadas antes do controller (autenticação e permissão) |
| `metrics-calculator.ts` | Classe `MetricsCalculator`, que calcula energia e emissão |

<br>

### Ordem de registro das rotas

O arquivo `src/modules/index.ts` registra os módulos nos seguintes prefixos. Qualquer outro caminho cai no tratamento final e responde `404`.

| Prefixo | Módulo | Proteção |
| ------- | ------ | -------- |
| `/health` | `app.ts` | Pública |
| `/auth` | `auth` | `/auth/login` é pública; `/auth/me` exige token |
| `/users` | `users` | Exige token **e** perfil de administrador (todas as rotas) |
| `/collections` | `collections` | Sem proteção no momento (veja [Pendências](#status-e-pendências)) |

<br>

### CORS

No arquivo `src/app.ts`, o servidor só aceita requisições vindas de `http://localhost:5173` e `http://localhost:8080` (as portas padrão do frontend), além de requisições sem origem (como as do terminal, `curl` e Supertest). Qualquer outra origem recebe o erro `Caminho bloqueado pelo CORS.`. Caso o frontend rode em outra porta, ela precisa ser adicionada na lista `allowedOrigins`.

<br>

## Autenticação e permissões

O login gera um token **JWT** válido por **8 horas**, assinado com a variável `JWT_SECRET`. O payload do token contém `id`, `name` e `isAdm`.

O fluxo é o seguinte:

1. O frontend envia `email` e `password` para `POST /auth/login`.
2. O `auth.service.ts` busca o usuário pelo e-mail e compara a senha com o hash salvo (`bcrypt.compare`).
3. Se estiver correto, o servidor devolve o `token` e os dados do usuário.
4. Nas rotas protegidas, o frontend envia o cabeçalho `Authorization: Bearer <token>`.

Os dois middlewares ficam em `src/middlewares/middleware.ts`.

| Middleware | O que faz | Respostas de erro |
| ---------- | --------- | ----------------- |
| `authenticateToken` | Confere se o cabeçalho `Authorization` existe e se o token é válido. Guarda os dados do usuário em `res.locals.authUser` | `401` (token ausente, inválido ou expirado) e `500` (`JWT_SECRET` não configurado) |
| `requireAdmin` | Roda depois do `authenticateToken` e libera apenas usuários com `isAdm = true` | `403` (usuário não é administrador) |

As senhas **nunca** são guardadas em texto puro: tanto o cadastro (`users.service.ts`) quanto a criação do administrador usam `bcrypt`.

<br>

## Variáveis de ambiente

O backend lê o arquivo `.env` que fica na **raiz do projeto** (e não dentro de `backend/`). Para criá-lo, copie o `.env.example` e preencha os campos:

| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta do backend |
| `VITE_PORT` | Mesmo valor de `PORT`, para o frontend saber em qual porta chamar o backend |
| `FRONT_PORT` | Porta do frontend |
| `PGPORT` | Porta do PostgreSQL (geralmente igual a `POSTGRES_PORT`) |
| `ENVIRONMENT` | Ambiente de execução (ex.: `dev`) |
| `POSTGRES_HOST` | Com Docker: `greener-database`. Sem Docker: `localhost` |
| `POSTGRES_PORT` | Porta do PostgreSQL (ex.: `5432`) |
| `POSTGRES_DB` | Nome do banco de dados (de preferência `greener_db`) |
| `POSTGRES_USER` | Usuário do banco (geralmente `postgres`) |
| `POSTGRES_PASSWORD` | Senha do banco, definida pelo time |
| `JWT_SECRET` | Chave secreta usada para assinar e verificar os tokens de login |
| `ADMIN_NAME` | Nome do administrador criado na inicialização |
| `ADMIN_EMAIL` | E-mail do administrador inicial (usado também para fazer login) |
| `ADMIN_PASSWORD` | Senha do administrador inicial |

**Nota:** usuário, senha e nome do banco precisam ser os mesmos usados quando o container do banco foi criado pela primeira vez, senão a autenticação falha.


<br>

## Instruções para execução
Caso queira utilizar o backend, há instruções para rodar o projeto com e sem Docker no README do projeto. Você pode acessar ele clicando [aqui](https://github.com/atmosabp/greener#instru%C3%A7%C3%B5es-para-execu%C3%A7%C3%A3o).


### Scripts disponíveis

| Comando | O que faz |
| ------- | --------- |
| `npm run dev` | Inicia o servidor em modo desenvolvimento, com recarga automática (`tsx watch`) |
| `npm run build` | Compila o TypeScript para a pasta `dist/` |
| `npm start` | Executa a versão compilada (`dist/server.js`) |
| `npm test` | Roda os testes com Jest (precisa do banco de dados rodando) |

<br>

### Dockerfile

O `Dockerfile` do backend usa **multi-stage build**, com 4 etapas:

| Etapa | Função |
| ----- | ------ |
| `base` | Parte de `node:24-alpine`, instala as dependências e copia `tsconfig.json` e `src/` |
| `development` | Executa `npm run dev`. É a etapa usada pelo `compose.yaml` (`target: development`) |
| `build` | Compila o TypeScript (`npm run build`) e remove as dependências de desenvolvimento |
| `runtime` | Imagem final de produção, apenas com `dist/` e `node_modules`. Executa `node dist/server.js` |

No `compose.yaml`, o container do backend só inicia depois que o banco estiver saudável (`depends_on` com `service_healthy`) e possui um *healthcheck* que consulta a rota `/health`.

<br>

## Endpoints

Todas as requisições e respostas usam JSON. Os controllers respondem com os seguintes status:

| Status | Quando acontece |
| ------ | --------------- |
| `200` / `201` | Operação realizada (`201` para usuário criado) |
| `400` | Dados inválidos ou ausentes |
| `401` | Login incorreto, token ausente, inválido ou expirado |
| `403` | Usuário autenticado, mas sem permissão de administrador |
| `404` | Usuário não encontrado ou rota inexistente |
| `409` | E-mail de usuário já cadastrado |
| `500` | Erro interno do servidor |

Em caso de erro, o corpo da resposta é sempre `{ "message": "..." }`. Rotas que não existem respondem `404` com `{ "message": "Rota inexistente!" }`.

Resumo das rotas (o detalhamento de cada uma, com exemplos, está em [`docs/endpoints.md`](https://github.com/atmosabp/greener/blob/develop/docs/endpoints.md)).

<br>

## Integrações externas

O backend consome as APIs auxiliares do cliente, cada uma com seu arquivo em `src/integrations/`:

| Arquivo | API | Onde ver |
| ------- | --- | -------------- |
| `metrics-api.ts` | `metrics.unilaunch.org/metrics/:serviceId` | Você pode encontrar as descrições [aqui](https://github.com/atmosabp/greener/blob/develop/docs/orientacoes-config-api.md) |
| `carbon-api.ts` | `carbon.unilaunch.org/carbon-intensity/:regionCode` | Você pode encontrar as descrições [aqui](https://github.com/atmosabp/greener/blob/develop/docs/orientacoes-config-api.md)|
| `services-api.ts` | `metrics.unilaunch.org/services` e `metrics.unilaunch.org/services/:serviceId` | Você pode encontrar as descrições [aqui](https://github.com/atmosabp/greener/blob/develop/docs/orientacoes-config-api.md) |

### Como cada integração funciona

- **Lista de serviços:** `reqServices` (`services-api.ts`) lê os serviços cadastrados no **banco de dados** (tabela `services`) e, para cada um, descobre a disponibilidade e a localização consultando a API. Ou seja, a lista exibida ao usuário vem do banco, e não diretamente da API.
- **Intensidade de carbono:** o código da região (ex.: `br-sudeste`) **não é fixo**. A função `reqMetrics` do `carbon-api.ts` primeiro consulta `/services/:serviceId` para obter o `region_code` do serviço e só depois consulta a API de carbono para aquela região. Dela saem a intensidade de carbono (`reqCarbonValue`) e a porcentagem de energia renovável (`reqRenewablePercent`).
- **Métricas de uso:** `metrics-api.ts` lê `/metrics/:serviceId`. De lá vêm `collection_interval_seconds` (`reqInterval`) e as métricas de CPU, memória, disco e rede (`reqMetrics`).

### Status do serviço

O status de cada serviço é calculado em `checkServiceAvailiability`:

- `active`: a API de métricas respondeu com sucesso.
- `incomplete`: a API respondeu, mas faltam uma ou mais métricas (intervalo, CPU, memória, disco ou rede ausentes ou com valor `0`).
- `inactive`: a API não respondeu para tal serviço ou retornou erro.

<br>

## Worker de histórico

O worker (`src/worker/worker.ts`) é iniciado junto com o servidor e é o responsável por alimentar o histórico do banco **automaticamente**. A cada **60 segundos** (`pullTimer`), ele:

1. Busca os serviços salvos no banco (`findServices`) e a lista atual da API de serviços;
2. Compara as duas listas (`verifyService`): se a API tiver um serviço que ainda não existe no banco, ele é cadastrado (`addNewService`);
3. Para cada serviço do banco, faz uma requisição `POST /collections/add-history` no próprio servidor, que calcula e grava uma linha em `minute_data`.

A partir daí, a compressão dos dados em `hour_data`, `day_data` e `month_data` é feita pelos *triggers* do banco, descritos no [README do banco de dados](../database/README.md).

> O worker espera 60 segundos **antes** da primeira coleta. Em caso de erro (API fora do ar, por exemplo), a mensagem é registrada no terminal e o worker continua para o próximo ciclo.

<br>

## Cálculos

Os cálculos são feitos pela classe `MetricsCalculator` (`src/modules/metrics-calculator.ts`) a cada coleta:

| Cálculo | Fórmula |
| ------- | ------- |
| Potência estimada (W) | CPU + memória + disco + rede |
| Energia (kWh) | Potência (W) × intervalo de coleta (h) / 1000 |
| Emissão (CO₂e) | Energia (kWh) × intensidade de carbono (gCO₂e/kWh) |
| Intensidade de carbono | CO₂e / kWh |
| Emissão total | CO₂e × tempo em horas |

O detalhamento de todas as fórmulas está em [`docs/calculos.md`](https://github.com/atmosabp/greener/blob/develop/docs/calculos.md).

<br>

## Banco de dados

O banco de dados usa PostgreSQL, e todo seu código e SQL com as queries está em [`database/schema.sql`](../database/schema.sql). O backend usa as seguintes tabelas:

| Tabela | Conteúdo |
| ------ | -------- |
| `users` | Usuários da plataforma (`name`, `email` único, `password` em hash, `is_adm`) |
| `services` | Serviços monitorados, com `max_emitted` e `min_emitted` |
| `minute_data` | Histórico por minuto: CPU, memória, disco, rede, kWh, CO₂e e % renovável |
| `hour_data` | Histórico por hora (mesma estrutura de `minute_data`) |
| `day_data` | Histórico por dia (mesma estrutura de `minute_data`) |
| `month_data` | Histórico por mês (mesma estrutura de `minute_data`) |

A conexão é feita pelo `Pool` do `pg` em `src/db/connections.ts`, com os dados vindos das variáveis de ambiente.

### Consultas de histórico

As consultas de `POST /collections/all-service-history` e `POST /collections/service-history` recebem `periodType` (`minute`, `hour`, `day` ou `month`) e `datePull` (a data desejada) e devolvem **uma única linha** com a média das métricas. Existem dois caminhos:

- **Data recente** (menos de 2 unidades do período, ex.: menos de 2 horas para `hour`): como os dados mais novos ainda não foram comprimidos, a média é calculada na hora a partir da tabela de granularidade menor (`minute_data` para hora, `hour_data` para dia, `day_data` para mês).
- **Data antiga:** a linha já comprimida é lida diretamente da tabela do período (`hour_data`, `day_data` ou `month_data`). Para `minute`, a leitura de datas antigas também é feita em `hour_data`, pois os minutos antigos já foram comprimidos.
3

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

