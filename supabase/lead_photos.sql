-- Metadata for vehicle images stored in the private sell-car-photos bucket.
create table if not exists public.sell_car_lead_photos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.sell_car_leads(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  content_type text not null,
  file_size bigint not null,
  display_order integer not null,
  created_at timestamptz not null default now()
);

create index if not exists sell_car_lead_photos_lead_id_idx
  on public.sell_car_lead_photos (lead_id);
create index if not exists sell_car_lead_photos_display_order_idx
  on public.sell_car_lead_photos (display_order);

-- Browser roles have no access. Server-side calls use the service-role key, which bypasses RLS.
alter table public.sell_car_lead_photos enable row level security;

drop policy if exists sell_car_lead_photos_anon_no_access on public.sell_car_lead_photos;
create policy sell_car_lead_photos_anon_no_access
  on public.sell_car_lead_photos
  as restrictive
  for all
  to anon
  using (false)
  with check (false);

drop policy if exists sell_car_lead_photos_authenticated_no_access on public.sell_car_lead_photos;
create policy sell_car_lead_photos_authenticated_no_access
  on public.sell_car_lead_photos
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);
