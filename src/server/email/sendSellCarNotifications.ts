import "server-only"
import { getSiteUrl } from "@/src/lib/siteUrl"
import type { SellCarSubmissionPayload } from "@/src/types/sellCar"
import { getSellCarEmailConfiguration } from "./client"

type SendSellCarNotificationsInput = {
  leadId: string
  referenceId: string
  submittedAt: string
  payload: SellCarSubmissionPayload
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const formatMileage = (mileage: number) => new Intl.NumberFormat("en-PH").format(mileage)

const getAdminLeadUrl = (leadId: string) => {
  try {
    return new URL(`/admin/leads/${leadId}`, getSiteUrl()).toString()
  } catch {
    return null
  }
}

export async function sendSellCarNotifications({
  leadId,
  referenceId,
  submittedAt,
  payload,
}: SendSellCarNotificationsInput): Promise<void> {
  const { resend, notificationEmail, fromEmail } = getSellCarEmailConfiguration()
  const adminLeadUrl = getAdminLeadUrl(leadId)
  const vehicle = payload.vehicle
  const contact = payload.contact
  const submissionDate = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(submittedAt))
  const rows = [
    ["Reference ID", referenceId],
    ["Customer Name", contact.fullName],
    ["Mobile Number", contact.mobileNumber],
    ["City", contact.city],
    ["Vehicle", `${vehicle.year} ${vehicle.make} ${vehicle.model}`],
    ["Variant", vehicle.variant || "Not provided"],
    ["Mileage", `${formatMileage(vehicle.mileage)} km`],
    ["Transmission", vehicle.transmission],
    ["Fuel Type", vehicle.fuelType],
    ["Condition", vehicle.condition],
    ["Photo Count", String(payload.photoCount)],
    ["Submitted", submissionDate],
  ]
  const detailsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#6b675f;font-weight:600;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;color:#1f1f1f">${escapeHtml(value)}</td></tr>`,
    )
    .join("")
  const adminLinkHtml = adminLeadUrl
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(adminLeadUrl)}" style="color:#805d18;font-weight:700">View lead in Admin Dashboard</a></p>`
    : `<p style="margin:24px 0 0;color:#6b675f">Use reference ID ${escapeHtml(referenceId)} to locate this lead in the Admin Dashboard.</p>`

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: notificationEmail,
    subject: `New Sell My Car lead: ${referenceId}`,
    html: `
      <div style="background:#f7f6f2;padding:32px;font-family:Arial,sans-serif;color:#1f1f1f">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px">
          <p style="margin:0;color:#a57b1f;font-size:12px;font-weight:700;letter-spacing:0.12em">BUY &amp; SELL CARS PHILIPPINES</p>
          <h1 style="margin:12px 0 20px;font-size:24px">New Sell My Car submission</h1>
          <table style="width:100%;border-collapse:collapse;font-size:14px">${detailsHtml}</table>
          ${adminLinkHtml}
        </div>
      </div>
    `,
  })

  if (error) {
    throw new Error("Unable to send Sell My Car notification.")
  }
}
