import Image from "next/image"
import Link from "next/link"
import Container from "../ui/Container"

const quickLinks = [
  { label: "Sell My Car", href: "/" },
  { label: "How It Works" },
  { label: "Latest Transactions" },
  { label: "Frequently Asked Questions" },
]

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy" },
  { label: "Terms and Conditions" },
]

const footerLinkClass =
  "group inline-flex items-center text-sm text-white/65 transition-[color,transform] duration-200 ease-out hover:translate-x-1 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--primary)]/65 bg-[#1F1F1F] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(200,160,68,0.15),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 left-1/2 hidden w-full -translate-x-1/2 select-none whitespace-nowrap text-center text-[7rem] font-bold leading-none tracking-[-0.08em] text-white/[0.025] xl:block">
        BUY AND SELL CARS PHILIPPINES
      </div>

      <Container className="relative z-10">
        <div className="py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr] xl:gap-12">
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
                    {link.href ? (
                      <Link href={link.href} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-white/50">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company links">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Company</h2>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link href={link.href} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-white/50">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Contact</h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">Questions about selling your car?</p>
              <Link href="/contact" className={`mt-4 font-medium ${footerLinkClass}`}>
                Contact Us
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">Our team is ready to guide you through the process.</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Buy and Sell Cars Philippines. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span>Privacy Policy</span>
              <span>Terms and Conditions</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
