import { getBrands, getModels, getVariants } from "../../data/vehicleCatalog"
import type { VehicleFieldMode, VehicleFieldModes } from "../../types/sellCar"
import { restoreStringFields } from "./helpers"
import { initialCarDetails, initialContactDetails, type CarDetails, type ContactDetails } from "./types"

type SellCarDraft = {
  carDetails: CarDetails
  contactDetails: ContactDetails
  vehicleFieldModes: VehicleFieldModes
  privacyConsent: boolean
}

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

    return { carDetails, contactDetails: restoreStringFields(initialContactDetails, draft.contactDetails), vehicleFieldModes, privacyConsent: draft.privacyConsent === true }
  } catch {
    clearSellCarDraft(draftKey)
    return null
  }
}

export const saveSellCarDraft = (draftKey: string, carDetails: CarDetails, contactDetails: ContactDetails, privacyConsent: boolean, vehicleFieldModes: VehicleFieldModes): void => {
  try {
    window.sessionStorage.setItem(draftKey, JSON.stringify({ carDetails, contactDetails, privacyConsent, vehicleFieldModes }))
  } catch {
    // sessionStorage may be unavailable in restricted browser contexts.
  }
}
