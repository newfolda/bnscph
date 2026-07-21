import type { MetadataRoute } from "next"

// TODO: Set NEXT_PUBLIC_SITE_URL to the canonical production domain before deployment.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
