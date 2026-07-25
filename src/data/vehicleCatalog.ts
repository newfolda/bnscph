import rawVehicleCatalog from "./philippines-car-models-variants-2010-2026.json"

export type CatalogModel = {
  model: string
  variants: string[]
}

export type CatalogYearData = Record<string, CatalogModel[]>

export type PhilippinesVehicleCatalog = {
  metadata: {
    market: string
    yearRange: [number, number]
    generatedOn: string
    makes: string[]
    hierarchy: string
    importantNote?: string
  }
  sources?: Record<string, { url: string; coverage: string }>
  years: Record<string, CatalogYearData>
}

export const OLDER_THAN_2010_VALUE = "older-than-2010"

const fallbackValues = new Set(["other", "other / not listed", "not sure", "not sure / other"])
const naturalCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function assertCatalog(value: unknown): asserts value is PhilippinesVehicleCatalog {
  if (!isRecord(value) || !isRecord(value.metadata) || !isRecord(value.years)) {
    throw new Error("Vehicle catalog has an invalid top-level structure.")
  }

  const { metadata } = value
  if (
    typeof metadata.market !== "string" ||
    typeof metadata.generatedOn !== "string" ||
    typeof metadata.hierarchy !== "string" ||
    !Array.isArray(metadata.makes) ||
    !Array.isArray(metadata.yearRange) ||
    metadata.yearRange.length !== 2 ||
    !metadata.yearRange.every((year) => typeof year === "number")
  ) {
    throw new Error("Vehicle catalog metadata is invalid.")
  }

  for (const [year, yearData] of Object.entries(value.years)) {
    if (!/^\d{4}$/.test(year) || !isRecord(yearData)) {
      throw new Error(`Vehicle catalog year "${year}" is invalid.`)
    }

    for (const [make, models] of Object.entries(yearData)) {
      if (!make.trim() || !Array.isArray(models)) {
        throw new Error(`Vehicle catalog make data is invalid for ${year}.`)
      }

      for (const model of models) {
        if (!isRecord(model) || typeof model.model !== "string" || !Array.isArray(model.variants) || !model.variants.every((variant) => typeof variant === "string")) {
          throw new Error(`Vehicle catalog model data is invalid for ${year} ${make}.`)
        }
      }
    }
  }
}

function normalizeCatalogValue(value: string): string {
  let normalized = value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])\1+/g, "$1")
    .replace(/\s*(?:\[NEW\]|NEW!?|UPDATED?)\s*$/i, "")
    .trim()

  const openingCount = (normalized.match(/\(/g) ?? []).length
  const closingCount = (normalized.match(/\)/g) ?? []).length
  if (openingCount === closingCount + 1 && normalized.endsWith("(")) normalized = normalized.slice(0, -1).trim()
  if (openingCount === closingCount + 1 && normalized.startsWith("(")) normalized = normalized.slice(1).trim()
  if (closingCount === openingCount + 1 && normalized.startsWith(")")) normalized = normalized.slice(1).trim()
  if (closingCount === openingCount + 1 && normalized.endsWith(")")) normalized = normalized.slice(0, -1).trim()

  return normalized
}

function normalizedKey(value: string): string {
  return normalizeCatalogValue(value).toLocaleLowerCase("en")
}

function isFallbackValue(value: string): boolean {
  return fallbackValues.has(normalizedKey(value))
}

function uniqueSorted(values: string[]): string[] {
  const byKey = new Map<string, string>()
  for (const rawValue of values) {
    const value = normalizeCatalogValue(rawValue)
    if (value && !isFallbackValue(value) && !byKey.has(normalizedKey(value))) {
      byKey.set(normalizedKey(value), value)
    }
  }
  return [...byKey.values()].sort(naturalCollator.compare)
}

const importedCatalog: unknown = rawVehicleCatalog
assertCatalog(importedCatalog)
export const vehicleCatalog: PhilippinesVehicleCatalog = importedCatalog

type YearIndex = {
  brands: string[]
  modelsByMake: Map<string, string[]>
  variantsByMakeAndModel: Map<string, string[]>
}

let catalogIndex: Map<number, YearIndex> | null = null

function buildCatalogIndex(): Map<number, YearIndex> {
  if (catalogIndex) return catalogIndex

  catalogIndex = new Map()
  for (const [yearKey, yearData] of Object.entries(vehicleCatalog.years)) {
    const modelsByMake = new Map<string, string[]>()
    const variantsByMakeAndModel = new Map<string, string[]>()
    const brands = uniqueSorted(Object.keys(yearData))

    for (const make of brands) {
      const rawMake = Object.keys(yearData).find((candidate) => normalizedKey(candidate) === normalizedKey(make))
      const models = rawMake ? yearData[rawMake] : []
      const modelNames = uniqueSorted(models.map((model) => model.model))
      modelsByMake.set(normalizedKey(make), modelNames)

      for (const modelName of modelNames) {
        const variants = models
          .filter((model) => normalizedKey(model.model) === normalizedKey(modelName))
          .flatMap((model) => model.variants)
        variantsByMakeAndModel.set(`${normalizedKey(make)}::${normalizedKey(modelName)}`, uniqueSorted(variants))
      }
    }

    catalogIndex.set(Number(yearKey), { brands, modelsByMake, variantsByMakeAndModel })
  }

  return catalogIndex
}

export function getCatalogYears(): number[] {
  return [...buildCatalogIndex().keys()].sort((first, second) => second - first)
}

export function isCatalogYear(year: number): boolean {
  return buildCatalogIndex().has(year)
}

export function getBrands(year?: number): string[] {
  const index = buildCatalogIndex()
  if (year !== undefined) return index.get(year)?.brands ?? []
  return uniqueSorted([...index.values()].flatMap((entry) => entry.brands))
}

export function getModels(make: string, year?: number): string[] {
  const makeKey = normalizedKey(make)
  const index = buildCatalogIndex()
  if (year !== undefined) return index.get(year)?.modelsByMake.get(makeKey) ?? []
  return uniqueSorted([...index.values()].flatMap((entry) => entry.modelsByMake.get(makeKey) ?? []))
}

export function getVariants(make: string, model: string, year?: number): string[] {
  const key = `${normalizedKey(make)}::${normalizedKey(model)}`
  const index = buildCatalogIndex()
  if (year !== undefined) return index.get(year)?.variantsByMakeAndModel.get(key) ?? []
  return uniqueSorted([...index.values()].flatMap((entry) => entry.variantsByMakeAndModel.get(key) ?? []))
}

// The source catalog begins at 2010; its metadata notes that 2010 uses a 2011 baseline.
