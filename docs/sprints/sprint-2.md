## Sprint 1 - GreenER
Esta sprint ocorreu entre os dias 20/11/2026 e 09/11/2026. Excluindo os dias que foram decididos não serem dias de desenvolvimento, teve a duração total de 15 dias.

### Objetivo da sprint
O objetivo geral dessa sprint era implementar todas as telas do site, como a tela principal e o dashboard, desenvolver o sistema de guardar métricas dos serviços no banco de dados e implementar sistema de segurança.  

Aqui está cada objetivo em mais detalhes:

- **Implementação e integração de telas** -> Implementar 3 telas no site: landing page, login e tela principal. Como essas são as primeiras telas que o usuário acessa, demos prioridade a elas nessa sprint.  

- **Servidor backend** -> Desenvolver um servidor backend funcional, que tenha quase todas as partes necessárias para o projeto inteiro: rotas, funções para pegar dados da API, autenticação com JWT e criptografia de senhas. 

- **Sistema de coleta de histórico** -> Desenvolver o sistema de coleta de histórico no servidor, para guardar no banco de dados o histórico de métricas de todos os serviços. Também desenvolver os triggers para garantir um desempenho maior na coleta de dados, separando-os em tabelas de minutos, horas, dias e meses.

- **Testes** -> Desenvolver os testes de endpoints restantes, de acordo com o possível e necessário, pois pode haver alguns que dependem de implementações da 3° sprint.

<br>

### O que foi entregue
O **vídeo** desenvolvido pela equipe para a sprint pode ser acessado nesse link: [clique aqui (ATUALIZAR LINK)](https://youtu.be/no3dPzF96Jo).  
Ele mostra visualmente o que foi feito durante a sprint das telas e backend, e o que está planejado para o próximo ciclo de entrega.

A seguir está o burndown da sprint 2.  
Ele demonstra a evolução das tarefas ao longo dos dias. Assim como a relação entre o esforço real de cada dia e o planejado.  
No início da sprint, foi definido um esforço total de 140 pontos. E para cada dia, uma média de 11 pontos esperados.

![Burndown da sprint 2](burndown-sprint-2.png)

<br>

Lista do que foi entregue:
- [ ✔ ] Implementação de todas as telas planejadas, e integração delas com o backend (servidor que liga os dados da API).
- [ ✔ ] Autenticação de usuários por meio de JWT e criptografia de senhas para segurança
- [ ✔ ] Banco de dados aprimorado com o sistema de triggers para melhorar desempenho do histórico
- [ ✔ ] Todos os testes de implementação viáveis no escopo atual

<br>

### Itens concluídos e pendentes
Não houve itens pendentes nessa sprint. Tudo o que foi realmente planejado foi concluído.

É possível acessar o Kanban da sprint [neste link](https://github.com/users/atmosabp/projects/3).

<details>

<summary>

### Sprint Backlog
</summary>

| ID       | Descrição                                                        | Autor          | Disciplina | Esforço |
| :------- | :--------------------------------------------------------------- | :------------- | :--------- | :------ |
| **BD04** | Criar estrutura para armazenar histórico das coletas                                           | Darcy          | BDR        | 8       |
| **DW05** | Implementar validação de login (conexão front com back)                                             | Lorenzo        | BDR        | 3       |
| **BD03** | Criar conexão do banco ao backend                                | kauã           | BDR        | 5       |
| **DD01** | Definir identidade visual (cores, fontes e logo)                 | All            | DD         | 3       |
| **DD02** | Desenvolver logo do projeto                                      | Júlia          | DD         | 3       |
| **DD03** | Desenvolver logo da equipe                                       | Júlia          | DD         | 3       |
| **DD04** | Tela de cadastro - Desktop                                       | Beatriz        | DD         | 3       |
| **DD05** | Tela de cadastro - Mobile                                        | Beatriz        | DD         | 1       |
| **DD06** | Tela de login - Desktop                                          | Júlia          | DD         | 5       |
| **DD07** | Tela de login - Mobile                                           | Júlia          | DD         | 1       |
| **DD08** | Tela principal - Desktop                                         | Lorenzo        | DD         | 8       |
| **DD09** | Tela principal - Mobile                                          | Lorenzo        | DD         | 2       |
| **DD10** | Tela dashboard - Desktop                                         | Beatriz        | DD         | 5       |
| **DD11** | Tela dashboard - Mobile                                          | Beatriz        | DD         | 2       |
| **DD12** | Tela de ranking - Desktop                                        | Mariana        | DD         | 5       |
| **DD13** | Tela de ranking - Mobile                                         | Mariana        | DD         | 3       |
| **DD14** | Tela de comparação - Desktop                                     | Kauã           | DD         | 3       |
| **DD15** | Tela de comparação - Mobile                                      | Kauã           | DD         | 2       |
| **DD16** | Tela 404 - Desktop                                               | Mariana        | DD         | 2       |
| **DD17** | Tela 404 - Mobile                                                | Mariana        | DD         | 1       |
| **DD18** | Tela Landing Page - Desktop                                      | kauã           | DD         | 3       |
| **DD19** | Tela Landing Page - Mobile                                       | kauã           | DD         | 2       |
| **DD20** | Definir avisos (loading, avisos, erros)                          | Mariana        | DD         | 3       |
| **DW01** | Criar estrutura do projeto frontend                              | Lorenzo        | DW II      | 5       |
| **DW02** | Implementar tela principal                                       | Lorenzo        | DW II      | 13      |
| **DW03** | Implementar tela de login                                        | Beatriz        | DW II      | 5       |
| **DW04** | Implementar landing page                                         | Beatriz        | DW II      | 3       |
| **ES01** | Criar e manter Product Backlog                                   | Beatriz        | ESW II     | 3       |
| **ES02** | Criar Sprint Backlog referente a 1° sprint                       | All            | ESW II     | 5       |
| **ES03** | Criar vídeo referente a 1° sprint                                | All            | ESW II     | 8       |
| **ES04** | Criar relatório da 1° sprint                                     | Júlia          | ESW II     | 5       |
| **ES05** | Criar e manter Burn da 1° sprint                                 | Júlia          | ESW II     | 2       |
| **ES06** | Criar e manter README.md                                         | Júlia          | ESW II     | 3       |
| **ES07** | Desenvolver User Story + critérios de aceitação                  | Kauã           | ESW II     | 2       |
| **ES08** | Criar DoD                                                        | Lorenzo        | ESW II     | 5       |
| **ES09** | Criar Diagrama de Caso de Uso                                    | Darcy          | ESW II     | 5       |
| **ES10** | Criar Diagrama de Sequência                                      | Darcy          | ESW II     | 8       |
| **ES11** | Conteinizar o projeto                                            | Júlia          | ESW II     | 3       |
| **ES12** | Criar Diagrama de Classes                                        | Mariana        | ESW II     | 8       |
| **TP01** | Criar estrutura do backend em módulos (controllers, services...) | Lorenzo        | TP I       | 3       |
| **TP02** | Configurar servidor HTTP e variáveis de ambiente                 | kauã           | TP I       | 2       |
| **TP03** | Consultar /services                                              | Darcy          | TP I       | 2       |
| **TP04** | Consultar /metrics/{id_servico}                                  | Darcy          | TP I       | 5       |
| **TP05** | Implementar cálculo de CO₂e                                      | Darcy          | TP I       | 3       |
| **TP06** | Consultar Carbon Intensity API                                   | Kauã           | TP I       | 5       |
| **TP07** | Calcular consumo total                                           | Kauã           | TP I       | 8       |
| **TP08** | Calcular emissão total                                           | Darcy          | TP I       | 5       |
| **TP09** | Calcular serviços ativos e indisponíveis                         | Darcy          | TP I       | 5       |
| **TP10** | Criar endpoints                                                  | Mariana        | TP I       | 2       |
| **TP11** | Implementar testes                                               | Júlia, Mariana | TP I       | 5       |

</details>

<br>

### Verificações realizadas
Durante a sprint, foi desenvolvido um relatório descrevendo o que foi feito em cada dia de trabalho para cada integrante, e outras informações adicionais.

Aqui está o link para o relatório da sprint: [clique aqui](https://github.com/atmosabp/greener/blob/develop/docs/relatorios/relatorio-sprint-2.md)

<br>

### Sprint Retrospective
Este é um evento da metodologia Scrum que permite que a equipe se junte e dialogue sobre o processo, sem focar no produto.

Como é feito apenas após o encerramento da Sprint Review, ainda não foi adicionado aqui.

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
