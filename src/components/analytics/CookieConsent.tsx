"use client"

import { Suspense, useEffect, useState } from "react"
import Script from "next/script"
import GoogleAnalyticsPageView from "./GoogleAnalyticsPageView"
import MicrosoftClarity from "./MicrosoftClarity"

const storageKey = "bnscph-cookie-consent-v1"
const measurementId = "G-VRFLFRZQL6"
type Consent = "accepted" | "rejected" | null

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey)
        if (saved === "accepted" || saved === "rejected") setConsent(saved)
      } catch { /* localStorage may be unavailable. */ }
      setReady(true)
    }, 0)
    const openSettings = () => setIsSettingsOpen(true)
    window.addEventListener("open-cookie-settings", openSettings)
    return () => { window.clearTimeout(initialize); window.removeEventListener("open-cookie-settings", openSettings) }
  }, [])

  const saveConsent = (nextConsent: Exclude<Consent, null>) => {
    setConsent(nextConsent)
    setIsSettingsOpen(false)
    try { window.localStorage.setItem(storageKey, nextConsent) } catch { /* Preference remains session-only. */ }
  }

  if (!ready) return null
  const showBanner = consent === null || isSettingsOpen

  return <>
    {consent === "accepted" && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}</Script>
      <Suspense fallback={null}><GoogleAnalyticsPageView measurementId={measurementId} /></Suspense>
      <MicrosoftClarity />
    </>}
    {showBanner && <section role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className="fixed inset-x-4 bottom-4 z-[1100] mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:bottom-6 sm:p-6">
      <h2 id="cookie-settings-title" className="text-lg font-bold text-[var(--text-primary)]">Cookie settings</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Essential technologies help the site work. Analytics are optional and help us understand aggregate website use; no valuation or contact details are included in analytics.</p>
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => saveConsent("rejected")} className="h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">Reject non-essential</button><button type="button" onClick={() => saveConsent("accepted")} className="h-11 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Accept analytics</button></div>
    </section>}
  </>
}
