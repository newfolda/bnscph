const productionSiteUrl = "https://buyandsellcarsph.com"

export const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || productionSiteUrl
