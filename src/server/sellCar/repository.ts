import type { SaveSellCarLeadInput } from "./types"
import { getSupabaseServerClient } from "../supabase/client"

export async function saveSellCarLead({
  referenceId,
  submittedAt,
  payload,
}: SaveSellCarLeadInput): Promise<string> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_leads")
    .insert({
      reference_id: referenceId,
      submitted_at: submittedAt,
      full_name: payload.contact.fullName,
      mobile_number: payload.contact.mobileNumber,
      city: payload.contact.city,
      vehicle_year: payload.vehicle.year,
      make: payload.vehicle.make,
      model: payload.vehicle.model,
      variant: payload.vehicle.variant || null,
      mileage: payload.vehicle.mileage,
      transmission: payload.vehicle.transmission,
      fuel_type: payload.vehicle.fuelType,
      condition: payload.vehicle.condition,
      vehicle_field_modes: payload.vehicleFieldModes,
      photo_count: payload.photoCount,
      privacy_consent: payload.privacyConsent,
      source: payload.source,
      raw_payload: payload,
    })
    .select("id")
    .single()

  if (error || !data) {
    throw error ?? new Error("Unable to save Sell My Car lead.")
  }

  return data.id as string
}

export async function deleteSellCarLead(id: string): Promise<void> {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("sell_car_leads").delete().eq("id", id)

  if (error) {
    throw error
  }
}
