# Arquitetura Técnica — VisitFlow Imob

## Visão geral

A solução é composta por três camadas que se comunicam por meio de uma única **API REST**:

```
┌──────────────┐        ┌──────────────────────────┐        ┌─────────────────────┐
│  App Mobile  │  HTTP  │   API REST (Next.js)      │  SQL   │  Banco de Dados      │
│  (Expo / RN) │ ─────► │   src/app/api/*           │ ─────► │  PostgreSQL (Supabase)│
└──────────────┘        │   - Auth JWT              │        └─────────────────────┘
                        │   - Permissões por perfil │
┌──────────────┐  HTTP  │   - Cálculo de nota       │
│ Interface Web│ ─────► │   - Dashboard             │
│ (Next.js/React)        └──────────────────────────┘
└──────────────┘
```

## Componentes

### Backend / API REST (Next.js Route Handlers)
- Implementado em `src/app/api/*` (App Router).
- Autenticação **JWT**: `POST /api/auth/login` valida e-mail/senha (bcrypt) e emite um token assinado com `JWT_SECRET`. As demais rotas leem o header `Authorization: Bearer <token>`.
- **Permissões** (`src/lib/permissions.js`): o GERENTE enxerga os corretores cujo `manager_id` é o seu; o CORRETOR enxerga apenas a si mesmo.
- **Regra de negócio da nota** (`src/lib/score.js`): a partir do quiz, calcula a nota 0–5; nota ≥ 4 marca o cliente como quente; intenção de proposta força nota 5 e status `PROPOSTA_EM_ANDAMENTO`; visita não realizada recebe nota 0.
- **CORS** liberado para a API (`next.config.js` + `src/middleware.js`) para permitir o consumo pelo app mobile.

### Banco de dados (Supabase Postgres)
Tabelas: `users`, `clients`, `properties`, `visits`, `visit_properties`, `visit_feedbacks`, `notifications`. Schema em `supabase/migrations/0001_init.sql`; dados mocados em `supabase/seed.sql`. O acesso é feito server-side via `@supabase/supabase-js` com a *service role key* (`src/lib/db.js`).

### Interface Web (Next.js + React + Tailwind)
- Páginas em `src/app/(app)/*`: Dashboard, Kanban, Clientes, Imóveis, Corretores, Clientes Quentes, Relatórios.
- Consome a API via `fetch` com o JWT guardado em `localStorage` (`src/lib/api-client.js`).

### App Mobile (Expo / React Native)
- Telas em `mobile/src/screens/*`: Login, Home, Agenda, Detalhe da visita, Quiz, Clientes Quentes, Perfil.
- Consome a **mesma API REST** via `mobile/src/services/api.js`, com o JWT em `AsyncStorage`.

## Fluxo de integração demonstrável
1. O corretor cria/confirma uma visita no **app mobile** → `POST/PATCH /api/visits`.
2. O dado é persistido no **Postgres** via API.
3. O **gerente** vê a mesma visita refletida no Kanban da **web** → `GET /api/visits`.
4. O corretor responde o **quiz** no mobile → `POST /api/visits/:id/feedback` calcula a nota e, se ≥ 4, move o cliente para *Clientes Quentes*, visível em ambas as interfaces.

## Deploy
- **Web + API:** Vercel (um único projeto Next.js).
- **Banco:** Supabase.
- **Mobile:** Expo Go (QR code), apontando `EXPO_PUBLIC_API_URL` para a URL da Vercel.
