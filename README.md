<div align="center">

# ⭐ Palpite Perfeito

### O bolão completo para a Copa do Mundo 2026!!

*Faça seus palpites, dispute com amigos e comprove quem manda nas previsões!*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-663399?logo=postgresql)](https://neon.com)

</div>

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack técnica](#-stack-técnica)
- [Pontuação](#-sistema-de-pontuação)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar localmente](#-como-rodar-localmente)
- [Deploy na Vercel + Neon](#-deploy-na-vercel--neon)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Banco de dados](#-banco-de-dados)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Painel Administrativo](#-painel-administrativo)

---

## 🎯 Sobre o projeto

**Palpite Perfeito** é uma aplicação web de bolão esportivo construída com Next.js 16, focada na Copa do Mundo 2026. Cada participante palpita nos placares das partidas, aposta no artilheiro e no campeão — acumulando pontos conforme a precisão das previsões. Também existe um seed de teste para Brasileirão 2026, útil para validar rodada e fluxo de apostas com jogos reais de teste.

### ✨ Destaques

- ⚡ **Tempo real** — pontos atualizados assim que o admin lança resultados
- 🔒 **Apostas únicas protegidas** — prazo valida 10 min antes de cada jogo (fuso SP)
- 📱 **Responsivo** — header adaptativo com ícones em telas menores, textos em telas largas
- 🛡️ **Segurança** — NextAuth + bcrypt + validação dupla (client + server action)

---

## 🚀 Funcionalidades

### Para participantes
| Funcionalidade | Descrição |
|---|---|
| 🏟️ **Palpites de partidas** | Aposte no placar antes de cada jogo (fecha 10 min antes) |
| 🥇 **Artilheiro da Copa** | Aposta única — nome do jogador + total de gols |
| 🏆 **Campeão & Final** | Aposta única — campeão, vice e placar da grande final |
| 📊 **Ranking ao vivo** | Classificação geral com todos os participantes |
| 📋 **Meus Palpites** | Histórico de palpites com pontos ganhos por jogo |
| ❓ **Como Funciona** | Página de ajuda com exemplos e tabela de pontuação |

### Para administradores
| Funcionalidade | Descrição |
|---|---|
| ✅ **Lançar resultados** | Insere placar + gols de cada partida e recalcula pontos |
| ⚽ **Gerenciar partidas** | CRUD completo: criar, editar, excluir partidas |
| 👥 **Gerenciar usuários** | CRUD de participantes com controle de roles |
| 🏅 **Definir artilheiro** | Define o artilheiro oficial e recalcula as apostas |
| 🥇 **Definir campeão** | Define campeão/vice/placar da final e recalcula |
| ♻️ **Resetar base** | Limpa palpites, gols, apostas especiais, resultados e pontos, preservando as partidas |

---

## 🛠️ Stack técnica

| Camada | Tecnologia |
|---|---|
| **Framework** | [Next.js 16.2](https://nextjs.org) com Turbopack + React Compiler |
| **Linguagem** | TypeScript 5 |
| **Autenticação** | [NextAuth v5](https://authjs.dev) — JWT + Credentials |
| **ORM** | [Prisma 6](https://prisma.io) |
| **Banco** | [Neon PostgreSQL](https://neon.com) (serverless, com branching) |
| **Deploy** | [Vercel](https://vercel.com) |
| **Estilização** | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Componentes** | Radix UI, Lucide Icons, Sonner (toasts) |
| **Datas/Fuso** | `date-fns` + `date-fns-tz` (America/Sao_Paulo) |
| **Senhas** | `bcryptjs` |

---

## 🏆 Sistema de Pontuação

### Palpites de Partidas

| Situação | Pontos |
|---|:---:|
| 🎯 Placar exato | **25** |
| 🥈 Vencedor + gols de um time corretos | **20** |
| 🥉 Empate não exato | **18** |
| 🟤 Apenas vencedor correto | **15** |
| 🟢 Gols do perdedor | **5** |
| ❌ Erro total | **0** |

### Apostas Especiais

| Situação | Pontos |
|---|:---:|
| 🎯 Artilheiro: nome + gols corretos | **35** |
| 🎖️ Artilheiro: apenas nome correto | **20** |
| 🥇 Final: campeão + placar + vice corretos | **90** |
| 🥈 Final: campeão + placar corretos | **70** |
| 🥉 Final: apenas campeão correto | **50** |

> **Nota:** As apostas especiais fecham **10 minutos antes do primeiro jogo** e são **únicas** (não podem ser alteradas após salvas).

---

## 📦 Pré-requisitos

- **Node.js** ≥ 20
- **npm** ≥ 10
- **PostgreSQL** local ou remoto (para desenvolvimento)

---

## ▶️ Como rodar localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/seu-usuario/palpite-perfeito-next.git
cd palpite-perfeito-next
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com seus valores (veja seção abaixo)
```

### 3. Criar e popular o banco

```bash
# Aplicar migrations no banco
npm run db:migrate

# Popular com dados da Copa do Mundo
npm run db:seed:worldcup

# Ou seed de teste do Brasileirão (rodada 10)
npm run db:seed:brasileirao-test

# Ou apenas criar usuário admin
npm run db:seed:admin
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3000
```

### 5. Build para produção

```bash
npm run build
npm run start
```

### Comandos úteis do banco

```bash
# Abrir o Prisma Studio (interface visual do banco)
npx prisma studio

# Push do schema sem migration (dev)
npm run db:push

# Regenerar o client após alterar o schema
npx prisma generate
```

---

## 🚀 Deploy na Vercel + Neon

### Passo a passo

#### 1. Criar banco no Neon

1. Acesse [neon.com](https://neon.com) e crie uma conta
2. Crie um novo projeto (ex: `palpite-perfeito`)
3. Copie a **Connection String** (pooler ou direta) no formato:
   ```
   postgresql://user:password@host/db?sslmode=require
   ```
4. Cole no `.env` como `DATABASE_URL`

#### 2. Deploy na Vercel

**Opção A — Via CLI:**

```bash
npm i -g vercel
vercel
# Siga as instruções e configure as variáveis de ambiente
```

**Opção B — Via Dashboard:**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente (veja abaixo)
4. Clique em **Deploy**

#### 3. Aplicar migrations no banco de produção

```bash
DATABASE_URL="sua_url_do_neon" npm run db:migrate
```

Ou rode localmente apontando para o banco Neon:

```bash
# Copie .env.example para .env.local e preencha com a URL do Neon
DATABASE_URL="postgresql://..." \
AUTH_SECRET="seu_secret" \
NEXTAUTH_URL="https://seu-app.vercel.app" \
npm run db:migrate
```

#### 4. Criar usuário admin

```bash
DATABASE_URL="sua_url_do_neon" npm run db:seed:admin
```

#### 5. Configurar domínio customizado (opcional)

No dashboard da Vercel, acesse **Settings → Domains** e adicione seu domínio (ex: `bolao.cesarmenegatti.com`).

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (ou configure no dashboard da Vercel):

```env
# ============================================
# DATABASE — Neon PostgreSQL
# ============================================
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# ============================================
# NEXTAUTH / AUTHENTICATION
# ============================================
# Gere um secret com: openssl rand -base64 32
AUTH_SECRET="seu_secret_aqui"
NEXTAUTH_SECRET="seu_secret_aqui"

# URL base da aplicação (produção)
NEXTAUTH_URL="https://seu-app.vercel.app"

# ============================================
# ADMIN (seed inicial)
# ============================================
ADMIN_PASS="Admin@2026#"
```

> ⚠️ **Nunca** versione o arquivo `.env` com valores reais. O arquivo já está no `.gitignore`.

### Variáveis na Vercel

No dashboard da Vercel, acesse **Settings → Environment Variables** e adicione:

| Variável | Ambiente | Obrigatória |
|---|---|---|
| `DATABASE_URL` | Production, Preview, Development | ✅ Sim |
| `AUTH_SECRET` | Production, Preview, Development | ✅ Sim |
| `NEXTAUTH_SECRET` | Production, Preview, Development | ✅ Sim |
| `NEXTAUTH_URL` | Production, Preview, Development | ✅ Sim |
| `ADMIN_PASS` | Production | ❌ Apenas para seed |

---

## 🗄️ Banco de dados

O projeto usa **Neon PostgreSQL** (serverless) com **Prisma ORM**.

### Por que Neon?

- **Serverless**: escala automaticamente, paga pelo uso
- **Branching**: crie branches do banco para test features sem afetar produção
- **Connection Pooling**: pooler built-in para serverless (Vercel Functions)
- **Free tier generoso**: 0.5 GB storage, suficiente para um bolão

### Modelos principais

```
User           → participantes (role: USER | ADMIN)
Match          → partidas (status: SCHEDULED | FINISHED)
Goal           → gols de uma partida (player, team, minute)
Guess          → palpite de partida por usuário
TopScorerBet   → aposta no artilheiro (única por usuário)
ChampionBet    → aposta no campeão/vice/final (única por usuário)
TournamentResult → resultado oficial (artilheiro e campeão)
LoginAttempt   → tentativas de login (rate limiting)
```

### Migrations

O projeto usa migrations versionadas em `prisma/migrations/`. Para aplicar:

```bash
npm run db:migrate   # prisma migrate deploy (produção)
npx prisma migrate dev  # desenvolvimento (cria nova migration)
```

## ♻️ Reset administrativo

No painel admin existe um botão de reset para reiniciar a competição antes de uma nova rodada ou evento.

- Mantém as partidas cadastradas quando o objetivo é só resetar a competição.
- Remove gols, palpites, apostas especiais, resultados e login attempts.
- Zera os pontos de todos os usuários.
- Exige confirmação manual no painel para evitar limpeza acidental.

---

## 📁 Estrutura do projeto

```
palpite-perfeito-next/
├── prisma/
│   ├── schema.prisma           # Modelos do banco
│   ├── seed.ts                 # Dados iniciais
│   └── migrations/             # Histórico de migrations
├── public/                     # Assets estáticos
└── src/
    ├── app/
    │   ├── (main)/             # Rotas protegidas por auth
    │   │   ├── page.tsx            # 🏟️ Dashboard geral
    │   │   ├── jogos/              # Lista de partidas
    │   │   ├── ranking/            # 📊 Ranking geral
    │   │   ├── my-bets/            # 📋 Meus palpites
    │   │   ├── special-bets/       # ⭐ Apostas especiais
    │   │   ├── help/               # ❓ Como funciona
    │   │   └── admin/              # 🛡️ Painel admin
    │   ├── actions/                # Server Actions
    │   │   ├── auth.ts             # Login / registro
    │   │   ├── guesses.ts          # Salvar palpites
    │   │   ├── admin.ts            # Ações administrativas
    │   │   └── special-bets.ts     # Apostas especiais
    │   └── api/auth/               # NextAuth route handler
    ├── components/
    │   ├── AdminPanel.tsx          # Dashboard admin (5 abas)
    │   ├── AppHeader.tsx           # Navbar responsivo
    │   ├── BetDialog.tsx           # Modal de palpite
    │   ├── GameCard.tsx            # Card de partida
    │   ├── GamesList.tsx           # Lista de partidas
    │   ├── SpecialBetsPanel.tsx    # Formulários de apostas especiais
    │   ├── FinancePanel.tsx        # Gestão financeira
    │   └── ui/                     # Componentes shadcn/ui
    └── lib/
        ├── auth.ts                 # Config NextAuth
        ├── auth-helpers.ts         # getSession, requireAdmin
        ├── auth-rate-limit.ts      # Rate limiting login
        ├── game-logic.ts           # Regras do bolão
        ├── prisma.ts               # Client singleton
        ├── scoring.ts              # Re-export de scoring
        └── timezone.ts             # Formatação de datas (SP)
```

---

## 🛡️ Painel Administrativo

Acesse `/admin` com uma conta de role `ADMIN`. O painel tem 5 abas:

| Aba | Função |
|---|---|
| **Resultados** | Lança placar + gols; recalcula pontos automaticamente |
| **Jogos** | CRUD de partidas (grupos e eliminatórias) |
| **Torneio** | Define artilheiro e resultado da final |
| **Usuários** | CRUD de participantes; promoção para ADMIN |
| **Palpites** | Lista todos os palpites de todos os usuários |

---

<div align="center">

Feito com ☕ e muito amor ao futebol brasileiro.

</div>
