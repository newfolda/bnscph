import { getSupabaseServerClient } from "../supabase/client"

export type SellCarLeadNote = {
  id: string
  lead_id: string
  note: string
  created_at: string
  author: string | null
}

export async function getLeadNotes(leadId: string): Promise<SellCarLeadNote[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_lead_notes")
    .select("id, lead_id, note, created_at, author")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Unable to load Sell My Car lead notes.")
  }

  return (data ?? []) as SellCarLeadNote[]
}
