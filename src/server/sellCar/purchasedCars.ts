import { getSupabaseServerClient } from "../supabase/client"

export const inventoryStatuses = ["Purchased", "Repairing", "Ready for Sale", "Sold"] as const
export type InventoryStatus = (typeof inventoryStatuses)[number]
export type PurchasedCar = { leadId: string; referenceId: string; customer: string; vehicle: string; purchasePrice: number | null; purchaseDate: string | null; assignedStaff: string | null; inventoryStatus: InventoryStatus; notes: string | null }

export async function getPurchasedCars(): Promise<PurchasedCar[]> {
  const supabase = getSupabaseServerClient()
  const { data: leads, error } = await supabase.from("sell_car_leads").select("id, reference_id, full_name, vehicle_year, make, model").eq("status", "purchased").order("created_at", { ascending: false })
  if (error) throw error
  const leadIds = (leads ?? []).map((lead) => lead.id as string)
  const { data: records, error: recordsError } = leadIds.length ? await supabase.from("purchased_cars").select("lead_id, purchase_price, purchase_date, assigned_staff, inventory_status, notes").in("lead_id", leadIds) : { data: [], error: null }
  if (recordsError) throw recordsError
  const recordsByLead = new Map((records ?? []).map((record) => [record.lead_id as string, record]))
  return (leads ?? []).map((lead) => {
    const record = recordsByLead.get(lead.id as string)
    return { leadId: lead.id as string, referenceId: lead.reference_id as string, customer: lead.full_name as string, vehicle: `${lead.vehicle_year} ${lead.make} ${lead.model}`, purchasePrice: record?.purchase_price === null || record?.purchase_price === undefined ? null : Number(record.purchase_price), purchaseDate: record?.purchase_date as string | null ?? null, assignedStaff: record?.assigned_staff as string | null ?? null, inventoryStatus: (record?.inventory_status as InventoryStatus | undefined) ?? "Purchased", notes: record?.notes as string | null ?? null }
  })
}

export async function getPurchasedCar(leadId: string) { return (await getPurchasedCars()).find((car) => car.leadId === leadId) ?? null }
export async function savePurchasedCar(leadId: string, values: Omit<PurchasedCar, "leadId" | "referenceId" | "customer" | "vehicle">) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("purchased_cars").upsert({ lead_id: leadId, purchase_price: values.purchasePrice, purchase_date: values.purchaseDate, assigned_staff: values.assignedStaff, inventory_status: values.inventoryStatus, notes: values.notes }, { onConflict: "lead_id" })
  if (error) throw error
}
