import type { SellCarSubmissionPayload } from "../../types/sellCar"

export type SaveSellCarLeadInput = {
  referenceId: string
  submittedAt: string
  payload: SellCarSubmissionPayload
}
