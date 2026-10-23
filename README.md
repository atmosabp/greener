<br>
<div align="center">
<img src="docs/design/logo-greener.svg" width="120">

<br>

# GreenER - ABP 2°SEM

</div>

<br>

<div align="center">

[Sobre](#sobre) - [Estrutura](#estrutura-de-arquivos) - [Tecnologias](#tecnologias-utilizadas) - [Documentação](#documentação) - [Cronograma](#cronograma-e-sprints) - [Instruções](#instruções-para-execução) - [Equipe](#equipe-e-cargos)

</div>

<br>

## Sobre

*GreenER* é uma plataforma web desenvolvida como projeto do 2º semestre da Fatec Jacareí, capaz de monitorar continuamente aplicações de software, estimar seu consumo energético e calcular suas emissões aproximadas de CO₂ equivalente (CO₂e).

Greener é feito para funcionários credenciados de empresas terem controle da emissão e consumo dos próprios serviços, comparando-os entre si, rankeando, e podendo tomar decisões para tornar o consumo menos prejudicial para o meio ambiente.

<br>

## Estrutura de arquivos

```
├ docs/           # Documentação do projeto
│ ├ bd/
│ ├ design/
│ ├ diagramas/
│ ├ relatorios/
│ ├ sprints/
├ frontend/       # Arquivos da aplicação HTML 
│ ├ src/
| ├ README.md
├ database/
├ database/        # Arquivos para banco de dados/histórico
| ├ schema.sql
| ├ README.md
├ backend/        # Servidor que conversa com frontend e API
| ├ src/
| ├ ├ __tests__/  # Testes de integração
| ├ ├ db/
| ├ ├ integrations/
| ├ ├ modules/
| ├ README.md
└ README.md       # Guia principal
```

<br>

## Tecnologias utilizadas

| [![My Skills](https://skillicons.dev/icons?i=react)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=ts)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=nodejs)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=docker)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=postgres)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=figma)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=git)](https://skillicons.dev) | [![My Skills](https://skillicons.dev/icons?i=github)](https://skillicons.dev) |
| ------ | ---- | ------- | ---- | ---- | ---- | ---- | ---- |
| React | TypeScript | NodeJS | Docker | PostgreSQL | Figma | Git | GitHub |
| v19.3 | v7.0 | v22.16.0 | v29 | v18.3 | Web | v2.53 | Web |

<br>

## Documentação

Toda a documentação do projeto pode ser encontrada em sua maioria na pasta `docs/`. Estas são as documentações principais do projeto, com os links para seus respectivos locais:

- <a href="https://github.com/atmosabp/greener/blob/develop/docs/product-backlog.md">Product Backlog</a>
- <a href="https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-1.md">Sprint Backlogs</a>
- <a href="https://github.com/atmosabp/greener/blob/develop/docs/dod.md">DoD (Definition of Done)</a>
- <a href="https://github.com/atmosabp/greener/blob/develop/docs/relatorios">Relatórios</a>

Para cada diretório como `frontend/`, `backend/` e `database/`, também há arquivos README, que juntos compõem uma documentação técnica explicando as funcionalidades de cada parte lógica da aplicação.

<br>

## Cronograma e Sprints

| N° Sprint | Data início | Status       | Relatório | Vídeo  |
| --------- | ----------- | ------------ | --------- | ------ |
| 1         | 28/09/2026  | Concluída | [Link](https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-1.md) | [Link](https://youtu.be/no3dPzF96Jo) |
| 2         | 19/10/2026  | Não iniciada | -         | -      |
| 3         | 09/11/2026  | Não iniciada | -         | -      |

<br>

## Instruções para execução

A aplicação usa principalmente Docker Compose para inicializar, portanto, é necessário ter o WSL instalado, caso esteja sendo usado um sistema Windows.  
Com isso garantido, siga os seguintes passos para utilizar a aplicação ***com Docker***:

1. Execute o comando `git clone https://github.com/atmosabp/greener` no terminal bash ou Powershell para copiar os arquivos do projeto no local de escolha do seu computador.
2. Abra o terminal na raiz do projeto. Primeiro, entre na pasta frontend executando `cd frontend`, e depois instalando as dependências necessárias com `npm i`. Faça o mesmo entrando na pasta backend com o comando `cd backend` e instale as dependências, para garantir que o Docker identifique o arquivo `package-lock.json`, caso eles ainda não existam.
3. Com as dependências instaladas, abra o arquivo `.env.example` na raiz do projeto, duplique o arquivo, renomeando-o para `.env` e preencha todos os campos com as informações sugeridas, ou decididas pela equipe.
    - **Nota**: A partir da linha 9, estão as informações para rodar o banco de dados. Os valores de usuário, senha e nome do banco de dados, uma vez que o Docker é executado, precisam sempre ser os mesmos, para a autenticação dar certo.
3. Após o .env ser criado, abra o terminal WSL na raiz do projeto e digite o comando `docker compose up --build`. Isso iniciará o serviço do Docker Compose, iniciando os serviços de frontend, backend e banco de dados.
4. Após isso, o projeto estará funcionando, e você pode acessar cada serviço com as portas definidas no `.env`. Exemplo: `localhost:8080` para o frontend e `localhost:3000` para o backend.

<br>

Caso não seja necessário rodar a aplicação completa, apenas uma única parte, como o frontend ou o backend, siga os seguintes passos para utilizar a aplicação ***sem Docker***:

1. Execute o comando `git clone https://github.com/atmosabp/greener` no terminal bash ou Powershell para copiar os arquivos do projeto no local de escolha do seu computador.
2. Para rodar o frontend do projeto, abra o terminal na raiz do projeto, execute `cd frontend`, e depois instale as dependências necessárias com `npm i`. Por fim, digite `npm run dev` no terminal.
3. Antes de executar o backend, é necessário criar o banco de dados. Sem Docker, é preciso configurá-lo na sua própria máquina com o PgAdmin, criando o banco de dados com o nome desejado e executando as queries do arquivo `database/schema.sql`.
3. Para rodar o backend do projeto, primeiro, crie um arquivo `.env` com base no `.env.example`, abra o terminal na raiz do projeto, execute `cd frontend` e depois instale as dependências necessárias com `npm i`. Para executar, digite `npm run dev` no terminal.
4. Após isso, ambas as partes do projeto estarão funcionando. Você pode utilizar o projeto frontend com `localhost:5173` e `localhost:3000` para o backend (ou outra porta que foi definida).


<br>

## Equipe

|  <img src="https://avatars.githubusercontent.com/u/132356935?v=4" width="75px;" alt="Beatriz Oliveira"/> |  <img src="https://avatars.githubusercontent.com/u/132353184?v=4" width="75px;" alt="Júlia Rodrigues"/> |  <img src="https://avatars.githubusercontent.com/u/132584182?v=4" width="75px;" alt="Darcy Salmazzo"/> |  <img src="https://avatars.githubusercontent.com/u/260771590?v=4" width="75px;" alt="Kauã Cristian"/> |  <img src="https://avatars.githubusercontent.com/u/230260190?v=4" width="75px;" alt="Lorenzo Milanelo"/> |  <img src="https://avatars.githubusercontent.com/u/213532358?v=4" width="75px;" alt="Mariana Tavares"/> |
| ------ | ---- | ------- | ---- | ---- | ---- |
| Beatriz Oliveira | Júlia Rodrigues | Darcy Salmazzo | Kauã Cristian   | Lorenzo Milanelo | Mariana Tavares |
| Product Owner | Scrum Master | Dev | Dev | Dev | Dev |
| [Github](https://github.com/abeatrizoliveira) | [Github](https://github.com/HeyLavenderBee) | [Github](https://github.com/Darcyasn08) | [Github](https://github.com/KauaCristian-Dev) | [Github](https://github.com/LorenzoOMN) | [Github](https://github.com/Mari432hz) |

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
