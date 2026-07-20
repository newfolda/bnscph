import type { SellCarSubmissionPayload } from "../../types/sellCar"

export type SellCarSubmissionResult = { referenceId: string }

// Temporary replacement boundary for the future backend API; multipart photo upload will be added there.
export async function submitSellCarLead(_payload: SellCarSubmissionPayload): Promise<SellCarSubmissionResult> {
  void _payload
  await new Promise((resolve) => window.setTimeout(resolve, 700))
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase() : Math.random().toString(36).slice(2, 8).toUpperCase()
  return { referenceId: `BSC-${new Date().getFullYear()}-${suffix}` }
}
