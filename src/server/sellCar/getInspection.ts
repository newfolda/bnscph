import { getSupabaseServerClient } from "../supabase/client"

export type SellCarInspection = {
  id: string
  lead_id: string
  scheduled_at: string
  location: string
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getInspection(leadId: string): Promise<SellCarInspection | null> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_inspections")
    .select("id, lead_id, scheduled_at, location, notes, created_at, updated_at")
    .eq("lead_id", leadId)
    .maybeSingle()

  if (error) {
    throw new Error("Unable to load Sell My Car inspection.")
  }

  return data as SellCarInspection | null
}
