<br>
<div align="center">
<img src="../docs/design/logo-greener.svg" width="120">

<br>

# GreenER - Frontend

</div>

<br>

<div align="center">

[Sobre](#sobre) - [Tecnologias](#tecnologias-utilizadas) - [Estrutura](#estrutura-de-arquivos) - [Rotas](#rotas-e-páginas) - [Componentes](#componentes) - [Tema](#sistema-de-temas) - [Execução](#instruções-para-execução) - [Docker](#docker-e-nginx) - [Status](#status-atual-e-próximos-passos)

</div>

<br>

## Sobre

Este diretório contém a interface web do **GreenER**, plataforma que monitora serviços de software, estima seu consumo energético e calcula suas emissões aproximadas de CO₂ equivalente (CO₂e).

O frontend é uma *Single Page Application* (SPA) feita com **React**, **TypeScript** e **Vite**. Ele é responsável por:

- apresentar o projeto na **landing page**;
- autenticar o usuário por e-mail corporativo (tela de **login**);
- exibir os serviços monitorados em um **globo 3D** ou em um **mapa 2D** interativos;
- oferecer telas de **dashboard**, **ranking**, **comparação** e **administração** de usuários;
- permitir alternar entre **tema claro/escuro** e **paleta verde/azul**.

Os dados são fornecidos pelo servidor em `backend/`, que por sua vez consome as APIs auxiliares do cliente. Veja o [README principal](../README.md) para a visão geral do projeto.

<br>

## Tecnologias utilizadas

| Tecnologia | Versão | Uso no projeto |
| ---------- | ------ | -------------- |
| [React](https://react.dev/) | ^19.2 | Biblioteca de construção da interface |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | Tipagem estática |
| [Vite](https://vite.dev/) | ^8.3 | Servidor de desenvolvimento e build |
| [React Router](https://reactrouter.com/) | ^7.18 | Roteamento entre páginas |
| [react-globe.gl](https://github.com/vasturiano/react-globe.gl) | ^2.38 | Globo 3D interativo |
| [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/) e [drei](https://github.com/pmndrs/drei) | ^0.186 / ^9.8 / ^10.7 | Renderização 3D (base do globo) |
| [Leaflet](https://leafletjs.com/) e [react-leaflet](https://react-leaflet.js.org/) | ^1.9 / ^5.0 | Mapa 2D interativo (tiles do OpenStreetMap) |
| [lucide-react](https://lucide.dev/) | ^1.52 | Ícones |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | 1.13.2 (CDN) | Ícones complementares, carregados via `index.html` |
| [ESLint](https://eslint.org/) + typescript-eslint | ^10 / ^8.69 | Padronização e análise estática do código |
| [Docker](https://www.docker.com/) + [Nginx](https://nginx.org/) | - | Empacotamento e entrega da aplicação |

> As versões acima seguem o `package.json`. Para a versão exata instalada, consulte o `package-lock.json`.

<br>

## Estrutura de arquivos

```
frontend/
├ public/
│ └ icon.svg                  # Ícone (favicon) da aplicação
├ src/
│ ├ assets/                   # Logos, imagens da landing page e árvores decorativas
│ ├ components/
│ │ ├ footer/                 # Rodapé da landing page
│ │ ├ header/                 # Header base, LandingHeader e AppHeader
│ │ ├ loginForm/              # Formulário de login com validação
│ │ └ themeToggle/            # Alternador de modo (claro/escuro) e paleta
│ ├ contexts/
│ │ └ ThemeContext.tsx        # Contexto do tema
│ ├ hooks/
│ │ └ useTheme.ts             # Hook de acesso ao contexto do tema
│ ├ pages/
│ │ ├ admin/                  # Administração de usuários
│ │ ├ comparison/             # Comparação entre serviços
│ │ ├ dashboard/              # Dashboard de métricas
│ │ ├ home/                   # Explorador de serviços (globo e mapa)
│ │ ├ login/                  # Tela de login
│ │ └ ranking/                # Ranking de emissões
│ ├ providers/
│ │ └ ThemeProvider.tsx       # Provedor do tema (persistência e aplicação)
│ ├ types/                    # Tipos compartilhados (header, login, theme)
│ ├ App.tsx / App.css         # Landing page (rota "/")
│ ├ index.css                 # Estilos globais e variáveis de tema
│ └ main.tsx                  # Ponto de entrada e definição das rotas
├ Dockerfile                  # Build de produção (Node + Nginx)
├ Dockerfile.dev              # Imagem de desenvolvimento
├ nginx.conf                  # Configuração do Nginx (SPA + proxy da API)
├ eslint.config.js            # Regras de lint
├ index.html                  # HTML base da SPA
├ vite.config.ts              # Configuração do Vite
├ tsconfig*.json              # Configurações do TypeScript
└ package.json                # Dependências e scripts
```

Cada página e componente mantém seu arquivo `.css` ao lado do `.tsx`, facilitando a manutenção dos estilos.

<br>

## Rotas e páginas

As rotas são definidas em `src/main.tsx` com o React Router:

| Rota | Página | Descrição | Situação |
| ---- | ------ | --------- | -------- |
| `/` | `App.tsx` | Landing page com apresentação do projeto | Implementada |
| `/login` | `Login.tsx` | Login com e-mail corporativo | Interface e validação prontas; autenticação pendente |
| `/home` | `Homepage.tsx` | Explorador de serviços com globo 3D e mapa | Implementada com dados de exemplo (*mock*) |
| `/dashboard` | `Dashboard.tsx` | Acompanhamento de métricas | Estrutura inicial (*placeholder*) |
| `/ranking` | `Ranking.tsx` | Ranking dos serviços por impacto ambiental | Estrutura inicial (*placeholder*) |
| `/comparison` | `Comparison.tsx` | Comparação de métricas entre serviços | Estrutura inicial (*placeholder*) |
| `/admin` | `Admin.tsx` | Gerenciamento de usuários | Estrutura inicial (*placeholder*) |

### Landing page (`/`)

Página pública dividida em seções navegáveis pelo header: **O que é**, **Missão**, **Funcionalidades** e **Resultado**, além de um chamado para login e do rodapé. Os cards de missão, funcionalidades e indicadores são gerados a partir de listas (`steps`, `features` e `indicators`) no próprio `App.tsx`, o que facilita alterar o conteúdo.

### Login (`/login`)

Formulário com validação no próprio navegador (`LoginForm`):

- **E-mail:** campo obrigatório e formato válido (`texto@dominio.com`);
- **Senha:** campo obrigatório e mínimo de 6 caracteres;
- botão de olho para mostrar a senha **enquanto estiver pressionado**;
- mensagens de erro exibidas ao perder o foco do campo ou ao enviar.

Atualmente, após a validação o usuário é redirecionado para `/home`. A integração com o backend ainda será adicionada.

### Visão geral (`/home`)

Tela principal da aplicação autenticada. Possui:

- **painel lateral** com a lista de serviços, numeração, status e contadores por status (ativos, incompletos e inativos);
- **alternância entre Globo e Mapa** pelo componente `view-switch`;
- indicação da **última atualização** dos dados;
- atalhos para **Ranking** e **Comparação**;
- seleção de serviço sincronizada entre a lista, o globo e o mapa. Ao alternar a visualização, a seleção é mantida.

Os serviços seguem este formato:

```ts
type ServiceStatus = "active" | "incomplete" | "inactive";

interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  latitude?: number;
  longitude?: number;
  co2e?: number;
}
```

Cores de status usadas nos pontos: ativo `#91bd79`, incompleto `#e0d344` e inativo `#df7779`. Serviços sem coordenadas válidas (latitude entre -90 e 90, longitude entre -180 e 180) não aparecem no globo nem no mapa.

#### Globo 3D (`InteractiveGlobe`)

- Rotação automática, pausada ao passar o cursor e também enquanto houver um serviço selecionado;
- um card com detalhes do serviço (incluindo o valor de CO₂e) é exibido ao selecionar um ponto, com link para o `/dashboard`;
- clicar fora do globo fecha o card;
- o visual acompanha o modo claro/escuro do tema.

#### Mapa 2D (`MapVisualization`)

- Mapa Leaflet com *tiles* do OpenStreetMap e pontos coloridos por status;
- ao selecionar um serviço, o mapa centraliza nele com animação;
- clicar em uma área vazia limpa a seleção;
- card com detalhes do serviço, com link para o `/dashboard`.

### Páginas em construção

`Dashboard`, `Ranking`, `Comparison` e `Admin` possuem apenas a estrutura de rota e navegação básica. Seus layouts estão definidos nos protótipos em [`docs/design`](../docs/design).

<br>

## Componentes

| Componente | Local | Função |
| ---------- | ----- | ------ |
| `Header` | `components/header/Header.tsx` | Cabeçalho base e responsivo: recebe `links`, `action`, `message` e `activeHref`. Encolhe ao rolar a página, se esconde ao descer e vira menu lateral (com *scrim*) em telas menores que 1024 px |
| `LandingHeader` | `components/header/LandingHeader.tsx` | Header da landing page, com âncoras para as seções e botão de login |
| `AppHeader` | `components/header/AppHeader.tsx` | Header da área logada, com links para Visão Geral, Ranking e Comparação, saudação e botão de sair |
| `Footer` | `components/footer/Footer.tsx` | Rodapé da landing page, com tópicos, redes sociais e link para o repositório |
| `LoginForm` | `components/loginForm/LoginForm.tsx` | Formulário de login com validação |
| `ThemeToggle` | `components/themeToggle/ThemeToggle.tsx` | Alterna modo claro/escuro e escolhe a paleta (verde ou azul) |

O tipo `HeaderLink` (`types/header.ts`) permite que um link seja interno (`to`, usa `NavLink`) ou uma âncora (`href`).

<br>

## Sistema de temas

A aplicação suporta **2 modos** (`light` e `dark`) e **2 paletas** (`green` e `blue`), combinados em 4 temas.

- `ThemeProvider` guarda o modo e a paleta no `localStorage` (chaves `theme-mode` e `theme-palette`). Por padrão, usa modo claro e paleta verde;
- os valores são aplicados no elemento `<html>` pelos atributos `data-theme` e `data-palette`;
- as cores ficam em variáveis CSS em `src/index.css` (`--primary`, `--primary-light`, `--primary-dark`, `--primary-darker`, entre outras), uma definição para cada combinação;
- para ler ou alterar o tema em qualquer componente, use o hook:

```tsx
import useTheme from "../../hooks/useTheme";

const { mode, palette, changeMode, changePalette } = useTheme();
```

O hook lança um erro caso seja usado fora do `ThemeProvider`, que envolve toda a aplicação em `main.tsx`.

<br>

## Instruções para execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) 22 ou superior (o Docker de desenvolvimento usa a versão 22);
- npm (instalado junto com o Node.js);
- (opcional) Docker e Docker Compose, para rodar a aplicação completa.

### Sem Docker

1. Clone o repositório:

```bash
git clone https://github.com/atmosabp/greener
```

2. Entre na pasta do frontend e instale as dependências:

```bash
cd greener/frontend
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse [http://localhost:5173](http://localhost:5173).

> O script `dev` usa `vite --host`, então a aplicação também fica acessível por outros dispositivos da mesma rede.

### Com Docker

Na raiz do projeto, com o arquivo `.env` configurado (veja o [README principal](../README.md#instruções-para-execução)), execute:

```bash
docker compose up --build
```

O frontend ficará disponível na porta definida em `FRONT_PORT`. Exemplo: `localhost:8080`.

### Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Inicia o servidor de desenvolvimento com recarregamento automático (HMR) |
| `npm run build` | Verifica os tipos (`tsc -b`) e gera a versão de produção na pasta `dist/` |
| `npm run preview` | Serve localmente a versão gerada pelo build |
| `npm run lint` | Executa o ESLint em todo o projeto |

<br>

## Docker e Nginx

O `Dockerfile` de produção usa duas etapas (*multi-stage build*):

1. **Build:** imagem `node:24-alpine` instala as dependências e executa `npm run build`;
2. **Entrega:** imagem `nginx:alpine` serve os arquivos estáticos gerados.

O `nginx.conf` cumpre dois papéis:

- **Fallback de SPA:** qualquer rota desconhecida retorna `index.html`, permitindo que o React Router resolva a página (por exemplo, ao atualizar a página em `/ranking`);
- **Proxy da API:** requisições para `/api/` são encaminhadas ao serviço `backend`, na porta definida pela variável `BACKEND_PORT` (repassada pelo `compose.yaml`).

O `Dockerfile.dev` é voltado ao desenvolvimento: usa `node:22-alpine`, copia o projeto, expõe a porta `5173` e executa o Vite com `--host 0.0.0.0`.

<br>

## Design

Os protótipos das telas (versões desktop e mobile) estão em [`docs/design`](../docs/design), organizados por tela: landing page, login, tela principal (globo e mapa), dashboard, ranking, comparação, cadastro, página 404 e avisos (modal, toast e *loading*).

<br>

## Status atual e próximos passos

O frontend está em desenvolvimento. Neste momento:

- ✅ Landing page, login (interface e validação), tema e visão geral (globo e mapa) implementados;
- ✅ Configuração de Docker, Nginx e proxy para a API prontas;
- 🚧 A visão geral usa **dados de exemplo**; ainda falta integrar com as rotas do backend (`/api/...`);
- 🚧 Login ainda **não autentica**: após validar os campos, apenas redireciona para `/home`;
- 🚧 Botão **sair** e saudação "Olá, &lt;nome&gt;!" do `AppHeader` ainda são provisórios;
- 🚧 `Dashboard`, `Ranking`, `Comparison` e `Admin` aguardam implementação conforme os protótipos;
- 🚧 Proteção das rotas internas (acesso apenas para usuários autenticados) ainda não existe;
- 🚧 Tela 404 prevista no design e ainda não criada.

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>