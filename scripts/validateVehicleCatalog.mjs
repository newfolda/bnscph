import { readFile } from "node:fs/promises"

const catalogUrl = new URL("../src/data/philippines-car-models-variants-2010-2026.json", import.meta.url)
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"))
const warnings = []
const fallbackPattern = /^(?:other|other\s*\/\s*not listed|not sure)$/i
const markerPattern = /(?:\[NEW\]|NEW!?|UPDATED?)\s*$/i

if (!catalog || typeof catalog !== "object" || !catalog.metadata || !catalog.years || typeof catalog.years !== "object") {
  throw new Error("Vehicle catalog is structurally invalid.")
}

for (const [year, makes] of Object.entries(catalog.years)) {
  if (!/^\d{4}$/.test(year) || !makes || typeof makes !== "object" || Array.isArray(makes)) {
    throw new Error(`Invalid vehicle catalog year entry: ${year}`)
  }

  const seenMakes = new Set()
  for (const [make, models] of Object.entries(makes)) {
    const makeKey = make.trim().toLowerCase()
    if (!make.trim()) warnings.push(`${year}: empty make`)
    if (seenMakes.has(makeKey)) warnings.push(`${year}: duplicate make "${make}"`)
    seenMakes.add(makeKey)
    if (!Array.isArray(models)) throw new Error(`${year} ${make}: models must be an array`)

    const seenModels = new Set()
    for (const model of models) {
      if (!model || typeof model !== "object" || typeof model.model !== "string") {
        throw new Error(`${year} ${make}: model entry is structurally invalid`)
      }
      if (!Array.isArray(model.variants)) throw new Error(`${year} ${make} ${model.model}: variants must be an array`)
      if (!model.model.trim()) warnings.push(`${year} ${make}: empty model`)
      const modelKey = model.model.trim().toLowerCase()
      if (seenModels.has(modelKey)) warnings.push(`${year} ${make}: duplicate model "${model.model}"`)
      seenModels.add(modelKey)

      const seenVariants = new Set()
      for (const variant of model.variants) {
        if (typeof variant !== "string") throw new Error(`${year} ${make} ${model.model}: non-string variant`)
        const variantKey = variant.trim().toLowerCase()
        if (!variant.trim()) warnings.push(`${year} ${make} ${model.model}: empty variant`)
        if (seenVariants.has(variantKey)) warnings.push(`${year} ${make} ${model.model}: duplicate variant "${variant}"`)
        if (fallbackPattern.test(variant.trim())) warnings.push(`${year} ${make} ${model.model}: embedded fallback "${variant}"`)
        if (markerPattern.test(variant.trim())) warnings.push(`${year} ${make} ${model.model}: status marker "${variant}"`)
        if ((variant.match(/\(/g) ?? []).length !== (variant.match(/\)/g) ?? []).length) warnings.push(`${year} ${make} ${model.model}: unmatched parentheses "${variant}"`)
        seenVariants.add(variantKey)
      }
    }
  }
}

console.log(`Vehicle catalog structure is valid (${Object.keys(catalog.years).length} years).`)
if (warnings.length) {
  console.warn(`${warnings.length} catalog quality warning(s):`)
  for (const warning of warnings.slice(0, 100)) console.warn(`- ${warning}`)
  if (warnings.length > 100) console.warn(`- …and ${warnings.length - 100} more`)
} else {
  console.log("No catalog quality warnings found.")
}
