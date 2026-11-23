<br>
<div align="center">
<img src="../docs/design/logo-greener.svg" width="120">

<br>

# GreenER - Frontend

</div>

<br>

<div align="center">

[Sobre](#sobre) - [Tecnologias](#tecnologias-utilizadas) - [Estrutura](#estrutura-de-arquivos) - [Rotas](#rotas-e-páginas) - [Componentes](#componentes) - [Providers e hooks](#providers-contextos-e-hooks) - [Autenticação](#autenticação-e-sessão) - [Backend](#comunicação-com-o-backend) - [Carregamento](#carregamento-skeleton-e-loading) - [Tema](#sistema-de-temas) - [Execução](#instruções-para-execução) - [Docker](#docker-e-nginx) - [Status](#status-atual-e-próximos-passos)

</div>

<br>

## Sobre

Este diretório contém a interface web do **GreenER**.

O frontend é uma *Single Page Application* (SPA) feita com **React**, **TypeScript** e **Vite**.  

Os dados são fornecidos pelo servidor em `backend/`, que por sua vez consome as APIs auxiliares do cliente.

<br>

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
| ---------- | -------------- |
| [React](https://react.dev/) | Biblioteca de construção da interface |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vite.dev/) | Servidor de desenvolvimento e build |
| [React Router](https://reactrouter.com/) (`react-router-dom`) | Roteamento entre páginas e proteção de rotas |
| [react-globe.gl](https://github.com/vasturiano/react-globe.gl)| Globo 3D interativo |
| [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/) e [drei](https://github.com/pmndrs/drei) | Renderização 3D (base do globo) |
| [Leaflet](https://leafletjs.com/) e [react-leaflet](https://react-leaflet.js.org/) | Mapa 2D interativo (tiles do OpenStreetMap) |
| [lucide-react](https://lucide.dev/) | Ícones |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | Ícones complementares, carregados via `index.html` |
| [ESLint](https://eslint.org/) + typescript-eslint | Padronização e análise estática do código |
| [Docker](https://www.docker.com/) | Empacotamento e entrega da aplicação |

<br>

## Estrutura de arquivos

```
frontend/
├ public/
│ └ icon.svg                  # Ícone (favicon) da aplicação
├ src/
│ ├ assets/                   # Logos, imagens da landing page, árvores decorativas e animações
│ ├ components/
│ │ ├ calendar/               # Calendário em modal para escolher uma data (Dashboard)
│ │ ├ footer/                 # Rodapé da landing page
│ │ ├ form/                   # Form genérico, CadForm, AltForm e Validators
│ │ ├ greetings/              # Saudação "Bom dia, nome." das telas internas
│ │ ├ header/                 # Header base, LandingHeader, AppHeader e CadHeader
│ │ ├ loading/                # Tela de carregamento com a logo animada
│ │ ├ loginForm/              # Formulário de login com validação
│ │ ├ protectRoute/           # ProtectedRoute: protege rotas que exigem login
│ │ ├ skeleton/               # Skeleton, SkeletonBoundary e useSkeleton
│ │ ├ themeToggle/            # Alternador de modo (claro/escuro) e paleta
│ │ ├ toast/                  # Aviso temporário de sucesso ou erro
│ │ └ warning/                # Modal de confirmação (sair, deletar)
│ ├ contexts/
│ │ ├ ThemeContext.tsx        # Contexto do tema
│ │ └ ToastContext.tsx        # Contexto dos toasts
│ ├ hooks/
│ │ ├ useTheme.ts             # Hook de acesso ao contexto do tema
│ │ └ useToast.ts             # Hook para exibir toasts
│ ├ pages/
│ │ ├ admin/                  # Administração de usuários
│ │ ├ comparison/             # Comparação entre serviços (components/ com dados e cartões)
│ │ ├ dashboard/              # Dashboard de métricas de um serviço
│ │ ├ home/                   # Explorador de serviços (globo e mapa)
│ │ ├ login/                  # Tela de login
│ │ └ ranking/                # Ranking de emissões (components/ com calendário e dados)
│ ├ providers/
│ │ ├ LoadingProvider.tsx     # Provedor da tela de carregamento (ainda não usado nas rotas)
│ │ ├ ThemeProvider.tsx       # Provedor do tema (persistência e aplicação)
│ │ └ ToastProvider.tsx       # Provedor dos toasts
│ ├ types/                    # Tipos compartilhados (form, header, login, service, theme, toast, warning)
│ ├ utils/
│ │ ├ connection.ts           # Porta do backend
│ │ └ logoff.ts               # Função de logout
│ ├ App.tsx / App.css         # Landing page (rota "/")
│ ├ index.css                 # Estilos globais e variáveis de tema
│ └ main.tsx                  # Ponto de entrada, providers e definição das rotas
├ Dockerfile                  # Imagem usada pelo compose (executa o servidor do Vite)
├ Dockerfile.dev              # Imagem alternativa de desenvolvimento
├ eslint.config.js            # Regras de lint
├ index.html                  # HTML base da SPA
├ vite.config.ts              # Configuração do Vite
├ tsconfig*.json              # Configurações do TypeScript
└ package.json                # Dependências e scripts
```

Cada página e componente mantém seu arquivo `.css` ao lado do `.tsx`, facilitando a manutenção dos estilos.

<br>

## Rotas e páginas

As rotas são definidas em `src/main.tsx`. Qualquer endereço que não exista redireciona para `/`.

| Rota | Página | Acesso |
| ---- | ------ | ------ |
| `/` | Landing page (`App.tsx`) | Pública |
| `/login` | Login | Pública |
| `/home` | Visão geral (globo e mapa) | Usuário logado |
| `/dashboard/:serviceId` | Dashboard de um serviço | Usuário logado |
| `/ranking` | Ranking de emissões | Usuário logado |
| `/comparison` | Comparação entre serviços | Usuário logado |
| `/admin` | Administração de usuários | Somente administrador |

<br>

### Landing page (`/`)

Página pública dividida em seções navegáveis pelo header: **O que é**, **Missão**, **Funcionalidades** e **Resultado**. Aqui é onde todo nosso sistema é explicado e passado um panorama geral do que somos. Além dessas, a página tem as seções **Panorama** (gráficos de consumo de datacenters), **Critério de sucesso** e **Se interessou?** (como conseguir acesso).

Detalhes de implementação:

- banner com animação de órbita (ícones de CPU, memória, disco, rede, energia, nuvem e água) e letreiro em movimento;
- animações de entrada ao rolar a página, controladas por atributos `data-reveal` e `data-stagger` e por um `IntersectionObserver`;
- barra de progresso de rolagem no topo e números que "contam" até o valor final (`CountUp`);
- os conteúdos dos cards (passos da missão, funcionalidades, indicadores e dados do panorama) ficam em listas no começo do `App.tsx`, o que facilita a manutenção dos textos.

### Login (`/login`)

Tela de validação de usuário, com o formulário em `LoginForm`:

- **E-mail:** campo obrigatório e formato válido (`texto@dominio.com`);
- **Senha:** campo obrigatório (o tamanho mínimo é validado apenas no cadastro de usuários);
- mensagens de erro exibidas ao perder o foco do campo ou ao enviar, em forma de **toast**;
- o botão com o "olho" mostra a senha apenas enquanto estiver pressionado;
- ao enviar, chama `POST /auth/login`; se der certo, guarda o token e os dados do usuário (veja [Autenticação e sessão](#autenticação-e-sessão)) e redireciona: **administradores vão para `/admin`** e os demais usuários para `/home`.

### Visão geral (`/home`)

Tela principal da aplicação. Possui: nosso globo terrestre e mapa geográfico, onde temos nossa funcionalidade principal nesta tela, lista de serviços e marcações geográficas de cada serviço.

- **painel lateral** com a lista de serviços, numeração, status e contadores por status (ativos, incompletos e inativos);
- **alternância entre Globo e Mapa**;
- atalhos para **Ranking** e **Comparação**;
- seleção de serviço sincronizada entre a lista, o globo e o mapa;
- horário da **última atualização** e atualização automática dos dados (padrão: a cada 5 segundos, ou o valor escolhido em `refresh_interval`);
- **skeleton** enquanto a primeira resposta não chega. Se o backend não responder em 15 segundos, a tela desiste de esperar e mostra o estado vazio ("Nenhum serviço foi encontrado.").

Os serviços seguem este formato (`types/service.ts`):

```ts
type ServiceStatus = "active" | "incomplete" | "inactive";

interface ServiceType {
  id: string;
  name: string;
  status: ServiceStatus;
  location?: CoordinatesType;   // region_code, country, region, city, latitude, longitude
  metrics_path?: string;
  metrics?: MetricsType;        // cpu_percent, memory_gb, disk_gb, network_gb, co2e, kwh, renewable_percent, carbon_intensity
}
```

#### Globo 3D (`InteractiveGlobe`)

- Rotação automática, pausada ao passar o cursor e também enquanto houver um serviço selecionado;
- um card com detalhes do serviço (CPU, CO₂e, memória e energia) é exibido ao selecionar um ponto, com o botão **Ver detalhes**, que leva ao `/dashboard/:serviceId`;
- clicar fora do globo fecha o card;
- o visual (imagem do globo e cor dos detalhes) acompanha o modo claro/escuro do tema.

#### Mapa 2D (`MapVisualization`)

- Mapa com marcação de serviços com pontos coloridos por status (verde, amarelo e vermelho);
- apenas serviços com latitude e longitude válidas aparecem no mapa;
- ao selecionar um serviço, o mapa centraliza nele com animação;
- clicar em uma área vazia limpa a seleção;
- card com detalhes do serviço (`ServiceCard`), com o botão **Ver detalhes** para o `/dashboard/:serviceId`.

### Dashboard (`/dashboard/:serviceId`)

Mostra os dados de **um** serviço, que vem do parâmetro `serviceId` da URL. Os dados são atualizados automaticamente, e a tela exibe:

- **cartões de identificação:** serviço selecionado, status e localização;
- **energia (kWh) e emissão (CO₂e)** da última coleta;
- **carrossel de métricas** (em telas pequenas) com CPU, memória, armazenamento e rede;
- **energia renovável**, em porcentagem;
- **intensidade de carbono**, classificada como *Baixo* (até 100), *Médio* (de 101 a 500) ou *Alto* (acima de 500) gCO₂e/kWh;
- lista **Outros serviços**, para trocar de serviço rapidamente (serviços inativos aparecem desabilitados);
- seletor **Atualizações** (5, 10, 15, 30, 60 ou 120 segundos). A escolha é salva em `localStorage` (`refresh_interval`) e a página é recarregada;
- seletor de data (**Hoje** ou **Escolher data**), que abre o `Calendar`;
- botão para voltar ao topo.

Se o serviço estiver inativo (sem métricas), a tela avisa que não é possível recolher as métricas e orienta a escolher outro serviço.

### Ranking (`/ranking`)

Tabela que ordena os serviços do maior para o menor, de acordo com a métrica escolhida:

- botões para alternar entre **Energia** (kWh) e **CO₂e**;
- serviços sem valor para a métrica ficam no final da lista;
- serviços ativos têm um link para o dashboard;
- seletor **Atualizações** e botão para atualizar na hora, com o horário da última atualização;
- seletor de período (**Agora**, **Hoje**, **Esse mês**, **Esse ano** e **Outros anos**), que abre o calendário do ranking (`rankingCalendar`) para escolher hora, dia, mês ou ano.

### Comparação (`/comparison`)

Compara as métricas de dois ou mais serviços lado a lado:

- todos os serviços começam selecionados, e **não é possível deixar menos de 2** selecionados;
- cada serviço é um cartão (`ServiceCard`) com CPU, energia, CO₂e, intensidade de carbono, disco, memória e rede;
- um serviço pode ser marcado (estrela) como **referência**; os demais mostram a diferença percentual em relação a ele ou em relação à **média** dos selecionados;
- medidores (`Gauge`) de consumo e de emissão, com escala baseada no maior valor entre os selecionados;
- a intensidade de carbono é classificada como *Baixo* (menos de 100), *Médio* (menos de 200) ou *Alto* gCO₂e/kWh;
- cada cartão tem setas para **reordenar** a posição do serviço, e o menu de ajuda (`Popover`) explica os conceitos.

Os dados vêm de `GET /collections/all-service-data` e são tratados em `components/comparisonData.tsx`, que também guarda as funções de formatação e de cálculo (média, máximo e diferença percentual). Se a intensidade de carbono não vier do backend, ela é calculada como `co2e / kwh`.

### Administração (`/admin`)

Tela exclusiva para administradores, para gerenciar os usuários com acesso à plataforma:

- tabela com **ID, nome e e-mail** (em telas pequenas vira uma lista expansível);
- **cadastrar** usuário (`CadForm`), **alterar** nome, e-mail e senha (`AltForm`, a senha em branco mantém a atual) e **deletar** um ou vários usuários selecionados;
- seleção por checkbox, com opção de selecionar todos da página;
- paginação, com 5, 10, 15, 20 ou 50 itens por página;
- confirmação antes de deletar, pelo componente `Warning`;
- mensagens de sucesso e de erro (conexão, sessão expirada, e-mail duplicado, sem permissão...) exibidas em toasts;
- usuários cadastrados por essa tela **sempre** são criados como usuários comuns (`isAdm: false`).

Os dados vêm das rotas `/users` do backend, enviando o token no cabeçalho `Authorization`.

<br>

## Componentes

| Componente | Local | Função |
| ---------- | ----- | ------ |
| `Header` | `components/header/Header.tsx` | Cabeçalho base e responsivo: recebe `links`, `action`, `message` e `activeHref`. Encolhe ao rolar a página, se esconde ao descer e vira menu lateral (com *scrim*) em telas menores que 1024 px. Adiciona o link **Gerenciamento** (`/admin`) quando o usuário logado é administrador |
| `LandingHeader` | `components/header/LandingHeader.tsx` | Header da landing page, com âncoras para as seções e botão de login |
| `AppHeader` | `components/header/AppHeader.tsx` | Header da área logada, com links para Visão Geral, Ranking e Comparação, saudação e botão de sair (com confirmação) |
| `CadHeader` | `components/header/CadHeader.tsx` | Header da tela de administração: sem links de navegação, com saudação e botão de sair |
| `Footer` | `components/footer/Footer.tsx` | Rodapé da landing page, com tópicos, redes sociais e link para o repositório |
| `LoginForm` | `components/loginForm/LoginForm.tsx` | Formulário de login com validação |
| `Form` | `components/form/Form.tsx` | Formulário genérico em modal: recebe `title`, `fields`, `submitLabel` e `onSubmit`, e cuida de valores, validação, olho da senha, tecla Esc e estado de envio |
| `CadForm` | `components/form/CadForm.tsx` | Formulário de cadastro de usuário (nome, e-mail, senha e confirmação) |
| `AltForm` | `components/form/AltForm.tsx` | Formulário de alteração de usuário (a nova senha é opcional) |
| `Validators` | `components/form/Validators.ts` | Funções de validação reutilizáveis (`required`, `email`, `minLength`, `matches`, `compose`, `optional`) |
| `Toast` | `components/toast/Toast.tsx` | Aviso de sucesso ou erro que some sozinho em 5 segundos, com barra de progresso |
| `Warning` | `components/warning/Warning.tsx` | Modal de confirmação com as variantes `logout` (sair) e `delete` (deletar) |
| `Calendar` | `components/calendar/Calendar.tsx` | Calendário em modal; não permite escolher datas futuras |
| `Greeting` | `components/greetings/Greeting.tsx` | Saudação conforme o horário (Bom dia, Boa tarde, Boa noite) com o nome do usuário logado |
| `ProtectedRoute` | `components/protectRoute/ProtectedRoute.tsx` | Valida o token no backend e libera ou bloqueia as rotas internas |
| `Skeleton` / `SkeletonText` | `components/skeleton/Skeleton.tsx` | Blocos animados que imitam o conteúdo enquanto os dados carregam |
| `SkeletonBoundary` | `components/skeleton/SkeletonBoundary.tsx` | Alterna entre o skeleton e o conteúdo real, evitando que ele "pisque" em respostas rápidas |
| `Loading` | `components/loading/Loading.tsx` | Tela de carregamento com a logo, animação e mensagens que se alternam |
| `ThemeToggle` | `components/themeToggle/ThemeToggle.tsx` | Alterna modo claro/escuro e escolhe a paleta (verde ou azul) |

O tipo `HeaderLink` (`types/header.ts`) permite que um link seja interno (`to`, usa `NavLink`) ou uma âncora (`href`).

### Formulários e validação

O `Form` é genérico: cada formulário apenas declara uma lista de campos (`FieldConfig`) com `name`, `label`, `type`, `placeholder`, `required` e uma função `validate`. 

Ao enviar, todos os campos são validados e apenas um toast é exibido, com o primeiro erro na ordem dos campos. Cada erro pode ser um texto simples ou um objeto `{ title, message }`, para o toast ter um título próprio.

<br>

## Providers, contextos e hooks

Os providers envolvem toda a aplicação em `main.tsx`, nesta ordem: `ThemeProvider` → `ToastProvider` → `BrowserRouter`.

| Provider | Contexto / Hook | O que oferece |
| -------- | --------------- | ------------- |
| `ThemeProvider` | `ThemeContext` / `useTheme` | `mode`, `palette`, `changeMode` e `changePalette` |
| `ToastProvider` | `ToastContext` / `useToast` | `showToast(icon, title, message?)`. Mostra um toast por vez; um novo toast substitui o anterior e reinicia o tempo |
| `LoadingProvider` | `useLoading` | `showLoading()` e `hideLoading()`, que exibem a tela de carregamento e travam a rolagem da página. **Ainda não está montado em `main.tsx`** |

<br>

## Autenticação e sessão

A autenticação usa o token JWT devolvido por `POST /auth/login`:

| Onde | O que é guardado | Para que serve |
| ---- | ---------------- | -------------- |
| `sessionStorage` → `token` | Token JWT | Enviado em `Authorization: Bearer <token>`. Some ao fechar a aba |
| `localStorage` → `user` | Dados do usuário (`id`, `name`, `email`, `isAdm`) | Saudação, link de gerenciamento no header e tela de administração |
| `localStorage` → `refresh_interval` | Intervalo de atualização em segundos | Compartilhado entre Home, Ranking e Dashboard |
| `localStorage` → `theme-mode` e `theme-palette` | Tema escolhido | Veja [Sistema de temas](#sistema-de-temas) |

### Proteção das rotas (`ProtectedRoute`)

O componente envolve as rotas internas e, a cada acesso, valida a sessão chamando `GET /auth/me`:

- **sem token** ou resposta `401` → redireciona para `/login` (e limpa os dados guardados no caso de `401`);
- **erro de conexão ou do servidor** → também redireciona para `/login`;
- com `requireAdmin`, se o usuário **não for administrador** → redireciona para `/home`;
- se tudo estiver certo, a página é exibida.

### Logout

A função `logout` (`utils/logoff.ts`) remove o token da sessão e os dados do usuário, e leva o usuário para a landing page (`/`). O botão **Sair** do header sempre pede confirmação pelo componente `Warning`.

<br>

## Comunicação com o backend

Todas as chamadas usam `fetch` para `http://localhost:{porta}`, em que a porta vem de `utils/connection.ts`:

```ts
export const port = import.meta.env.VITE_PORT | 3000;
```

A variável `VITE_PORT` é lida do `.env` da raiz do projeto (o `vite.config.ts` usa `envDir: '../'`). Se ela não existir, a porta padrão é `3000`.

| Tela / componente | Requisição | Observação |
| ----------------- | ---------- | ---------- |
| `LoginForm` | `POST /auth/login` | Envia e-mail e senha |
| `ProtectedRoute` | `GET /auth/me` | Valida o token a cada acesso |
| `Admin` | `GET /users/get-users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` | Com token. A exclusão de vários usuários dispara uma requisição por usuário |
| `Homepage` | `GET /collections/all-service-data` | Atualização automática (5 s por padrão) |
| `Ranking` | `GET /collections/all-service-data` | Atualização automática, ordenada no frontend |
| `Comparison` | `GET /collections/all-service-data` | Uma vez, ao abrir a tela |
| `Dashboard` | `GET /collections/service-metrics/:serviceId` e `GET /collections/all-service-data` | Atualização automática; a segunda alimenta a lista "Outros serviços" |

<br>

## Carregamento: skeleton e loading

Para evitar telas vazias enquanto o backend responde (principalmente porque ele consulta APIs externas), as telas usam **skeletons**: blocos cinzas animados com o formato do conteúdo.

| Peça | Uso |
| ---- | --- |
| `Skeleton` | Bloco básico (`width`, `height`, `radius`, `circle`). Cada página monta o seu skeleton com ele |
| `useSkeleton(loading, minDuration)` | Devolve `true` enquanto o skeleton deve aparecer, garantindo um tempo mínimo (400 ms) para não piscar. É o usado nas páginas |
| `SkeletonBoundary` | Alternativa em componente: só mostra o skeleton se a espera passar de 150 ms e o mantém por pelo menos 400 ms |

Cada página tem seu arquivo de skeleton ao lado (`HomepageSkeleton`, `DashboardSkeleton`, `RankingSkeleton`, `ComparisonSkeleton` e `AdminSkeleton`). Em Home, Ranking e Dashboard, se o backend não responder em **15 segundos**, o skeleton é removido para não ficar carregando para sempre.

O componente `Loading` (tela cheia, com a logo) existe e recebe `data` como propriedade, mas hoje as telas usam skeleton no lugar.

<br>

## Sistema de temas

A aplicação suporta **2 modos** (`light` e `dark`) e **2 paletas** (`green` e `blue`), combinados em 4 temas.

- `ThemeProvider` guarda o modo e a paleta no `localStorage` (chaves `theme-mode` e `theme-palette`). Por padrão, usa modo claro e paleta verde.
- o `index.html` possui um pequeno script que aplica o tema salvo **antes** do React carregar (se não houver tema salvo, usa a preferência de modo escuro do sistema), evitando que a tela "pisque" com o tema errado.
- os valores são aplicados no elemento `<html>` pelos atributos `data-theme` e `data-palette`.
- as cores ficam em variáveis CSS em `src/index.css` (`--primary`, `--primary-light`, `--primary-dark`, `--primary-darker`, entre outras), uma definição para cada combinação.
- o globo 3D também troca de visual conforme o modo;
- para ler ou alterar o tema em qualquer componente, use o hook:

```tsx
import useTheme from "../../hooks/useTheme";

const { mode, palette, changeMode, changePalette } = useTheme();
```

O hook lança um erro caso seja usado fora do `ThemeProvider`, que envolve toda a aplicação em `main.tsx`.

<br>

## Instruções para execução

O frontend fica disponível na porta definida em `FRONT_PORT`. Exemplo: `localhost:8080`. Sem Docker, o Vite usa a porta `5173`.

Para o login e as telas funcionarem, o backend precisa estar rodando e o `.env` da raiz precisa ter `VITE_PORT` com a mesma porta do backend (`PORT`). Além disso, o backend só aceita requisições vindas de `localhost:5173` e `localhost:8080`.

### Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Inicia o servidor de desenvolvimento com recarregamento automático (HMR), acessível pela rede (`--host`) |
| `npm run build` | Verifica os tipos (`tsc -b`) e gera a versão de produção na pasta `dist/` |

<br>

## Docker

No `compose.yaml`, o serviço `frontend` é construído a partir de `frontend/Dockerfile`, expõe a porta `5173` do container na porta `FRONT_PORT` e só inicia depois que o backend estiver saudável.

| Arquivo | Função |
| ------- | ------ |
| `Dockerfile` | Parte de `node:24-alpine`, instala as dependências e executa `npm run dev -- --host 0.0.0.0`. É o usado pelo `docker compose` |
| `Dockerfile.dev` | Versão alternativa para desenvolvimento, baseada em `node:22-alpine`, que copia todo o projeto |
| `.dockerignore` | Evita copiar `node_modules`, `dist`, `.git` e outros arquivos desnecessários para a imagem |

No `vite.config.ts`, o monitoramento de arquivos usa *polling* (`usePolling`), o que garante a recarga automática dentro do container Docker, inclusive no WSL.

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>