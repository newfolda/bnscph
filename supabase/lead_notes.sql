-- Internal activity notes linked to Sell My Car leads.
create table if not exists public.sell_car_lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.sell_car_leads(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author text null
);

create index if not exists sell_car_lead_notes_lead_id_idx
  on public.sell_car_lead_notes (lead_id);
create index if not exists sell_car_lead_notes_created_at_idx
  on public.sell_car_lead_notes (created_at desc);

-- Browser roles have no access. Server-side calls use the service-role key, which bypasses RLS.
alter table public.sell_car_lead_notes enable row level security;

drop policy if exists sell_car_lead_notes_anon_no_access on public.sell_car_lead_notes;
create policy sell_car_lead_notes_anon_no_access
  on public.sell_car_lead_notes
  as restrictive
  for all
  to anon
  using (false)
  with check (false);

drop policy if exists sell_car_lead_notes_authenticated_no_access on public.sell_car_lead_notes;
create policy sell_car_lead_notes_authenticated_no_access
  on public.sell_car_lead_notes
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);

-- Keep updated_at current whenever an internal note is edited.
create or replace function public.set_sell_car_lead_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sell_car_lead_notes_set_updated_at on public.sell_car_lead_notes;
create trigger sell_car_lead_notes_set_updated_at
before update on public.sell_car_lead_notes
for each row
execute function public.set_sell_car_lead_notes_updated_at();
