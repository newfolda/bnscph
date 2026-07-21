import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { deleteSellCarLead, saveSellCarLead } from "@/src/server/sellCar/repository"
import { uploadLeadPhotos } from "@/src/server/sellCar/uploadLeadPhotos"
import { sendSellCarNotifications } from "@/src/server/email/sendSellCarNotifications"
import type { SellCarSubmissionPayload, VehicleFieldMode } from "@/src/types/sellCar"

const maximumRequestBytes = 8 * 10 * 1024 * 1024 + 32 * 1024
const vehicleFieldModes: VehicleFieldMode[] = ["catalog", "manual", "unsure"]

const jsonResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const hasOnlyKeys = (value: Record<string, unknown>, allowedKeys: string[]) =>
  Object.keys(value).every((key) => allowedKeys.includes(key))

const isNonEmptyString = (value: unknown, maxLength = 120): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength

const isValidMobileNumber = (value: string) =>
  /^(?:09\d{9}|\+639\d{9})$/.test(value.replace(/[\s-]/g, ""))

const isValidSubmission = (value: unknown): value is SellCarSubmissionPayload => {
  if (!isRecord(value)) return false

  const requiredTopLevelKeys = [
    "vehicle",
    "vehicleFieldModes",
    "contact",
    "privacyConsent",
    "photoCount",
    "submittedAt",
    "source",
  ]

  if (
    !hasOnlyKeys(value, requiredTopLevelKeys) ||
    !requiredTopLevelKeys.every((key) => key in value) ||
    !isRecord(value.vehicle) ||
    !isRecord(value.vehicleFieldModes) ||
    !isRecord(value.contact)
  ) {
    return false
  }

  const vehicle = value.vehicle
  const modes = value.vehicleFieldModes
  const contact = value.contact
  const currentYear = new Date().getFullYear()
  const vehicleKeys = ["year", "make", "model", "variant", "mileage", "transmission", "fuelType", "condition"]
  const modeKeys = ["make", "model", "variant"]
  const contactKeys = ["fullName", "mobileNumber", "city"]

  if (
    !hasOnlyKeys(vehicle, vehicleKeys) ||
    !hasOnlyKeys(modes, modeKeys) ||
    !hasOnlyKeys(contact, contactKeys) ||
    !["year", "make", "model", "mileage", "transmission", "fuelType", "condition"].every((key) => key in vehicle) ||
    !modeKeys.every((key) => key in modes) ||
    !contactKeys.every((key) => key in contact)
  ) {
    return false
  }

  const submittedAt = typeof value.submittedAt === "string" ? Date.parse(value.submittedAt) : Number.NaN

  return (
    typeof vehicle.year === "number" &&
    Number.isInteger(vehicle.year) &&
    vehicle.year >= 1900 &&
    vehicle.year <= currentYear &&
    typeof vehicle.mileage === "number" &&
    Number.isSafeInteger(vehicle.mileage) &&
    vehicle.mileage >= 0 &&
    isNonEmptyString(vehicle.make) &&
    isNonEmptyString(vehicle.model) &&
    (vehicle.variant === undefined || (typeof vehicle.variant === "string" && vehicle.variant.trim().length <= 120)) &&
    isNonEmptyString(vehicle.transmission) &&
    isNonEmptyString(vehicle.fuelType) &&
    isNonEmptyString(vehicle.condition) &&
    modeKeys.every((key) => typeof modes[key] === "string" && vehicleFieldModes.includes(modes[key] as VehicleFieldMode)) &&
    isNonEmptyString(contact.fullName) &&
    contact.fullName.trim().length >= 2 &&
    isNonEmptyString(contact.mobileNumber, 30) &&
    isValidMobileNumber(contact.mobileNumber) &&
    isNonEmptyString(contact.city) &&
    value.privacyConsent === true &&
    typeof value.photoCount === "number" &&
    Number.isInteger(value.photoCount) &&
    value.photoCount >= 0 &&
    value.photoCount <= 8 &&
    Number.isFinite(submittedAt) &&
    value.source === "homepage-sell-car-modal"
  )
}

const createReferenceId = () => {
  const date = new Date()
  const datePart = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`
  const randomPart = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()

  return `BSC-${datePart}-${randomPart}`
}

const normalizeSubmission = (payload: SellCarSubmissionPayload): SellCarSubmissionPayload => ({
  ...payload,
  vehicle: {
    ...payload.vehicle,
    make: payload.vehicle.make.trim(),
    model: payload.vehicle.model.trim(),
    ...(payload.vehicle.variant ? { variant: payload.vehicle.variant.trim() } : {}),
    transmission: payload.vehicle.transmission.trim(),
    fuelType: payload.vehicle.fuelType.trim(),
    condition: payload.vehicle.condition.trim(),
  },
  contact: {
    fullName: payload.contact.fullName.trim(),
    mobileNumber: payload.contact.mobileNumber.replace(/[\s-]/g, ""),
    city: payload.contact.city.trim(),
  },
})

const isUploadedFile = (value: FormDataEntryValue): value is File =>
  typeof value !== "string" && value instanceof File

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""
  const contentLength = Number(request.headers.get("content-length"))

  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return jsonResponse("Invalid submission.", 415)
  }

  if (Number.isFinite(contentLength) && contentLength > maximumRequestBytes) {
    return jsonResponse("Submission is too large.", 413)
  }

  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return jsonResponse("Invalid submission.", 400)
  }

  const formDataKeys = Array.from(formData.keys())

  if (!formDataKeys.every((key) => key === "payload" || key === "photos") || formData.getAll("payload").length !== 1) {
    return jsonResponse("Invalid submission.", 400)
  }

  const rawPayload = formData.get("payload")

  if (typeof rawPayload !== "string" || rawPayload.length > 16 * 1024) {
    return jsonResponse("Invalid submission.", 400)
  }

  let payload: unknown

  try {
    payload = JSON.parse(rawPayload)
  } catch {
    return jsonResponse("Invalid submission.", 400)
  }

  const photoEntries = formData.getAll("photos")

  if (!photoEntries.every(isUploadedFile)) {
    return jsonResponse("Invalid submission.", 400)
  }

  const photos = photoEntries

  if (!isValidSubmission(payload) || photos.length !== payload.photoCount) {
    return jsonResponse("Invalid submission.", 400)
  }

  const normalizedPayload = normalizeSubmission(payload)
  const referenceId = createReferenceId()
  const submittedAt = new Date().toISOString()
  let leadId: string | null = null

  try {
    leadId = await saveSellCarLead({
      referenceId,
      submittedAt,
      payload: normalizedPayload,
    })
    await uploadLeadPhotos(leadId, photos)
  } catch {
    if (leadId) {
      try {
        await deleteSellCarLead(leadId)
      } catch {
        // The public response remains generic; this cleanup failure is retried operationally.
      }
    }

    return jsonResponse("Unable to submit your details right now.", 500)
  }

  try {
    await sendSellCarNotifications({
      leadId,
      referenceId,
      submittedAt,
      payload: normalizedPayload,
    })
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("Sell My Car notification failed", { referenceId, leadId })
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info("Sell My Car lead accepted", {
      referenceId,
      vehicleYear: normalizedPayload.vehicle.year,
      photoCount: normalizedPayload.photoCount,
    })
  }

  return NextResponse.json(
    {
      success: true,
      referenceId,
      submittedAt,
    },
    { status: 202 },
  )
}
