create or replace function public.verify_cleanup_activation()
returns table (
  pg_cron_available boolean,
  pg_net_available boolean,
  cleanup_job_count bigint,
  cleanup_schedule text,
  vault_url_exists boolean,
  vault_secret_exists boolean,
  preview_candidate_count bigint
)
language sql
security definer
set search_path = public, cron, vault
as $$
  select
    to_regclass('cron.job') is not null,
    exists (select 1 from pg_extension where extname = 'pg_net'),
    (select count(*) from cron.job where jobname = 'cleanup-expired-unsuccessful-leads'),
    (select schedule from cron.job where jobname = 'cleanup-expired-unsuccessful-leads' limit 1),
    exists (select 1 from vault.decrypted_secrets where name = 'cleanup_expired_leads_url'),
    exists (select 1 from vault.decrypted_secrets where name = 'cleanup_expired_leads_secret'),
    (select count(*) from public.preview_expired_sell_car_leads());
$$;
revoke all on function public.verify_cleanup_activation() from public, anon, authenticated;
grant execute on function public.verify_cleanup_activation() to service_role;
