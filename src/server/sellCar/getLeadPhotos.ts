import { getSupabaseServerClient } from "../supabase/client"

const bucketName = "sell-car-photos"
const signedUrlExpiresIn = 60 * 60

export type SellCarLeadPhoto = {
  id: string
  file_name: string
  content_type: string
  file_size: number
  display_order: number
  created_at: string
  signedUrl: string
}

type StoredLeadPhoto = Omit<SellCarLeadPhoto, "signedUrl">

export async function getLeadPhotos(leadId: string): Promise<SellCarLeadPhoto[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_lead_photos")
    .select("id, file_name, content_type, file_size, display_order, created_at, storage_path")
    .eq("lead_id", leadId)
    .order("display_order", { ascending: true })

  if (error) {
    throw new Error("Unable to load Sell My Car lead photos.")
  }

  const photos = (data ?? []) as Array<StoredLeadPhoto & { storage_path: string }>
  const signedPhotos = await Promise.all(
    photos.map(async ({ storage_path, ...photo }) => {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(storage_path, signedUrlExpiresIn)

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw signedUrlError ?? new Error("Unable to sign Sell My Car lead photo.")
      }

      return { ...photo, signedUrl: signedUrlData.signedUrl }
    }),
  )

  return signedPhotos
}
