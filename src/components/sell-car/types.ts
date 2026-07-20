import type { VehicleFieldModes } from "../../types/sellCar"

export type CarDetails = {
  year: string
  make: string
  model: string
  variant: string
  mileage: string
  transmission: string
  fuelType: string
  condition: string
}

export type CarDetailsField = keyof CarDetails

export type ContactDetails = {
  fullName: string
  mobileNumber: string
  city: string
}

export type ContactDetailsField = keyof ContactDetails

export type VehiclePhoto = { file: File; id: string; previewUrl: string }

export type SubmitStatus = "idle" | "submitting" | "success" | "error"

export const initialCarDetails: CarDetails = { year: "", make: "", model: "", variant: "", mileage: "", transmission: "", fuelType: "", condition: "" }

export const initialContactDetails: ContactDetails = { fullName: "", mobileNumber: "", city: "" }

export const initialVehicleFieldModes: VehicleFieldModes = { make: "catalog", model: "catalog", variant: "catalog" }

export const sellCarDraftKey = "buy-and-sell-cars-sell-my-car-draft"

export const formFieldClass = "mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)]/65 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
