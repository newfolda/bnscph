-- Scheduled doorstep inspections for Sell My Car leads.
create table if not exists public.sell_car_inspections (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.sell_car_leads(id) on delete cascade,
  scheduled_at timestamptz not null,
  location text not null,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sell_car_inspections_lead_id_idx
  on public.sell_car_inspections (lead_id);
create index if not exists sell_car_inspections_scheduled_at_idx
  on public.sell_car_inspections (scheduled_at desc);

-- Browser roles have no access. Server-side calls use the service-role key, which bypasses RLS.
alter table public.sell_car_inspections enable row level security;

drop policy if exists sell_car_inspections_anon_no_access on public.sell_car_inspections;
create policy sell_car_inspections_anon_no_access
  on public.sell_car_inspections
  as restrictive
  for all
  to anon
  using (false)
  with check (false);

drop policy if exists sell_car_inspections_authenticated_no_access on public.sell_car_inspections;
create policy sell_car_inspections_authenticated_no_access
  on public.sell_car_inspections
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);

-- Keep updated_at current whenever an inspection is replaced.
create or replace function public.set_sell_car_inspections_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sell_car_inspections_set_updated_at on public.sell_car_inspections;
create trigger sell_car_inspections_set_updated_at
before update on public.sell_car_inspections
for each row
execute function public.set_sell_car_inspections_updated_at();
