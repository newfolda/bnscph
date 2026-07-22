import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/src/lib/siteUrl"

const siteUrl = getSiteUrl()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
