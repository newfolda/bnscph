"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Container from "../ui/Container"

const navigationItems = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "How It Works", href: "#how-it-works", sectionId: "how-it-works" },
  { label: "Transactions", href: "#latest-transactions", sectionId: "latest-transactions" },
  { label: "Why Choose Us", href: "#why-choose-us", sectionId: "why-choose-us" },
  { label: "FAQ", href: "#faq", sectionId: "faq" },
]

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h2.018c.967 0 1.805.657 2.034 1.595l.665 2.724a2.25 2.25 0 0 1-.821 2.329l-1.156.867a13.517 13.517 0 0 0 7.005 7.005l.867-1.156a2.25 2.25 0 0 1 2.329-.821l2.724.665a2.25 2.25 0 0 1 1.595 2.034V19.5a2.25 2.25 0 0 1-2.25 2.25h-1.5C8.76 21.75 2.25 15.24 2.25 7.5V4.5Z"
      />
    </svg>
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
        compact ? "gap-2.5" : "gap-3"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--primary)]/70 text-[var(--primary)] transition-colors group-hover:border-[var(--primary)]">
        <PhoneIcon />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="inline-block text-sm font-semibold text-[var(--text-primary)] transition-[color,transform] duration-200 ease-out group-hover:-translate-y-px group-hover:text-[var(--primary)] motion-reduce:transform-none">
          0916-253-6325
        </span>
        <span className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
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
        className="inline-block text-[var(--primary)] transition-[color,transform] duration-200 ease-out hover:-translate-y-px hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 motion-reduce:transform-none"
      >
        EN
      </Link>
      <span aria-hidden="true" className="text-gray-300">|</span>
      <Link
        href="/?locale=tgl"
        className="inline-block transition-[color,transform] duration-200 ease-out hover:-translate-y-px hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 motion-reduce:transform-none"
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
    `inline-block whitespace-nowrap text-gray-700 transition-[color,transform] duration-200 ease-out hover:-translate-y-px hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 motion-reduce:transform-none ${
      isActive ? "text-[var(--primary)]" : ""
    }`

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)
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
              onClick={() => handleNavigation("home")}
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
                    onClick={() => handleNavigation(item.sectionId)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={`hidden h-full items-center justify-self-end lg:flex ${
              isCompact ? "gap-4" : "gap-5"
            }`}>
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
                    onClick={() => handleNavigation(item.sectionId)}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-[color,transform] duration-200 ease-out hover:-translate-y-px hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset motion-reduce:transform-none ${
                      activeSection === item.sectionId
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border)] py-4">
                <PhoneContact compact />
                <LanguageSelector />
              </div>
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
