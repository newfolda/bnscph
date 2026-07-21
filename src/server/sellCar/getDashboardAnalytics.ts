import { getSupabaseServerClient } from "../supabase/client"

type DashboardAnalyticsLead = {
  status: string
  vehicle_year: number
  mileage: number
  make: string
  city: string
  submitted_at: string
}

type RankedValue = {
  value: string
  count: number
}

export type DashboardAnalytics = {
  totalLeads: number
  newLeads: number
  contacted: number
  inspectionScheduled: number
  purchased: number
  rejected: number
  conversionRate: number
  averageVehicleYear: number | null
  averageMileage: number | null
  topVehicleMakes: Array<{ make: string; count: number }>
  topCities: Array<{ city: string; count: number }>
  leadsSubmitted: {
    today: number
    last7Days: number
    last30Days: number
  }
}

const rankValues = (values: string[]): RankedValue[] => {
  const counts = new Map<string, number>()

  values.forEach((value) => {
    const normalizedValue = value.trim()

    if (!normalizedValue) return

    counts.set(normalizedValue, (counts.get(normalizedValue) ?? 0) + 1)
  })

  return Array.from(counts, ([value, count]) => ({ value, count }))
    .sort((first, second) => second.count - first.count || first.value.localeCompare(second.value))
    .slice(0, 5)
}

const createStartOfDay = (date: Date) => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay
}

const countSince = (leads: DashboardAnalyticsLead[], start: Date) =>
  leads.reduce((count, lead) => {
    const submittedAt = Date.parse(lead.submitted_at)
    return Number.isFinite(submittedAt) && submittedAt >= start.getTime() ? count + 1 : count
  }, 0)

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("sell_car_leads")
    .select("status, vehicle_year, mileage, make, city, submitted_at")

  if (error) {
    throw new Error("Unable to load Sell My Car dashboard analytics.")
  }

  const leads = (data ?? []) as DashboardAnalyticsLead[]
  const totalLeads = leads.length
  const statusCounts = leads.reduce<Record<string, number>>((counts, lead) => {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1
    return counts
  }, {})
  const totalVehicleYears = leads.reduce((total, lead) => total + lead.vehicle_year, 0)
  const totalMileage = leads.reduce((total, lead) => total + lead.mileage, 0)
  const today = createStartOfDay(new Date())
  const last7Days = new Date(today)
  last7Days.setDate(last7Days.getDate() - 6)
  const last30Days = new Date(today)
  last30Days.setDate(last30Days.getDate() - 29)
  const topVehicleMakes = rankValues(leads.map((lead) => lead.make)).map(({ value, count }) => ({ make: value, count }))
  const topCities = rankValues(leads.map((lead) => lead.city)).map(({ value, count }) => ({ city: value, count }))

  return {
    totalLeads,
    newLeads: statusCounts.new ?? 0,
    contacted: statusCounts.contacted ?? 0,
    inspectionScheduled: statusCounts.inspection_scheduled ?? 0,
    purchased: statusCounts.purchased ?? 0,
    rejected: statusCounts.rejected ?? 0,
    conversionRate: totalLeads === 0 ? 0 : Number(((statusCounts.purchased ?? 0) / totalLeads * 100).toFixed(1)),
    averageVehicleYear: totalLeads === 0 ? null : Math.round(totalVehicleYears / totalLeads),
    averageMileage: totalLeads === 0 ? null : Math.round(totalMileage / totalLeads),
    topVehicleMakes,
    topCities,
    leadsSubmitted: {
      today: countSince(leads, today),
      last7Days: countSince(leads, last7Days),
      last30Days: countSince(leads, last30Days),
    },
  }
}
