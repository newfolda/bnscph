"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type GoogleAnalyticsPageViewProps = {
  measurementId: string
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function GoogleAnalyticsPageView({ measurementId }: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialPageView = useRef(true)

  useEffect(() => {
    if (isInitialPageView.current) {
      isInitialPageView.current = false
      return
    }

    if (typeof window.gtag !== "function") return

    const queryString = searchParams.toString()
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname

    window.gtag("config", measurementId, { page_path: pagePath })
  }, [measurementId, pathname, searchParams])

  return null
}
