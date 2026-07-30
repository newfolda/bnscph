import { getSupabaseServerClient } from "../supabase/client"
import type { SellCarLeadStatus } from "./getRecentLeads"

export type SellCarLeadDetails = {
  id: string
  reference_id: string
  submitted_at: string
  created_at: string
  updated_at: string
  status: SellCarLeadStatus
  full_name: string
  mobile_number: string
  city: string
  vehicle_year: number
  make: string
  model: string
  variant: string | null
  mileage: number
  transmission: string
  fuel_type: string
  condition: string
  vehicle_field_modes: unknown
  photo_count: number
  privacy_consent: boolean
  source: string
  closed_at: string | null
  retention_delete_after: string | null
  legal_hold: boolean
  retention_status: string | null
}

export async function getLeadById(id: string): Promise<SellCarLeadDetails | null> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_leads")
    .select(
      "id, reference_id, submitted_at, created_at, updated_at, status, full_name, mobile_number, city, vehicle_year, make, model, variant, mileage, transmission, fuel_type, condition, vehicle_field_modes, photo_count, privacy_consent, source, closed_at, retention_delete_after, legal_hold, retention_status"
    )
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error("Unable to load Sell My Car lead.")
  }

  return data as SellCarLeadDetails | null
}
