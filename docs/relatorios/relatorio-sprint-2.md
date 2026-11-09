## Relatório da Sprint 2
Este é o relatório da segunda sprint do projeto, que aconteceu entre os dias 20/10/2026 e 09/11/2026. <br>
Neste documento é detalhado tudo o que foi feito em cada dia de desenvolvimento.  

Caso seja preciso ver outras informações sobre a sprint, veja o arquivo `sprints/sprint-2.md`, clicando [aqui](https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-2.md).

<details>
<summary>

### Dailies
</summary>

#### 20/out 
Dia separado apenas para o Sprint Planning, um evento da metodologia Scrum para planejar as tarefas para essa sprint, os esforços e quem irá fazer cada.  
Foi feito apenas essa tarefa neste dia, no entanto, ela foi complemtamente concluída, e permitiu ter um bom planejamento para o resto da sprint.

---

#### 23/out
Hoje foi realmente iniciado o desenvolvimento da sprint.  
Iniciamos a implementação de duas telas: dashboard e comparação. Elas são telas cruciais e mais demoradas para fazer, então colocamos mais prioridade nelas nessa sprint. A implementação delas é baseado no design desenvolvido no Figma.  

Também continuamos a criar mais endpoints para as coletas de métricas e CRUD de usuários, que serão utilizados pelo frontend, iniciamos a estrutura para armazenar o histórico de métricas no banco de dados e começamos o tratamento de coordenadas ausentes.  

**Beatriz** -> Inicia implementação tela dashboard (DW07)   
**Darcy** -> Inicia estrutura para armazenar histórico das coletas (BD04)  
**Júlia** -> Auxilia na criação de endpoints, faz relatório do dia e cria burndown (ES16)   
**Kauã** -> Inicia tratamento de coordenadas ausentes (TP17)  
**Lorenzo** -> Inicia implementação da tela de comparação (DW11)  
**Mariana** -> Inicia ciação de mais endpoints (TP18)

---

#### 24/out
Nesse dia, apenas foi dado continuação nas tasks iniciadas no dia anterior, como a implementação de telas e desenvolvimento do backend. E também foi inciado criação de queries específicas para retornar dados do histórico, que não há relação com algum requisito.

**Beatriz** -> Continua implementação tela dashboard (DW07)   
**Darcy** -> Desenvolve queries SQL para coleta de dados de histórico    
**Júlia** -> Auxilia na criação de endpoints e faz relatório do dia     
**Kauã** -> Finaliza tratamento de coordenadas ausentes (TP17)  
**Lorenzo** -> Continua implementação da tela de comparação (DW11)  
**Mariana** -> Finaliza ciação de endpoints (TP18)

---

#### 25/out e 26/out
Esse final de semana não foi tão produtivo, pois ocorreu o 2° turno das eleições, e não conseguimos produzir tanto por motivos pessoais de vários membros.  
Portanto, o desenvolvimento dos dois dias está sendo juntado em apenas um item.  

**Beatriz** -> Finaliza implementação tela dashboard (DW07)   
**Darcy** -> Faz documento para auxiliar na configuração das APIs auxiliares (ES17)    
**Júlia** -> Ajusta pequenas coisas nos endpoints, inicia integração backend da tela principal e faz relatório (DW08)  
**Lorenzo** -> Finaliza implementação da tela de comparação (DW11)  
**Mariana** -> Finaliza ciação de endpoints (TP18)

---

#### 27/out
De acordo com a falta de desenvolvimento do final de semana, nos organizamos melhor e desenvolvemos o máximo que pudemos nesse dia.  
Continuando com a implementação de erros no frontend, desenvolvimento de READMEs para as pastas e integração de telas com o backend.

**Beatriz** -> Inicia implementação dos estados de loading e erro (DW09)   
**Darcy** -> Faz alterações no documento de instruções da API auxiliar (ES17)  
**Júlia** -> Inicia integração backend da tela principal e faz relatório do dia (DW08)  
**Kauã** -> Inicia documento README backend (ES17)  
**Lorenzo** -> Faz correções tela comparação  
**Mariana** -> Inicia documento README dos endpoints (ES17)  

---

#### 31/out
Hoje foi iniciado o sistema de segurança da aplicação, começando a autenticação JWT no backend.  
Também foi iniciado o mecanismo de coleta periódica, que é muito importante pois guarda os históricos de métricas de todos os serviços, que irá ser usado na 3° sprint nas telas de dashboard, ranking e comparação.  

**Beatriz** -> Finaliza implementação dos estados de loading e erro (DW09)   
**Darcy** -> Inicia mecanismo de coleta periódica (TP16)  
**Júlia** -> Continua integração backend da tela principal e faz relatório do dia (DW08)  
**Kauã** -> Finaliza documento README backend (ES17)  
**Lorenzo** -> Faz autenticação JWT (TP12)  
**Mariana** -> Finaliza documento README dos endpoints (ES17)  

---

#### 01/nov
Foi iniciado os READMEs da pasta de frontend e do database, que ajuda desenvolvedores a entender como cada parte funciona, e como fazer alterações nela, caso necessário.

**Beatriz** -> Faz correções de cores dos temas nos avisos e erros (DW09)   
**Darcy** -> Continua mecanismo de coleta periódica (TP16)  
**Júlia** -> Finaliza integração backend da tela principal e faz relatório do dia (DW08)  
**Kauã** -> Faz documento README frontend (ES17)  
**Lorenzo** -> Implementa validação de login e logout (DW05 e DW06)   
**Mariana** -> Inicia documento README do database (ES17) 

---

#### 03/nov
Nesse dia, o mecanismo de coleta periódica foi finalizado, que era uma das adições mais esperadas pelo grupo, para permitir que o histórico fosse guardado automaticamente.  
Também foi iniciado integrações com backend de algumas telas.

**Beatriz** -> Inicia implementação dos estados de loading e erro (DW09)   
**Darcy** -> Finaliza mecanismo de coleta periódica e inicia integração backend tela de ranking (TP16 e DW10)  
**Júlia** -> Faz relatório e cria documento de nomeação de branches e commits  
**Kauã** -> Faz integração backend tela de comparação (DW11)  
**Lorenzo** -> Inicia implementação tratamento de erros no login (DW05)  
**Mariana** -> Finaliza documento README do database (ES17)  

---

#### 06/nov
O roteiro do vídeo foi iniciado nesse dia, definindo o que cada membro irá falar.  
O principal foram as integrações das telas de ranking e cadastro com o backend e vários ajustes no código do servidor, também.

**Beatriz** -> Inicia implementação dos estados de loading e erro (DW09)   
**Darcy** -> Continua integração backend tela de ranking (DW10)  
**Júlia** -> Faz relatório e cria documento de nomeação de branches e commits  
**Kauã** -> Inicia integração backend tela de cadastro (DW12)  
**Lorenzo** -> Inicia implementação tratamento de erros no login (DW05)  
**Mariana** -> Faz ajustes na detecção de alteração na lista de serviços (TP13)  

---

#### 07/nov
Os testes de integração foram continuados da sprint anterior, para serem finalizados para cobrir quase todas as rotas, e garantir suas integridades.  
A edição do vídeo foi iniciada, separando as cenas e gravando os clipes para serem juntados com as falas posteriormente.  

**Beatriz** -> Desenvolve e edita vídeo (ES14)    
**Darcy** -> Finaliza integração backend tela de ranking (DW10)  
**Júlia** -> Faz ajustes na integração do backend com o loading, avisos e erros  
**Kauã** -> Finaliza integração backend tela de cadastro/admin (DW12)  
**Lorenzo** -> Finaliza implementação tratamento de erros no login e inicia tratamento de erros no cadastro (DW05)  
**Mariana** -> Inicia testes de integração (ES17)  

---

#### 08/nov
Nesse dia, o vídeo foi finalizado, adicionando os áudios de todos os membros e terminando a edição.  
De tasks funcionais, o grupo inteiro colaborou em terminar e ajustar os testes de implementação, autenticação JWT, tratamento de erros e outras funcionalidades do backend. Completando por fim todas as tasks da sprint.   

---

#### 09/nov  
Este é o dia da Sprint Review. Não houve daily pois o desenvolvimento já foi concluído no dia anterior.  
Caso queira ver sobre as informações da Sprint Review, veja [esse link](https://github.com/atmosabp/greener/blob/develop/docs/sprints/sprint-2.md).

</details>

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
