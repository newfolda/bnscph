export type VehicleVariant = {
  name: string
  yearFrom: number
  yearTo?: number
}

export type VehicleModel = {
  name: string
  yearFrom: number
  yearTo?: number
  variants: VehicleVariant[]
}

export type VehicleBrand = {
  name: string
  models: VehicleModel[]
}

// Sample catalog data only. Replace with verified Philippine-market data in production.
export const vehicleCatalog: VehicleBrand[] = [
  { name: "Toyota", models: [{ name: "Vios", yearFrom: 2003, variants: [{ name: "E", yearFrom: 2014 }, { name: "G", yearFrom: 2014 }, { name: "GR-S", yearFrom: 2021 }] }, { name: "Fortuner", yearFrom: 2005, variants: [{ name: "G", yearFrom: 2016 }, { name: "V", yearFrom: 2016 }, { name: "LTD", yearFrom: 2021 }] }, { name: "Hilux", yearFrom: 2005, variants: [{ name: "J", yearFrom: 2016 }, { name: "E", yearFrom: 2016 }, { name: "Conquest", yearFrom: 2017 }] }, { name: "Innova", yearFrom: 2005, variants: [{ name: "E", yearFrom: 2016 }, { name: "G", yearFrom: 2016 }, { name: "V", yearFrom: 2016 }] }] },
  { name: "Honda", models: [{ name: "City", yearFrom: 1996, variants: [{ name: "S", yearFrom: 2014 }, { name: "E", yearFrom: 2014 }, { name: "RS", yearFrom: 2020 }] }, { name: "Civic", yearFrom: 1991, variants: [{ name: "V", yearFrom: 2016 }, { name: "RS", yearFrom: 2016 }, { name: "Type R", yearFrom: 2017 }] }, { name: "BR-V", yearFrom: 2016, variants: [{ name: "S", yearFrom: 2016 }, { name: "V", yearFrom: 2016 }, { name: "VX", yearFrom: 2022 }] }, { name: "CR-V", yearFrom: 1997, variants: [{ name: "S", yearFrom: 2017 }, { name: "V", yearFrom: 2017 }, { name: "SX", yearFrom: 2017 }] }] },
  { name: "Mitsubishi", models: [{ name: "Mirage G4", yearFrom: 2014, variants: [{ name: "GLX", yearFrom: 2014 }, { name: "GLS", yearFrom: 2014 }] }, { name: "Montero Sport", yearFrom: 2005, variants: [{ name: "GLX", yearFrom: 2016 }, { name: "GT", yearFrom: 2016 }, { name: "Black Series", yearFrom: 2020 }] }, { name: "Xpander", yearFrom: 2018, variants: [{ name: "GLS", yearFrom: 2018 }, { name: "Cross", yearFrom: 2020 }] }] },
  { name: "Nissan", models: [{ name: "Almera", yearFrom: 2012, variants: [{ name: "EL", yearFrom: 2020 }, { name: "VE", yearFrom: 2020 }, { name: "VL", yearFrom: 2020 }] }, { name: "Navara", yearFrom: 1997, variants: [{ name: "EL", yearFrom: 2021 }, { name: "VE", yearFrom: 2021 }, { name: "PRO-4X", yearFrom: 2021 }] }, { name: "Terra", yearFrom: 2018, variants: [{ name: "EL", yearFrom: 2018 }, { name: "VE", yearFrom: 2018 }, { name: "VL", yearFrom: 2018 }] }] },
  { name: "Ford", models: [{ name: "Ranger", yearFrom: 1998, variants: [{ name: "XL", yearFrom: 2019 }, { name: "Sport", yearFrom: 2022 }, { name: "Wildtrak", yearFrom: 2012 }] }, { name: "Everest", yearFrom: 2003, variants: [{ name: "Trend", yearFrom: 2019 }, { name: "Sport", yearFrom: 2022 }, { name: "Titanium+", yearFrom: 2019 }] }, { name: "Territory", yearFrom: 2020, variants: [{ name: "Titanium", yearFrom: 2020 }, { name: "Sport", yearFrom: 2023 }] }] },
  { name: "Hyundai", models: [{ name: "Tucson", yearFrom: 2005, variants: [{ name: "GL", yearFrom: 2016 }, { name: "GLS", yearFrom: 2016 }] }, { name: "Stargazer", yearFrom: 2022, variants: [{ name: "GL", yearFrom: 2022 }, { name: "GLS", yearFrom: 2022 }, { name: "Premium", yearFrom: 2022 }] }, { name: "Santa Fe", yearFrom: 2001, variants: [{ name: "GL", yearFrom: 2019 }, { name: "GLS", yearFrom: 2019 }, { name: "Calligraphy", yearFrom: 2021 }] }] },
  { name: "Isuzu", models: [{ name: "D-Max", yearFrom: 2003, variants: [{ name: "LS", yearFrom: 2020 }, { name: "LS-A", yearFrom: 2020 }, { name: "LS-E", yearFrom: 2020 }] }, { name: "MU-X", yearFrom: 2014, variants: [{ name: "LS-A", yearFrom: 2021 }, { name: "LS-E", yearFrom: 2021 }, { name: "LS-E 4x4", yearFrom: 2021 }] }] },
  { name: "Mazda", models: [{ name: "Mazda2", yearFrom: 2008, variants: [{ name: "Sport", yearFrom: 2015 }, { name: "Signature", yearFrom: 2020 }] }, { name: "Mazda3", yearFrom: 2004, variants: [{ name: "Sport", yearFrom: 2019 }, { name: "Signature", yearFrom: 2019 }] }, { name: "CX-5", yearFrom: 2012, variants: [{ name: "Elite", yearFrom: 2017 }, { name: "Signature", yearFrom: 2019 }] }] },
  { name: "Suzuki", models: [{ name: "Swift", yearFrom: 2005, variants: [{ name: "GL", yearFrom: 2018 }, { name: "GL CVT", yearFrom: 2018 }] }, { name: "Ertiga", yearFrom: 2012, variants: [{ name: "GA", yearFrom: 2019 }, { name: "GL", yearFrom: 2019 }, { name: "Hybrid", yearFrom: 2022 }] }, { name: "Jimny", yearFrom: 1998, variants: [{ name: "GL", yearFrom: 2019 }, { name: "GLX", yearFrom: 2019 }] }] },
  { name: "Kia", models: [{ name: "Soluto", yearFrom: 2019, variants: [{ name: "LX", yearFrom: 2019 }, { name: "EX", yearFrom: 2019 }] }, { name: "Seltos", yearFrom: 2019, variants: [{ name: "LX", yearFrom: 2019 }, { name: "EX", yearFrom: 2019 }, { name: "SX", yearFrom: 2019 }] }, { name: "Stinger", yearFrom: 2018, variants: [{ name: "GT-Line", yearFrom: 2018 }, { name: "GT", yearFrom: 2018 }] }] },
]

export function isAvailableForYear(year: number, yearFrom: number, yearTo?: number) {
  return year >= yearFrom && (yearTo === undefined || year <= yearTo)
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function hasValidYear(year?: number) {
  return Number.isInteger(year) && year! >= 1990
}

export function getBrands(year?: number) {
  return vehicleCatalog.filter((brand) => !hasValidYear(year) || brand.models.some((model) => isAvailableForYear(year!, model.yearFrom, model.yearTo))).map((brand) => brand.name)
}

export function getModels(make: string, year?: number) {
  return vehicleCatalog.find((brand) => normalize(brand.name) === normalize(make))?.models.filter((model) => !hasValidYear(year) || isAvailableForYear(year!, model.yearFrom, model.yearTo)).map((model) => model.name) ?? []
}

export function getVariants(make: string, model: string, year?: number) {
  return vehicleCatalog.find((brand) => normalize(brand.name) === normalize(make))?.models.find((catalogModel) => normalize(catalogModel.name) === normalize(model))?.variants.filter((variant) => !hasValidYear(year) || isAvailableForYear(year!, variant.yearFrom, variant.yearTo)).map((variant) => variant.name) ?? []
}
