## Plano de entregas
Aqui consta tabelas com o plano de tarefas a ser entregues para cada sprint.

<br>

### Sprint 1
Para verificar os requisitos dessa sprint, que estão relacionados à cada critério, [clique aqui](https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-1.md).

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no Github | Situação |
| --- | --- | --- | --- | --- | --- | --- |
| ES01 | ES01 | Fazer Product Backlog do projeto | Ler arquivo `docs/product-backlog.md` | Beatriz | Arquivo [docs/product-backlog.md](https://github.com/atmosabp/greener/blob/develop/docs/product-backlog.md) | Concluído |
| ES02 | ES02 | Desenvolver Sprint Backlog 1 | Ler arquivo `docs/sprints/sprint-1.md` | Todos | [docs/sprints/sprint-1.md](https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-1.md) | Concluído |
| ES03 | ES07 | Desenvolver user story e critérios de aceite | Ler arquivo `docs/user-story.md` e `docs/criterios-aceite.md` | Kauã | Arquivo [docs/user-story.md](https://github.com/atmosabp/greener/blob/develop/docs/user-story.md) | Completo |
| ES04 | - | Criar issues, fazer commits e pull requests | Ver [Kanban](https://github.com/users/atmosabp/projects/1), [commits](https://github.com/atmosabp/greener) (arquivos) e [pull requests](https://github.com/atmosabp/greener/pulls) | Todos | [Kanban](https://github.com/users/atmosabp/projects/1), [commits](https://github.com/atmosabp/greener) (arquivos) e [pull requests](https://github.com/atmosabp/greener/pulls) | Completo |
| ES05 | - | Fazer commits e distribuir tarefas entre devs | Ver [commits](https://github.com/atmosabp/greener) e arquivos do projeto | Todos | [Commits](https://github.com/atmosabp/greener) e arquivos | Completo |
| ES06 | - | Fazer sprint review, retrospective e decidir passos futuros | Ver relatório da sprint 1, e arquivo sprint-1.md, com as informações da review e retrospectiva | Beatriz e Júlia | [Relatório sprint 1](https://github.com/atmosabp/greener/blob/develop/docs/relatorios/relatorio-sprint-1.md) e [sprint-1.md](https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-1.md) | Em andamento (aguardar término Sprint Review) |
| ES07 | ES08 | Criar DoD para cada task no sprint backlog | Ver arquivo `dod.md` com o DoD de cada tarefa | Lorenzo | Arquivo [dod.md](https://github.com/atmosabp/greener/blob/develop/docs/dod.md) | Concluído |
| ES08 | - | Fazer e manter documentações e README.md | Ver arquivo [README](https://github.com/atmosabp/greener/blob/develop/README.md) e pasta `docs/` | Júlia | Arquivo [README](https://github.com/atmosabp/greener/blob/develop/README.md) e pasta `docs/` | Concluído |
| ES09 | BD02 | Desenvolver Kanban, código, banco de dados, design e documentação | Ver Kanban, commits, arquivos e pull requests | Todos | [Kanban](https://github.com/users/atmosabp/projects/1), [arquivos](https://github.com/atmosabp/greener) e [pull requests](https://github.com/atmosabp/greener/pulls) | Concluído |
| DW01 | - | Separar tecnologias em pastas diferentes: frontend, backend e docs | Ver arquivos nas pastas de frontend, backend e docs, e as tecnologias e arquivos dentro deles | Todos | Pastas [frontend](https://github.com/atmosabp/greener/blob/develop/frontend), [backend](https://github.com/atmosabp/greener/blob/develop/backend) e [docs](https://github.com/atmosabp/greener/blob/develop/docs) | Concluído |
| DW02 | TP03, TP04 e TP06 | Chamar API do GreenER, trazer dados, processar respostas e tratar erros | Ver arquivos `backend/src/integrations` | Darcy e Kauã | [backend/src/integrations](https://github.com/atmosabp/greener/blob/develop/backend/src/integrations) | Em andamento |
| DW03 | TP01 | Separar módulos do backend, fazer respostas coerentes, métodos HTTP adequados e boas requisições | Ver arquivos da pasta `backend/src` e suas organizações | Darcy, Júlia, Kauã e Mariana | Pasta [backend/src/modules](https://github.com/atmosabp/greener/blob/develop/backend/src/modules) | Em andamento |
| DW04 | DW01 | Criar componentes, fazer chamadas HTTP da API e criar hooks, contexts e provides | Ver arquivos da pasta `frontend/src` | Beatriz e Lorenzo | Arquivos no [frontend/src](https://github.com/atmosabp/greener/blob/develop/frontend/src) | Em andamento |
| DW05 | - | Fazer atualizações contínuas no frontend para coletar dados da API | - | Beatriz e Lorenzo | - | Não iniciado |
| DW06 | - | Fazer validação de token e proteção de rotas do backend | Ver códigos `*-routes.ts` no backend e arquivos de validação de token | Darcy, Júlia, Kauã e Mariana | - | Não iniciado |
| DW07 | ES11 | Criar Dockerfiles, compose.yml, env.example e instruções | Ver [README](https://github.com/atmosabp/greener/blob/develop/README.md), pastas do projeto e arquivo compose.yml e env.example | Júlia | Arquivo [README](https://github.com/atmosabp/greener/blob/develop/README.md), pastas [frontend](https://github.com/atmosabp/greener/blob/develop/frontend), [backend](https://github.com/atmosabp/greener/blob/develop/backend) e arquivos descritos | Em andamento |
| BD01 | BD01 e BD02 | Criar modelo do banco de dados e código SQL funcional | Ver modelo de banco de dados e comparar com o `schema.sql` | Darcy e Mariana | [Modelo BD](https://github.com/atmosabp/greener/blob/develop/docs/bd/modelo-image.png) e [schema.sql](https://github.com/atmosabp/greener/blob/develop/database/schema.sql) | Completo |
| BD02 | - | - | - | Darcy e Mariana | - | Não iniciado |
| BD03 | ES11 e BD03 | Criar conexão backend ao banco de dados e criar volume no Docker Compose | Ver arquivo `connections.ts`, com a conexão do backend ao BD, os `*-repository.ts` e o `compose.yml` | Júlia e Kauã | [connections.ts](https://github.com/atmosabp/greener/blob/develop/backend/src/db/connections.ts), [users.repository.ts](https://github.com/atmosabp/greener/blob/develop/backend/src/modules/users/users.repository.ts) [collections-repository.ts](https://github.com/atmosabp/greener/blob/develop/backend/src/modules/collections/collections.repository.ts) e [compose.yml](https://github.com/atmosabp/greener/blob/develop/compose.yaml) | Concluído |
| BD04 | - | - | - | Júlia | - | Em andamento |
| TP01 | ES12, TP07, TP08 | Fazer classes a serem usadas pelo servidor backend (repository) | Ver arquivo `metrics-calculator.ts` na pasta `backend/`, e sua integração com o arquivo `collections.repository.ts` | Darcy | Verificar [metrics-calculator.ts](https://github.com/atmosabp/greener/blob/develop/backend/src/modules/metrics-calculator.ts) e [collections.repository.ts](https://github.com/atmosabp/greener/blob/develop/backend/src/modules/collections/collections.repository.ts) | Em andamento |
| TP02 | - | Fazer tipagens de todas as variáveis e funções | Ver funções e variáveis nos arquivos na pasta `backend/` | Darcy, Júlia e Kauã | Arquivos na pasta [backend/src](https://github.com/atmosabp/greener/blob/develop/backend/src) | Em andamento |
| TP03 | - | Desenvolver código usando trycatch e tratamento de falhas da API | Ver arquivos da pasta backend que contém trycatch e tratamento de falhas | Darcy, Júlia, Kauã e Mariana | Arquivos na pasta [backend/src](https://github.com/atmosabp/greener/blob/develop/backend/src) | Em andamento |

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
