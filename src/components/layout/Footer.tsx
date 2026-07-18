import Image from "next/image"
import Link from "next/link"
import Container from "../ui/Container"

const quickLinks = [
  { label: "Sell My Car", href: "/" },
  { label: "How It Works", href: "#process" },
  { label: "Frequently Asked Questions", href: "#faq" },
]

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Reviews", href: "/reviews" },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <Container>
        <div className="py-14">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
            <div>
              <Link href="/" className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                <Image src="/images/brand/logo.png" alt="Mobee" width={140} height={40} className="h-auto w-[140px]" />
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
                Mobee Cars is an automotive technology platform built to bring transparency, structure, and trust to used car transactions across Southeast Asia.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--secondary)]">Quick Links</h2>
              <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--secondary)]">Company</h2>
              <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--secondary)]">Contact</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">Questions about selling your car?</p>
              <Link
                href="/contact"
                className="mt-3 inline-block text-sm font-medium text-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-14 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
            © 2026 Mobee Cars
          </div>
        </div>
      </Container>
    </footer>
  )
}
