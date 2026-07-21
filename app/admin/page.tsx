import LeadStatusSelect from "@/src/components/admin/LeadStatusSelect"
import { getDashboardAnalytics, type DashboardAnalytics } from "@/src/server/sellCar/getDashboardAnalytics"
import { getRecentLeads, isSellCarLeadStatus, type SellCarLeadStatus } from "@/src/server/sellCar/getRecentLeads"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

type DashboardData = Awaited<ReturnType<typeof getRecentLeads>>

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

type AdminDashboardPageProps = {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[]; page?: string | string[] }>
}

const getQueryValue = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined

const getPageValue = (value: string | undefined) => {
  if (!value || !/^\d+$/.test(value)) return 1

  const page = Number(value)

  return Number.isSafeInteger(page) && page > 0 && page <= 10_000 ? page : 1
}

const createDashboardUrl = ({
  query,
  status,
  page,
}: {
  query?: string
  status?: SellCarLeadStatus
  page?: number
}) => {
  const queryParameters = new URLSearchParams()

  if (query) queryParameters.set("q", query)
  if (status) queryParameters.set("status", status)
  if (page && page > 1) queryParameters.set("page", String(page))

  const queryString = queryParameters.toString()

  return queryString ? `/admin?${queryString}` : "/admin"
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams
  const rawQuery = getQueryValue(params.q)?.trim().slice(0, 100) ?? ""
  const query = rawQuery.length >= 2 ? rawQuery : undefined
  const rawStatus = getQueryValue(params.status)
  const status: SellCarLeadStatus | undefined = rawStatus && rawStatus !== "all" && isSellCarLeadStatus(rawStatus)
    ? rawStatus
    : undefined
  const requestedPage = getPageValue(getQueryValue(params.page))
  const hasActiveFilters = Boolean(query || status)
  let dashboardData: DashboardData | null = null
  let analytics: DashboardAnalytics | null = null

  try {
    ;[dashboardData, analytics] = await Promise.all([
      getRecentLeads({ query, status, page: requestedPage }),
      getDashboardAnalytics(),
    ])
  } catch {
    dashboardData = null
    analytics = null
  }

  if (!dashboardData || !analytics) {
    return (
      <section aria-labelledby="recent-leads-heading">
        <h2 id="recent-leads-heading" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Recent Leads
        </h2>
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)] md:p-10"
        >
          <p className="text-sm text-[var(--text-secondary)]">Unable to load leads.</p>
        </div>
      </section>
    )
  }

  const { leads, pagination } = dashboardData

  if (pagination.totalMatching > 0 && requestedPage > pagination.totalPages) {
    redirect(createDashboardUrl({ query, status, page: pagination.totalPages }))
  }

  const resultLabel = pagination.totalMatching === 0
    ? "Showing 0 leads"
    : pagination.totalMatching === 1
      ? "Showing 1 lead"
      : `Showing ${((pagination.page - 1) * pagination.pageSize) + 1}–${Math.min(
          pagination.page * pagination.pageSize,
          pagination.totalMatching,
        )} of ${pagination.totalMatching} leads`
  const statistics = [
    { label: "New Leads", value: analytics.newLeads },
    { label: "Contacted", value: analytics.contacted },
    { label: "Inspections Scheduled", value: analytics.inspectionScheduled },
    { label: "Purchased", value: analytics.purchased },
  ]

  return (
    <>
      <section aria-label="Lead statistics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((statistic) => (
            <article
              key={statistic.label}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_8px_20px_rgba(31,31,31,0.05)]"
            >
              <p className="text-sm font-medium text-[var(--text-secondary)]">{statistic.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {statistic.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="business-analytics-heading" className="mt-8 md:mt-10">
        <h2 id="business-analytics-heading" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Business Analytics
        </h2>

        {analytics.totalLeads === 0 ? (
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)] md:p-10">
            <p className="text-sm text-[var(--text-secondary)]">No analytics available.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Conversion Rate", value: `${analytics.conversionRate}%` },
                { label: "Average Vehicle Year", value: String(analytics.averageVehicleYear ?? "—") },
                {
                  label: "Average Mileage",
                  value: analytics.averageMileage === null
                    ? "—"
                    : `${new Intl.NumberFormat("en-PH").format(analytics.averageMileage)} km`,
                },
              ].map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_8px_20px_rgba(31,31,31,0.05)]"
                >
                  <p className="text-sm font-medium text-[var(--text-secondary)]">{metric.label}</p>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{metric.value}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
                <h3 className="px-5 pt-5 text-lg font-bold tracking-tight text-[var(--text-primary)]">Top Vehicle Makes</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-y border-[var(--border)] bg-[#fcfcfb] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">Make</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Leads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {analytics.topVehicleMakes.map((make) => (
                        <tr key={make.make}>
                          <td className="px-5 py-3 font-medium text-[var(--text-primary)]">{make.make}</td>
                          <td className="px-5 py-3 text-right text-[var(--text-secondary)]">{make.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
                <h3 className="px-5 pt-5 text-lg font-bold tracking-tight text-[var(--text-primary)]">Top Cities</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-y border-[var(--border)] bg-[#fcfcfb] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">City</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Leads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {analytics.topCities.map((city) => (
                        <tr key={city.city}>
                          <td className="px-5 py-3 font-medium text-[var(--text-primary)]">{city.city}</td>
                          <td className="px-5 py-3 text-right text-[var(--text-secondary)]">{city.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>

            <article className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Lead Activity</h3>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Today", value: analytics.leadsSubmitted.today },
                  { label: "Last 7 Days", value: analytics.leadsSubmitted.last7Days },
                  { label: "Last 30 Days", value: analytics.leadsSubmitted.last30Days },
                ].map((period) => (
                  <div key={period.label} className="rounded-xl bg-[#fcfcfb] p-4">
                    <dt className="text-sm font-medium text-[var(--text-secondary)]">{period.label}</dt>
                    <dd className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{period.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        )}
      </section>

      <section aria-labelledby="recent-leads-heading" className="mt-8 md:mt-10">
        <h2 id="recent-leads-heading" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Recent Leads
        </h2>

        <form method="get" className="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_8px_20px_rgba(31,31,31,0.05)] md:flex-row md:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
            Search leads
            <input
              type="search"
              name="q"
              defaultValue={rawQuery}
              maxLength={100}
              placeholder="Customer, vehicle, city, or reference ID"
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            />
          </label>
          <label className="flex min-w-44 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
            Status
            <select
              name="status"
              defaultValue={status ?? "all"}
              className="h-10 rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="inspection_scheduled">Inspection Scheduled</option>
              <option value="purchased">Purchased</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="h-10 rounded-xl bg-[var(--text-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <Link
                href="/admin"
                className="rounded-sm text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </form>

        <p className="mt-3 text-sm text-[var(--text-secondary)]">{resultLabel}</p>

        {leads.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)] md:p-10">
            <p className="text-sm text-[var(--text-secondary)]">
              {analytics.totalLeads === 0 && !hasActiveFilters ? "No leads yet." : "No leads match your filters."}
            </p>
          </div>
        ) : (
          <>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[#fcfcfb] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">Reference ID</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Customer</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Vehicle</th>
                  <th scope="col" className="px-5 py-4 font-semibold">City</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {leads.map((lead) => (
                  <tr key={lead.id} className="text-[var(--text-primary)]">
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="rounded-sm text-[var(--text-primary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                      >
                        {lead.reference_id}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{lead.full_name}</p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">{lead.mobile_number}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {lead.vehicle_year} {lead.make} {lead.model}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">{lead.city}</td>
                    <td className="px-5 py-4">
                      <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">
                      {formatCreatedAt(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Lead pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {pagination.hasPreviousPage ? (
              <Link
                href={createDashboardUrl({ query, status, page: pagination.page - 1 })}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                Previous
              </Link>
            ) : (
              <span aria-disabled="true" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50">
                Previous
              </span>
            )}

            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            {pagination.hasNextPage ? (
              <Link
                href={createDashboardUrl({ query, status, page: pagination.page + 1 })}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                Next
              </Link>
            ) : (
              <span aria-disabled="true" className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50">
                Next
              </span>
            )}
          </nav>
          </>
        )}
      </section>
    </>
  )
}
