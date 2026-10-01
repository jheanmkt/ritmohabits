-- Ritmo: una fila por usuario con todos sus datos (hábitos, recordatorios, checklist...)
create table if not exists public.ritmo_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seguridad: cada persona solo puede ver y editar SU propia fila
alter table public.ritmo_state enable row level security;

drop policy if exists "ritmo: ver lo propio"      on public.ritmo_state;
drop policy if exists "ritmo: crear lo propio"    on public.ritmo_state;
drop policy if exists "ritmo: editar lo propio"   on public.ritmo_state;
drop policy if exists "ritmo: borrar lo propio"   on public.ritmo_state;

create policy "ritmo: ver lo propio"    on public.ritmo_state for select using (auth.uid() = user_id);
create policy "ritmo: crear lo propio"  on public.ritmo_state for insert with check (auth.uid() = user_id);
create policy "ritmo: editar lo propio" on public.ritmo_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ritmo: borrar lo propio" on public.ritmo_state for delete using (auth.uid() = user_id);
