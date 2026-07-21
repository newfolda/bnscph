import type { Metadata } from "next"
import "./globals.css"

// TODO: Set NEXT_PUBLIC_SITE_URL to the canonical production domain before deployment.
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com")

export const metadata: Metadata = {
  metadataBase: siteUrl,
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
