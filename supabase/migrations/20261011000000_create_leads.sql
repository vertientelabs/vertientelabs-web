-- Leads del formulario de contacto de vertientelabs.com
-- Ejecutar una vez en Supabase (SQL Editor o `supabase db push`).

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nombre      text not null check (char_length(nombre) between 2 and 120),
  empresa     text not null check (char_length(empresa) between 2 and 160),
  email       text not null check (char_length(email) <= 254 and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  sector      text not null check (sector in (
                'Industria / Manufactura', 'Minería', 'Energía y servicios básicos',
                'Construcción / Ingeniería', 'Inmobiliaria / Condominios', 'Logística', 'Salud', 'Otro')),
  interes     text check (interes is null or interes in (
                'LaborCare', 'Vertiente Reader', 'Software a la medida', 'Plataforma web',
                'App móvil', 'Producto con IA', 'Consultoría técnica', 'Aún no lo sé')),
  mensaje     text check (mensaje is null or char_length(mensaje) <= 4000),
  origen      text not null default 'web' check (char_length(origen) <= 40),
  user_agent  text check (user_agent is null or char_length(user_agent) <= 400),
  atendido    boolean not null default false
);

comment on table public.leads is 'Solicitudes del formulario de contacto del sitio web.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Seguridad: la web usa la clave publicable (rol anon). Solo puede INSERTAR.
-- Sin políticas de SELECT/UPDATE/DELETE: los leads solo se leen desde el
-- panel de Supabase o con la clave secreta, nunca desde el navegador.
alter table public.leads enable row level security;

drop policy if exists "web puede registrar leads" on public.leads;
create policy "web puede registrar leads"
  on public.leads
  for insert
  to anon
  with check (atendido = false and origen = 'web');

revoke all on public.leads from anon;
grant insert (nombre, empresa, email, sector, interes, mensaje, origen, user_agent) on public.leads to anon;
