import type { SellCarSubmissionPayload, VehicleFieldModes } from "../../types/sellCar"

type FormValues = {
  year: string; make: string; model: string; variant: string; mileage: string; transmission: string; fuelType: string; condition: string
}

type ContactValues = { fullName: string; mobileNumber: string; city: string }

export function buildSellCarPayload(carDetails: FormValues, contactDetails: ContactValues, vehicleFieldModes: VehicleFieldModes, photoCount: number): SellCarSubmissionPayload {
  const variant = carDetails.variant.trim()
  return {
    vehicle: { year: Number(carDetails.year), make: carDetails.make.trim(), model: carDetails.model.trim(), ...(variant ? { variant } : {}), mileage: Number(carDetails.mileage), transmission: carDetails.transmission.trim(), fuelType: carDetails.fuelType.trim(), condition: carDetails.condition.trim() },
    vehicleFieldModes,
    contact: { fullName: contactDetails.fullName.trim(), mobileNumber: contactDetails.mobileNumber.replace(/[\s-]/g, ""), city: contactDetails.city.trim() },
    privacyConsent: true,
    photoCount,
    submittedAt: new Date().toISOString(),
    source: "homepage-sell-car-modal",
  }
}
