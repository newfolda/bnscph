-- Run this migration in the Supabase SQL editor before deploying rate-limited public forms.
-- Browser roles remain denied access; server-side service-role code performs all lead operations.

create table if not exists public.api_rate_limits (
  endpoint text not null,
  key_hash text not null,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  primary key (endpoint, key_hash)
);
alter table public.api_rate_limits enable row level security;
revoke all on table public.api_rate_limits from anon, authenticated;

create or replace function public.consume_api_rate_limit(
  p_endpoint text,
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count integer;
begin
  if p_endpoint !~ '^[a-z0-9-]{1,64}$' or length(p_key_hash) <> 64 or p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  insert into public.api_rate_limits (endpoint, key_hash, window_started_at, request_count)
  values (p_endpoint, p_key_hash, now(), 1)
  on conflict (endpoint, key_hash) do update
  set request_count = case
        when public.api_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
        then 1 else public.api_rate_limits.request_count + 1 end,
      window_started_at = case
        when public.api_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
        then now() else public.api_rate_limits.window_started_at end
  returning request_count into next_count;

  return next_count <= p_limit;
end;
$$;
revoke all on function public.consume_api_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, text, integer, integer) to service_role;

-- The service-role key bypasses RLS and retains execute access. Do not grant browser roles access.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sell-car-photos', 'sell-car-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists sell_car_photos_anon_no_access on storage.objects;
create policy sell_car_photos_anon_no_access on storage.objects as restrictive for all to anon using (false) with check (false);
drop policy if exists sell_car_photos_authenticated_no_access on storage.objects;
create policy sell_car_photos_authenticated_no_access on storage.objects as restrictive for all to authenticated using (false) with check (false);
