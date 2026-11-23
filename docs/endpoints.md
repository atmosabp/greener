## Endpoints
Esse documento tem como objetivo descrever os endpoints mapeados pela nossa aplicação.  
Todos os endpoints descritos abaixo estão aplicados nos arquivos `*.routes.ts` do diretório `backend/src/modules/`.  
Você pode acessar essa pasta [nesse link](https://github.com/atmosabp/greener/tree/develop/backend/src/modules).

A URL principal de todas as rotas é `http://localhost:3000/`. Sendo 3000 o número da porta, que pode ser alterado no arquivo .env (variável `PORT`).

<br>

### Resumo

| Método | Rota | Proteção | Descrição |
| ------ | ---- | -------- | --------- |
| `GET` | `/health` | Pública | Verifica se o servidor está no ar |
| `POST` | `/auth/login` | Pública | Faz login e devolve o token |
| `GET` | `/auth/me` | Token | Verifica a sessão e devolve o usuário |
| `POST` | `/users` | Administrador | Cria um usuário |
| `GET` | `/users/get-users` | Administrador | Lista todos os usuários |
| `GET` | `/users/:id` | Administrador | Busca um usuário pelo id |
| `PATCH` | `/users/:id` | Administrador | Atualiza um usuário |
| `DELETE` | `/users/:id` | Administrador | Deleta um usuário |
| `GET` | `/collections/all-service-data` | Sem proteção | Serviços com status, localização e métricas atuais |
| `GET` | `/collections/service-metrics/:serviceId` | Sem proteção | Métricas atuais de um serviço |
| `POST` | `/collections/add-history` | Sem proteção | Adiciona uma coleta ao histórico |
| `GET` | `/collections/get-history` | Sem proteção | Rota de teste do histórico |
| `POST` | `/collections/all-service-history` | Sem proteção | Histórico de todos os serviços em um período |
| `POST` | `/collections/service-history` | Sem proteção | Histórico de um serviço em um período |

<br>

### Padrão de respostas

Todas as requisições e respostas usam JSON. Em caso de erro, o corpo é sempre `{ "message": "..." }`.

| Status | Significado |
| ------ | ----------- |
| `200` | Requisição realizada com sucesso |
| `201` | Recurso criado (cadastro de usuário) |
| `400` | Dados inválidos ou ausentes |
| `401` | Login incorreto, ou token ausente, inválido ou expirado |
| `403` | O usuário está logado, mas não é administrador |
| `404` | Recurso não encontrado, ou rota inexistente (`{ "message": "Rota inexistente!" }`) |
| `409` | Já existe um usuário com o e-mail informado |
| `500` | Erro interno do servidor |

<br>

---

<br>

## Rota de verificação

`GET /health`: Retorna `{ "status": "ok" }`. É usada pelo *healthcheck* do Docker Compose para saber se o backend já está pronto.  
Exemplo da URL: `http://localhost:3000/health`

<br>

## Rotas para autenticação
Serão usados para o login e para verificar se o usuário continua autenticado.  
A URL principal dessa rota é http://localhost:3000/auth/.

O login devolve um **token JWT**, válido por **8 horas**. Para acessar as rotas protegidas, esse token precisa ser enviado no cabeçalho `Authorization`, no formato `Bearer <token>`.

**Rota tipo POST:**

`/login`: Faz o login do usuário.  
Exemplo da URL: `http://localhost:3000/auth/login`

Corpo da requisição:

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `email` | string | E-mail do usuário |
| `password` | string | Senha do usuário |

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@email.com", "password": "123456"}'
```

```typescript
async function login(email, password) {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
```

Resposta de sucesso (`200`):

```json
{
  "token": "eyJhbG...",
  "user": { "id": 1, "name": "Administrador", "email": "admin@email.com", "isAdm": true }
}
```

| Status | Quando acontece |
| ------ | --------------- |
| `400` | E-mail ou senha ausentes ou que não são texto |
| `401` | E-mail ou senha incorretos |
| `500` | Erro interno (por exemplo, `JWT_SECRET` não configurado) |

<br>

**Rota tipo GET:**

`/me`: Verifica se o token continua válido e devolve o usuário dono dele. É usada pelo frontend para proteger as telas.  
Exemplo da URL: `http://localhost:3000/auth/me`

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta de sucesso (`200`):

```json
{ "user": { "id": 1, "name": "Administrador", "isAdm": true } }
```

Retorna `401` se o token não for enviado, for inválido ou tiver expirado.

<br>

## Rotas para usuários 
Serão usados para qualquer ação relativa ao(s) usuário(s).  
A URL principal dessa rota é http://localhost:3000/users/. Sendo 3000 o número da porta, que pode ser alterado no arquivo .env.

> **Todas as rotas de usuários exigem token de um administrador.** Sem o cabeçalho `Authorization` a resposta é `401`, e com um usuário comum a resposta é `403`.

Os usuários são devolvidos neste formato (a senha nunca é retornada):

```json
{ "id": 2, "name": "Teste", "email": "teste@email.com", "is_adm": false }
```

<br>

**Rotas tipo GET:** 

`/get-users`: Lista todos os usuários.  
Exemplo da URL: `http://localhost:3000/users/get-users`

`/:id`: Lista usuário baseado no id. O resultado é um array com o usuário encontrado.  
Exemplo da URL: `http://localhost:3000/users/1`

| Status | Quando acontece |
| ------ | --------------- |
| `400` | O id não é um número inteiro positivo |
| `404` | Não existe usuário com o id informado |

```bash
curl http://localhost:3000/users/get-users \
  -H "Authorization: Bearer SEU_TOKEN"
```

<br>

**Rota tipo POST:**

`/`: Serve para criar um novo usuário.  
Exemplo da URL: `http://localhost:3000/users/`

Corpo da requisição:

| Campo | Tipo | Obrigatório | Descrição |
| ----- | ---- | ----------- | --------- |
| `name` | string | Sim | Nome do usuário |
| `email` | string | Sim | E-mail do usuário (não pode repetir) |
| `password` | string | Sim | Senha, com no mínimo 6 caracteres. É salva criptografada (bcrypt) |
| `isAdm` | boolean | Não | Se o usuário é administrador. Padrão: `false` |

É necessário fazer uma requisição CURL, ou um fetch por um sistema externo:

```bash
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Teste", "email": "teste@email.com", "password": "123456", "isAdm": true}'
```

```typescript
async function test(token) {
    const result = await fetch("http://localhost:3000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "Teste", email: "teste@email.com", password: "123456", isAdm: true }),
    });
}
```

| Status | Quando acontece |
| ------ | --------------- |
| `201` | Usuário criado (devolve os dados do usuário) |
| `400` | Campos obrigatórios ausentes, tipos inválidos ou senha com menos de 6 caracteres |
| `409` | Já existe um usuário com o e-mail informado |

<br>

**Rota tipo PATCH:**

`/:id`: Atualiza usuário baseado no id. Apenas os campos enviados são alterados, mas é necessário enviar **ao menos um**.  
Exemplo da URL: `http://localhost:3000/users/9`

Campos aceitos no corpo: `name`, `email`, `password` (mínimo de 6 caracteres) e `isAdm`.

É necessário fazer uma requisição CURL, ou um fetch por um sistema externo:

```bash
curl -X PATCH http://localhost:3000/users/9 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Teste2", "email": "teste2@email.com", "password": "123456", "isAdm": false}'
```

```typescript
async function test(id, data, token) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
```

| Status | Quando acontece |
| ------ | --------------- |
| `200` | Usuário atualizado (devolve os dados atualizados) |
| `400` | Id inválido, nenhum campo informado ou senha com menos de 6 caracteres |
| `404` | Usuário não encontrado |
| `409` | O novo e-mail já pertence a outro usuário |

<br>

**Rota tipo DELETE:**

`/:id`: Deleta usuário baseado no id.  
Exemplo da URL: `http://localhost:3000/users/9`

É necessário fazer uma requisição CURL, ou um fetch por um sistema externo:

```bash
curl -X DELETE http://localhost:3000/users/9 \
  -H "Authorization: Bearer SEU_TOKEN"
```

```typescript
async function test(id, token) {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
}
```

| Status | Quando acontece |
| ------ | --------------- |
| `200` | Usuário deletado (devolve `{ "id": 9 }`) |
| `400` | Id inválido |
| `404` | Usuário não encontrado |

<br>

## Rotas para coleta de métricas
Serão usados para qualquer ação relativa a(s) coleta(s) de dados proveniente das API auxiliares.  
A URL principal dessa rota é http://localhost:3000/collections/. Sendo 3000 o número da porta, que pode ser alterado no arquivo .env.

As rotas de histórico respondem `500` em caso de erro interno.  
Para datas recentes, a média é calculada na hora a partir da tabela de granularidade menor. Para datas antigas, é lida a linha já comprimida pelos triggers do banco (veja o [README do banco de dados](https://github.com/atmosabp/greener/blob/develop/database/README.md)).

<br>

**Rotas tipo GET:** 

`/all-service-data`: Retorna todos os serviços cadastrados, cada um com status, localização e as métricas atuais. É a rota usada pela tela principal, pelo ranking, pela comparação e pela lista de serviços do dashboard.  
Exemplo da URL: `http://localhost:3000/collections/all-service-data`.

```json
[
  {
    "id": "billing-api",
    "name": "Billing API",
    "status": "active",
    "location": { "region_code": "br-sudeste", "country": "Brazil", "region": "Sudeste", "city": "Sao Paulo", "latitude": -23.5505, "longitude": -46.6333 },
    "metrics": { "cpu_percent": 35.2, "memory_gb": 12.4, "disk_gb": 80, "network_gb": 3.1, "co2e": 0.9, "kwh": 0.01 }
  }
]
```

O `status` pode ser `active`, `incomplete` ou `inactive`. Caso as métricas de um serviço não possam ser coletadas, o campo `metrics` volta vazio (`{}`) para aquele serviço. Os valores acima são apenas ilustrativos.

<br>

`/service-metrics/:serviceId`: Retorna as métricas atuais de um serviço, direto das APIs auxiliares, **sem gravar nada no banco**. É a rota usada pelo dashboard.  
Exemplo da URL: `http://localhost:3000/collections/service-metrics/inventory-sync`.

```bash
curl http://localhost:3000/collections/service-metrics/inventory-sync
```

```typescript
async function test(serviceId) {
  const response = await fetch(`http://localhost:3000/collections/service-metrics/${serviceId}`);
  return response.json();
}
```

Resposta (`200`):

```json
{
  "name": "Inventory Sync",
  "status": "active",
  "location": { "region_code": "br-sudeste", "city": "Sao Paulo", "latitude": -23.5505, "longitude": -46.6333 },
  "metrics": {
    "cpu_percent": 35.2, "memory_gb": 12.4, "disk_gb": 80, "network_gb": 3.1,
    "co2e": 0.9, "kwh": 0.01, "renewable_percent": 83, "carbon_intensity": 90
  }
}
```

<br>

`/get-history`: Rota de teste, usada pelo teste do worker. Retorna os registros de `hour_data` do serviço `billing-api`.  
Exemplo da URL: `http://localhost:3000/collections/get-history`.

<br>

**Rotas tipo POST:** 

`/add-history`: Calcula as métricas atuais de um serviço e adiciona um registro na tabela `minute_data`. Essa rota é chamada automaticamente pelo worker do backend a cada minuto, mas também pode ser chamada manualmente.  
Exemplo da URL: `http://localhost:3000/collections/add-history`

Corpo da requisição: `{ "serviceId": "inventory-sync" }`

```bash
curl -X POST http://localhost:3000/collections/add-history \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "inventory-sync"}'
```

```typescript
async function test(serviceId) {
  const response = await fetch(`http://localhost:3000/collections/add-history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({serviceId}),
  });
}
```

<br>

`/all-service-history`: Retorna o histórico de todos os serviços em um período (usado para o ranking). A resposta é uma única linha, com a média das métricas do período.  
Exemplo da URL: `http://localhost:3000/collections/all-service-history`.

Corpo da requisição:

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| `periodType` | string | Período desejado: `minute`, `hour`, `day` ou `month` |
| `datePull` | string | Data de referência (ex.: `2026-10-17`) |

```bash
curl -X POST http://localhost:3000/collections/all-service-history \
  -H "Content-Type: application/json" \
  -d '{"periodType": "day", "datePull": "2026-10-17"}'
```

<br>

`/service-history`: Retorna o histórico de um serviço, no mesmo formato da rota anterior. O corpo da requisição também usa `periodType` e `datePull`.  
Exemplo da URL: `http://localhost:3000/collections/service-history`

```bash
curl -X POST http://localhost:3000/collections/service-history \
  -H "Content-Type: application/json" \
  -d '{"periodType": "hour", "datePull": "2026-10-17"}'
```

**Atenção:** o controller desta rota lê o id do serviço de `req.params.id`, mas a rota está declarada sem o parâmetro `:id`. Enquanto isso não for ajustado no backend, o id do serviço não chega à consulta. Veja as pendências no [README do backend](https://github.com/atmosabp/greener/blob/develop/backend/README.md#status-e-pendências).

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
