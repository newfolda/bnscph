"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

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
  const isInitialPageView = useRef(true)

  useEffect(() => {
    if (isInitialPageView.current) {
      isInitialPageView.current = false
      return
    }

    if (typeof window.gtag !== "function") return

    window.gtag("config", measurementId, { page_path: pathname })
  }, [measurementId, pathname])

  return null
}
