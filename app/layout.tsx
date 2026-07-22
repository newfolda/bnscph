import type { Metadata } from "next"
import { Suspense } from "react"
import Script from "next/script"
import GoogleAnalyticsPageView from "@/src/components/analytics/GoogleAnalyticsPageView"
import MicrosoftClarity from "@/src/components/analytics/MicrosoftClarity"
import { getSiteUrl } from "@/src/lib/siteUrl"
import "./globals.css"

const siteUrl = new URL(getSiteUrl())
const googleAnalyticsMeasurementId = "G-VRFLFRZQL6"

export const metadata: Metadata = {
  metadataBase: siteUrl,
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Buy & Sell Cars Philippines",
    template: "%s | Buy & Sell Cars Philippines",
  },
  description: "Sell your car quickly, safely, and for the best possible price anywhere in the Philippines.",
  applicationName: "Buy & Sell Cars Philippines",
  keywords: [
    "sell my car Philippines",
    "sell used car Philippines",
    "car valuation Philippines",
    "doorstep car inspection",
    "Buy & Sell Cars Philippines",
  ],
  authors: [{ name: "Buy & Sell Cars Philippines" }],
  creator: "Buy & Sell Cars Philippines",
  publisher: "Buy & Sell Cars Philippines",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: "Automotive",
  openGraph: {
    url: "/",
    title: "Buy & Sell Cars Philippines",
    description: "Sell your car quickly, safely, and for the best possible price anywhere in the Philippines.",
    siteName: "Buy & Sell Cars Philippines",
    locale: "en_PH",
    type: "website",
    // TODO: Add a production Open Graph image when an approved asset is available.
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy & Sell Cars Philippines",
    description: "Sell your car quickly, safely, and for the best possible price anywhere in the Philippines.",
    // TODO: Add a production Twitter image when an approved asset is available.
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <MicrosoftClarity />
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsMeasurementId}');
              `}
            </Script>
            <Suspense fallback={null}>
              <GoogleAnalyticsPageView measurementId={googleAnalyticsMeasurementId} />
            </Suspense>
          </>
        )}
      </body>
    </html>
  )
}
