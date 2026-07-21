import { getSupabaseServerClient } from "../supabase/client"
import type { SellCarLeadStatus } from "./getRecentLeads"

export async function updateLeadStatus(id: string, status: SellCarLeadStatus): Promise<void> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle()

  if (error || !data) {
    throw error ?? new Error("Sell My Car lead was not found.")
  }
}
