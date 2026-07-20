import type { CarDetailsField, ContactDetailsField } from "./types"

export function restoreStringFields<T extends Record<string, string>>(initialValues: T, savedValues: unknown): T {
  if (!savedValues || typeof savedValues !== "object") return initialValues

  const savedRecord = savedValues as Record<string, unknown>

  return Object.fromEntries(
    Object.keys(initialValues).map((key) => [key, typeof savedRecord[key] === "string" ? savedRecord[key] : initialValues[key]]),
  ) as T
}

export function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 1024 * 1024 ? 1 : 2)} MB`
}

export function validateCarDetailsField(field: CarDetailsField, value: string, currentYear: number) {
  if (field === "variant") return ""
  if (!value.trim()) return "This field is required."

  if (field === "year") {
    const year = Number(value)
    if (!/^\d{4}$/.test(value) || year < 1900 || year > currentYear) {
      return `Enter a valid year between 1900 and ${currentYear}.`
    }
  }

  if (field === "mileage" && (Number(value) < 0 || !/^\d+$/.test(value))) {
    return "Enter a valid mileage in kilometers."
  }

  return ""
}

export function validateContactDetailsField(field: ContactDetailsField, value: string) {
  if (!value.trim()) return "This field is required."
  if (field === "fullName" && value.trim().length < 2) return "Enter your full name."

  if (field === "mobileNumber") {
    const normalizedNumber = value.replace(/[\s-]/g, "")
    if (!/^(?:09\d{9}|\+639\d{9})$/.test(normalizedNumber)) return "Enter a valid Philippine mobile number."
  }

  return ""
}
