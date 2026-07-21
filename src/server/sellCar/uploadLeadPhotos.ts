import { randomUUID } from "node:crypto"
import { getSupabaseServerClient } from "../supabase/client"

const bucketName = "sell-car-photos"
const maximumPhotoCount = 8
const maximumFileSize = 10 * 1024 * 1024

const allowedPhotoTypes = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
} as const

type AllowedPhotoType = keyof typeof allowedPhotoTypes

const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  return extension ?? ""
}

const isAllowedPhotoType = (contentType: string): contentType is AllowedPhotoType =>
  contentType in allowedPhotoTypes

const validatePhoto = (file: File) => {
  if (!isAllowedPhotoType(file.type)) {
    throw new Error("Unsupported vehicle photo type.")
  }

  const extension = getFileExtension(file.name)

  if (!allowedPhotoTypes[file.type].includes(extension as never)) {
    throw new Error("Unsupported vehicle photo extension.")
  }

  if (file.size <= 0 || file.size > maximumFileSize) {
    throw new Error("Vehicle photo exceeds the allowed size.")
  }

  return extension
}

export async function uploadLeadPhotos(leadId: string, files: File[]): Promise<void> {
  if (files.length > maximumPhotoCount) {
    throw new Error("Too many vehicle photos.")
  }

  const validatedPhotos = files.map((file) => ({ file, extension: validatePhoto(file) }))
  const supabase = getSupabaseServerClient()
  const uploadedPaths: string[] = []

  try {
    const photoMetadata = []

    for (const [displayOrder, photo] of validatedPhotos.entries()) {
      const storagePath = `${leadId}/${randomUUID()}.${photo.extension}`
      const fileData = Buffer.from(await photo.file.arrayBuffer())
      const { error } = await supabase.storage.from(bucketName).upload(storagePath, fileData, {
        contentType: photo.file.type,
        upsert: false,
      })

      if (error) {
        throw error
      }

      uploadedPaths.push(storagePath)
      photoMetadata.push({
        lead_id: leadId,
        storage_path: storagePath,
        file_name: photo.file.name,
        content_type: photo.file.type,
        file_size: photo.file.size,
        display_order: displayOrder,
      })
    }

    if (photoMetadata.length === 0) return

    const { error } = await supabase.from("sell_car_lead_photos").insert(photoMetadata)

    if (error) {
      throw error
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(bucketName).remove(uploadedPaths)
    }

    throw error
  }
}
