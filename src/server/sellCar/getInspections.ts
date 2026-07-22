import { getSupabaseServerClient } from "../supabase/client"

export type AdminInspection = {
  id: string
  leadId: string
  scheduledAt: string
  location: string
  lead: {
    referenceId: string
    fullName: string
    city: string
    vehicle: string
    status: string
  }
}

export async function getInspections(): Promise<{ inspections: AdminInspection[]; currentTime: number }> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_inspections")
    .select("id, lead_id, scheduled_at, location, sell_car_leads!inner(reference_id, full_name, city, vehicle_year, make, model, status)")
    .order("scheduled_at", { ascending: true })

  if (error) throw new Error("Unable to load Sell My Car inspections.")

  const inspections = (data ?? []).map((inspection) => {
    const lead = inspection.sell_car_leads as unknown as {
      reference_id: string; full_name: string; city: string; vehicle_year: number; make: string; model: string; status: string
    }
    return {
      id: inspection.id as string,
      leadId: inspection.lead_id as string,
      scheduledAt: inspection.scheduled_at as string,
      location: inspection.location as string,
      lead: {
        referenceId: lead.reference_id,
        fullName: lead.full_name,
        city: lead.city,
        vehicle: `${lead.vehicle_year} ${lead.make} ${lead.model}`,
        status: lead.status,
      },
    }
  })

  return { inspections, currentTime: Date.now() }
}
