import type { VehiclePhoto } from "./types"

export const revokePhotoPreviews = (photos: VehiclePhoto[]) => {
  photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
}

export const validateVehiclePhoto = (file: File): string | null => {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Only JPG, PNG, and WebP images are allowed."
  if (file.size > 5 * 1024 * 1024) return "Each photo must be 5 MB or smaller."

  return null
}

export const createVehiclePhoto = (file: File, index: number): VehiclePhoto => {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `photo-${Date.now()}-${index}`

  return { id, file, previewUrl: URL.createObjectURL(file) }
}
