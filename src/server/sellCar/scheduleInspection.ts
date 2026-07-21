import { getSupabaseServerClient } from "../supabase/client"
import type { SellCarInspection } from "./getInspection"

type ScheduleInspectionInput = {
  leadId: string
  scheduledAt: string
  location: string
  notes: string | null
}

export async function scheduleInspection({
  leadId,
  scheduledAt,
  location,
  notes,
}: ScheduleInspectionInput): Promise<SellCarInspection> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_inspections")
    .upsert(
      {
        lead_id: leadId,
        scheduled_at: scheduledAt,
        location,
        notes,
      },
      { onConflict: "lead_id" },
    )
    .select("id, lead_id, scheduled_at, location, notes, created_at, updated_at")
    .single()

  if (error || !data) {
    throw error ?? new Error("Unable to schedule Sell My Car inspection.")
  }

  const { error: statusError } = await supabase
    .from("sell_car_leads")
    .update({ status: "inspection_scheduled" })
    .eq("id", leadId)

  if (statusError) {
    throw statusError
  }

  return data as SellCarInspection
}
