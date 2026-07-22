import Link from "next/link"
import { redirect } from "next/navigation"
import LeadStatusSelect from "@/src/components/admin/LeadStatusSelect"
import { getRecentLeads, isSellCarLeadStatus, type SellCarLeadStatus } from "@/src/server/sellCar/getRecentLeads"

export const dynamic = "force-dynamic"

type LeadsPageProps = {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[]; page?: string | string[] }>
}

const getQueryValue = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined

const getPageValue = (value: string | undefined) => {
  if (!value || !/^\d+$/.test(value)) return 1

  const page = Number(value)
  return Number.isSafeInteger(page) && page > 0 && page <= 10_000 ? page : 1
}

const createLeadsUrl = ({ query, status, page }: { query?: string; status?: SellCarLeadStatus; page?: number }) => {
  const parameters = new URLSearchParams()
  if (query) parameters.set("q", query)
  if (status) parameters.set("status", status)
  if (page && page > 1) parameters.set("page", String(page))
  const queryString = parameters.toString()
  return queryString ? `/admin/leads?${queryString}` : "/admin/leads"
}

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams
  const rawQuery = getQueryValue(params.q)?.trim().slice(0, 100) ?? ""
  const query = rawQuery.length >= 2 ? rawQuery : undefined
  const rawStatus = getQueryValue(params.status)
  const status = rawStatus && rawStatus !== "all" && isSellCarLeadStatus(rawStatus) ? rawStatus : undefined
  const requestedPage = getPageValue(getQueryValue(params.page))
  const hasActiveFilters = Boolean(query || status)

  let leadData: Awaited<ReturnType<typeof getRecentLeads>> | null = null
  try {
    leadData = await getRecentLeads({ query, status, page: requestedPage })
  } catch {
    leadData = null
  }

  if (!leadData) {
    return <section><h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Leads</h1><div role="alert" className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)]"><p className="text-sm text-[var(--text-secondary)]">Unable to load leads.</p></div></section>
  }

  const { leads, pagination } = leadData
  if (pagination.totalMatching > 0 && requestedPage > pagination.totalPages) redirect(createLeadsUrl({ query, status, page: pagination.totalPages }))
  const resultLabel = pagination.totalMatching === 0 ? "Showing 0 leads" : pagination.totalMatching === 1 ? "Showing 1 lead" : `Showing ${((pagination.page - 1) * pagination.pageSize) + 1}–${Math.min(pagination.page * pagination.pageSize, pagination.totalMatching)} of ${pagination.totalMatching} leads`

  return (
    <section aria-labelledby="leads-heading">
      <h1 id="leads-heading" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Leads</h1>
      <form method="get" className="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_8px_20px_rgba(31,31,31,0.05)] md:flex-row md:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">Search leads<input type="search" name="q" defaultValue={rawQuery} maxLength={100} placeholder="Customer, vehicle, city, or reference ID" className="h-10 w-full rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]" /></label>
        <label className="flex min-w-44 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">Status<select name="status" defaultValue={status ?? "all"} className="h-10 rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="inspection_scheduled">Inspection Scheduled</option><option value="purchased">Purchased</option><option value="rejected">Rejected</option><option value="archived">Archived</option></select></label>
        <div className="flex items-center gap-3"><button type="submit" className="h-10 rounded-xl bg-[var(--text-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Apply Filters</button>{hasActiveFilters && <Link href="/admin/leads" className="rounded-sm text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Clear Filters</Link>}</div>
      </form>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{resultLabel}</p>
      {leads.length === 0 ? <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)]"><p className="text-sm text-[var(--text-secondary)]">{hasActiveFilters ? "No leads match your filters." : "No leads yet."}</p></div> : <><div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.05)]"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[var(--border)] bg-[#fcfcfb] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]"><tr><th scope="col" className="px-5 py-4 font-semibold">Reference ID</th><th scope="col" className="px-5 py-4 font-semibold">Customer</th><th scope="col" className="px-5 py-4 font-semibold">Vehicle</th><th scope="col" className="px-5 py-4 font-semibold">City</th><th scope="col" className="px-5 py-4 font-semibold">Status</th><th scope="col" className="px-5 py-4 font-semibold">Created</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{leads.map((lead) => <tr key={lead.id} className="text-[var(--text-primary)]"><td className="whitespace-nowrap px-5 py-4 font-medium"><Link href={`/admin/leads/${lead.id}`} className="rounded-sm text-[var(--text-primary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">{lead.reference_id}</Link></td><td className="px-5 py-4"><p className="font-medium">{lead.full_name}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{lead.mobile_number}</p></td><td className="whitespace-nowrap px-5 py-4">{lead.vehicle_year} {lead.make} {lead.model}</td><td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">{lead.city}</td><td className="px-5 py-4"><LeadStatusSelect leadId={lead.id} initialStatus={lead.status} /></td><td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">{formatCreatedAt(lead.created_at)}</td></tr>)}</tbody></table></div><nav aria-label="Lead pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">{pagination.hasPreviousPage ? <Link href={createLeadsUrl({ query, status, page: pagination.page - 1 })} className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Previous</Link> : <span aria-disabled="true" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50">Previous</span>}<p className="text-sm font-medium text-[var(--text-secondary)]">Page {pagination.page} of {pagination.totalPages}</p>{pagination.hasNextPage ? <Link href={createLeadsUrl({ query, status, page: pagination.page + 1 })} className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Next</Link> : <span aria-disabled="true" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50">Next</span>}</nav></>}
    </section>
  )
}
