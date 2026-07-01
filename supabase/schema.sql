-- Ejecutar UNA SOLA VEZ en el SQL Editor de Supabase.

create extension if not exists pgcrypto;

create table if not exists statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position bigint not null default 0
);

create table if not exists sprints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  end_date date,
  goal text default '',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  status_id uuid references statuses(id) on delete set null,
  sprint_id uuid references sprints(id) on delete set null,
  priority text not null default 'media' check (priority in ('alta','media','baja')),
  estimated_hours numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists task_points (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  position bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  point_id uuid not null references task_points(id) on delete cascade,
  entry_date date not null,
  hours numeric not null,
  description text default '',
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists blockers (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  text text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

-- Estados iniciales (los podés editar/reordenar después desde la app)
insert into statuses (name, position) values
  ('Por hacer', 1),
  ('En progreso', 2),
  ('Bloqueado', 3),
  ('En revisión', 4),
  ('Hecho', 5);

-- Nota de seguridad: a propósito NO se habilita Row Level Security.
-- La app no tiene login y usa la anon key directamente desde el navegador,
-- así que cualquiera con la URL pública podría leer y modificar estos datos.
-- Si en el futuro agregás autenticación, activá RLS y creá políticas por tabla.
