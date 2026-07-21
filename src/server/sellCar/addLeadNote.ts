import { getSupabaseServerClient } from "../supabase/client"
import type { SellCarLeadNote } from "./getLeadNotes"

type AddLeadNoteInput = {
  leadId: string
  note: string
  author?: string | null
}

export async function addLeadNote({ leadId, note, author = null }: AddLeadNoteInput): Promise<SellCarLeadNote> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_lead_notes")
    .insert({
      lead_id: leadId,
      note,
      author,
    })
    .select("id, lead_id, note, created_at, author")
    .single()

  if (error) {
    throw new Error("Unable to add Sell My Car lead note.")
  }

  return data as SellCarLeadNote
}
