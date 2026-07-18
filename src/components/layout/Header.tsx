"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Container from "../ui/Container"

const learnLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Team", href: "/team" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
]

export default function Header() {
  const pathname = usePathname()
  const [isCompact, setIsCompact] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [activeHomeSectionIndex, setActiveHomeSectionIndex] = useState(0)
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
        setIsHidden(scrollDifference > 0)
        previousScrollY.current = currentScrollY
      }
    }

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })

    return () => window.removeEventListener("scroll", updateHeader)
  }, [])

  useEffect(() => {
    if (pathname !== "/") {
      return
    }

    const sections = Array.from(document.querySelectorAll("section"))

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting)

        if (activeEntry) {
          setActiveHomeSectionIndex(sections.indexOf(activeEntry.target as HTMLElement))
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [pathname])

  const isSellMyCarActive = pathname === "/" && activeHomeSectionIndex === 0
  const isLearnActive = pathname === "/" ? activeHomeSectionIndex > 0 : learnLinks.some((link) => link.href === pathname)

  const activeLinkClass = (isActive: boolean) =>
    `transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 ${isActive ? "font-semibold text-[var(--primary)]" : ""}`

  return (
    <header
      className={`sticky top-0 z-50 hidden transform-gpu bg-white transition-[transform,opacity,box-shadow] duration-[450ms] ease-out md:block ${isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"} ${isCompact ? "shadow-[0_3px_10px_rgba(25,25,112,0.12)]" : "shadow-none"}`}
    >
      <Container>
        <nav
          aria-label="Primary navigation"
          className={`grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300 ${isCompact ? "h-10" : "h-12"}`}
        >
          <Link
            href="/"
            className={`flex h-full items-center transition-[width] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 ${isCompact ? "w-[120px]" : "w-[140px]"}`}
          >
            <Image
              src="/images/brand/logo.png"
              alt="Mobee"
              width={140}
              height={40}
              className={`h-auto transition-[width] duration-300 ${isCompact ? "w-[120px]" : "w-[140px]"}`}
              priority
            />
          </Link>

          <ul className={`flex h-full items-center text-sm font-normal text-gray-700 transition-[gap] duration-300 ${isCompact ? "gap-8" : "gap-10"}`}>
            <li>
              <Link
                href="/"
                aria-current={isSellMyCarActive ? "page" : undefined}
                className={activeLinkClass(isSellMyCarActive)}
              >
                Sell My Car
              </Link>
            </li>
            <li>
              <details className="group relative">
                <summary className={`flex cursor-pointer list-none items-center gap-2 ${activeLinkClass(isLearnActive)}`}>
                  Learn
                  <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <ul className="absolute left-0 top-full z-50 w-40 rounded-lg bg-white p-2 shadow">
                  {learnLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className={`block rounded-md px-3 py-2 hover:bg-[var(--background)] ${activeLinkClass(pathname === link.href)}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>

          <div
            className={`flex h-full items-center justify-self-end text-sm text-gray-700 transition-[gap,margin] duration-300 ${isCompact ? "mr-4 gap-2" : "mr-6 gap-3"}`}
            aria-label="Language selector"
          >
            <Link
              href="/"
              aria-current="page"
              className="font-semibold text-[var(--primary)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            >
              EN
            </Link>
            <Link
              href="/?locale=tgl"
              className="transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            >
              TGL
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  )
}
