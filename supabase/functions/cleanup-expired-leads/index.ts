import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const bucketName = "sell-car-photos"
const eligibleStatuses = ["rejected", "archived"]
const batchSize = 100

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })

Deno.serve(async (request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  const cronSecret = Deno.env.get("CLEANUP_CRON_SECRET")
  const suppliedSecret = request.headers.get("x-cleanup-secret")
  const authorization = request.headers.get("authorization")
  const serviceRoleRequest = Boolean(serviceRoleKey && authorization === `Bearer ${serviceRoleKey}`)

  if (!supabaseUrl || !serviceRoleKey || (!serviceRoleRequest && (!cronSecret || suppliedSecret !== cronSecret))) return json({ success: false }, 401)

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const body = request.method === "POST" ? await request.json().catch(() => ({})) : {}
  const requestedLeadId = typeof body?.leadId === "string" ? body.leadId : null
  const dryRun = body?.dryRun === true
  const setup = body?.setup === true
  const verify = body?.verify === true
  if (requestedLeadId && !serviceRoleRequest) return json({ success: false }, 403)
  if (setup) {
    if (!serviceRoleRequest || typeof body?.url !== "string" || typeof body?.secret !== "string") return json({ success: false }, 403)
    const { error } = await supabase.rpc("configure_cleanup_cron", { p_url: body.url, p_secret: body.secret })
    return error ? json({ success: false, code: "cleanup_configuration_failed" }, 500) : json({ success: true, configured: true })
  }
  if (verify) {
    if (!serviceRoleRequest) return json({ success: false }, 403)
    const { data, error } = await supabase.rpc("verify_cleanup_activation")
    return error ? json({ success: false, code: "cleanup_verification_failed" }, 500) : json({ success: true, verification: data })
  }

  let query = supabase
    .from("sell_car_leads")
    .select("id, status, retention_status")
    .in("status", eligibleStatuses)
    .lte("retention_delete_after", new Date().toISOString())
    .eq("legal_hold", false)
    .not("retention_delete_after", "is", null)
    .limit(requestedLeadId ? 1 : batchSize)
  if (requestedLeadId) query = query.eq("id", requestedLeadId)
  const { data: candidates, error: candidateError } = await query
  if (candidateError) return json({ success: false, code: "candidate_query_failed" }, 500)

  if (dryRun) return json({ success: true, dryRun: true, examined: candidates?.length ?? 0, eligible: candidates?.length ?? 0 })

  const runId = crypto.randomUUID()
  let deleted = 0; let skipped = 0; let failed = 0; let storageObjectsDeleted = 0
  for (const candidate of candidates ?? []) {
    const { data: lock } = await supabase.from("sell_car_leads")
      .update({ retention_status: "cleanup_in_progress" })
      .eq("id", candidate.id).in("status", eligibleStatuses).eq("legal_hold", false).eq("retention_status", "scheduled")
      .select("id").maybeSingle()
    if (!lock) { skipped += 1; continue }

    const { data: purchase } = await supabase.from("purchased_cars").select("lead_id").eq("lead_id", candidate.id).maybeSingle()
    if (purchase) { await supabase.from("sell_car_leads").update({ retention_status: "retained", retention_delete_after: null }).eq("id", candidate.id); skipped += 1; continue }

    const { data: photos, error: photoError } = await supabase.from("sell_car_lead_photos").select("storage_path").eq("lead_id", candidate.id)
    if (photoError) { await supabase.from("sell_car_leads").update({ retention_status: "scheduled" }).eq("id", candidate.id); failed += 1; continue }
    const paths = (photos ?? []).map((photo) => photo.storage_path).filter((path): path is string => typeof path === "string")
    if (paths.length) {
      const { error: storageError } = await supabase.storage.from(bucketName).remove(paths)
      if (storageError) { await supabase.from("sell_car_leads").update({ retention_status: "scheduled" }).eq("id", candidate.id); failed += 1; continue }
      storageObjectsDeleted += paths.length
    }
    const { error: deleteError } = await supabase.from("sell_car_leads").delete().eq("id", candidate.id).in("status", eligibleStatuses).eq("legal_hold", false)
    if (deleteError) { await supabase.from("sell_car_leads").update({ retention_status: "scheduled" }).eq("id", candidate.id); failed += 1; continue }
    deleted += 1
  }
  console.info(JSON.stringify({ runId, examined: candidates?.length ?? 0, deleted, skipped, failed, storageObjectsDeleted }))
  return json({ success: true, runId, examined: candidates?.length ?? 0, deleted, skipped, failed, storageObjectsDeleted })
})
