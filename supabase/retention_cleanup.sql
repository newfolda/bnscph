-- Deploy after the base schema and security_hardening.sql.
-- Actual closed/unsuccessful statuses in this application are rejected and archived.

alter table public.sell_car_leads
  add column if not exists closed_at timestamptz null,
  add column if not exists retention_delete_after timestamptz null,
  add column if not exists legal_hold boolean not null default false,
  add column if not exists retention_status text null;

alter table public.sell_car_leads
  drop constraint if exists sell_car_leads_retention_status_check;
alter table public.sell_car_leads
  add constraint sell_car_leads_retention_status_check
  check (retention_status is null or retention_status in ('scheduled', 'cleanup_in_progress', 'held', 'retained'));

create index if not exists sell_car_leads_retention_cleanup_idx
  on public.sell_car_leads (retention_delete_after)
  where retention_delete_after is not null and legal_hold = false;

create or replace function public.apply_sell_car_lead_retention()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('rejected', 'archived') then
    new.closed_at := coalesce(old.closed_at, new.closed_at, now());
    new.retention_delete_after := coalesce(new.retention_delete_after, new.closed_at + interval '30 days');
    new.retention_status := case when new.legal_hold then 'held' else 'scheduled' end;
  elsif new.status = 'purchased' then
    new.retention_delete_after := null;
    new.retention_status := 'retained';
  else
    new.closed_at := null;
    new.retention_delete_after := null;
    new.retention_status := null;
  end if;

  if new.legal_hold and new.status in ('rejected', 'archived') then
    new.retention_status := 'held';
  elsif not new.legal_hold and new.status in ('rejected', 'archived') and new.retention_status = 'held' then
    new.retention_status := 'scheduled';
  end if;
  return new;
end;
$$;

drop trigger if exists sell_car_leads_apply_retention on public.sell_car_leads;
create trigger sell_car_leads_apply_retention
before insert or update of status, legal_hold, closed_at, retention_delete_after on public.sell_car_leads
for each row execute function public.apply_sell_car_lead_retention();

create or replace function public.preview_expired_sell_car_leads()
returns table (
  lead_id uuid,
  lead_status text,
  closed_at timestamptz,
  retention_delete_after timestamptz,
  photo_count bigint,
  has_purchased_car boolean,
  legal_hold boolean
)
language sql
security definer
set search_path = public
as $$
  select l.id, l.status, l.closed_at, l.retention_delete_after,
    count(p.id) as photo_count,
    exists (select 1 from public.purchased_cars pc where pc.lead_id = l.id) as has_purchased_car,
    l.legal_hold
  from public.sell_car_leads l
  left join public.sell_car_lead_photos p on p.lead_id = l.id
  where l.status in ('rejected', 'archived')
    and l.retention_delete_after <= now()
    and l.legal_hold = false
    and not exists (select 1 from public.purchased_cars pc where pc.lead_id = l.id)
  group by l.id;
$$;
revoke all on function public.preview_expired_sell_car_leads() from public, anon, authenticated;
grant execute on function public.preview_expired_sell_car_leads() to service_role;

-- Create these two Vault secrets in the Supabase Dashboard before enabling the job:
-- cleanup_expired_leads_url: https://<project-ref>.supabase.co/functions/v1/cleanup-expired-leads
-- cleanup_expired_leads_secret: a long random secret also set as CLEANUP_CRON_SECRET for the Edge Function.
do $$
declare existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job where jobname = 'cleanup-expired-unsuccessful-leads' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule(
    'cleanup-expired-unsuccessful-leads',
    '0 19 * * *',
    $cron$
      select net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'cleanup_expired_leads_url' limit 1),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cleanup-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cleanup_expired_leads_secret' limit 1)
        ),
        body := '{}'::jsonb
      );
    $cron$
  );
end $$;
