"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"

const quickLinkHrefs = ["/", "/#how-it-works", "/#latest-transactions", "/#why-choose-us", "/#faq"]

const footerLinkClass =
  "group inline-flex items-center text-sm text-white/65 transition-[color,transform] duration-200 ease-out hover:translate-x-1 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"

const footerHeadingClass = "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]"

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.65 2.65a2 2 0 0 1-.45 2.11L8.04 9.75a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.86.31 1.75.53 2.65.65A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-8.15 5.18a3.5 3.5 0 0 1-3.7 0L2 7" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M20 10c0 5.25-8 11-8 11S4 15.25 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.25 2" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const quickLinks = [t.footer.home, t.footer.howItWorks, t.footer.latestTransactions, t.footer.whyChooseUs, t.footer.frequentlyAskedQuestions]

  return (
    <footer className="relative overflow-hidden border-t border-[var(--primary)]/65 bg-[#1F1F1F] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 left-1/2 hidden w-full -translate-x-1/2 select-none whitespace-nowrap text-center text-[7rem] font-bold leading-none tracking-[-0.08em] text-white/[0.02] xl:block">
        BUY AND SELL CARS PHILIPPINES
      </div>

      <Container className="relative z-10">
        <div className="py-14 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,0.8fr)] lg:gap-x-10 xl:gap-x-14">
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"
              >
                <Image src="/images/brand/logofooter.webp" alt="Buy and Sell Cars Philippines" width={180} height={52} className="h-auto w-[180px]" />
              </Link>
              <p className="mt-5 text-sm leading-relaxed text-white/65">
                {t.footer.description}
              </p>
            </div>

            <nav aria-label="Quick links">
              <h2 className={footerHeadingClass}>{t.footer.quickLinks}</h2>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((label, index) => (
                  <li key={quickLinkHrefs[index]}>
                    <Link href={quickLinkHrefs[index]} className={footerLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section aria-labelledby="footer-contact-heading">
              <h2 id="footer-contact-heading" className={footerHeadingClass}>{t.footer.contactUs}</h2>
              <div className="mt-5 space-y-4">
                <a
                  aria-label="Call or text Buy and Sell Cars Philippines at 0916-253-6325"
                  className="group flex items-start gap-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"
                  href="tel:09162536325"
                >
                  <PhoneIcon />
                  <span className="-mt-0.5 flex flex-col leading-tight">
                    <span className="text-white/85 transition-colors duration-200 group-hover:text-[var(--primary)]">0916-253-6325</span>
                    <span className="mt-1 text-xs text-white/50">{t.footer.callOrText}</span>
                  </span>
                </a>
                <a
                  aria-label="Email Buy and Sell Cars Philippines at buyandsellcarph@gmail.com"
                  className="group flex items-start gap-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1F1F]"
                  href="mailto:buyandsellcarph@gmail.com"
                >
                  <MailIcon />
                  <span className="-mt-0.5 flex flex-col leading-tight">
                    <span className="break-all text-white/85 transition-colors duration-200 group-hover:text-[var(--primary)]">buyandsellcarph@gmail.com</span>
                    <span className="mt-1 text-xs text-white/50">{t.footer.emailUs}</span>
                  </span>
                </a>
                <div className="flex items-start gap-3 text-sm">
                  <LocationIcon />
                  <span className="-mt-0.5 flex flex-col leading-tight">
                    <span className="text-white/85">San Juan City, Philippines 1116</span>
                    <span className="mt-1 text-xs text-white/50">{t.footer.ourLocation}</span>
                  </span>
                </div>
              </div>
            </section>

            <section aria-labelledby="footer-hours-heading">
              <h2 id="footer-hours-heading" className={footerHeadingClass}>{t.footer.businessHours}</h2>
              <div className="mt-5 flex items-start gap-3 text-sm leading-tight">
                <ClockIcon />
                <span className="-mt-0.5 flex flex-col">
                  <span className="text-white/65">{t.footer.mondaySaturday}</span>
                  <span className="mt-1 font-medium text-white/90">9:00 AM – 10:00 PM</span>
                </span>
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
