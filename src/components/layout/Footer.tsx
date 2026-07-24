import Image from "next/image"
import Link from "next/link"
import Container from "../ui/Container"

const quickLinks = [
  { label: "Sell My Car", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Latest Transactions", href: "/#latest-transactions" },
  { label: "Frequently Asked Questions", href: "/#faq" },
]

const footerLinkClass =
  "group inline-flex items-center text-sm text-white/65 transition-[color,transform] duration-200 ease-out hover:translate-x-1 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1F1F1F] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-[linear-gradient(to_bottom,#fffefd_0%,rgba(255,254,253,0.94)_12%,rgba(245,243,238,0.72)_32%,rgba(185,182,175,0.34)_55%,rgba(45,45,43,0.82)_82%,#1F1F1F_100%)] md:h-32"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(200,160,68,0.15),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 left-1/2 hidden w-full -translate-x-1/2 select-none whitespace-nowrap text-center text-[7rem] font-bold leading-none tracking-[-0.08em] text-white/[0.025] xl:block">
        BUY AND SELL CARS PHILIPPINES
      </div>

      <Container className="relative z-10">
        <div className="pb-14 pt-32 md:pb-16 md:pt-40">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12">
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"
              >
                <Image src="/images/brand/logo.png" alt="Buy and Sell Cars Philippines" width={180} height={52} className="h-auto w-[180px]" />
              </Link>
              <p className="mt-5 text-sm leading-relaxed text-white/65">
                We make selling your car simple, convenient, and secure with fair offers, free doorstep inspection, and same-day payment.
              </p>
            </div>

            <nav aria-label="Quick links">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Quick Links</h2>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={footerLinkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
            <p>© 2026 Buy and Sell Cars Philippines. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
