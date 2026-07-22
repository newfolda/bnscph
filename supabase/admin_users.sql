-- Active staff records authorize authenticated Supabase users for the internal admin area.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint admin_users_role_check check (role in ('admin', 'staff'))
);

-- Browser roles cannot read or modify admin access records. Server-side service-role calls bypass RLS.
alter table public.admin_users enable row level security;

drop policy if exists admin_users_anon_no_access on public.admin_users;
create policy admin_users_anon_no_access
  on public.admin_users
  as restrictive
  for all
  to anon
  using (false)
  with check (false);

drop policy if exists admin_users_authenticated_no_access on public.admin_users;
create policy admin_users_authenticated_no_access
  on public.admin_users
  as restrictive
  for all
  to authenticated
  using (false)
  with check (false);
