import type { SellCarSubmissionPayload } from "../../types/sellCar"

export type SellCarSubmissionResult = {
  referenceId: string
  submittedAt: string
}

type SellCarSubmissionResponse = {
  success: boolean
  referenceId?: unknown
  submittedAt?: unknown
}

export async function submitSellCarLead(
  payload: SellCarSubmissionPayload,
  photos: File[],
): Promise<SellCarSubmissionResult> {
  let response: Response

  try {
    const formData = new FormData()
    formData.set("payload", JSON.stringify(payload))
    photos.forEach((photo) => formData.append("photos", photo, photo.name))

    response = await fetch("/api/sell-car", {
      method: "POST",
      body: formData,
    })
  } catch {
    throw new Error("Unable to submit your details right now.")
  }

  let responseBody: SellCarSubmissionResponse

  try {
    responseBody = (await response.json()) as SellCarSubmissionResponse
  } catch {
    throw new Error("Unable to submit your details right now.")
  }

  if (
    !response.ok ||
    responseBody.success !== true ||
    typeof responseBody.referenceId !== "string" ||
    typeof responseBody.submittedAt !== "string"
  ) {
    throw new Error("Unable to submit your details right now.")
  }

  return {
    referenceId: responseBody.referenceId,
    submittedAt: responseBody.submittedAt,
  }
}
