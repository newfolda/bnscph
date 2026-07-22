create table if not exists public.purchased_cars (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.sell_car_leads(id) on delete cascade,
  purchase_price numeric(12,2) null,
  purchase_date date null,
  assigned_staff text null,
  inventory_status text not null default 'Purchased',
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint purchased_cars_inventory_status_check check (inventory_status in ('Purchased', 'Repairing', 'Ready for Sale', 'Sold'))
);
create index if not exists purchased_cars_lead_id_idx on public.purchased_cars (lead_id);
alter table public.purchased_cars enable row level security;
create policy purchased_cars_anon_no_access on public.purchased_cars as restrictive for all to anon using (false) with check (false);
create policy purchased_cars_authenticated_no_access on public.purchased_cars as restrictive for all to authenticated using (false) with check (false);
create or replace function public.set_purchased_cars_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger purchased_cars_set_updated_at before update on public.purchased_cars for each row execute function public.set_purchased_cars_updated_at();
