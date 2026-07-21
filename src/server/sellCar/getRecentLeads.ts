import { getSupabaseServerClient } from "../supabase/client"

export const sellCarLeadStatuses = [
  "new",
  "contacted",
  "inspection_scheduled",
  "purchased",
  "rejected",
  "archived",
] as const

export type SellCarLeadStatus = (typeof sellCarLeadStatuses)[number]

export const isSellCarLeadStatus = (value: unknown): value is SellCarLeadStatus =>
  typeof value === "string" && sellCarLeadStatuses.includes(value as SellCarLeadStatus)

export type RecentSellCarLead = {
  id: string
  reference_id: string
  created_at: string
  status: SellCarLeadStatus
  full_name: string
  mobile_number: string
  city: string
  vehicle_year: number
  make: string
  model: string
  variant: string | null
}

type GetRecentLeadsFilters = {
  query?: string
  status?: SellCarLeadStatus
  page?: number
  pageSize?: number
}

const sanitizeSearchQuery = (query: string) =>
  query
    .trim()
    .slice(0, 100)
    .replace(/[^\p{L}\p{N}\s@.+\-']/gu, "")

const normalizePage = (page: number | undefined) =>
  Number.isInteger(page) && page && page > 0 && page <= 10_000 ? page : 1

const normalizePageSize = (pageSize: number | undefined) =>
  Number.isInteger(pageSize) && pageSize && pageSize > 0 && pageSize <= 100 ? pageSize : 25

export async function getRecentLeads({ query, status, page, pageSize }: GetRecentLeadsFilters = {}): Promise<{
  leads: RecentSellCarLead[]
  pagination: {
    totalMatching: number
    page: number
    pageSize: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}> {
  const supabase = getSupabaseServerClient()
  const searchQuery = query ? sanitizeSearchQuery(query) : ""
  const normalizedPage = normalizePage(page)
  const normalizedPageSize = normalizePageSize(pageSize)
  const offset = (normalizedPage - 1) * normalizedPageSize
  const searchableColumns = ["reference_id", "full_name", "mobile_number", "city", "make", "model", "variant"]
  const searchFilters = searchableColumns.map((column) => `${column}.ilike.%${searchQuery}%`).join(",")
  let recentLeadsQuery = supabase
    .from("sell_car_leads")
    .select("id, reference_id, created_at, status, full_name, mobile_number, city, vehicle_year, make, model, variant")
  let matchingCountQuery = supabase.from("sell_car_leads").select("id", { count: "exact", head: true })

  if (searchQuery.length >= 2) {
    recentLeadsQuery = recentLeadsQuery.or(searchFilters)
    matchingCountQuery = matchingCountQuery.or(searchFilters)
  }

  if (status && isSellCarLeadStatus(status)) {
    recentLeadsQuery = recentLeadsQuery.eq("status", status)
    matchingCountQuery = matchingCountQuery.eq("status", status)
  }

  const [recentLeads, matchingLeads] = await Promise.all([
    recentLeadsQuery
      .order("created_at", { ascending: false })
      .range(offset, offset + normalizedPageSize - 1),
    matchingCountQuery,
  ])

  const results = [recentLeads, matchingLeads]

  if (results.some((result) => result.error)) {
    throw new Error("Unable to load Sell My Car leads.")
  }

  const totalMatching = matchingLeads.count ?? 0
  const totalPages = totalMatching === 0 ? 0 : Math.ceil(totalMatching / normalizedPageSize)

  return {
    leads: (recentLeads.data ?? []) as RecentSellCarLead[],
    pagination: {
      totalMatching,
      page: normalizedPage,
      pageSize: normalizedPageSize,
      totalPages,
      hasPreviousPage: normalizedPage > 1 && totalMatching > 0,
      hasNextPage: normalizedPage < totalPages,
    },
  }
}
