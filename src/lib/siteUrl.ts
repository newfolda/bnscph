const productionSiteUrl = "https://buyandsellcarsph.com"
const localhostHostnames = new Set(["localhost", "127.0.0.1", "::1", "[::1]"])

export const getSiteUrl = () => {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (!configuredSiteUrl) return productionSiteUrl

  try {
    const url = new URL(configuredSiteUrl)
    const isHttpUrl = url.protocol === "http:" || url.protocol === "https:"
    const isLocalhost = localhostHostnames.has(url.hostname.toLowerCase())

    if (!isHttpUrl || (process.env.NODE_ENV === "production" && isLocalhost)) {
      return productionSiteUrl
    }

    return url.toString().replace(/\/+$/, "")
  } catch {
    return productionSiteUrl
  }
}
