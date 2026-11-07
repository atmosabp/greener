# GreenER — Backend

Backend da aplicação **GreenER**, desenvolvido para gerenciar a autenticação de usuários, o acesso aos recursos do sistema e a comunicação com o banco de dados PostgreSQL.

A aplicação utiliza Node.js com Express e TypeScript, além de JWT para autenticação e bcrypt para criptografia de senhas.

---

## 1. Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express:** framework para criação da API REST.
- **TypeScript:** tipagem estática e organização do código.
- **PostgreSQL:** banco de dados relacional.
- **pg:** biblioteca para conexão e comunicação com o PostgreSQL.
- **JWT (JSON Web Token):** autenticação e validação de sessões.
- **bcrypt:** criptografia de senhas.
- **dotenv:** gerenciamento de variáveis de ambiente.
- **CORS:** controle de acesso às requisições entre frontend e backend.
- **Docker:** conteinerização e execução do ambiente.

---

## 2. Estrutura do projeto

A organização do backend segue uma divisão por responsabilidades, separando configurações, conexão com o banco de dados e módulos da aplicação.

```text
backend/
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── db/
│   │   ├── connections.ts
│   │   ├── init.ts
│   │   └── insert.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.repository.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   └── users.routes.ts
│   │   │
│   │   ├── collections/
│   │   │
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── Dockerfile
├── package.json
├── package-lock.json
└── .env
```

### Responsabilidade dos principais arquivos

| Arquivo | Responsabilidade |
|---|---|
| `config/env.ts` | Centraliza configurações e variáveis de ambiente. |
| `db/connections.ts` | Gerencia a conexão com o PostgreSQL. |
| `db/init.ts` | Inicializa a estrutura do banco de dados. |
| `db/insert.ts` | Verifica e cadastra o usuário administrador. |
| `app.ts` | Configura o Express, middlewares, CORS e rotas. |
| `server.ts` | Inicializa o servidor HTTP. |
| `modules/index.ts` | Centraliza os módulos e suas rotas. |

Os módulos seguem uma divisão de responsabilidades:

- **Routes:** definem os endpoints disponíveis.
- **Controller:** recebem as requisições e retornam as respostas HTTP.
- **Service:** concentram as regras de negócio.
- **Repository:** realizam as operações de acesso ao banco de dados.

---

## 3. Configuração do ambiente

Antes de executar o backend, é necessário configurar as variáveis de ambiente.

Crie um arquivo `.env` na raiz do projeto, seguindo o formato do env.examples. 


**Atenção:**

- Os valores são exemplos. Utilize os dados correspondentes ao seu ambiente.
- O `JWT_SECRET` deve ser uma chave segura e privada.
- Não compartilhe o arquivo `.env` nem o envie ao repositório.
- No Docker, os dados de conexão devem corresponder à configuração do serviço PostgreSQL.

---

## 4. Banco de dados

O GreenER utiliza PostgreSQL para armazenar os dados da aplicação.

A estrutura do banco contém as seguintes tabelas principais:

| Tabela | Finalidade |
|---|---|
| `users` | Armazena os usuários e suas credenciais. |
| `services` | Armazena os serviços monitorados. |
| `minute_data` | Armazena dados de monitoramento por minuto. |
| `hour_data` | Armazena dados de monitoramento por hora. |
| `day_data` | Armazena dados de monitoramento por dia. |
| `month_data` | Armazena dados de monitoramento por mês. |

### Inicialização do banco — `init.ts`

O arquivo `init.ts` é responsável pela inicialização da estrutura do banco de dados quando aplicação estiver sendo executada na maquina local.

Ele deve ser executado quando for necessário criar as tabelas, índices, funções, gatilhos e demais estruturas definidas no script de inicialização.

Em sua execução ele cria o usuario admin de acordo com as credenciais fornecidas no .env (certifique que esteja preenchido).

### Cadastro do administrador — `insert.ts`

O arquivo `insert.ts` é responsável por garantir que exista um usuário administrador cadastrado no banco de dados. Ele realiza essa operação de forma independente da inicialização da estrutura do banco.

Seu funcionamento é o seguinte:

1. Recupera as informações do administrador pelas variáveis de ambiente.
2. Consulta a tabela `users` para verificar se o e-mail já está cadastrado.
3. Caso o administrador já exista, encerra a execução sem criar outro registro.
4. Caso não exista, gera um hash da senha utilizando bcrypt.
5. Insere o administrador na tabela `users`, definindo `is_adm` como `true`.

Essa verificação evita a criação de administradores duplicados quando o script é executado mais de uma vez.

**Importante:** o `insert.ts` não cria tabelas. O banco e a tabela `users` precisam estar disponíveis antes de sua execução.

---

## 5. Autenticação e controle de acesso

A autenticação da aplicação utiliza JWT (JSON Web Token).

O fluxo de autenticação funciona da seguinte maneira:

1. O usuário informa seu e-mail e senha na tela de login.
2. O frontend envia as credenciais para o endpoint de autenticação.
3. O backend verifica se o usuário existe.
4. A senha informada é comparada com o hash armazenado no banco utilizando bcrypt.
5. Caso as credenciais sejam válidas, o backend gera um token JWT.
6. O frontend armazena o token na sessão e o utiliza nas requisições protegidas.

### Validade do token

Atualmente, o token JWT possui validade de **8 horas**.

O token contém informações de identificação do usuário e sua permissão administrativa.

### Middleware de autenticação

O arquivo `auth.middleware.ts` contém os middlewares responsáveis pela proteção dos endpoints.

**`authenticateToken`**

- Verifica se a requisição possui um token no cabeçalho `Authorization`.
- Valida a assinatura e a validade do JWT.
- Disponibiliza os dados do usuário autenticado para as próximas etapas.
- Retorna HTTP 401 quando o token está ausente, inválido ou expirado.

**`requireAdmin`**

- Verifica se o usuário autenticado possui permissão administrativa.
- Retorna HTTP 403 quando o usuário não possui essa permissão.

### Proteção de rotas

As rotas administrativas de gerenciamento de usuários exigem autenticação e permissão de administrador.

O frontend também possui proteção de navegação para impedir que usuários não autenticados acessem páginas internas.

A proteção do frontend complementa a autenticação, mas não substitui a validação realizada pelo backend.

---

## 6. Endpoints de autenticação

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/auth/login` | Realiza o login e retorna o JWT. | Público |
| GET | `/auth/me` | Valida o token e retorna informações do usuário autenticado. | Autenticado |

### Exemplo de login

**Requisição:**

```http
POST /auth/login
Content-Type: application/json
```

Corpo:

```json
{
  "email": "admin@greener.com",
  "password": "sua_senha"
}
```

**Resposta esperada:**

```json
{
  "token": "JWT_GERADO",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@greener.com",
    "isAdm": true
  }
}
```

### Exemplo de validação da sessão

**Requisição:**

```http
GET /auth/me
Authorization: Bearer JWT_GERADO
```

**Resposta esperada:**

```json
{
  "user": {
    "id": 1,
    "isAdm": true
  }
}
```

---

## 7. Códigos de resposta HTTP

A API utiliza códigos HTTP para indicar o resultado das operações.

| Código | Significado |
|---|---|
| 200 | Requisição realizada com sucesso. |
| 201 | Recurso criado com sucesso. |
| 400 | Requisição inválida. |
| 401 | Usuário não autenticado ou token inválido. |
| 403 | Usuário autenticado, mas sem permissão para acessar o recurso. |
| 404 | Recurso não encontrado. |
| 409 | Conflito com um recurso existente. |
| 500 | Erro interno do servidor. |

---

## 8. Considerações de segurança

Algumas medidas utilizadas no backend:

- Senhas armazenadas com hash gerado pelo bcrypt.
- Autenticação por JWT.
- Validação de tokens por middleware.
- Separação entre usuários comuns e administradores.
- Proteção de endpoints administrativos.
- Utilização de variáveis de ambiente para informações sensíveis.
- Controle de origem das requisições por CORS.

O arquivo `.env` não deve ser enviado ao repositório. Para compartilhar o projeto, disponibilize apenas um arquivo de exemplo, como `.env.example`, sem senhas ou chaves reais.

---

## 9. Fluxo resumido de execução

### Ambiente local

```text
Instalar dependências
        ↓
Configurar .env
        ↓
Iniciar PostgreSQL
        ↓
Executar init.ts
        ↓
Iniciar servidor
        ↓
Backend disponível
```

### Ambiente Docker

```text
Configurar variáveis de ambiente
        ↓
Executar docker compose up --build
        ↓
Docker inicia PostgreSQL e backend
        ↓
Aguardar banco ficar disponível
        ↓
Garantir que a estrutura do banco exista
        ↓
Executar insert.ts no contêiner do backend
        ↓
Backend disponível
```

---

**GreenER — Fatec Jacareí**

Projeto acadêmico desenvolvido no curso de Desenvolvimento de Software Multiplataforma.