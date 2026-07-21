import "server-only"
import { Resend } from "resend"

type SellCarEmailConfiguration = {
  resend: Resend
  notificationEmail: string
  fromEmail: string
}

export const getSellCarEmailConfiguration = (): SellCarEmailConfiguration => {
  const apiKey = process.env.RESEND_API_KEY
  const notificationEmail = process.env.SELL_CAR_NOTIFICATION_EMAIL
  const fromEmail = process.env.SELL_CAR_FROM_EMAIL

  if (!apiKey || !notificationEmail || !fromEmail) {
    throw new Error("Missing Sell My Car email configuration.")
  }

  return {
    resend: new Resend(apiKey),
    notificationEmail,
    fromEmail,
  }
}
