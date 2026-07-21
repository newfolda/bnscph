import { getBrands, getModels, getVariants } from "../../data/vehicleCatalog"
import type { VehicleFieldMode, VehicleFieldModes } from "../../types/sellCar"
import { restoreStringFields } from "./helpers"
import { initialCarDetails, type CarDetails } from "./types"

type SafeVehicleDraftDetails = Pick<
  CarDetails,
  "year" | "make" | "model" | "variant" | "mileage" | "transmission" | "fuelType" | "condition"
>

type SellCarDraft = {
  carDetails: SafeVehicleDraftDetails
  vehicleFieldModes: VehicleFieldModes
}

const createSafeVehicleDraft = (
  carDetails: CarDetails,
  vehicleFieldModes: VehicleFieldModes,
): SellCarDraft => ({
  // This allowlist is the browser-storage privacy boundary for Sell My Car drafts.
  carDetails: {
    year: carDetails.year,
    make: carDetails.make,
    model: carDetails.model,
    variant: carDetails.variant,
    mileage: carDetails.mileage,
    transmission: carDetails.transmission,
    fuelType: carDetails.fuelType,
    condition: carDetails.condition,
  },
  vehicleFieldModes: {
    make: vehicleFieldModes.make,
    model: vehicleFieldModes.model,
    variant: vehicleFieldModes.variant,
  },
})

export const clearSellCarDraft = (draftKey: string): void => {
  try {
    window.sessionStorage.removeItem(draftKey)
  } catch {
    // sessionStorage may be unavailable in restricted browser contexts.
  }
}

export const restoreSellCarDraft = (draftKey: string, currentYear: number): SellCarDraft | null => {
  try {
    const savedDraft = window.sessionStorage.getItem(draftKey)

    if (!savedDraft) return null

    const parsedDraft: unknown = JSON.parse(savedDraft)

    if (!parsedDraft || typeof parsedDraft !== "object") return null

    const draft = parsedDraft as Record<string, unknown>
    const carDetails = restoreStringFields(initialCarDetails, draft.carDetails)
    const restoredYear = Number(carDetails.year)
    const hasRestoredYear = /^\d{4}$/.test(carDetails.year) && restoredYear >= 1990 && restoredYear <= currentYear
    const normalizedMake = carDetails.make.trim().toLowerCase()
    const knownMake = getBrands().some((brand) => brand.toLowerCase() === normalizedMake)
    const makeAvailable = getBrands(restoredYear).some((brand) => brand.toLowerCase() === normalizedMake)

    if (!hasRestoredYear || (knownMake && !makeAvailable)) {
      carDetails.make = ""
      carDetails.model = ""
      carDetails.variant = ""
    } else if (carDetails.make) {
      const normalizedModel = carDetails.model.trim().toLowerCase()
      const knownModel = getModels(carDetails.make).some((model) => model.toLowerCase() === normalizedModel)
      const modelAvailable = getModels(carDetails.make, restoredYear).some((model) => model.toLowerCase() === normalizedModel)

      if (knownModel && !modelAvailable) {
        carDetails.model = ""
        carDetails.variant = ""
      } else if (carDetails.model) {
        const normalizedVariant = carDetails.variant.trim().toLowerCase()
        const knownVariant = getVariants(carDetails.make, carDetails.model).some((variant) => variant.toLowerCase() === normalizedVariant)
        const variantAvailable = getVariants(carDetails.make, carDetails.model, restoredYear).some((variant) => variant.toLowerCase() === normalizedVariant)

        if (knownVariant && !variantAvailable) carDetails.variant = ""
      }
    }

    const savedModes = draft.vehicleFieldModes as Partial<VehicleFieldModes> | undefined
    const inferMode = (value: string, options: string[]): VehicleFieldMode => value === "Not Sure" ? "unsure" : value && !options.some((option) => option.toLowerCase() === value.trim().toLowerCase()) ? "manual" : "catalog"
    const vehicleFieldModes: VehicleFieldModes = {
      make: savedModes?.make === "manual" || savedModes?.make === "unsure" || savedModes?.make === "catalog" ? savedModes.make : inferMode(carDetails.make, getBrands(restoredYear)),
      model: savedModes?.model === "manual" || savedModes?.model === "unsure" || savedModes?.model === "catalog" ? savedModes.model : inferMode(carDetails.model, getModels(carDetails.make, restoredYear)),
      variant: savedModes?.variant === "manual" || savedModes?.variant === "unsure" || savedModes?.variant === "catalog" ? savedModes.variant : inferMode(carDetails.variant, getVariants(carDetails.make, carDetails.model, restoredYear)),
    }

    const safeDraft = createSafeVehicleDraft(carDetails, vehicleFieldModes)

    // Rewrite legacy drafts without their former sensitive fields after safely restoring vehicle data.
    window.sessionStorage.setItem(draftKey, JSON.stringify(safeDraft))

    return safeDraft
  } catch {
    clearSellCarDraft(draftKey)
    return null
  }
}

export const saveSellCarDraft = (
  draftKey: string,
  carDetails: CarDetails,
  vehicleFieldModes: VehicleFieldModes,
): void => {
  try {
    const safeDraft = createSafeVehicleDraft(carDetails, vehicleFieldModes)
    window.sessionStorage.setItem(draftKey, JSON.stringify(safeDraft))
  } catch {
    // sessionStorage may be unavailable in restricted browser contexts.
  }
}
