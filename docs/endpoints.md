## Endpoints
Esse documento tem como objetivo descrever os endpoints mapeados pela nossa aplicação.  
Todos os endpoints descritos abaixo estão aplicados nos arquivos `.routes.ts `do diretório `backend/src/modules/`.  
Você também pode acessar essa pasta [aqui](https://github.com/atmosabp/greener/tree/develop/backend/src/modules).

<br>


## Endpoints de Users 
Serão usados para qualquer ação relativa ao(s) usuário(s).

---
## Endpoints de Colletions
Serão usados para conseguir informações realizadas a partir da coleta de dados proveniente das APIs auxiliares.
<br>

--- 
**Endpoints tipo GET:** 

`/get-users`: Lista todos os usuários.

`/:id`: Lista usuário baseado no id.

`get-history`: Serve para puxar todo o histórico.

---

**Endpoints tipo POST:** 

`/`: Serve para criar um novo usuário.

`/add-history`:  Adiciona registro no histórico.

`/all-service-data`: Retorna todos os serviços e todas as métricas.

`/service-history`: Retorna o histórico de um serviço.

`/all-service-history`: Retorna histórico de todos os serviços para o ranking.

**Endpoint tipo PATCH:**

`/:id`: Rota para editar usuário.

**Endpoint tipo DELETE:**

`/:id`: Deleta usuário baseado no id

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
