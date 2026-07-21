-- Extensions required by this schema.
create extension if not exists pgcrypto;

-- Sell My Car lead records persisted by the server-side API.
create table if not exists public.sell_car_leads (
  id uuid primary key default gen_random_uuid(),
  reference_id text unique not null,
  submitted_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new',
  full_name text not null,
  mobile_number text not null,
  city text not null,
  vehicle_year integer not null,
  make text not null,
  model text not null,
  variant text null,
  mileage integer not null,
  transmission text not null,
  fuel_type text not null,
  condition text not null,
  vehicle_field_modes jsonb not null,
  photo_count integer not null,
  privacy_consent boolean not null,
  source text not null,
  raw_payload jsonb not null,
  constraint sell_car_leads_vehicle_year_min_check check (vehicle_year >= 1990),
  constraint sell_car_leads_vehicle_year_max_check check (vehicle_year <= 2100),
  constraint sell_car_leads_mileage_check check (mileage >= 0),
  constraint sell_car_leads_photo_count_min_check check (photo_count >= 0),
  constraint sell_car_leads_photo_count_max_check check (photo_count <= 8),
  constraint sell_car_leads_status_check check (
    status in ('new', 'contacted', 'inspection_scheduled', 'purchased', 'rejected', 'archived')
  )
);

-- reference_id is indexed by its unique constraint.
create index if not exists sell_car_leads_status_idx on public.sell_car_leads (status);
create index if not exists sell_car_leads_created_at_idx on public.sell_car_leads (created_at desc);
create index if not exists sell_car_leads_mobile_number_idx on public.sell_car_leads (mobile_number);
create index if not exists sell_car_leads_vehicle_year_idx on public.sell_car_leads (vehicle_year);
create index if not exists sell_car_leads_make_idx on public.sell_car_leads (make);
create index if not exists sell_car_leads_model_idx on public.sell_car_leads (model);
create index if not exists sell_car_leads_city_idx on public.sell_car_leads (city);

-- Row access is denied to browser roles. The server-only service-role key bypasses RLS for API inserts.
alter table public.sell_car_leads enable row level security;

drop policy if exists sell_car_leads_anon_no_access on public.sell_car_leads;
create policy sell_car_leads_anon_no_access
  on public.sell_car_leads
  as restrictive
  for all
  to anon
  using (false)
  with check (false);

drop policy if exists sell_car_leads_authenticated_no_access on public.sell_car_leads;
create policy sell_car_leads_authenticated_no_access
  on public.sell_car_leads
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);

-- Keep updated_at current whenever an existing lead is modified.
create or replace function public.set_sell_car_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sell_car_leads_set_updated_at on public.sell_car_leads;
create trigger sell_car_leads_set_updated_at
before update on public.sell_car_leads
for each row
execute function public.set_sell_car_leads_updated_at();
