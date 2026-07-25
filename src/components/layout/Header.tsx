"use client"

import Image from "next/image"
import Link from "next/link"
import { type MouseEvent, useEffect, useRef, useState } from "react"
import Container from "../ui/Container"

const navigationItems = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "How It Works", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Transactions", href: "/#latest-transactions", sectionId: "latest-transactions" },
  { label: "Why Choose Us", href: "/#why-choose-us", sectionId: "why-choose-us" },
  { label: "FAQ", href: "/#faq", sectionId: "faq" },
]

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-[var(--primary)]"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M2.25 3.75A2.25 2.25 0 0 1 4.5 1.5h2.018c.967 0 1.805.657 2.034 1.595l.665 2.724a2.25 2.25 0 0 1-.821 2.329l-1.156.867a13.517 13.517 0 0 0 7.005 7.005l.867-1.156a2.25 2.25 0 0 1 2.329-.821l2.724.665A2.25 2.25 0 0 1 22.5 17.482V19.5a2.25 2.25 0 0 1-2.25 2.25h-1.5C9.492 21.75 2.25 14.508 2.25 5.25V3.75Z" />
    </svg>
  )
}

function HeaderSocialLinks({ mobile = false }: { mobile?: boolean }) {
  const iconLinkClass = `inline-flex items-center justify-center text-gray-600 transition-[color,transform] duration-200 ease-out hover:-translate-y-px hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 motion-reduce:hover:translate-y-0 ${
    mobile ? "size-9" : "size-6"
  }`

  return (
    <div className={`flex items-center gap-3 ${mobile ? "gap-2" : ""}`} aria-label="Contact and social links">
      <a
        aria-label="Email Buy and Sell Cars Philippines"
        className={iconLinkClass}
        href="mailto:buyandsellcarph@gmail.com"
      >
        <svg aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-8.15 5.18a3.5 3.5 0 0 1-3.7 0L2 7" />
        </svg>
      </a>
      <a
        aria-label="Visit Buy and Sell Cars Philippines on Facebook"
        className={iconLinkClass}
        href="https://www.facebook.com/buyandsellcarsph2021"
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg aria-hidden="true" className="size-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.49-1.46H16.6V3.95c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.06V10H7.65v3h2.65v8h3.2Z" />
        </svg>
      </a>
      <a
        aria-label="Visit Buy and Sell Cars Philippines on Instagram"
        className={iconLinkClass}
        href="https://www.instagram.com/buyandsellcarph"
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect height="17" rx="4.5" width="17" x="3.5" y="3.5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.3" cy="6.8" fill="currentColor" r="1" stroke="none" />
        </svg>
      </a>
    </div>
  )
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {isOpen ? (
        <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  )
}

function PhoneContact({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="tel:09162536325"
      className={`group flex items-center rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 ${
        compact ? "gap-2" : "gap-2.5"
      }`}
    >
      <PhoneIcon />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold leading-none text-[var(--text-primary)]">
          0916-253-6325
        </span>
        <span className="mt-px text-[11px] leading-none text-[var(--text-secondary)]">
          Call or Text Us
        </span>
      </span>
    </a>
  )
}

function LanguageSelector() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700" aria-label="Language selector">
      <Link
        href="/"
        aria-current="page"
        className="inline-block text-[var(--primary)] transition-colors duration-200 ease-out hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
      >
        EN
      </Link>
      <span aria-hidden="true" className="text-gray-300">|</span>
      <Link
        href="/?locale=tgl"
        className="inline-block transition-colors duration-200 ease-out hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
      >
        TGL
      </Link>
    </div>
  )
}

export default function Header() {
  const [isCompact, setIsCompact] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const previousScrollY = useRef(0)

  useEffect(() => {
    const updateHeader = () => {
      const currentScrollY = window.scrollY
      const scrollDifference = currentScrollY - previousScrollY.current
      const wasAtTop = previousScrollY.current <= 40

      setIsCompact(currentScrollY > 40)

      if (currentScrollY <= 40 || wasAtTop) {
        setIsHidden(false)
        previousScrollY.current = currentScrollY
      } else if (Math.abs(scrollDifference) >= 4) {
        setIsHidden(scrollDifference > 0 && !isMobileMenuOpen)
        previousScrollY.current = currentScrollY
      }
    }

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })

    return () => window.removeEventListener("scroll", updateHeader)
  }, [isMobileMenuOpen])

  useEffect(() => {
    const sectionIds = navigationItems
      .map((item) => item.sectionId)
      .filter((sectionId) => sectionId !== "home")

    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      { rootMargin: "-35% 0px -55%", threshold: [0, 0.1, 0.3] },
    )

    const setHomeWhenAtTop = () => {
      if (window.scrollY <= 80) setActiveSection("home")
    }

    sections.forEach((section) => observer.observe(section))
    setHomeWhenAtTop()
    window.addEventListener("scroll", setHomeWhenAtTop, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", setHomeWhenAtTop)
    }
  }, [])

  const activeLinkClass = (isActive: boolean) =>
    `navbar-nav-link relative whitespace-nowrap text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 ${
      isActive ? "navbar-nav-link--active text-[var(--primary)]" : ""
    }`

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)

    if (sectionId === "home") {
      window.history.replaceState(null, "", "/")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    window.history.replaceState(null, "", `/#${sectionId}`)
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <header
      className={`sticky top-0 z-50 transform-gpu border-b border-black/5 bg-white/95 backdrop-blur-sm transition-[transform,opacity,box-shadow] duration-[450ms] ease-out ${
        isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      } ${isCompact ? "shadow-[0_4px_16px_rgba(31,31,31,0.08)]" : "shadow-none"}`}
    >
      <Container>
        <nav aria-label="Primary navigation">
          <div
            className={`flex items-center justify-between transition-[height] duration-300 lg:grid lg:grid-cols-[auto_1fr_auto] ${
              isCompact ? "h-12" : "h-16"
            }`}
          >
            <Link
              href="/"
              onClick={(event) => handleNavigation(event, "home")}
              className={`flex h-full items-center transition-[width] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 ${
                isCompact ? "w-[155px]" : "w-[190px]"
              }`}
            >
              <Image
                src="/images/brand/logo.png"
                alt="Mobee"
                width={190}
                height={54}
                className={`h-auto transition-[width] duration-300 ${
                  isCompact ? "w-[155px]" : "w-[190px]"
                }`}
                priority
              />
            </Link>

            <ul className={`hidden h-full items-center justify-self-center text-sm font-medium text-gray-700 transition-[gap] duration-300 lg:flex ${
              isCompact ? "gap-5" : "gap-7"
            }`}>
              {navigationItems.map((item) => (
                <li key={item.sectionId}>
                  <Link
                    href={item.href}
                    aria-current={activeSection === item.sectionId ? "page" : undefined}
                    className={activeLinkClass(activeSection === item.sectionId)}
                    onClick={(event) => handleNavigation(event, item.sectionId)}
                    data-label={item.label}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={`hidden h-full items-center justify-self-end lg:flex ${
              isCompact ? "gap-4" : "gap-5"
            }`}>
              <HeaderSocialLinks />
              <PhoneContact />
              <LanguageSelector />
            </div>

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-primary-navigation"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 lg:hidden"
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>

          <div
            id="mobile-primary-navigation"
            className={`overflow-hidden border-t border-[var(--border)] transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
              isMobileMenuOpen ? "grid grid-rows-[1fr] opacity-100" : "grid grid-rows-[0fr] border-t-transparent opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="space-y-1 py-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.sectionId}
                    href={item.href}
                    aria-current={activeSection === item.sectionId ? "page" : undefined}
                    onClick={(event) => handleNavigation(event, item.sectionId)}
                    className={`${activeLinkClass(activeSection === item.sectionId)} block rounded-xl px-3 py-2.5 text-sm font-semibold focus-visible:ring-inset`}
                    data-label={item.label}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-[var(--border)] pt-4">
                <HeaderSocialLinks mobile />
              </div>
              <div className="flex items-center justify-between py-4">
                <PhoneContact compact />
                <LanguageSelector />
              </div>
            </div>
          </div>
        </nav>
      </Container>
      <style>{`
        .navbar-nav-link {
          font-weight: 600;
        }

        .navbar-nav-link::after {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          color: transparent;
          content: attr(data-label);
          font: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          text-align: inherit;
          white-space: inherit;
          opacity: 0;
          background: linear-gradient(
            105deg,
            transparent 0%,
            transparent 38%,
            rgba(255, 255, 255, 0.15) 44%,
            rgba(255, 255, 255, 0.98) 50%,
            rgba(255, 255, 255, 0.32) 56%,
            transparent 62%,
            transparent 100%
          );
          background-repeat: no-repeat;
          background-position: 110% 0;
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-nav-link:hover::after {
          animation: navbar-text-light-streak 1600ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
        }

        @keyframes navbar-text-light-streak {
          0% { background-position: 110% 0; opacity: 0; }
          14% { opacity: 1; }
          86% { opacity: 1; }
          100% { background-position: -10% 0; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar-nav-link::after,
          .navbar-nav-link:hover::after {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </header>
  )
}
