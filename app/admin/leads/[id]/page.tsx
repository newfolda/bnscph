import Link from "next/link"
import { notFound } from "next/navigation"
import LeadActivity from "@/src/components/admin/LeadActivity"
import LeadPhotoGallery from "@/src/components/admin/LeadPhotoGallery"
import InspectionCard from "@/src/components/admin/InspectionCard"
import { getLeadById } from "@/src/server/sellCar/getLeadById"
import { getInspection } from "@/src/server/sellCar/getInspection"
import { getLeadNotes } from "@/src/server/sellCar/getLeadNotes"
import { getLeadPhotos } from "@/src/server/sellCar/getLeadPhotos"
import type { SellCarLeadStatus } from "@/src/server/sellCar/getRecentLeads"

type LeadDetailsPageProps = {
  params: Promise<{ id: string }>
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const statusLabels: Record<SellCarLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  inspection_scheduled: "Inspection Scheduled",
  purchased: "Purchased",
  rejected: "Rejected",
  archived: "Archived",
}

const statusClassNames: Record<SellCarLeadStatus, string> = {
  new: "bg-[var(--primary-light)] text-[#805d18]",
  contacted: "bg-sky-50 text-sky-800",
  inspection_scheduled: "bg-violet-50 text-violet-800",
  purchased: "bg-emerald-50 text-emerald-800",
  rejected: "bg-rose-50 text-rose-800",
  archived: "bg-stone-100 text-stone-700",
}

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

const formatVehicleFieldModes = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Not provided"

  const entries = Object.entries(value)

  if (entries.length === 0) return "Not provided"

  return entries.map(([field, mode]) => `${field}: ${String(mode)}`).join(", ")
}

const detailItems = (items: Array<{ label: string; value: string }>) => (
  <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
    {items.map((item) => (
      <div key={item.label}>
        <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          {item.label}
        </dt>
        <dd className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">{item.value}</dd>
      </div>
    ))}
  </dl>
)

export default async function AdminLeadDetailsPage({ params }: LeadDetailsPageProps) {
  const { id } = await params

  if (!uuidPattern.test(id)) {
    notFound()
  }

  let lead

  try {
    lead = await getLeadById(id)
  } catch {
    notFound()
  }

  if (!lead) {
    notFound()
  }

  let notes: Awaited<ReturnType<typeof getLeadNotes>> = []

  try {
    notes = await getLeadNotes(lead.id)
  } catch {
    notes = []
  }

  let photos: Awaited<ReturnType<typeof getLeadPhotos>> = []

  try {
    photos = await getLeadPhotos(lead.id)
  } catch {
    photos = []
  }

  let inspection: Awaited<ReturnType<typeof getInspection>> = null

  try {
    inspection = await getInspection(lead.id)
  } catch {
    inspection = null
  }

  return (
    <section aria-labelledby="lead-details-heading">
      <Link
        href="/admin"
        className="inline-flex rounded-sm text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      >
        ← Back to Dashboard
      </Link>

      <div className="mt-5 flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Lead details</p>
          <h1 id="lead-details-heading" className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {lead.reference_id}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Submitted {formatDate(lead.submitted_at)}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClassNames[lead.status]}`}>
          {statusLabels[lead.status]}
        </span>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Customer Details</h2>
          <div className="mt-5">
            {detailItems([
              { label: "Full Name", value: lead.full_name },
              { label: "Mobile Number", value: lead.mobile_number },
              { label: "City", value: lead.city },
            ])}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Vehicle Details</h2>
          <div className="mt-5">
            {detailItems([
              { label: "Year", value: String(lead.vehicle_year) },
              { label: "Make", value: lead.make },
              { label: "Model", value: lead.model },
              { label: "Variant", value: lead.variant?.trim() || "Not provided" },
              { label: "Mileage", value: `${new Intl.NumberFormat("en-PH").format(lead.mileage)} km` },
              { label: "Transmission", value: lead.transmission },
              { label: "Fuel Type", value: lead.fuel_type },
              { label: "Condition", value: lead.condition },
            ])}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)] lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Submission Details</h2>
          <div className="mt-5">
            {detailItems([
              { label: "Photo Count", value: String(lead.photo_count) },
              { label: "Privacy Consent", value: lead.privacy_consent ? "Provided" : "Not provided" },
              { label: "Source", value: lead.source },
              { label: "Vehicle Field Modes", value: formatVehicleFieldModes(lead.vehicle_field_modes) },
              { label: "Created At", value: formatDate(lead.created_at) },
              { label: "Updated At", value: formatDate(lead.updated_at) },
            ])}
          </div>
        </article>

        <InspectionCard leadId={lead.id} initialInspection={inspection} />
      </div>

      <LeadActivity leadId={lead.id} initialNotes={notes} />
      <LeadPhotoGallery photos={photos} />
    </section>
  )
}
