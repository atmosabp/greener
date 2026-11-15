## DoD - Definition of Done

<div align="center">

[DoD Sprint 1](#sprint-1) - [DoD Sprint 2](#sprint-2) - [DoD Sprint 3](#sprint-3)

</div>

--- 

Este arquivo demonstra todas as tarefas definidas até a sprint atual, e o que elas precisam ter para serem consideradas "concluídas".


***Importante:*** As listas abaixo organizam as atividades e padronizam suas descrições, mas uma lista de tarefas não constitui, por si só, uma Definition of Done completa. A Definition of Done define os critérios de qualidade que precisam ser atendidos para considerar um item concluído. As atividades individuais listadas neste documento funcionam melhor como tarefas ou issues do Sprint Backlog.<br>
Exemplo de critérios de conclusão para uma tela:
- Implementação concluída conforme o protótipo aprovado.
- Layout responsivo nos dispositivos previstos.
- Funcionalidades implementadas e testadas.
- Código revisado e integrado ao repositório.
- Ausência de erros críticos conhecidos.

<br>

---

### Sprint 1

#### Tela principal
- Tela principal — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela principal — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
- Implementar tela principal: Desenvolver a página principal utilizando React, deixando-a acessível e pronta para envio ao GitHub.
- Tela principal — Responsividade: Adaptar a página principal para dispositivos móveis e tablets, melhorando a navegabilidade.
#### Tela de login
- Tela de login — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela de login — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
- Implementar tela de login: Desenvolver a página de login utilizando React, deixando-a acessível e pronta para envio ao GitHub.
#### Tela de cadastro
- Tela de cadastro — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela de cadastro — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
#### Tela de dashboard
- Tela de dashboard — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela de dashboard — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
#### Tela de ranking
- Tela de ranking — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela de ranking — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
#### Tela de comparação
- Tela de comparação — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela de comparação — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
#### Landing Page
- Tela Landing Page — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela Landing Page — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
- Implementar Landing Page: Desenvolver uma página que apresente o projeto, suas funcionalidades e os integrantes do grupo, seguindo o protótipo definido no Figma.
#### Tela 404
- Tela 404 — Desktop: Desenvolver a tela completa no Figma, pronta para implementação.
- Tela 404 — Mobile: Desenvolver a tela completa no Figma, pronta para implementação.
Avisos e estados da interface
- Definir avisos: Definir a identidade visual dos avisos de carregamento (loading) e de erros.

#### Endpoints e requisições
- Criar endpoints: Definir e implementar os endpoints necessários, utilizando os métodos HTTP pertinentes, como GET, POST, PUT, PATCH e DELETE, e verificar seu funcionamento.
- Consultar /services: Realizar a consulta dos serviços fornecidos pela API.
- Consultar /metrics/{id_servico}: Consultar as métricas de acordo com o identificador do serviço fornecido pela API.
- Consultar Carbon Intensity API: Consultar os dados de intensidade de carbono disponibilizados pela API.
- Implementar testes: Implementar testes automatizados para verificar o funcionamento das requisições e dos endpoints, incluindo operações GET, POST, PUT, PATCH e DELETE, conforme aplicável.

#### Cálculos e métricas
- Calcular emissão total: Calcular a emissão total de CO₂e com base nas métricas fornecidas pela API.
- Implementar cálculo de CO₂e: Implementar os cálculos de emissão de CO₂e de acordo com as métricas fornecidas pela API.
- Calcular consumo total: Calcular o consumo total de energia com base nas métricas fornecidas pela API.
- Calcular serviços ativos e indisponíveis: Utilizar os dados retornados pela API para contabilizar quantos serviços estão ativos e quantos estão indisponíveis.

#### Banco de Dados
- Modelar banco de dados: Modelar o banco de dados para armazenar o histórico de coletas e métricas recebidas das APIs e os dados dos usuários da aplicação.
- Criar banco de dados: Desenvolver o código necessário para criar o banco de dados de acordo com a modelagem, permitindo as funcionalidades requisitadas pelo cliente.
- Criar conexão do banco ao backend: Implementar a conexão entre o banco de dados e o backend, organizando os arquivos nas pastas correspondentes do projeto.

#### Estrutura e Configuração do Projeto
- Criar estrutura do projeto frontend: Organizar as pastas e os arquivos do frontend de acordo com a estrutura fornecida pelo Arley.
Backend
- Criar estrutura do backend em módulos: Organizar as pastas e os arquivos do backend em módulos, seguindo a estrutura fornecida pelo Arley.
Ambiente de desenvolvimento
- Configurar servidor HTTP e variáveis de ambiente: Configurar o servidor HTTP e as variáveis de ambiente necessárias para executar o site localmente e realizar os testes iniciais.
- Conteinerizar o projeto: Criar os arquivos necessários para conteinerizar o projeto, padronizando o ambiente de execução e facilitando a realização de testes simultâneos sem divergências de configuração.

#### Identidade Visual e Branding
- Definir a identidade visual do projeto: Definir os elementos visuais do projeto, incluindo cores, fontes, logotipo e nome.
- Desenvolver a logo para o projeto: Definir e desenvolver o logotipo definitivo do projeto.
- Desenvolver a logo para a equipe: Definir e desenvolver o logotipo definitivo da equipe.

#### Planejamento e Gerenciamento Ágil
- Criar Product Backlog: Criar e manter o Product Backlog para gerenciar as atividades do projeto com base nos requisitos levantados.
- Criar Sprint Backlog referente à 1ª Sprint: Criar o Sprint Backlog para acompanhar e gerenciar as tarefas previstas para a primeira Sprint.
- Criar DoD: Definir e adicionar a descrição da Definition of Done às issues do Kanban referentes à primeira Sprint.
- Desenvolver User Stories e critérios de aceitação: Elaborar as histórias de usuário (User Stories) e seus critérios de aceitação com base nos requisitos informados, facilitando a compreensão das necessidades do cliente e orientando o desenvolvimento.
- Criar e manter o Burndown da 1ª Sprint: Criar e atualizar o gráfico Burndown para acompanhar o progresso das tarefas e visualizar o trabalho restante ao longo da Sprint.

#### Diagramas e Documentação Técnica
- Criar diagrama de sequência: Desenvolver o diagrama de sequência para facilitar a visualização do fluxo de execução do sistema.
- Criar diagrama de classes: Desenvolver o diagrama de classes do projeto.
- Criar diagrama de caso de uso: Desenvolver o diagrama de caso de uso seguindo as normas da UML.
- Criar e manter README.md: Desenvolver e manter o arquivo README.md atualizado durante toda a primeira Sprint, documentando as informações relevantes do projeto.
- Criar relatório da 1ª Sprint: Elaborar o relatório referente à primeira Sprint, registrando as atividades realizadas e os resultados alcançados.

#### Entregas e Apresentação
- Criar vídeo referente à 1ª Sprint: Desenvolver e editar o vídeo final da primeira Sprint para apresentação ao cliente, garantindo uma apresentação profissional e a participação de todos os integrantes do grupo.

<br>

---

<br>

### Sprint 2
O formato do DoD foi alterado para detalhar mais sobre cada requisito e as tarefas relacionadas a ele. Assim como identificar o responsável por cada tarefa.

- BD04 -> Criar estrutura para armazenar histórico das coletas.  
**Responsável:** Darcy
    - Estrutura criada conforme o modelo de dados definido.
    - Campos, tipos, chaves e relacionamentos necessários.
    - Estrutura criada com sucesso no ambiente de desenvolvimento.
    - Teste de inserção e consulta de registros realizado.

- DW05 -> Implementar validação de login (conexão com o back)  
**Responsável:** Lorenzo
    - Formulário envia as credenciais para o endpoint correto.
    - Respostas de sucesso e falha do backend são tratadas.
    - Credenciais inválidas não permitem acesso.
    - Testes realizados com credenciais válidas e inválidas.

- DW05 -> Implementar tratamento de erros no cadastro  (conexão com o back)  
**Responsável:** Lorenzo
    - Erros retornados pelo backend são identificados e tratados.
    - Mensagens de erro são claras e não expõem informações sensíveis.
    - O estado de carregamento é encerrado após sucesso ou falha.
    - Fluxos de cadastro válido e de erro foram testados.

- DW05 -> Implementar tratamento de erros no login  (conexão com o back)  
**Responsável:** Beatriz  
    - Erros de autenticação e de conexão são tratados.
    - Mensagens de erro são exibidas de forma compreensível.
    - Informações sensíveis não são expostas nas mensagens.
    - Em caso de falha, o usuário permanece no fluxo de login.
    - Cenários de credenciais inválidas e falha de conexão foram testados.

- DW06 -> Implementar logout  
**Responsável:** Lorenzo
    - A opção de logout está disponível ao usuário autenticado.
    - Token e estado de autenticação são removidos ou invalidados conforme a arquitetura do projeto.
    - O usuário é redirecionado para a tela pública ou de login.
    - Após o logout, o acesso às rotas protegidas é bloqueado.

- DW07 | Implementar dashboard  
**Responsável:** Beatriz  
    - Dashboard implementada conforme o protótipo ou requisitos definidos.
    - Componentes e indicadores previstos estão presentes.
    - Estados sem dados ou com dados indisponíveis são tratados sem inventar valores.
    - Layout verificado nos tamanhos de tela previstos.
    - Não existem erros críticos que impeçam o uso da tela. 

- DW07 | Conectar backend das APIs na dashboard   
**Responsável:** Júlia
    - Dashboard realiza chamadas aos endpoints necessários do backend.
    - Dados recebidos são apresentados nos componentes correspondentes.
    - Estados de carregamento, ausência de dados e falha são tratados.
    - Integração testada com respostas de sucesso e de erro.

- DW08 | Implementar atualização dos dados na tela principal (conexão com o back)  
**Responsável:** Júlia
    - Tela principal obtém os dados dos serviços a partir do backend.
    - Atualização dos dados ocorre conforme o mecanismo definido para o projeto.
    - Atualizações não geram duplicações ou estados inconsistentes.
    - Cenários de resposta bem-sucedida e falha na requisição foram testados.

- DW09 | Implementar estados de loading e erro (geral - frontend)  
**Responsável:** Beatriz
    - Componentes visuais de carregamento e erro foram implementados.
    - Estados seguem a identidade visual do projeto.
    - Mensagens são legíveis e compreensíveis.
    - Os estados não bloqueiam desnecessariamente a navegação.
    - Interface verificada nos tamanhos de tela previstos.

- DW09 | Implementar estados de loading e erro (geral - backend)  
**Responsável:** Júlia
    - Requisições exibem estado de carregamento quando necessário.
    - Erros de resposta e de conexão são tratados.
    - O carregamento é encerrado após sucesso ou falha.
    - Fluxos de sucesso e erro foram verificados nas integrações aplicáveis.


- DW10 | Implementar tela de ranking  
**Responsável:** Lorenzo
    - Tela implementada conforme o protótipo ou requisitos definidos.
    - Itens e indicadores previstos estão presentes.
    - Ordenação respeita as regras de ranking definidas para o projeto.
    - Estados de carregamento, ausência de dados e erro são tratados.

- DW10 | Conectar backend na tela de ranking  
**Responsável:** Darcy
    - Tela realiza chamada ao endpoint de ranking do backend.
    - Dados recebidos são mapeados e exibidos corretamente.
    - Respostas vazias e erros são tratados adequadamente.
    - Integração testada com respostas de sucesso e de falha.

- DW11 | Implementar tela de comparação  
**Responsável:** Lorenzo 
    - Tela implementada conforme o protótipo ou requisitos definidos.
    - Usuário consegue selecionar e visualizar os itens previstos para comparação.
    - Dados comparados são apresentados de forma clara e consistente.
    - Estados de carregamento, ausência de dados e erro são tratados.

- DW11 | Conectar backend na tela de comparação  
**Responsável:** Kauã
    - Tela realiza chamadas ao backend para obter os dados de comparação.
    - Dados recebidos são associados aos serviços corretos.
    - Comparação é atualizada quando a seleção muda, caso previsto nos requisitos.
    - Respostas vazias e erros são tratados.
    - Integração foi testada.

- DW12 | Implementar tela de cadastro (admin)  
**Responsável:** Beatriz
    - Tela de cadastro administrativo implementada conforme os requisitos definidos.
    - Campos obrigatórios e validações previstos estão presentes.
    - Mensagens de sucesso, erro e carregamento são exibidas quando necessário.
    - Fluxo de cadastro verificado nos tamanhos de tela previstos.

- DW12 | Conectar backend na cadastro (admin)  
**Responsável:** Lorenzo
    - Formulário envia os dados para o endpoint correto do backend.
    - Respostas de sucesso e falha são tratadas.
    - Erros de validação e conexão são comunicados ao usuário.
    - Cadastro com dados válidos e inválidos foi testado.

- ES13 | Criar Sprint Backlog referente a 2° sprint  
**Responsável:** Todos
    - Sprint Backlog da segunda sprint foi criado e está acessível à equipe.
    - Tarefas, responsáveis e estimativas estão registrados conforme o planejamento.
    - Organização permite acompanhar o progresso das atividades.
    - Conteúdo revisado pela equipe.

- ES14 | Criar vídeo referente a 2° sprint  
**Responsável:** Todos
    - Vídeo apresenta os objetivos, entregas e resultados da segunda sprint.
    - Demonstrações correspondem ao estado real do projeto.
    - Áudio, imagem e edição estão claros e compreensíveis.
    - Vídeo exportado, revisado e compartilhado com a equipe conforme necessário. 

- ES16 | Criar e manter Burn da 2° sprint  
**Responsável:** Júlia
    - Gráfico Burndown da segunda sprint foi criado.
    - Dados refletem as estimativas e o progresso das tarefas.
    - Gráfico atualizado ao longo da sprint conforme as mudanças de progresso.
    - Versão mais recente está acessível à equipe.

- ES06 | Criar e manter README.md  
**Responsável:** Júlia
    - README.md principal existe na raiz do projeto.
    - Objetivo e descrição geral do projeto estão documentados.
    - Instruções para configuração e execução estão documentadas ou referenciadas.
    - Documento revisado e atualizado conforme as entregas da sprint. 

- ES17 | Documentar endpoints desenvolvidas pela equipe  
**Responsável:** Mariana
    - Endpoints desenvolvidos pela equipe estão listados.
    - Método HTTP, rota, finalidade e parâmetros estão documentados.
    - Exemplos de requisição, resposta e erros são incluídos quando aplicável.

- ES17 | Documentar orientações para configurar o acesso às APIs auxiliares.  
**Responsável:** Darcy
    - APIs auxiliares utilizadas pelo projeto estão identificadas.
    - Pré-requisitos e etapas de configuração estão documentados.
    - Variáveis de ambiente necessárias estão descritas sem expor credenciais reais.
    - Instruções revisadas e verificadas pela equipe.

- ES17 | Desenvolver README da pasta frontend.  
**Responsável:** Kauã
    - README criado dentro da pasta frontend.
    - Finalidade e organização do frontend estão descritas.
    - Dependências e comandos para instalação e execução estão documentados.
    - Instruções verificadas e ausência de credenciais ou segredos confirmada.

- ES17 | Desenvolver README da pasta backend.  
**Responsável:** Kauã
    - README criado dentro da pasta backend.
    - Finalidade e organização do backend estão descritas.
    - Dependências e comandos para instalação e execução estão documentados.
    - Variáveis de ambiente e integrações necessárias estão descritas sem expor segredos.
    - Instruções revisadas pela equipe.

- ES17 | Desenvolver README da pasta database.  
**Responsável:** Mariana
    - README criado dentro da pasta database.
    - Finalidade da pasta e organização dos arquivos estão descritas.
    - Instruções para criação e configuração do banco de dados estão documentadas.
    - Procedimentos de migração ou inicialização são descritos quando aplicáveis.
    - Documento revisado e sem credenciais expostas.

- TP12 | Implementar autenticação com JWT  
**Responsável:** Lorenzo
    - Autenticação com JWT implementada conforme a arquitetura definida.
    - Backend verifica a validade do token e sua expiração.
    - Rotas protegidas rejeitam tokens ausentes, inválidos ou expirados.
    - Segredos de autenticação não são armazenados no repositório.
    - Testes realizados com tokens válidos, inválidos, ausentes e expirados, quando aplicável.

- TP13 | Detectar alterações na lista de serviços  
**Responsável:** Mariana
    - Lista atual de serviços é comparada com uma referência anterior.
    - Inclusões, remoções e alterações relevantes são identificadas.
    - Comparações não geram detecções duplicadas indevidas.
    - Cenários com lista inalterada e lista modificada foram testados.

- TP14 | Detectar serviços sem métricas  
**Responsável:** Mariana
    - Serviços sem as métricas esperadas são identificados.
    - Ausência de métrica é diferenciada de um valor válido igual a zero.
    - Serviço afetado pode ser identificado no resultado da verificação.
    - Testes realizados com serviços que possuem e não possuem métricas.

- TP15 | Persistir métricas coletadas no banco de dados  
**Responsável:** Darcy  
    - Métricas coletadas são armazenadas no banco de dados.
    - Cada registro é associado ao serviço correspondente e ao horário da coleta.
    - Tipos e campos respeitam o modelo de dados definido.
    - Teste de inserção e consulta dos dados persistidos foi realizado.

- TP16 | Criar mecanismo de coleta periódica  
**Responsável:** Darcy
    - Coleta é executada no intervalo configurado.
    - Cada execução realiza as consultas previstas.
    - Falhas são tratadas e registradas conforme o mecanismo definido.
    - Uma falha não impede indevidamente as próximas execuções.
    - Funcionamento periódico foi testado.

- TP17 | Tratar coordenadas ausentes  
**Responsável:** Kauã 
    - Latitude e longitude são validadas antes de serem utilizadas.
    - Ausência de coordenadas não provoca falha inesperada na aplicação.
    - Comportamento para serviços sem coordenadas está definido e implementado.
    - Coordenadas inválidas são tratadas adequadamente.
    - Casos válidos, ausentes e inválidos foram testados.

- TP18 | Criar mais endpoints  
**Responsável:** Mariana
    - Endpoints adicionais previstos nos requisitos foram implementados.
    - Cada endpoint utiliza o método HTTP adequado.
    - Parâmetros, validações e respostas estão definidos.
    - Códigos de status e tratamento de erros são coerentes.
    - Endpoints testados e documentados.

- TP19 | Continuar testes de rota  
**Responsáveis:** Júlia e Mariana 
    - Rotas previstas para teste estão identificadas.
    - Testes cobrem cenários de sucesso e falha.
    - Códigos de status e estrutura das respostas são verificados.
    - Rotas protegidas são testadas com e sem autenticação, quando aplicável.
    - Testes executados e falhas encontradas registradas ou corrigidas.

- TP20 | Criar teste automatizados  
**Responsáveis:** Júlia e Mariana 
    - Testes automatizados implementados para as funcionalidades previstas.
    - Testes cobrem cenários de sucesso, entradas inválidas e falhas relevantes.
    - Execução dos testes pode ser realizada por um comando documentado.
    - Falhas nos testes são identificadas e não ignoradas indevidamente.
    - Suíte executada e problemas encontrados registrados ou corrigidos.

<br>

---

<br>

### Sprint 3
- FE01 -> Transformar serviços das telas de Ranking e Comparação em componentes clicáveis
**Responsável:** Júlia
    -  Ao clicar em um serviço, o usuário deve ser redirecionado para a Dashboard correspondente
    - As informações exibidas devem corresponder ao serviço selecionado
    - A navegação deve funcionar corretamente, sem erros ou comportamentos inesperados

- FE02 -> Adicionar framework de dropdown para personalização
**Responsável:** Lorenzo
    -  Implementar um componente de Dropdown reutilizável.
    - Permitir a personalização de estilos conforme o design system.
    - Garantir consistência visual com os demais componentes do sistema
    - Garantir responsividade e funcionamento adequado das opções e interações
    - Validar a integração do componente nas telas que utilizam Dropdown. (Dashboard, Ranking e Comparação)

- FE03 -> Skeleton
**Responsável:** Beatriz
    - Implementar componentes Skeleton reutilizáveis
    - Garantir que os Skeletons correspondam à estrutura visual dos conteúdos que serão carregados
    - Aplicar os componentes nas telas necessárias
    - Garantir consistência com o Design System e responsividade
    - Validar a exibição e remoção dos Skeletons após o carregamento dos dados

- FE04 -> Fazer animação de loading
**Responsável:** Júlia
    -  Desenvolver uma ilustração animada para o estado de Loading
    - Garantir que a animação tenha movimento fluido e contínuo
    - Garantir consistência visual com o Design System

- FE05 -> Integrar histórico com as telas
**Responsável:** Darcy
    - Integrar a funcionalidade de Histórico nas telas previstas
    - Exibir os registros correspondentes a cada contexto
    - Garantir que as informações sejam apresentadas corretamente e estejam atualizadas

- FE06 -> Refatoração do backend em classes
**Responsável:** Mariana
    - Criar interfaces para definir os contratos das camadas
    - Implementar as classes em Controller, Service e Repository
    - Aplicar injeção de dependências entre as camadas
    - Garantir a separação de responsabilidades e o baixo acoplamento
    - Preservar as funcionalidades e regras de negócio existentes
    - Validar a integração entre as camadas e o funcionamento geral do sistema

- FE07 -> Tela principal
**Responsável:** Lorenzo
    - Analisar as funcionalidades atuais do Globo e do Mapa.
    - Implementar novas funcionalidades nos componentes.
    - Melhorar a usabilidade e a experiência de interação.
    - Otimizar o desempenho e o tempo de carregamento.
    - Garantir a integração correta com os demais elementos da tela principal.
    - Manter a consistência visual com o Design System.
    - Validar o funcionamento, a responsividade e o desempenho após as alterações.

- FE08 -> Tela 404
**Responsável:** -
    - Desenvolver a interface da tela 404 conforme o design definido
    - Desenvolver responsividade para celulares
    - Desenvolver responsividade para tablets
    - Disponibilizar botão para navegar de volta
    - Garantir consistência com o Design System
    - Implementar tratamento para rotas inexistentes no backend
    - Retornar o status HTTP 404 para endpoints não encontrados
    - Retornar a tela anterior quando clicado no botão "voltar"
    - Garantir compatibilidade com o frontend
    - Validar o comportamento com rotas inexistentes

- BU01 -> Alterar esquema de cores
**Responsável:** Beatriz
    - Corrigir todos os bugs que foram notificados pelos desenvolvedores
    - Seguir o padrão de design do projeto e das telas que foi definido
    - Garantir visual dos formatos responsivos

- BU02 -> Adicionar botão de atualizar serviços na hora
**Responsável:** Darcy
    - As seguintes telas: Tela Principal, Dashboard e Ranking devem ter o botão desenvolvido
    - O botão está funcional, e apresenta uma mensagem de carregamento de requisição, para o UX

- BU03 -> Card de serviço do globo sobrepõe header
**Responsável:** Mariana
    - Em todos os formatos e responsividades de tela o problema não deve existir
    - Não haver gerado outros problemas em relação ao card ou outros componentes da Tela Principal

- BU04 -> Refatorar header
**Responsável:** Kauã
    - Header possui mais animações
    - Botão de sair tem indicador visual quando tem hover (além do cursor mudar)
    - Logo do GreenER tem efeito de hover aparente

- BU05 -> Arruamr header no login
**Responsável:** Mariana
    - Erro visual de sobreposição formulário arrumado para qualquer tamanho, formato e responsividade de tela

- BU06 -> Melhorar desempenho das requisições
**Responsável:** Darcy
    - Desempenho das requisições da aplicação têm melhora aparente OU não possuem tempos de esperas longos demais no geral (descontar erros da API externa).
    - Todos os endpoints e telas citados foram revisados e alterados para melhoria.

- BU07 -> Não permitir usuário selecionar menos de 2 serviços
**Responsável:** Kauã
    - Usuário pode selecionar no mínimo 2 serviços na tela de comparação.

- BU08 -> Padronizar tela principal com o resto do site
**Responsável:** Lorenzo
    - Tamanhos dos textos foram ajustados para seguir o padrão de rem (não px) e manter o mesmo tamanho das outras telas.
    - Componente de lista de serviços é visualmente "igual" (dentro do possível) ao componente de lista de serviços da dashboard.
    - Botões abaixo da lista de serviços foram alterados para seguir o padrão de outros botões.

- BU09 -> Manter elementos da tela de cadastro no topo
**Responsável:** Darcy
    - Os elementos (greetings e tabela) ficam alinhados no topo da página, independente de seu tamanho, formato ou responsividade.

- BU10 -> Refatorar landing page
**Responsável:** Beatriz
    - A tela possui todas as animações e adições que adicionam o interesse visual necessário.
    - As cores e visuais estão harmoniosos.

- BU11 -> Redirecionar administrador logado para tela de cadastro
**Responsável:** Mariana
    - Usuário administrador que acabou de logar é redirecionado para a página de cadastro, ao invés da tela principal.
    - Um usuário normal deve ser redirecionado normalmente para a tela principal.
    - Um link intuitivo foi adicionado, além da logo do header já existente, para redirecionar o usuário para a tela principal.

- BU12 -> Padronizar erros de input para Toast
**Responsável:** Kauã
    - Todos os erros em formato de texto puro nas telas de Login e Cadastro foram retirados.
    - Todos os erros que existiam em formato de texto puro agora possui seu formato em Toast, cubrindo todos eles, sem excluir algum.

- BU13 -> Tratar e padronizar mensagens de erro do backend
**Responsável:** Júlia
    - Mensagens principais dos erros são mostrados como mais user-friendly para os usuários, e não erros que apenas pessoas da área entendem.
    - Todos os erros do backend e do frontend estão formatados para ter o mesmo padrão, e possuem informações úteis para o usuário saber o que fazer em seguida.

- BU14 -> Arrumar toast atrás de scrim
**Responsável:** Kauã
    - Toast definido pela não está mais atrás do scrim.

- BU15 -> Adicionar tooltips e aria-label em componentes
**Responsável:** Darcy
    - Tooltips e aria-labels foram adicionados com as informações necessárias sobre a métrica/componente para o usuário entender sua função.
    - Grande parte dos componentes possuem tooltips para entender suas funcionalidades.

- BU16 -> Padronizar greetings
**Responsável:** Kauã
    - A página de ranking possui saudação
    - As saudações de todas as páginas alteram de acordo com o horário atual (assim como a tela de Comparação).
    - As saudações funcionam nas duas responsividades (mobile e desktop) e não apresentam nenhum problema visual.

- ES06 -> Manter README.md
**Responsável:** Júlia
    - Atualizar o arquivo README.md
    - Manter as informações atualizadas conforme a evolução do projeto
    - Garantir clareza, organização e padronização da documentação

- ES17 -> Finalizar a documentação técnica
**Responsável:** Kauã
    - Atualizar a documentação dos endpoints implementados ou modificados
    - Documentar alterações no banco de dados, se for necessário
    - Atualizar a documentação das funcionalidades e componentes do frontend
    - Garantir que a documentação corresponda à implementação atual
    - Manter a organização e padronização da documentação técnica

- ES18 -> Criar Sprint Backlog referente a 3° sprint
**Responsável:** Todos
    - Selecionar e priorizar os itens do Product Backlog.
    - Detalhar as tarefas necessárias para cada entrega.
    - Definir responsáveis pelas atividades.
    - Estabelecer critérios de aceite para as tarefas.
    - Organizar as atividades no quadro de gerenciamento do projeto.
    - Garantir o alinhamento da equipe quanto às entregas e objetivos da Sprint.

- ES19 -> Criar vídeo referente a 3° sprint
**Responsável:** Todos
    - Elaborar o roteiro de apresentação do vídeo
    - Demonstrar as principais funcionalidades do sistema
    - Apresentar a evolução do projeto e as entregas realizadas
    - Garantir qualidade de áudio, vídeo e clareza na apresentação
    - Realizar a edição do vídeo
    - Publicar vídeo no youtube

- ES20 -> Criar relatório da 3° sprint
**Responsável:** Júlia
    - Documentar as atividades e tarefas realizadas durante a terceira Sprint.
    - Registrar as entregas concluídas e funcionalidades implementadas.

- ES21 -> Criar e manter burndown da 3° sprint  
**Responsável:** Júlia
    - Criar o gráfico Burndown para a Sprint.
    - Registrar o progresso e o trabalho restante ao longo dos dias.
    - Atualizar o gráfico conforme a conclusão das atividades.
    - Apresentar as linhas de progresso ideal e real.
    - Manter o gráfico atualizado durante toda a Sprint.
    - Garantir que as informações estejam alinhadas ao Sprint Backlog.

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>
