# VisitFlow Imob

**VisitFlow Imob** é uma plataforma integrada de gestão de visitas imobiliárias para corretores e gerentes. Projeto desenvolvido como **Atividade Substitutiva da Global Solution**, demonstrando integração real entre **app mobile**, **interface web** e **backend com API REST**.

> Aluno: **Rafael Santos** — RM: **560567**

## Slogan
Gestão inteligente de visitas imobiliárias.

## Problema
Corretores costumam visitar de 3 a 7 imóveis com um mesmo cliente antes de gerar uma proposta. Sem um sistema centralizado, perde-se o controle de agenda, roteiros, imóveis visitados, retorno do cliente e oportunidades quentes.

## Solução
Um fluxo visual (Kanban), agenda, roteiros com múltiplos imóveis, quiz pós-visita, nota de qualificação (0–5 estrelas) e dashboard administrativo.

## Perfis de usuário
- **GERENTE**: acompanha toda a equipe, dashboard, Kanban, clientes, imóveis e clientes quentes.
- **CORRETOR**: gerencia apenas seus próprios clientes e visitas.

## Arquitetura

```
App Mobile (Expo)  ─┐
                    ├─►  API REST (Next.js /api)  ─►  Banco (Supabase Postgres)
Interface Web ──────┘
```

O app mobile e a interface web consomem **a mesma API REST**, servida por route handlers do Next.js (`src/app/api/*`). O backend autentica via **JWT**, aplica as regras de permissão por perfil e calcula a nota da visita a partir do quiz.

## Stack
| Camada | Tecnologia |
|---|---|
| Interface web + API REST | Next.js 15 (App Router) + Tailwind CSS |
| App mobile | React Native + Expo |
| Banco de dados | PostgreSQL (Supabase) |
| Autenticação | JWT (`jsonwebtoken` + `bcryptjs`) |
| Deploy web/API | Vercel |
| Deploy mobile | Expo Go |

## Contas de teste (senha: `123456`)
- Gerente: `gerente@visitflow.com`
- Corretor: `joao@visitflow.com` · `ana@visitflow.com`

## Rodando localmente

### 1. Backend + Web (Next.js)
```bash
npm install
cp .env.example .env        # preencha SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
npm run dev                 # http://localhost:3000
```

### 2. Banco de dados (Supabase)
Crie um projeto no Supabase e rode, no SQL Editor, na ordem:
1. `supabase/migrations/0001_init.sql`
2. `supabase/seed.sql`

### 3. App mobile (Expo)
```bash
cd mobile
npm install
cp .env.example .env        # EXPO_PUBLIC_API_URL apontando para a API (Vercel ou IP local)
npx expo start              # escaneie o QR code com o Expo Go
```

## API REST (resumo)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login, retorna JWT |
| GET | `/api/auth/me` | Usuário autenticado |
| GET/POST | `/api/clients` | Listar / criar clientes |
| GET/PUT/DELETE | `/api/clients/:id` | Detalhe / editar / excluir |
| GET/POST | `/api/properties` | Listar / cadastrar imóveis |
| GET/PUT/DELETE | `/api/properties/:id` | Detalhe / editar / excluir |
| GET/POST | `/api/visits` | Listar / criar visitas (com roteiro) |
| GET/DELETE | `/api/visits/:id` | Detalhe / excluir |
| PATCH | `/api/visits/:id/status` | Atualizar status |
| GET/POST | `/api/visits/:id/feedback` | Quiz pós-visita + cálculo de nota |
| GET | `/api/dashboard/manager` | Indicadores da equipe |
| GET | `/api/dashboard/broker` | Indicadores do corretor |
| GET | `/api/dashboard/hot-clients` | Clientes quentes (nota ≥ 4) |
| GET | `/api/users` | Corretores visíveis |
| GET | `/api/notifications` | Notificações |
| PATCH | `/api/notifications/:id/read` | Marcar como lida |

## Variáveis de ambiente

### Vercel (web + API)
| Nome | Descrição |
|---|---|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secreta) |
| `JWT_SECRET` | Segredo para assinar os JWT |

### Mobile (Expo)
| Nome | Descrição |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL da API (`https://<deploy>.vercel.app/api`) |

## Links
- **Deploy web/API:** https://visitflow-imob.vercel.app
- **Repositório:** https://github.com/rafastos-io/visitflow-imob

## Funcionalidades
- Login com dois perfis (GERENTE / CORRETOR)
- Cadastro de clientes e imóveis
- Cadastro de visitas com roteiro de múltiplos imóveis
- Kanban (Marcadas, Confirmadas, Realizadas, Clientes Quentes, Proposta em Andamento)
- Quiz pós-visita com cálculo de nota 0–5
- Marcação automática de cliente quente (nota ≥ 4) e proposta em andamento
- Alerta de visita pós-data pendente de atualização
- Dashboard com indicadores reais
- API REST consumida por web e mobile
