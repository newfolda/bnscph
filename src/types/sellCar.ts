export type VehicleFieldMode = "catalog" | "manual" | "unsure"

export type VehicleFieldModes = {
  make: VehicleFieldMode
  model: VehicleFieldMode
  variant: VehicleFieldMode
}

export type SellCarVehicleDetails = {
  year: number
  make: string
  model: string
  variant?: string
  mileage: number
  transmission: string
  fuelType: string
  condition: string
}

export type SellCarContactDetails = { fullName: string; mobileNumber: string; city: string }

export type SellCarSubmissionPayload = {
  vehicle: SellCarVehicleDetails
  vehicleFieldModes: VehicleFieldModes
  contact: SellCarContactDetails
  privacyConsent: true
  photoCount: number
  submittedAt: string
  source: "homepage-sell-car-modal"
}
