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
    ["Email", "Not collected"],
    ["Vehicle", `${vehicle.make} ${vehicle.model}`],
    ["Year", String(vehicle.year)],
    ["Mileage", `${formatMileage(vehicle.mileage)} km`],
    ["Transmission", vehicle.transmission],
    ["Fuel Type", vehicle.fuelType],
    ["City", contact.city],
    ["Asking Price", "Not provided"],
    ["Variant", vehicle.variant || "Not provided"],
    ["Condition", vehicle.condition],
    ["Photo Count", String(payload.photoCount)],
    ["Date Submitted", submissionDate],
  ]
  const detailsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="width:42%;padding:11px 16px 11px 0;border-bottom:1px solid #ebe8e1;color:#746f65;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;vertical-align:top">${escapeHtml(label)}</td><td style="padding:11px 0;border-bottom:1px solid #ebe8e1;color:#1f1f1f;font-size:14px;font-weight:600;vertical-align:top">${escapeHtml(value)}</td></tr>`,
    )
    .join("")
  const adminLinkHtml = adminLeadUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto 0"><tr><td style="border-radius:10px;background:#1f1f1f"><a href="${escapeHtml(adminLeadUrl)}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;line-height:20px;text-align:center;text-decoration:none">View Lead</a></td></tr></table><p style="margin:20px 0 0;color:#746f65;font-family:Arial,sans-serif;font-size:12px;line-height:18px;word-break:break-all">${escapeHtml(adminLeadUrl)}</p>`
    : `<p style="margin:24px 0 0;color:#6b675f">Use reference ID ${escapeHtml(referenceId)} to locate this lead in the Admin Dashboard.</p>`

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: notificationEmail,
    subject: `New Sell My Car lead: ${referenceId}`,
    html: `
      <div style="margin:0;padding:0;background:#f4f2ed;color:#1f1f1f">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f2ed"><tr><td align="center" style="padding:32px 16px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e7e3da">
            <tr><td style="padding:28px 32px 24px;background:#1f1f1f">
              <p style="margin:0;color:#d5ad54;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em">BUY &amp; SELL CARS PHILIPPINES</p>
              <h1 style="margin:10px 0 0;color:#ffffff;font-family:Arial,sans-serif;font-size:26px;line-height:34px">New Sell My Car lead</h1>
            </td></tr>
            <tr><td style="padding:28px 32px 32px">
              <p style="margin:0 0 20px;color:#746f65;font-family:Arial,sans-serif;font-size:14px;line-height:22px">A new vehicle submission is ready for review.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse">${detailsHtml}</table>
              ${adminLinkHtml}
            </td></tr>
          </table>
        </td></tr></table>
      </div>
    `,
  })

  if (error) {
    throw new Error("Unable to send Sell My Car notification.")
  }
}
