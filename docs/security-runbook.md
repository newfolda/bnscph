# Security runbook

This internal runbook supplements—not replaces—legal, regulatory, or incident-response advice.

## Account and platform checklist

- **Namecheap:** enable 2FA, domain lock, and auto-renew; review recovery information, DNSSEC, API keys, and delegated access.
- **Vercel:** enable 2FA; review project members, preview protection, production/preview environment separation, old variables, deployments, and logs for personal data.
- **Supabase:** enable 2FA; review organization members, database/service-role key rotation, RLS and storage policies, backups, Auth configuration, and available network restrictions.
- **GitHub:** enable 2FA; verify repository visibility, secret scanning, branch protection, collaborators, deployment keys, and git history for secrets.
- **Google and Meta:** enable 2FA; review app passwords, active sessions, recovery methods, page roles, integrations, and unknown sessions.

## Retention workflow

The automated retention job applies only to the application’s closed statuses: `rejected` and `archived`. It schedules eligible records for deletion 30 days after `closed_at`; `purchased`, active, inspection-scheduled, completed/purchased-car, and legal-hold records are excluded. The cron job runs at `0 19 * * *` UTC, approximately 3:00 a.m. Philippine time the following day.

Before enabling the job, deploy `supabase/retention_cleanup.sql`, create the documented Vault secrets, and deploy the `cleanup-expired-leads` Edge Function with `CLEANUP_CRON_SECRET`. Preview candidates with the service-role-only `preview_expired_sell_car_leads()` function. To pause the job, unschedule `cleanup-expired-unsuccessful-leads` in `cron.job`; review execution history through Supabase Cron/Edge Function logs. The function removes exact private storage objects first, then cascades related photo rows, notes, inspections, and the lead record. A storage failure retains the database record for retry. Monthly, review non-personal run counts and confirm that purchased and legal-hold records were excluded.

## Incident response

1. **Contain:** disable the affected integration, revoke sessions, restrict access, or make the affected bucket private as appropriate. For a lost phone or unauthorized Messenger access, revoke sessions and change credentials immediately.
2. **Rotate:** rotate exposed API keys, Supabase service-role keys, database passwords, email credentials, and platform recovery codes as relevant.
3. **Preserve and assess:** retain access logs and deployment information, identify the affected data categories and people, and document the timeline without copying sensitive records into unsecured channels.
4. **Escalate:** obtain appropriate legal/privacy advice, including whether notification to affected people, the National Privacy Commission, or other authorities is required.
5. **Correct:** repair the root cause, review policies and access roles, test the fix, and document actions taken. Specific scenarios include public tables/buckets, leaked photos, malicious uploads, analytics data leakage, account compromise, and exposed keys.
