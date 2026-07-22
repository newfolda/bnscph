import Link from "next/link"
import { redirect } from "next/navigation"
import { getPurchasedCars } from "@/src/server/sellCar/purchasedCars"

export const dynamic = "force-dynamic"

type PurchasedCarsPageProps = {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>
}

const pageSize = 25

const getQueryValue = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined

const getPageValue = (value: string | undefined) =>
  value && /^\d+$/.test(value) && Number(value) > 0 && Number(value) <= 10_000
    ? Number(value)
    : 1

const createPurchasedCarsUrl = (query?: string, page?: number) => {
  const parameters = new URLSearchParams()

  if (query) parameters.set("q", query)
  if (page && page > 1) parameters.set("page", String(page))

  return parameters.size
    ? `/admin/purchased-cars?${parameters}`
    : "/admin/purchased-cars"
}

const formatDate = (value: string | null) => {
  if (!value) return "Not recorded"

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(date)
}

const formatPurchasePrice = (value: number | null) =>
  value === null
    ? "Not recorded"
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 2,
      }).format(value)

export default async function PurchasedCarsPage({
  searchParams,
}: PurchasedCarsPageProps) {
  const params = await searchParams
  const rawQuery = getQueryValue(params.q)?.trim().slice(0, 100) ?? ""
  const query = rawQuery.length >= 2 ? rawQuery : undefined
  const requestedPage = getPageValue(getQueryValue(params.page))

  let purchasedCars: Awaited<ReturnType<typeof getPurchasedCars>> | null = null

  try {
    purchasedCars = await getPurchasedCars()
  } catch {
    purchasedCars = null
  }

  if (!purchasedCars) {
    return (
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Purchased Cars
        </h1>
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)]"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            Unable to load purchased cars.
          </p>
        </div>
      </section>
    )
  }

  const filteredCars = query
    ? purchasedCars.filter((car) =>
        [car.referenceId, car.customer, car.vehicle, car.assignedStaff].filter(
          (value): value is string => Boolean(value),
        )
          .some((value) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())),
      )
    : purchasedCars
  const totalMatching = filteredCars.length
  const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize))

  if (totalMatching > 0 && requestedPage > totalPages) {
    redirect(createPurchasedCarsUrl(query, totalPages))
  }

  const currentPage = Math.min(requestedPage, totalPages)
  const firstItemIndex = (currentPage - 1) * pageSize
  const cars = filteredCars.slice(firstItemIndex, firstItemIndex + pageSize)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages
  const summary =
    totalMatching === 0
      ? "Showing 0 purchased cars"
      : totalMatching === 1
        ? "Showing 1 purchased car"
        : `Showing ${firstItemIndex + 1}–${Math.min(firstItemIndex + pageSize, totalMatching)} of ${totalMatching} purchased cars`

  return (
    <section aria-labelledby="purchased-cars-heading">
      <h1
        id="purchased-cars-heading"
        className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
      >
        Purchased Cars
      </h1>

      <form
        method="get"
        className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_8px_20px_rgba(31,31,31,0.05)]"
      >
        <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
          Search purchased cars
          <input
            type="search"
            name="q"
            defaultValue={rawQuery}
            maxLength={100}
            placeholder="Customer, vehicle, city, or reference ID"
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          />
        </label>
        <label className="flex min-w-40 flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
          Status
          <select
            disabled
            defaultValue="purchased"
            className="h-10 rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm text-[var(--text-secondary)]"
          >
            <option value="purchased">Purchased</option>
          </select>
        </label>
        <button
          type="submit"
          className="h-10 rounded-xl bg-[var(--text-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
        >
          Apply Filters
        </button>
        {query && (
          <Link
            href="/admin/purchased-cars"
            className="rounded-sm text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          >
            Clear Filters
          </Link>
        )}
      </form>

      <p className="mt-3 text-sm text-[var(--text-secondary)]">{summary}</p>

      {cars.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
          <p className="text-sm text-[var(--text-secondary)]">
            {query ? "No purchased cars match your filters." : "No purchased cars yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[#fcfcfb] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Reference ID</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Vehicle</th>
                  <th className="px-5 py-4 font-semibold">Purchase Price</th>
                  <th className="px-5 py-4 font-semibold">Purchase Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Assigned Staff</th>
                  <th className="px-5 py-4 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {cars.map((car) => (
                  <tr key={car.leadId} className="text-[var(--text-primary)]">
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {car.referenceId}
                    </td>
                    <td className="px-5 py-4 font-medium">{car.customer}</td>
                    <td className="whitespace-nowrap px-5 py-4">{car.vehicle}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">
                      {formatPurchasePrice(car.purchasePrice)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">
                      {formatDate(car.purchaseDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {car.inventoryStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--text-secondary)]">
                      {car.assignedStaff || "Not assigned"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        href={`/admin/purchased-cars/${car.leadId}`}
                        className="rounded-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalMatching > 0 && (
            <nav
              aria-label="Purchased car pagination"
              className="mt-4 flex flex-wrap items-center justify-between gap-3"
            >
              {hasPreviousPage ? (
                <Link
                  href={createPurchasedCarsUrl(query, currentPage - 1)}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                >
                  Previous
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50"
                >
                  Previous
                </span>
              )}
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Page {currentPage} of {totalPages}
              </p>
              {hasNextPage ? (
                <Link
                  href={createPurchasedCarsUrl(query, currentPage + 1)}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                >
                  Next
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50"
                >
                  Next
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  )
}
