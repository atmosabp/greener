## Endpoints
Esse documento tem como objetivo descrever os endpoints mapeados pela nossa aplicação.  
Todos os endpoints descritos abaixo estão aplicados nos arquivos `.routes.ts `do diretório `backend/src/modules/`.  
Você também pode acessar essa pasta [aqui](https://github.com/atmosabp/greener/tree/develop/backend/src/modules).

<br>


## Rotas para usuários 
Serão usados para qualquer ação relativa ao(s) usuário(s).  
A URL principal dessa rota é http://localhost:3000/users/. Sendo 3000 o número da porta, que pode ser alterado no arquivo .env.


**Rotas tipo GET:** 

`/get-users`: Lista todos os usuários.  
Exemplo: `http://localhost:3000/users/get-users`

`/:id`: Lista usuário baseado no id.  
Exemplo: `http://localhost:3000/users/1`


**Rotas tipo POST:**

`/`: Serve para criar um novo usuário.  
Exemplo da URL: `http://localhost:3000/users/`

É necessário fazer uma requisição CURL, ou um fetch por um sistema externo:

```bash
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "email": "teste@email.com", "password": "123456", "isAdm": true}'
```

```typescript
async function test(){
    const result = await fetch("http://localhost:3000/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Teste", email: "teste@email.com", password: "123456", isAdm: true }),
    });
}
```

**Rotas tipo PATCH:**

`/:id`: Atualiza usuário baseado no id.  
Exemplo da URL: `http://localhost:3000/users/1`

É necessário fazer uma requisição CURL, ou um fetch por um sistema externo:

```bash
curl -X PATCH http://localhost:3000/users/9 \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste2", "email": "teste@email.com", "password": "123456", "isAdm": false}'
```

```typescript
async function test(id, data) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
```
**Rotas tipo DELETE:**

`/:id`: Deleta usuário baseado no id.  
Exemplo da URL: `http://localhost:3000/users/1`

É necessário fazer uma requisição CURL, ou um fetch por um sistema externo:

```bash
curl -X DELETE http://localhost:3000/users/9
```

```typescript
async function test(id, data) {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
    });
}
```

## Rotas para coleta de métricas
Serão usados para qualquer ação relativa a(s) coleta(s) de dados proveniente das API auxiliares.  
A URL principal dessa rota é http://localhost:3000/collections/. Sendo 3000 o número da porta, que pode ser alterado no arquivo .env.
<br>

--- 

**Rotas tipo GET:** 

`get-history`: Serve para puxar todo o histórico.  
Exemplo: `http://localhost:3000/collections/get-history`.

`/all-service-history`: Retorna histórico de todos os serviços para o ranking.  
Exemplo: `http://localhost:3000/collections/all-service-history`.

`/service-metrics`: Serve para puxar as métricas do serviço baseado no Id pego pelo body.  
Exemplo: `http://localhost:3000/collections/service-metrics`.

---

**Endpoints tipo POST:** 

`/add-history`:  Adiciona registro no histórico.
Exemplo da URL: `http://localhost:3000/collections/add-history`

```bash
curl -X POST http://localhost:3000/collections/add-history \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "inventory-sync"}'
```

```typescript
async function test(id, data) {
  const response = await fetch(`http://localhost:3000/collections/add-history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
```

`/all-service-data`: Retorna todos os serviços e todas as métricas.

`/service-history`: Retorna o histórico de um serviço.

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
