import Link from "next/link"
import { getInspections, type AdminInspection } from "@/src/server/sellCar/getInspections"

export const dynamic = "force-dynamic"

type InspectionsPageProps = { searchParams: Promise<{ view?: string | string[] }> }

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

const InspectionTable = ({ inspections }: { inspections: AdminInspection[] }) => (
  <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
    <table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[var(--border)] bg-[#fcfcfb] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]"><tr><th scope="col" className="px-5 py-4 font-semibold">Lead</th><th scope="col" className="px-5 py-4 font-semibold">Customer</th><th scope="col" className="px-5 py-4 font-semibold">Vehicle</th><th scope="col" className="px-5 py-4 font-semibold">Inspection</th><th scope="col" className="px-5 py-4 font-semibold">Location</th><th scope="col" className="px-5 py-4 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{inspections.map((inspection) => <tr key={inspection.id} className="text-[var(--text-primary)]"><td className="whitespace-nowrap px-5 py-4 font-medium"><Link href={`/admin/leads/${inspection.leadId}`} className="rounded-sm transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">{inspection.lead.referenceId}</Link></td><td className="px-5 py-4"><p className="font-medium">{inspection.lead.fullName}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{inspection.lead.city}</p></td><td className="whitespace-nowrap px-5 py-4">{inspection.lead.vehicle}</td><td className="whitespace-nowrap px-5 py-4">{formatDate(inspection.scheduledAt)}</td><td className="px-5 py-4 text-[var(--text-secondary)]">{inspection.location}</td><td className="px-5 py-4"><span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800">{inspection.lead.status.replaceAll("_", " ")}</span></td></tr>)}</tbody></table>
  </div>
)

export default async function InspectionsPage({ searchParams }: InspectionsPageProps) {
  const params = await searchParams
  const view = typeof params.view === "string" && params.view === "all" ? "all" : "upcoming"
  let inspectionData: Awaited<ReturnType<typeof getInspections>> | null = null
  try { inspectionData = await getInspections() } catch { inspectionData = null }
  if (!inspectionData) return <section><h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Inspections</h1><div role="alert" className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)]"><p className="text-sm text-[var(--text-secondary)]">Unable to load inspections.</p></div></section>
  const { inspections, currentTime } = inspectionData
  const upcoming = inspections.filter((inspection) => Date.parse(inspection.scheduledAt) >= currentTime)
  const past = inspections.filter((inspection) => Date.parse(inspection.scheduledAt) < currentTime)
  return <section aria-labelledby="inspections-heading"><h1 id="inspections-heading" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Inspections</h1><form method="get" className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_8px_20px_rgba(31,31,31,0.05)]"><label className="flex min-w-44 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">View<select name="view" defaultValue={view} className="h-10 rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"><option value="upcoming">Upcoming</option><option value="all">All inspections</option></select></label><button type="submit" className="h-10 rounded-xl bg-[var(--text-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Apply Filter</button></form><div className="mt-8"><h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Upcoming Inspections</h2>{upcoming.length ? <InspectionTable inspections={upcoming} /> : <p className="mt-4 text-sm text-[var(--text-secondary)]">No upcoming inspections.</p>}</div>{view === "all" && <div className="mt-8"><h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Past Inspections</h2>{past.length ? <InspectionTable inspections={past} /> : <p className="mt-4 text-sm text-[var(--text-secondary)]">No past inspections.</p>}</div>}</section>
}
