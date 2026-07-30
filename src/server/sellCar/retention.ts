import "server-only"
import { getSupabaseServerClient } from "../supabase/client"

export async function updateLeadLegalHold(id: string, legalHold: boolean): Promise<void> {
  const { data, error } = await getSupabaseServerClient().from("sell_car_leads")
    .update({ legal_hold: legalHold, updated_at: new Date().toISOString() })
    .eq("id", id).select("id").maybeSingle()
  if (error || !data) throw error ?? new Error("Lead not found.")
}

export async function deleteEligibleLead(id: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) throw new Error("Retention cleanup is unavailable.")
  const response = await fetch(`${url.replace(/\/$/, "")}/functions/v1/cleanup-expired-leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceRoleKey}` },
    body: JSON.stringify({ leadId: id }), cache: "no-store",
  })
  if (!response.ok) throw new Error("Retention cleanup failed.")
  const result: unknown = await response.json()
  return Boolean(result && typeof result === "object" && "deleted" in result && typeof result.deleted === "number" && result.deleted === 1)
}
