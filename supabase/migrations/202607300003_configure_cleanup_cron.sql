create or replace function public.configure_cleanup_cron(p_url text, p_secret text)
returns void
language plpgsql
security definer
set search_path = public, vault, cron, net
as $$
declare existing_job_id bigint;
begin
  if p_url !~ '^https://[a-z0-9-]+\.supabase\.co/functions/v1/cleanup-expired-leads$' or length(p_secret) < 48 then
    raise exception 'Invalid cleanup configuration';
  end if;
  delete from vault.secrets where name in ('cleanup_expired_leads_url', 'cleanup_expired_leads_secret');
  perform vault.create_secret(p_url, 'cleanup_expired_leads_url');
  perform vault.create_secret(p_secret, 'cleanup_expired_leads_secret');
  select jobid into existing_job_id from cron.job where jobname = 'cleanup-expired-unsuccessful-leads' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('cleanup-expired-unsuccessful-leads', '0 19 * * *', $cron$
    select net.http_post(url := (select decrypted_secret from vault.decrypted_secrets where name = 'cleanup_expired_leads_url' limit 1), headers := jsonb_build_object('Content-Type', 'application/json', 'x-cleanup-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cleanup_expired_leads_secret' limit 1)), body := '{}'::jsonb);
  $cron$);
end;
$$;
revoke all on function public.configure_cleanup_cron(text, text) from public, anon, authenticated;
grant execute on function public.configure_cleanup_cron(text, text) to service_role;
