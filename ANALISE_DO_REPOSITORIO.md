# Análise Profunda do Repositório — Palpite Perfeito Next

> Data da análise: 06/04/2026  
> Diretório: `/home/cesar/js/palpite-perfeito-next`

---

## 1. VISÃO GERAL DO PROJETO

**Palpite Perfeito** é um bolão esportivo web para a Copa do Mundo 2026, construído com **Next.js 16.2** (App Router) + **React 19** + **TypeScript 5** + **Tailwind CSS 4**.

### Proposta de Valor
- Usuários registram palpites de placar em partidas de futebol
- Apostas especiais em artilheiro e campeão do torneio
- Sistema de pontuação sofisticado com 6 níveis de acerto
- Painel administrativo completo para gerenciar tudo
- Ranking em tempo real

### Modelo de Negócio
- Pagamento confirmado é pré-requisito para fazer palpites
- Admin controla status de pagamento de cada usuário
- Apostas especiais são únicas e não editáveis

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Stack Tecnológica Completa

| Camada | Tecnologia | Versão | Notas |
|---|---|---|---|
| **Framework Web** | Next.js | 16.2.1 | App Router, React Compiler |
| **UI** | React | 19.2.4 | Server + Client Components |
| **Linguagem** | TypeScript | 5.x | Strict mode, ES2017 target |
| **CSS** | Tailwind CSS | 4.x | PostCSS plugin |
| **Componentes** | shadcn/ui | 4.1.2 | Style base-nova, Radix UI |
| **Ícones** | Lucide React | 1.7.0 | |
| **Toasts** | Sonner | 2.0.7 | |
| **Datas** | date-fns + date-fns-tz | 4.1.0 + 3.2.0 | Timezone America/Sao_Paulo |
| **Autenticação** | NextAuth v5 (Auth.js) | 5.0.0-beta.30 | JWT + Credentials |
| **Senhas** | bcryptjs | 3.0.3 | Salt rounds: 12 |
| **ORM** | Prisma | 6.19.2 | |
| **Driver DB** | @prisma/adapter-better-sqlite3 | 6.19.2 | |
| **Banco** | SQLite | embedded | Arquivo: prisma/dev.db |
| **Testes** | Vitest + Coverage V8 | 4.1.2 | Ambiente: node |
| **Lint** | ESLint 9 + eslint-config-next | 9.x | Core Web Vitals + TS |
| **React Compiler** | babel-plugin-react-compiler | 1.0.0 | Otimização automática |
| **Runtime** | Node.js | 20 (prod), 24 (CI) | |
| **Container** | Docker + Docker Compose | multi-stage | 4 stages no Dockerfile |
| **Proxy** | Nginx | 1.27 Alpine | Reverse proxy + blue-green |

### 2.2 Arquitetura de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare Tunnel                     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                     Nginx Proxy                          │
│           (porta 8080 prod / 3000 dev)                   │
│    upstream.conf → app-blue ou app-green                 │
└────────┬──────────────────────┬─────────────────────────┘
         │                      │
┌────────▼────────┐    ┌────────▼────────┐
│   app-blue      │    │   app-green     │
│  (Node:3000)    │    │  (Node:3000)    │
│  Next.js Stand. │    │  Next.js Stand. │
└────────┬────────┘    └────────┬────────┘
         │                      │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │   Volume: app-data   │
         │   prisma/palpite.db  │
         └──────────────────────┘
```

### 2.3 Padrão de Fluxo de Dados

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   Browser    │────▶│  Server Comp  │────▶│    Prisma    │
│   (HTML)     │◀────│  (SSR/ISR)    │◀────│   (SQLite)   │
└──────┬───────┘     └───────────────┘     └──────────────┘
       │
       │  Server Actions ("use server")
       ▼
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  Revalidate  │◀────│  Mutação DB   │◀────│   Validação  │
│   Path (ISR) │     │  (Prisma)     │     │  (Server)    │
└──────────────┘     └───────────────┘     └──────────────┘
```

---

## 3. ESTRUTURA DE DIRETÓRIOS

```
palpite-perfeito-next/
├── .dockerignore                      # Arquivos excluídos do Docker
├── .gitignore                         # Padrão Next.js + extras
├── AGENTS.md                          # Instruções para agentes IA
├── CLAUDE.md                          # Referência ao AGENTS.md
├── components.json                    # Config shadcn/ui (base-nova)
├── dev.db                             # SQLite desenvolvimento
├── docker-compose.develop.yml         # Compose develop (porta 3000, app:3002)
├── docker-compose.local.yml           # Compose local (porta 3000)
├── docker-compose.prod.yml            # Compose prod (blue-green)
├── Dockerfile                         # Multi-stage: base→deps→builder→runner
├── eslint.config.mjs                  # ESLint 9 + Next.js + TS
├── next.config.ts                     # React Compiler, standalone, origins
├── package-lock.json                  # Lockfile npm
├── package.json                       # Dependencies + scripts
├── postcss.config.mjs                 # Tailwind CSS 4 plugin
├── prisma.config.ts                   # Config Prisma
├── README.md                          # Documentação completa
├── tsconfig.json                      # TS strict, paths @/*
├── vitest.config.ts                   # Vitest node + coverage v8
│
├── deploy/
│   └── nginx/
│       ├── nginx.conf                 # Prod: listen 8080, proxy_pass http://app
│       ├── upstream.conf              # upstream app { server app-blue:3000; }
│       └── develop/
│           ├── nginx.conf             # Dev: listen 3000
│           └── upstream.conf          # upstream app { server app:3002; }
│
├── prisma/
│   ├── schema.prisma                  # 10 models, Role enum, indices
│   ├── seed.ts                        # 3 modos: worldcup, brasileirao-test, admin-only
│   └── migrations/
│       ├── 20260331225444_init/
│       │   └── migration.sql          # User, Match, Guess
│       ├── 20260401000706_add_goals/
│       │   └── migration.sql          # Goal
│       ├── 20260401003147_add_special_bets/
│       │   └── migration.sql          # TopScorerBet, ChampionBet, TournamentResult
│       ├── 20260401133000_day2_hardening/
│       │   └── migration.sql          # CHECK role, indices performance
│       ├── 20260401141000_add_login_rate_limit/
│       │   └── migration.sql          # LoginAttempt
│       ├── 20260403120000_add_payment_status/
│       │   └── migration.sql          # paymentConfirmed, paymentConfirmedAt
│       └── migration_lock.toml
│
├── public/                            # Assets estáticos
│   ├── favicon.svg
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│
├── scripts/
│   ├── backup-db.sh                   # Backup SQLite 2x/dia, rotação 14
│   ├── deploy-blue-green.sh           # Deploy prod sem downtime
│   ├── deploy-develop.sh              # Deploy branch develop
│   ├── install-cron.sh                # Instala cronjob backup
│   └── run-local-container.sh         # Sobe container local
│
├── src/
│   ├── app/
│   │   ├── (main)/                    # Route group: requer autenticação
│   │   │   ├── layout.tsx             # Layout com AppHeader + proteção auth
│   │   │   ├── page.tsx               # Dashboard geral (/)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx           # Painel Admin (/admin)
│   │   │   │   └── finance/page.tsx   # Gestão Financeira (/admin/finance)
│   │   │   ├── help/page.tsx          # Como funciona (/help)
│   │   │   ├── jogos/page.tsx         # Jogos - palpites (/jogos)
│   │   │   ├── my-bets/page.tsx       # Meus palpites (/my-bets)
│   │   │   ├── ranking/page.tsx       # Ranking geral (/ranking)
│   │   │   └── special-bets/page.tsx  # Apostas especiais (/special-bets)
│   │   ├── actions/                   # Server Actions
│   │   │   ├── admin.ts               # CRUD partidas, usuários, resultados
│   │   │   ├── auth.ts                # login, signUp
│   │   │   ├── guesses.ts             # saveGuess
│   │   │   └── special-bets.ts        # saveTopScorerBet, saveChampionBet
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   │   └── health/route.ts        # Healthcheck endpoint
│   │   ├── auth/page.tsx              # Página login/registro (pública)
│   │   ├── globals.css                # CSS global + tema Tailwind
│   │   ├── layout.tsx                 # Root layout + SessionProvider + Toaster
│   │   ├── not-found.tsx              # Página 404
│   │   └── favicon.ico
│   ├── components/
│   │   ├── AdminPanel.tsx             # 5 abas: Resultados, Jogos, Torneio, Usuarios, Palpites
│   │   ├── AppHeader.tsx              # Header responsivo desktop/mobile
│   │   ├── BetDialog.tsx              # Modal de palpite (dialog)
│   │   ├── FinancePanel.tsx           # Tabela gestão financeira
│   │   ├── GameCard.tsx               # Card de partida individual
│   │   ├── GamesList.tsx              # Lista jogos agrupados por data
│   │   ├── SpecialBetsPanel.tsx       # Forms artilheiro + campeão
│   │   └── ui/                        # shadcn/ui (14 componentes)
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── date-picker.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── popover.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── table.tsx
│   │       └── tabs.tsx
│   ├── __tests__/
│   │   ├── game-logic.test.ts         # 14 testes calculateGuessPoints
│   │   └── timezone.test.ts           # 11 testes isBettingOpen
│   ├── lib/
│   │   ├── auth.ts                    # Config NextAuth (Credentials, JWT)
│   │   ├── auth-helpers.ts            # getSession, getRequiredUser, requireAdmin
│   │   ├── auth-rate-limit.ts         # Rate limiting IP/email, bloqueio escalonado
│   │   ├── bet-dashboard.ts           # Helpers deadline apostas
│   │   ├── game-logic.ts              # calculateGuessPoints, canUserPlaceGuess
│   │   ├── payment.ts                 # Mensagem pagamento pendente
│   │   ├── points-recalculation.ts    # recalculateUsersTotalPoints
│   │   ├── prisma.ts                  # Singleton Prisma + adapter SQLite
│   │   ├── reset-competition-data.ts  # resetCompetitionData helper
│   │   ├── scoring.ts                 # Re-export calculatePoints
│   │   ├── timezone.ts                # Utils fuso America/Sao_Paulo
│   │   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
│   ├── types/
│   │   └── next-auth.d.ts             # Module augmentation Session/JWT
│   └── proxy.ts                       # Middleware proteção rotas
│
└── .github/
    └── workflows/
        ├── ci.yml                     # CI: lint, test, build (push + PR)
        ├── docker-publish.yml         # Prod: build/push Docker + deploy
        └── docker-publish-develop.yml # Develop: build/push Docker + deploy
```

---

## 4. MODELO DE DADOS (BANCO DE DADOS)

### 4.1 Diagrama Entidade-Relacionamento

```
┌──────────────────┐       ┌──────────────────┐
│      User        │       │     Match        │
│──────────────────│       │──────────────────│
│ id        (PK)   │◄──┐   │ id        (PK)   │◄──┐
│ name             │   │   │ teamA            │   │
│ email     (UQ)   │   │   │ teamB            │   │
│ password         │   │   │ datetime   (IDX) │   │
│ role    (ENUM)   │   │   │ groupStage       │   │
│ totalPoints(IDX) │   │   │ scoreA?          │   │
│ paymentConfirmed │   │   │ scoreB?          │   │
│ paymentConfirmedAt?   │   │ status           │   │
│ createdAt        │   │   │ createdAt        │   │
└────────┬─────────┘   │   └────────┬─────────┘   │
         │             │            │             │
         │ 1:N         │            │ 1:N         │
         ▼             │            ▼             │
┌──────────────────┐   │   ┌──────────────────┐   │
│     Guess        │   │   │      Goal        │   │
│──────────────────│   │   │──────────────────│   │
│ id        (PK)   │   │   │ id        (PK)   │   │
│ userId    (FK)───┘   │   │ matchId   (FK)───┘   │
│ matchId   (FK)───────┘   │ team      (A|B)      │
│ guessA                   │ player               │
│ guessB                   │ minute               │
│ pointsEarned?            └──────────────────────┘
│ createdAt
│ UNIQUE(userId, matchId)
└──────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│   TopScorerBet       │  │    ChampionBet       │
│──────────────────────│  │──────────────────────│
│ id            (PK)   │  │ id            (PK)   │
│ userId  (UQ, FK)────┼──┼─│ userId  (UQ, FK)───┼──┐
│ playerName           │  │ │ champion           │  │
│ totalGoals           │  │ │ runnerUp           │  │
│ pointsEarned?        │  │ │ finalScoreA        │  │
└──────────┬───────────┘  │ │ finalScoreB        │  │
           │              │ │ pointsEarned?      │  │
           │              │ └─────────┬──────────┘  │
           │              │           │             │
           └──────────────┴───────────┘             │
                                                    │
┌──────────────────────┐                            │
│  TournamentResult    │                            │
│──────────────────────│                            │
│ id            (PK)   │                            │
│ key           (UQ)   │  ◄───── "topScorer"        │
│ topScorerName?       │       "champion"            │
│ topScorerGoals?      │                            │
│ champion?            │◄────────────────────────────┘
│ runnerUp?            │
│ finalScoreA?         │
│ finalScoreB?         │
└──────────────────────┘

┌──────────────────────┐
│    LoginAttempt      │
│──────────────────────│
│ id            (PK)   │
│ email?               │
│ ip                   │
│ success              │
│ blocked              │
│ reason?              │
│ createdAt      (IDX) │
│ INDEX(ip, createdAt) │
│ INDEX(email, createdAt)
└──────────────────────┘
```

### 4.2 Detalhes de Cada Model

#### User
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | Identificador único |
| name | String | | Nome completo |
| email | String | UNIQUE | Email (lowercase) |
| password | String | | Hash bcrypt (12 rounds) |
| role | Enum | CHECK IN ('USER','ADMIN') | USER ou ADMIN |
| totalPoints | Int | DEFAULT 0, INDEX | Pontuação total acumulada |
| paymentConfirmed | Boolean | DEFAULT false | Status de pagamento |
| paymentConfirmedAt | DateTime? | | Timestamp confirmação |
| createdAt | DateTime | DEFAULT now() | Data criação |

#### Match
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| teamA | String | | Time da casa |
| teamB | String | | Time visitante |
| datetime | DateTime | INDEX | Data/hora do jogo (UTC no DB) |
| groupStage | String | | Grupo ou fase |
| scoreA | Int? | | Gols time A (resultado) |
| scoreB | Int? | | Gols time B (resultado) |
| status | String | DEFAULT "SCHEDULED" | SCHEDULED ou FINISHED |
| createdAt | DateTime | DEFAULT now() | |

#### Goal
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| matchId | String | FK → Match.id (Cascade) | |
| team | String | "A" ou "B" | Time que marcou |
| player | String | | Nome do jogador |
| minute | Int | | Minuto do gol |

#### Guess
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| userId | String | FK → User.id (Cascade), INDEX | |
| matchId | String | FK → Match.id (Cascade), INDEX | |
| guessA | Int | | Palpite gols time A |
| guessB | Int | | Palpite gols time B |
| pointsEarned | Int? | | Pontos obtidos |
| createdAt | DateTime | DEFAULT now() | |
| **UNIQUE** | (userId, matchId) | | Um palpite por partida |

#### TopScorerBet
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| userId | String | UNIQUE, FK → User.id | Uma aposta por usuário |
| playerName | String | | Nome do artilheiro |
| totalGoals | Int | | Total de gols |
| pointsEarned | Int? | | Pontos obtidos |

#### ChampionBet
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| userId | String | UNIQUE, FK → User.id | Uma aposta por usuário |
| champion | String | | Time campeão |
| runnerUp | String | | Time vice |
| finalScoreA | Int | | Placar final A |
| finalScoreB | Int | | Placar final B |
| pointsEarned | Int? | | Pontos obtidos |

#### TournamentResult
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| key | String | UNIQUE | "topScorer" ou "champion" |
| topScorerName | String? | | Nome artilheiro oficial |
| topScorerGoals | Int? | | Gols artilheiro |
| champion | String? | | Time campeão oficial |
| runnerUp | String? | | Time vice oficial |
| finalScoreA | Int? | | Placar final A |
| finalScoreB | Int? | | Placar final B |

#### LoginAttempt
| Campo | Tipo | Constraint | Descrição |
|---|---|---|---|
| id | String (cuid) | PK | |
| email | String? | | Email tentado |
| ip | String | | IP do cliente |
| success | Boolean | | Login bem-sucedido |
| blocked | Boolean | DEFAULT false | Bloqueado por rate limit |
| reason | String? | | Motivo do bloqueio/falha |
| createdAt | DateTime | DEFAULT now(), INDEX | |

### 4.3 Histórico de Migrations

| # | Migration | Data | O que mudou |
|---|---|---|---|
| 1 | `init` | 2026-03-31 | User, Match, Guess |
| 2 | `add_goals` | 2026-04-01 | Tabela Goal |
| 3 | `add_special_bets` | 2026-04-01 | TopScorerBet, ChampionBet, TournamentResult |
| 4 | `day2_hardening` | 2026-04-01 | CHECK constraint role, índices de performance |
| 5 | `add_login_rate_limit` | 2026-04-01 | LoginAttempt com índices compostos |
| 6 | `add_payment_status` | 2026-04-03 | paymentConfirmed, paymentConfirmedAt |

---

## 5. ROTAS E ENDPOINTS

### 5.1 Páginas (Route Group `(main)` requer autenticação)

| Rota | Arquivo | Método | Proteção | Descrição |
|---|---|---|---|---|
| `/` | `src/app/(main)/page.tsx` | GET | Auth | Dashboard geral |
| `/jogos` | `src/app/(main)/jogos/page.tsx` | GET | Auth | Lista de jogos para palpitar |
| `/ranking` | `src/app/(main)/ranking/page.tsx` | GET | Auth | Ranking geral |
| `/my-bets` | `src/app/(main)/my-bets/page.tsx` | GET | Auth | Meus palpites |
| `/special-bets` | `src/app/(main)/special-bets/page.tsx` | GET | Auth | Apostas especiais |
| `/help` | `src/app/(main)/help/page.tsx` | GET | Auth | Como funciona |
| `/admin` | `src/app/(main)/admin/page.tsx` | GET | Admin | Painel administrativo |
| `/admin/finance` | `src/app/(main)/admin/finance/page.tsx` | GET | Admin | Gestão financeira |
| `/auth` | `src/app/auth/page.tsx` | GET/POST | Pública | Login/registro |

### 5.2 API Routes

| Rota | Handler | Descrição |
|---|---|---|
| `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth (login, logout, session) |
| `/api/health` | `src/app/api/health/route.ts` | Healthcheck: `{ok: true, status: "healthy"}` |

### 5.3 Server Actions

#### `src/app/actions/auth.ts`
| Action | Parâmetros | Descrição |
|---|---|---|
| `signUp` | formData (name, email, password) | Cria usuário com validação (email regex, senha min 6 chars, bcrypt 12 rounds) |
| `login` | formData (email, password) | Login via NextAuth signIn com redirect |

#### `src/app/actions/guesses.ts`
| Action | Parâmetros | Descrição |
|---|---|---|
| `saveGuess` | matchId, guessA, guessB | Upsert palpite com validações: 0-30, inteiro, betting window open, payment confirmed |

#### `src/app/actions/admin.ts`
| Action | Parâmetros | Descrição |
|---|---|---|
| `finishMatch` | matchId, scoreA, scoreB, goals | Finaliza partida, salva gols, calcula pontos, recalcula ranking |
| `createMatch` | formData | CRUD criar partida |
| `updateMatch` | matchId, formData | CRUD editar (bloqueia finalizadas) |
| `deleteMatch` | matchId | CRUD deletar (bloqueia finalizadas) |
| `createUser` | formData | CRUD criar usuário |
| `updateUser` | userId, formData | CRUD editar |
| `deleteUser` | userId | CRUD deletar (bloqueia admins) |
| `setUserPaymentStatus` | userId, paymentConfirmed | Altera status pagamento |
| `resetTournamentData` | - | Reset: apaga palpites, gols, apostas, resultados, zera pontos |
| `seedWorldCupData` | - | Seed Copa do Mundo |
| `seedBrasileiraoTestData` | - | Seed Brasileirão teste |

#### `src/app/actions/special-bets.ts`
| Action | Parâmetros | Descrição |
|---|---|---|
| `saveTopScorerBet` | playerName, totalGoals | Aposta única (não editável) |
| `saveChampionBet` | champion, runnerUp, finalScoreA, finalScoreB | Aposta única (não editável) |
| `setTopScorerResult` | playerName, totalGoals | Admin define artilheiro + calcula pontos |
| `setChampionResult` | champion, runnerUp, finalScoreA, finalScoreB | Admin define campeão + calcula pontos |

### 5.4 Middleware (`src/proxy.ts`)

```typescript
export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)"],
};
```

**Comportamento**: NextAuth `auth` é exportado como middleware. Intercepta todas as rotas EXCETO:
- `/api/auth/*` (rotas de autenticação)
- `/auth` (página de login)
- `/_next/static/*` (assets estáticos)
- `/_next/image/*` (imagens otimizadas)
- `/favicon.ico`

Rotas protegidas pelo middleware redirecionam para `/auth` se não autenticadas.

---

## 6. COMPONENTES PRINCIPAIS

### 6.1 Layouts

#### Root Layout (`src/app/layout.tsx`)
- **Server Component**
- Wrappa app com `SessionProvider` (client component para contexto de sessão)
- Adiciona `Toaster` do Sonner para notificações
- Fontes: Outfit + Space Grotesk (Google Fonts via `next/font`)
- Metadados padrão do bolão

#### Main Layout (`src/app/(main)/layout.tsx`)
- **Server Component** com proteção de autenticação
- Busca perfil do usuário via `getRequiredUser()`
- Renderiza `AppHeader` com nome, pontos totais, badge de admin
- Filhos: `{children}` das rotas do grupo `(main)`

### 6.2 Componentes de Página

#### AppHeader (`src/components/AppHeader.tsx`)
- **Client Component** (`"use client"`)
- **Desktop**: Nav pills (Dashboard, Jogos, Ranking, Apostas) + menu dropdown usuário
- **Mobile**: Menu hamburger com drawer
- Mostra: nome do usuário, totalPoints, link admin/finanças se ADMIN
- Responsivo: ícones em telas pequenas, textos em telas largas

#### AdminPanel (`src/components/AdminPanel.tsx`)
- **Client Component**
- 5 abas (Tabs):
  1. **Resultados**: Lança placar + gols, filtra por data, dialog para gols
  2. **Jogos**: CRUD completo de partidas
  3. **Torneio**: Define artilheiro e campeão oficial
  4. **Usuários**: CRUD de participantes, controle de roles
  5. **Palpites**: Lista todos os palpites de todos os usuários
- Funcionalidades especiais:
  - Reset de torneio com confirmação manual (digitar "RESETAR")
  - Seeds rápidos (Copa do Mundo, Brasileirão teste)
  - Filtros por data e grupo

#### GameCard (`src/components/GameCard.tsx`)
- **Client Component**
- Exibe: times, placar (se finalizado), grupo, status
- Se jogo finalizado: mostra palpite do usuário + pontos ganhos
- Se betting open: botão "Fazer Palpite" ou "Editar"
- Se betting closed: mensagem "Encerrado"

#### GamesList (`src/components/GamesList.tsx`)
- **Client Component**
- Agrupa jogos por data
- Filtro DatePicker para navegar entre datas
- Delega renderização para `GameCard` + `BetDialog`

#### BetDialog (`src/components/BetDialog.tsx`)
- **Client Component** (Dialog do Radix UI)
- Modal para inserir/editar placar do palpite
- Validação client-side: 0-30, inteiros
- Submete via `saveGuess` server action

#### SpecialBetsPanel (`src/components/SpecialBetsPanel.tsx`)
- **Client Component**
- Formulário artilheiro: nome + total de gols
- Formulário campeão: campeão, vice, placar final
- Mostra apostas existentes (read-only)
- Mostra resultados oficiais (se definidos)
- Bloqueia se:
  - Prazo encerrado (10 min antes do primeiro jogo)
  - Aposta já feita (única)
  - Pagamento não confirmado

#### FinancePanel (`src/components/FinancePanel.tsx`)
- **Client Component**
- Tabela de usuários com status de pagamento
- Ações: confirmar pagamento / reverter
- Atualiza via `setUserPaymentStatus` server action

### 6.3 Componentes UI (shadcn/ui)

14 componentes baseados em Radix UI + Tailwind CSS:
- avatar, badge, button (CVA variants), calendar, card, date-picker, dialog, input, label, popover, select, separator, table, tabs

---

## 7. LÓGICA DE NEGÓCIO

### 7.1 Sistema de Pontuação

#### Palpites de Partida (`calculateGuessPoints`)

| Situação | Pontos | Condição | Exemplo |
|---|:---:|---|---|
| 🎯 **Placar exato** | **25** | `guessA === realA && guessB === realB` | 2×1 → 2×1 |
| 🥈 **Vencedor + gols de um time** | **20** | Mesmo vencedor + `guessA === realA || guessB === realB` | 3×1 → 3×0 |
| 🥉 **Empate não exato** | **18** | Ambos empataram mas placar diferente | 2×2 → 1×1 |
| 🟤 **Vencedor seco** | **15** | Mesmo vencedor, placar diferente | 3×1 → 1×0 |
| 🟢 **Gols de um time (vencedor errado)** | **5** | `guessA === realA || guessB === realB` mas vencedor diferente | 3×1 → 0×1 |
| ❌ **Erro total** | **0** | Nada correto | 3×1 → 0×0 |

**Algoritmo de decisão** (ordem de verificação):
```
1. Placar exato? → 25
2. Resultado foi empate?
   ├── Palpite também empate (placar diferente)? → 18
   └── Acertou gols de algum time? → 5
   └── Senão → 0
3. Palpite acertou vencedor?
   ├── Acertou gols de algum time? → 20
   └── Senão → 15
4. Acertou gols de algum time? → 5
5. Senão → 0
```

#### Apostas Especiais

**Artilheiro (TopScorerBet):**
| Situação | Pontos | Condição |
|---|:---:|---|
| 🎯 Nome + gols corretos | **35** | `playerName === result.name && totalGoals === result.goals` |
| 🎖️ Apenas nome correto | **20** | `playerName === result.name` |

**Campeão (ChampionBet):**
| Situação | Pontos | Condição |
|---|:---:|---|
| 🥇 Campeão + placar + vice | **90** | Tudo correto |
| 🥈 Campeão + placar | **70** | Campeão + placar, vice errado |
| 🥉 Apenas campeão | **50** | Só o time campeão |

### 7.2 Regras de Betting Window

**Deadline**: 10 minutos antes do início do jogo (fuso America/Sao_Paulo)

```typescript
// Em src/lib/timezone.ts
function isBettingOpen(matchDate: Date): boolean {
  // Converte UTC → America/Sao_Paulo
  // Calcula diferença entre agora e matchDate
  // Retorna true se diferença >= 10 minutos
}
```

**Implicações**:
- Banco armazena datetime em UTC
- Conversão para SP timezone feita na leitura/escrita
- Servidor pode estar em qualquer fuso, a conversão é explícita
- Jogos passados ou em andamento: betting fechado

### 7.3 Gate de Pagamento

```
Usuário tenta fazer palpite
    ↓
paymentConfirmed === true?
    ├── SIM → permite
    └── NÃO → bloqueia com mensagem
```

### 7.4 Recálculo de Pontos

```typescript
// Em src/lib/points-recalculation.ts
async function recalculateUsersTotalPoints(): Promise<void> {
  // 1. Busca todos os usuários
  // 2. Para cada usuário, soma pointsEarned de todos os Guesses
  // 3. Soma pointsEarned de TopScorerBet (se existir)
  // 4. Soma pointsEarned de ChampionBet (se existir)
  // 5. Atualiza User.totalPoints
}
```

**Quando é chamado**:
- Após `finishMatch` (admin lança resultado)
- Após `setTopScorerResult` (admin define artilheiro)
- Após `setChampionResult` (admin define campeão)

### 7.5 Rate Limiting de Login

**Em `src/lib/auth-rate-limit.ts`**:

| Limite | Valor | Janela |
|---|---|---|
| Tentativas por IP | 20 | 10 minutos |
| Tentativas por Email | 7 | 10 minutos |

**Bloqueio escalonado**:
| Falhas consecutivas | Bloqueio |
|---|---|
| 5 | 5 minutos |
| 10 | 15 minutos |
| 15+ | 60 minutos |

**Implementação**:
- `LoginAttempt` model registra todas as tentativas
- `getClientIp(request)` extrai IP do headers
- `getRateLimitState({email, ip})` calcula estado atual
- `logLoginAttempt()` persiste tentativa

### 7.6 Autenticação (NextAuth v5)

**Provider**: Credentials (email + senha)

**Fluxo de login**:
```
1. Usuário submete email + senha
2. Rate limiting check
3. Busca User no DB por email
4. bcrypt.compare(password, hash)
5. Se válido → logLoginAttempt(success) → retorna user
6. Se inválido → logLoginAttempt(fail) → retorna null
```

**JWT Session**:
```typescript
// Callback jwt: adiciona id e role ao token
token.id = user.id
token.role = user.role

// Callback session: adiciona id e role ao session
session.user.id = token.id
session.user.role = token.role
```

**Module Augmentation** (`src/types/next-auth.d.ts`):
```typescript
declare module "next-auth" {
  interface User { role: string }
  interface Session { user: { id: string; role: string } }
  interface JWT { id: string; role: string }
}
```

---

## 8. SEGURANÇA

### 8.1 Autenticação e Autorização

| Mecanismo | Implementação |
|---|---|
| **Middleware de proteção** | `src/proxy.ts` — redirect para `/auth` se não autenticado |
| **Server-side auth check** | `getRequiredUser()` — redirect em server components |
| **Admin-only actions** | `requireAdmin()` — verifica `session.user.role === "ADMIN"` |
| **Validação server-side** | Todas as server actions validam input antes de mutate |
| **Validação client-side** | Forms validam antes de submeter |

### 8.2 Proteção de Dados

| Vetor | Proteção |
|---|---|
| **Senhas** | bcryptjs, salt 12 rounds |
| **Sessão** | JWT signed com AUTH_SECRET |
| **SQL Injection** | Prisma ORM (parameterized queries) |
| **CSRF** | NextAuth protege automaticamente |
| **Rate Limiting** | Login attempts tracking + bloqueio escalonado |
| **Unique Constraints** | Apostas especiais: 1 por usuário |
| **Betting Deadline** | 10 min antes do jogo (imutável) |

### 8.3 Constraints de Banco

```sql
-- CHECK constraint no role
ALTER TABLE User ADD CONSTRAINT check_role CHECK (role IN ('USER', 'ADMIN'));

-- Unique constraints
User.email UNIQUE
Guess.(userId, matchId) UNIQUE
TopScorerBet.userId UNIQUE
ChampionBet.userId UNIQUE
TournamentResult.key UNIQUE

-- Foreign keys com CASCADE
Guess.userId → User.id ON DELETE CASCADE
Guess.matchId → Match.id ON DELETE CASCADE
Goal.matchId → Match.id ON DELETE CASCADE
TopScorerBet.userId → User.id ON DELETE CASCADE
ChampionBet.userId → User.id ON DELETE CASCADE
```

---

## 9. TIMEZONE E DATAS

### 9.1 Convenção

- **Banco**: armazena em UTC
- **Servidor**: pode estar em qualquer fuso
- **Usuário**: fuso America/Sao_Paulo (Brasília)
- **Conversão**: explícita via `date-fns-tz`

### 9.2 Helpers (`src/lib/timezone.ts`)

| Função | Descrição |
|---|---|
| `formatMatchDate(date)` | Formata para "dd/MM" no fuso SP |
| `formatMatchTime(date)` | Formata para "HH:mm" no fuso SP |
| `formatMatchDateTimeForInput(date)` | Formata para input datetime-local |
| `parseMatchDateTimeInput(string)` | Parse de input para Date UTC |
| `isBettingOpen(matchDate)` | Verifica se faltam >= 10 minutos |

### 9.3 Fluxo de Datas

```
Admin cria partida:
  Input: "2026-06-11 13:00" (SP timezone)
  → parseMatchDateTimeInput()
  → DB: "2026-06-11T16:00:00Z" (UTC)

Usuário vê partida:
  ← DB: "2026-06-11T16:00:00Z"
  → formatMatchTime()
  → UI: "13:00" (SP timezone)

Betting check:
  ← DB: "2026-06-11T16:00:00Z"
  → Converte para SP: "2026-06-11T13:00:00-03:00"
  → Calcula diff com agora (SP)
  → Retorna true/false
```

---

## 10. TESTES

### 10.1 Configuração

```typescript
// vitest.config.ts
{
  environment: "node",
  coverage: {
    provider: "v8",
    include: ["src/lib/**"],
  },
  resolve: { tsconfigPaths: true }
}
```

### 10.2 Testes Existentes

#### `src/__tests__/game-logic.test.ts` — 14 testes

Cobre `calculateGuessPoints` exaustivamente:

| Teste | Input | Esperado |
|---|---|---|
| Placar exato | 2×1 → 2×1 | 25 |
| Vencedor + gols A | 3×1 → 3×0 | 20 |
| Vencedor + gols B | 3×1 → 2×1 | 20 |
| Empate não exato | 2×2 → 1×1 | 18 |
| Vencedor seco | 3×1 → 1×0 | 15 |
| Gols isolados (vencedor errado) | 3×1 → 0×1 | 5 |
| Erro total | 3×1 → 0×0 | 0 |
| Empate 0×0 exato | 0×0 → 0×0 | 25 |
| Gols altos | 5×3 → 5×2 | 20 |
| Inversão de vencedor | 2×1 → 1×2 | 0 |
| ... | ... | ... |

#### `src/__tests__/timezone.test.ts` — 11 testes

Cobre `isBettingOpen` e `canUserPlaceGuess`:

| Teste | Cenário | Esperado |
|---|---|---|
| 11 min antes | betting open | true |
| 10 min antes | betting closed | false |
| 9 min antes | betting closed | false |
| 5 min antes | betting closed | false |
| 1 min antes | betting closed | false |
| 0 min (exato) | betting closed | false |
| 1 dia antes | betting open | true |
| Jogo passado | betting closed | false |

### 10.3 Executar Testes

```bash
npm run test           # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # Com coverage
```

---

## 11. DEPLOYMENT E CI/CD

### 11.1 Dockerfile (4 Stages)

```dockerfile
# Stage 1: base
FROM node:20-bookworm-slim
# Instala openssl (necessário para NextAuth)

# Stage 2: deps
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 3: builder
FROM deps AS builder
COPY . .
RUN npx prisma generate
RUN npm run build
# Copia public/ e .next/standalone/

# Stage 4: runner
FROM node:20-bookworm-slim AS runner
USER node
WORKDIR /app
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 11.2 Docker Compose — Produção (Blue-Green)

```yaml
# docker-compose.prod.yml
services:
  proxy:
    image: nginx:1.27-alpine
    ports: ["8080:8080"]
    volumes:
      - ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./deploy/nginx/upstream.conf:/etc/nginx/conf.d/upstream.conf

  app-blue:
    image: ${APP_IMAGE}
    environment:
      DATABASE_URL: "file:/data/palpite.db"
      AUTH_SECRET: ${AUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
    volumes:
      - app-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 2s
      retries: 60

  app-green:
    # Mesma config, slot alternativo

volumes:
  app-data:
```

### 11.3 Blue-Green Deployment (`deploy-blue-green.sh`)

```bash
# Fluxo:
1. Detecta slot ativo (blue ou green) via upstream.conf
2. Sobe novo slot no slot inativo
3. Aplica migrations: docker exec app-new npx prisma migrate deploy
4. Executa seed admin: docker exec app-new npm run prisma:seed:admin
5. Aguarda healthcheck (60 tentativas × 2s = 2min timeout)
6. Troca upstream.conf para apontar para novo slot
7. nginx -s reload (graceful)
8. Para slot antigo
```

### 11.4 CI/CD Workflows

#### `.github/workflows/ci.yml`
**Trigger**: push/PR em `main` ou `develop`

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup node 24
      - npm ci
      - npx prisma generate
      - npm run lint
      - npm run test
      - npm run build
```

#### `.github/workflows/docker-publish.yml`
**Trigger**: push em `main`

```yaml
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions: packages: write
    steps:
      - checkout
      - login GHCR
      - build/push Docker image para ghcr.io/<repo>:latest
  
  deploy:
    needs: build-and-push
    runs-on: self-hosted
    steps:
      - pull image
      - ./scripts/deploy-blue-green.sh
```

#### `.github/workflows/docker-publish-develop.yml`
**Trigger**: push em `develop`

```yaml
# Similar ao prod mas:
# - Tag: develop
# - Deploy via deploy-develop.sh (single app, sem blue-green)
```

### 11.5 Backup Automático

**Script**: `scripts/backup-db.sh`

```bash
# Config:
# - Frequência: 2x/dia (08:00 e 20:00)
# - Rotação: mantém 14 arquivos mais recentes (~1 semana)
# - Formato: backups/palpite_YYYYMMDD_HHMMSS.db
# - Método: sqlite3 .backup (consistent snapshot)

# Instalação:
./scripts/install-cron.sh

# Output crontab:
# 0 8,20 * * * /path/scripts/backup-db.sh >> /var/log/palpite-backup.log 2>&1
```

---

## 12. CONFIGURAÇÕES DO PROJETO

### 12.1 next.config.ts

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,         // Babel plugin de otimização automática
  output: "standalone",        // Build standalone para Docker
  allowedDevOrigins: [         // Origens permitidas para dev
    "bolao.cesarmenegatti.com",
    "*.cesarmenegatti.com",
    "*.trycloudflare.com",
    "localhost",
    "127.0.0.1",
  ],
  turbopack: {
    root: __dirname,           // Turbopack root
  },
};
```

### 12.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### 12.3 components.json (shadcn/ui)

```json
{
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 12.4 Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `DATABASE_URL` | Sim | URL do SQLite | `file:./prisma/dev.db` |
| `AUTH_SECRET` | Sim | Secret JWT para NextAuth | gerado via `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Sim | Mesma coisa (legado) | mesmo valor |
| `NEXTAUTH_URL` | Sim | URL base da aplicação | `https://bolao.cesarmenegatti.com` |
| `NEXT_ALLOWED_DEV_ORIGINS` | Não | Origens dev customizadas | `localhost,127.0.0.1` |
| `ADMIN_PASS` | Deploy | Senha do admin no seed | `Admin@2026#` |

---

## 13. PADRÕES DE CÓDIGO E CONVENÇÕES

### 13.1 Arquitetura

| Padrão | Uso |
|---|---|
| **App Router** | Next.js 16 com route groups |
| **Server Components** | Default para páginas |
| **Client Components** | Explícito com `"use client"` |
| **Server Actions** | `"use server"` para mutações |
| **ISR** | `revalidatePath()` após mutations |
| **Dynamic Routes** | `export const dynamic = "force-dynamic"` |

### 13.2 Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `GameCard.tsx` |
| Server Actions | camelCase export | `saveGuess()` |
| Lib functions | camelCase | `calculateGuessPoints()` |
| Arquivos | kebab-case | `game-logic.ts` |
| Paths | `@/*` alias | `@/lib/prisma` |

### 13.3 Tratamento de Erros

```typescript
// Server Actions padrão:
async function someAction(input) {
  "use server";

  // 1. Validar input
  if (!input) throw new Error("Input required");

  // 2. Verificar autenticação
  const user = await getRequiredUser();

  // 3. Verificar permissão
  if (user.role !== "ADMIN") throw new Error("Unauthorized");

  // 4. Executar operação
  await prisma.someModel.create({ data: input });

  // 5. Revalidar cache
  revalidatePath("/some-route");
}
```

---

## 14. DEPENDÊNCIAS DETALHADAS

### 14.1 Produção (19 pacotes)

| Pacote | Versão | Uso |
|---|---|---|
| `@auth/prisma-adapter` | ^2.11.1 | Adapter Prisma para Auth.js |
| `@base-ui/react` | ^1.3.0 | Componentes base UI |
| `@prisma/adapter-better-sqlite3` | ^6.19.2 | Driver SQLite otimizado |
| `@prisma/client` | ^6.19.2 | ORM Prisma |
| `@radix-ui/react-popover` | ^1.1.15 | Popover acessível |
| `bcryptjs` | ^3.0.3 | Hash de senhas |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes |
| `clsx` | ^2.1.1 | Condições de className |
| `date-fns` | ^4.1.0 | Manipulação de datas |
| `date-fns-tz` | ^3.2.0 | Conversão de timezone |
| `lucide-react` | ^1.7.0 | Ícones |
| `next` | 16.2.1 | Framework principal |
| `next-auth` | ^5.0.0-beta.30 | Autenticação |
| `prisma` | ^6.19.2 | CLI |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | DOM renderer |
| `shadcn` | ^4.1.2 | CLI componentes |
| `sonner` | ^2.0.7 | Toast notifications |
| `tailwind-merge` | ^3.5.0 | Merge de classes Tailwind |
| `tw-animate-css` | ^1.4.0 | Animações CSS |

### 14.2 Desenvolvimento (10 pacotes)

| Pacote | Versão | Uso |
|---|---|---|
| `@tailwindcss/postcss` | ^4 | Plugin PostCSS |
| `@types/bcryptjs` | ^2.4.6 | Tipos |
| `@types/node` | ^20 | Tipos Node |
| `@types/react` | ^19 | Tipos React |
| `@types/react-dom` | ^19 | Tipos React DOM |
| `@vitest/coverage-v8` | ^4.1.2 | Coverage |
| `babel-plugin-react-compiler` | 1.0.0 | React Compiler |
| `eslint` | ^9 | Linter |
| `eslint-config-next` | 16.2.1 | Config Next.js |
| `tailwindcss` | ^4 | CSS framework |
| `tsx` | ^4.21.0 | Runtime TypeScript (seeds) |
| `typescript` | ^5 | Linguagem |
| `vitest` | ^4.1.2 | Test runner |

---

## 15. PONTOS DE EXTENSÃO PARA FUTURAS IMPLEMENTAÇÕES

### 15.1 Fáceis (baixo risco)

| Feature | Onde mexer | Esforço |
|---|---|---|
| Adicionar novo campo em User | schema.prisma + form admin | Baixo |
| Nova página no menu | `(main)/nova-rota/page.tsx` + AppHeader | Baixo |
| Novo tipo de aposta especial | schema + actions + component | Médio-Baixo |
| Exportar dados para CSV | Lib util + botão no admin | Baixo |
| Notificações por email | Worker externo + eventos | Médio |

### 15.2 Médios (moderação de risco)

| Feature | Onde mexer | Complexidade |
|---|---|---|
| Suporte a múltiplos torneios | schema (Tournament), rotas, UI | Média |
| Sistema de grupos/ligas | novos models, relações, UI | Média-Alta |
| Pagamento integrado (Stripe/MercadoPago) | webhook, model Payment, fluxo | Média |
| Chat entre usuários | WebSocket, model Message | Média-Alta |
| Estatísticas avançadas | queries agregadas, cache | Média |

### 15.3 Complexos (alto impacto)

| Feature | Mudanças necessárias |
|---|---|
| Migrar para PostgreSQL | schema, DATABASE_URL, testes, deploy |
| Autenticação social (Google, GitHub) | NextAuth providers, UI |
| App mobile (React Native) | API REST separada, auth tokens |
| Real-time com WebSockets | Server-Sent Events ou WS library |
| Multi-tenant | schema changes, row-level security |

---

## 16. RISCOS E CONSIDERAÇÕES TÉCNICAS

### 16.1 Riscos Conhecidos

| Risco | Impacto | Mitigação |
|---|---|---|
| SQLite em produção | Escalabilidade, concorrência | Adequado para < 100 usuários simultâneos |
| NextAuth beta | Breaking changes | Pin versão, testar updates |
| Arquivo DB único | Ponto único de falha | Backup 2x/dia + rotação |
| Sem testes E2E | Bugs de integração | Adicionar Playwright |
| Sem error boundary | Crashes em produção | Adicionar error boundaries |

### 16.2 Boas Práticas Adotadas

✅ Server Components por default  
✅ Validação server-side em todas as mutations  
✅ Rate limiting de login  
✅ senhas com bcrypt (12 rounds)  
✅ Timezone explícito (America/Sao_Paulo)  
✅ Testes unitários de lógica crítica  
✅ CI/CD com lint + test + build  
✅ Blue-green deployment sem downtime  
✅ Backup automático com rotação  
✅ Singleton Prisma client  
✅ Middleware de proteção de rotas  
✅ Constraints de banco (unique, FK, CHECK)  

---

## 17. COMANDOS ÚTEIS DE REFERÊNCIA

### Desenvolvimento

```bash
npm run dev                     # Servidor de desenvolvimento
npm run build                   # Build de produção
npm run start                   # Servidor de produção
npm run lint                    # ESLint
npm run test                    # Vitest run
npm run test:watch              # Vitest watch
npm run test:coverage           # Vitest com coverage

npx prisma migrate dev          # Aplicar migrations
npx prisma studio               # UI do banco
npx prisma generate             # Regenerar client
npx prisma migrate reset --force # Reset completo

npm run prisma:seed:admin       # Seed apenas admin
npm run prisma:seed:worldcup    # Seed Copa do Mundo
npm run prisma:seed:brasileirao-test  # Seed Brasileirão teste
```

### Docker

```bash
# Produção (blue-green)
docker compose -f docker-compose.prod.yml up -d proxy app-blue

# Develop
docker compose -f docker-compose.develop.yml up -d

# Local
AUTH_SECRET=seu_secret docker compose -f docker-compose.local.yml up -d --build
```

### Deploy

```bash
# Manual blue-green
APP_IMAGE=ghcr.io/.../palpite-perfeito-next:latest \
AUTH_SECRET=seu_secret \
./scripts/deploy-blue-green.sh

# Backup manual
./scripts/backup-db.sh

# Instalar cron de backup
./scripts/install-cron.sh
```

---

## 18. CONCLUSÃO

O **Palpite Perfeito Next** é uma aplicação web madura, bem arquitetada e production-ready para um bolão esportivo. Utiliza as melhores práticas do ecossistema Next.js 16 (App Router, Server Components, Server Actions, ISR) com uma stack moderna e coerente.

**Pontos fortes**:
- Arquitetura limpa e modular
- Segurança robusta (auth, rate limit, validação)
- Deploy automatizado sem downtime
- Testes unitários de lógica crítica
- Backup automático com rotação
- Documentação completa

**Áreas de melhoria potencial**:
- Testes E2E (Playwright)
- Migração para PostgreSQL se escalar
- Error boundaries em produção
- Monitoramento/observabilidade (Sentry, etc)
- Mais cobertura de testes (components, actions)

Este documento serve como base de conhecimento completa para futuras implementações, manutenções e evoluções do projeto.
