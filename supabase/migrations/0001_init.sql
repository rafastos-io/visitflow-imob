-- VisitFlow Imob - schema inicial
-- Aplicar no projeto Supabase (SQL Editor, CLI ou MCP apply_migration).

create extension if not exists "pgcrypto";

-- ===== users (gerentes e corretores) =====
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('GERENTE', 'CORRETOR')),
  manager_id uuid references users(id),
  created_at timestamptz not null default now()
);

-- ===== clients =====
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  broker_id uuid references users(id),
  created_at timestamptz not null default now()
);

-- ===== properties =====
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  address text,
  neighborhood text,
  city text,
  type text,
  area numeric,
  bedrooms integer,
  suites integer,
  parking_spaces integer,
  price numeric,
  status text default 'Disponivel',
  created_at timestamptz not null default now()
);

-- ===== visits =====
create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  broker_id uuid references users(id),
  manager_id uuid references users(id),
  scheduled_at timestamptz not null,
  status text not null default 'MARCADA'
    check (status in ('MARCADA','CONFIRMADA','REALIZADA','CLIENTE_QUENTE','PROPOSTA_EM_ANDAMENTO','CANCELADA')),
  score integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== visit_properties (roteiro: imoveis por visita) =====
create table if not exists visit_properties (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references visits(id) on delete cascade,
  property_id uuid references properties(id),
  visit_order integer,
  created_at timestamptz not null default now()
);

-- ===== visit_feedbacks (quiz pos-visita) =====
create table if not exists visit_feedbacks (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references visits(id) on delete cascade,
  was_completed boolean,
  visited_count text,
  interest_level text,
  has_proposal_intent boolean,
  general_perception text,
  notes text,
  score integer,
  created_at timestamptz not null default now()
);

-- ===== notifications =====
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  visit_id uuid references visits(id),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_broker on clients(broker_id);
create index if not exists idx_visits_broker on visits(broker_id);
create index if not exists idx_visits_status on visits(status);
create index if not exists idx_visit_properties_visit on visit_properties(visit_id);
create index if not exists idx_notifications_user on notifications(user_id);
