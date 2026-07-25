import { getBrands, getModels, getVariants, isCatalogYear } from "../../data/vehicleCatalog"
import type { VehicleFieldMode, VehicleFieldModes } from "../../types/sellCar"
import { restoreStringFields } from "./helpers"
import { initialCarDetails, type CarDetails, type SellCarFormStep } from "./types"

type SafeVehicleDraftDetails = Pick<
  CarDetails,
  "year" | "make" | "model" | "variant" | "mileage" | "transmission" | "fuelType" | "condition"
>

type SellCarDraft = {
  carDetails: SafeVehicleDraftDetails
  vehicleFieldModes: VehicleFieldModes
  currentStep: SellCarFormStep
  usesManualYear: boolean
}

const createSafeVehicleDraft = (
  carDetails: CarDetails,
  vehicleFieldModes: VehicleFieldModes,
  currentStep: SellCarFormStep,
  usesManualYear: boolean,
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
  currentStep,
  usesManualYear,
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
    const hasRestoredYear = /^\d{4}$/.test(carDetails.year) && restoredYear >= 1900 && restoredYear <= currentYear
    const savedUsesManualYear = draft.usesManualYear === true || (hasRestoredYear && !isCatalogYear(restoredYear))
    const savedModes = draft.vehicleFieldModes as Partial<VehicleFieldModes> | undefined
    const isMode = (mode: unknown): mode is VehicleFieldMode => mode === "manual" || mode === "unsure" || mode === "catalog"
    const normalizedMake = carDetails.make.trim().toLowerCase()
    const makeAvailable = getBrands(restoredYear).some((brand) => brand.toLowerCase() === normalizedMake)

    if (!hasRestoredYear) {
      carDetails.year = ""
      carDetails.make = ""
      carDetails.model = ""
      carDetails.variant = ""
    } else if (!savedUsesManualYear && savedModes?.make === "catalog" && carDetails.make && !makeAvailable) {
      carDetails.make = ""
      carDetails.model = ""
      carDetails.variant = ""
    } else if (!savedUsesManualYear && carDetails.make) {
      const normalizedModel = carDetails.model.trim().toLowerCase()
      const modelAvailable = getModels(carDetails.make, restoredYear).some((model) => model.toLowerCase() === normalizedModel)

      if (savedModes?.model === "catalog" && carDetails.model && !modelAvailable) {
        carDetails.model = ""
        carDetails.variant = ""
      } else if (carDetails.model) {
        const normalizedVariant = carDetails.variant.trim().toLowerCase()
        const variantAvailable = getVariants(carDetails.make, carDetails.model, restoredYear).some((variant) => variant.toLowerCase() === normalizedVariant)

        if (savedModes?.variant === "catalog" && carDetails.variant && !variantAvailable) carDetails.variant = ""
      }
    }

    const inferMode = (value: string, options: string[]): VehicleFieldMode => value === "Not Sure" ? "unsure" : value && !options.some((option) => option.toLowerCase() === value.trim().toLowerCase()) ? "manual" : "catalog"
    const vehicleFieldModes: VehicleFieldModes = {
      make: isMode(savedModes?.make) ? savedModes.make : inferMode(carDetails.make, getBrands(restoredYear)),
      model: isMode(savedModes?.model) ? savedModes.model : inferMode(carDetails.model, getModels(carDetails.make, restoredYear)),
      variant: isMode(savedModes?.variant) ? savedModes.variant : inferMode(carDetails.variant, getVariants(carDetails.make, carDetails.model, restoredYear)),
    }

    const requestedStep = draft.currentStep
    const currentStep: SellCarFormStep = requestedStep === 2 || requestedStep === 3 || requestedStep === 4 ? requestedStep : 1
    const safeDraft = createSafeVehicleDraft(carDetails, vehicleFieldModes, currentStep, savedUsesManualYear)

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
  currentStep: SellCarFormStep,
  usesManualYear: boolean,
): void => {
  try {
    const safeDraft = createSafeVehicleDraft(carDetails, vehicleFieldModes, currentStep, usesManualYear)
    window.sessionStorage.setItem(draftKey, JSON.stringify(safeDraft))
  } catch {
    // sessionStorage may be unavailable in restricted browser contexts.
  }
}
