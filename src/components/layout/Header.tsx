"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Container from "../ui/Container"

export default function Header() {
  const pathname = usePathname()
  const [isCompact, setIsCompact] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
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

  const isSellMyCarActive = pathname === "/"

  const activeLinkClass = (isActive: boolean) =>
    `relative transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 after:pointer-events-none after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-full after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-[var(--primary)] after:opacity-0 after:transition-[transform,opacity] after:duration-[220ms] after:ease-out hover:after:scale-x-100 hover:after:opacity-100 motion-reduce:after:transition-none ${
      isActive
        ? "font-semibold text-[var(--primary)] hover:text-[var(--primary)] after:scale-x-100 after:opacity-100"
        : ""
    }`

  return (
    <header
      className={`sticky top-0 z-50 hidden transform-gpu bg-white transition-[transform,opacity,box-shadow] duration-[450ms] ease-out md:block ${
        isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      } ${isCompact ? "shadow-[0_3px_10px_rgba(25,25,112,0.12)]" : "shadow-none"}`}
    >
      <Container>
        <nav
          aria-label="Primary navigation"
          className={`grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300 ${
            isCompact ? "h-10" : "h-12"
          }`}
        >
          <Link
            href="/"
            className={`flex h-full items-center transition-[width] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 ${
              isCompact ? "w-[144px]" : "w-[168px]"
            }`}
          >
            <Image
              src="/images/brand/logo.png"
              alt="Mobee"
              width={168}
              height={48}
              className={`h-auto transition-[width] duration-300 ${
                isCompact ? "w-[144px]" : "w-[168px]"
              }`}
              priority
            />
          </Link>

          <ul
            className={`flex h-full items-center text-sm font-medium text-gray-700 transition-[gap] duration-300 ${
              isCompact ? "gap-8" : "gap-10"
            }`}
          >
            <li>
              <Link
                href="/"
                aria-current={isSellMyCarActive ? "page" : undefined}
                className={activeLinkClass(isSellMyCarActive)}
              >
                Sell My Car
              </Link>
            </li>
          </ul>

          <div
            className={`flex h-full items-center justify-self-end text-sm text-gray-700 transition-[gap,margin] duration-300 ${
              isCompact ? "mr-4 gap-2" : "mr-6 gap-3"
            }`}
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
