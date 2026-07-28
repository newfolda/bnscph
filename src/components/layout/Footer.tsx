"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "../language/LanguageProvider"

const quickLinkHrefs = ["/", "/#how-it-works", "/#latest-transactions", "/#why-choose-us", "/#faq"]

const footerLinkClass =
  "group inline-flex items-center text-base text-white/90 transition-[color,transform] duration-200 ease-out hover:translate-x-1 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#383838] lg:text-sm"

const footerHeadingClass = "text-sm font-bold uppercase tracking-[0.16em] text-[var(--primary)] lg:text-xs lg:font-semibold"

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.65 2.65a2 2 0 0 1-.45 2.11L8.04 9.75a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.86.31 1.75.53 2.65.65A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-8.15 5.18a3.5 3.5 0 0 1-3.7 0L2 7" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 10c0 5.25-8 11-8 11S4 15.25 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" fill="#383838" r="2.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.25 2" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const quickLinks = [t.footer.home, t.footer.howItWorks, t.footer.latestTransactions, t.footer.whyChooseUs, t.footer.frequentlyAskedQuestions]

  return (
    <footer className="relative overflow-hidden border-t border-[var(--primary)]/65 bg-[#383838] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 left-1/2 hidden w-full -translate-x-1/2 select-none whitespace-nowrap text-center text-[7rem] font-bold leading-none tracking-[-0.08em] text-white/[0.02] xl:block">
        BUY AND SELL CARS PHILIPPINES
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
        <div className="py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-[minmax(15rem,1.35fr)_minmax(9rem,0.75fr)_minmax(14rem,1.1fr)_minmax(11rem,0.85fr)_minmax(20rem,1.55fr)] xl:gap-x-12 2xl:gap-x-16">
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#383838]"
              >
                <Image src="/images/brand/logofooter.webp" alt="Buy and Sell Cars Philippines" width={360} height={104} className="h-auto w-[360px] max-w-full object-contain" />
              </Link>
              <p className="mt-5 text-sm leading-relaxed text-white/90">
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
                  className="group flex items-start gap-3 text-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#383838] lg:text-sm lg:font-normal"
                  href="tel:09162536325"
                >
                  <PhoneIcon />
                  <span className="-mt-0.5 flex flex-col leading-tight">
                    <span className="whitespace-nowrap text-white transition-colors duration-200 group-hover:text-[var(--primary)]">0916-253-6325</span>
                    <span className="mt-1 text-sm text-white/70 lg:text-xs">{t.footer.callOrText}</span>
                  </span>
                </a>
                <a
                  aria-label="Email Buy and Sell Cars Philippines at buyandsellcarph@gmail.com"
                  className="group flex items-start gap-3 text-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#383838] lg:text-sm lg:font-normal"
                  href="mailto:buyandsellcarph@gmail.com"
                >
                  <MailIcon />
                  <span className="-mt-0.5 flex flex-col leading-tight">
                    <span className="break-words text-white transition-colors duration-200 group-hover:text-[var(--primary)]">buyandsellcarph@gmail.com</span>
                    <span className="mt-1 text-sm text-white/70 lg:text-xs">{t.footer.emailUs}</span>
                  </span>
                </a>
                <div className="flex items-start gap-3 text-lg font-medium lg:text-sm lg:font-normal">
                  <LocationIcon />
                  <span className="-mt-0.5 flex flex-col leading-tight">
                    <span className="text-white">San Juan City, Philippines 1116</span>
                    <span className="mt-1 text-sm text-white/70 lg:text-xs">{t.footer.ourLocation}</span>
                  </span>
                </div>
              </div>
            </section>

            <section aria-labelledby="footer-hours-heading">
              <h2 id="footer-hours-heading" className={footerHeadingClass}>{t.footer.businessHours}</h2>
              <div className="mt-5 flex items-start gap-3 text-sm leading-tight">
                <ClockIcon />
                <span className="-mt-0.5 flex flex-col">
                  <span className="text-sm text-white/70 lg:text-sm">{t.footer.mondaySaturday}</span>
                  <span className="mt-1 whitespace-nowrap text-lg font-semibold text-white lg:text-sm lg:font-medium">9:00 AM – 10:00 PM</span>
                </span>
              </div>
            </section>

            <section aria-labelledby="footer-newsletter-heading" className="md:col-span-2 xl:col-auto">
              <h2 id="footer-newsletter-heading" className={footerHeadingClass}>Subscribe to Our Newsletter</h2>
              <p className="mt-3 max-w-[19rem] text-base leading-relaxed text-white/80 lg:text-sm">
                Get the latest offers, new transactions and updates.
              </p>
              {/* TODO: Connect this form to the newsletter subscription service. */}
              <form className="mt-4 flex flex-col gap-2 xl:flex-row xl:gap-0" onSubmit={(event) => event.preventDefault()}>
                <label className="sr-only" htmlFor="footer-newsletter-email">Email address</label>
                <input
                  id="footer-newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  required
                  className="h-[62px] min-w-0 w-full flex-1 rounded-xl border border-white/15 bg-white px-6 text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/35 lg:h-[52px] lg:px-4 lg:text-sm xl:rounded-r-none"
                />
                <button
                  type="submit"
                  className="h-[62px] w-full cursor-pointer rounded-xl bg-[var(--primary)] px-5 text-base font-bold text-[var(--text-primary)] transition-[filter,transform] duration-200 ease-out hover:brightness-[1.06] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#383838] lg:h-[52px] lg:text-[15px] lg:font-semibold xl:w-[116px] xl:rounded-l-none motion-reduce:transition-none"
                >
                  Submit
                </button>
              </form>
            </section>
          </div>

          <div className="mt-12 border-t border-white/15 pt-6 text-sm text-white/70">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
