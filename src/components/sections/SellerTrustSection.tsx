"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const numberFormatter = new Intl.NumberFormat("en-PH")
const COUNTER_DURATION_MS = 1250

function TrackRecordIcon({ index }: { index: number }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.4,
    viewBox: "0 0 24 24",
  }

  if (index === 0) {
    return <svg {...commonProps}><rect height="16" rx="2.5" width="17" x="3.5" y="4.5" /><path d="M7.5 2.5v4M16.5 2.5v4M7.5 12l2.5 2.5 5-5" /></svg>
  }

  if (index === 1) {
    return <svg {...commonProps}><path d="M4 15.5V11l2.5-4h11l2.5 4v4.5M5.5 15.5h13M7.5 18.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM16.5 18.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z" /></svg>
  }

  if (index === 2) {
    return <svg {...commonProps}><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /><path d="M18 18h3M19.5 16.5v3" /></svg>
  }

  return <svg {...commonProps}><rect height="6" rx="1" width="6" x="4" y="4" /><rect height="6" rx="1" width="6" x="14" y="4" /><rect height="6" rx="1" width="6" x="4" y="14" /><rect height="6" rx="1" width="6" x="14" y="14" /></svg>
}

export default function SellerTrustSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const hasAnimatedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const [years, setYears] = useState(0)
  const [carsPurchased, setCarsPurchased] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const showFinalValues = () => {
      setYears(5)
      setCarsPurchased(1000)
      setIsRevealed(true)
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reducedMotionQuery.matches) {
      showFinalValues()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || hasAnimatedRef.current) return

        hasAnimatedRef.current = true
        observer.disconnect()
        setIsRevealed(true)
        const startTime = performance.now()

        const animateCounters = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / COUNTER_DURATION_MS, 1)
          const easedProgress = 1 - (1 - progress) ** 4
          setYears(Math.round(5 * easedProgress))
          setCarsPurchased(Math.round(1000 * easedProgress))

          if (progress < 1) {
            animationFrameRef.current = window.requestAnimationFrame(animateCounters)
            return
          }

          animationFrameRef.current = null
          showFinalValues()
        }

        animationFrameRef.current = window.requestAnimationFrame(animateCounters)
      },
      { threshold: 0.28 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const yearsSuffix = t.sellerTrust.items[0]?.value.replace(/^5\+\s*/, "") ?? ""

  return (
    <section ref={sectionRef} id="seller-trust" aria-labelledby="seller-trust-title" className="border-y border-[rgba(143,106,31,0.10)] bg-[#F4F2EC] py-14 sm:py-16 lg:py-16">
      <Container>
        <div className="mx-auto max-w-[77rem]">
          <header className="mx-auto max-w-[52rem] text-center">
            <SectionPill className="mb-4">{t.sellerTrust.pill}</SectionPill>
            <h2 id="seller-trust-title" className="text-3xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[2.4rem]">
              {t.sellerTrust.title}
            </h2>
            <p className="mx-auto mt-3 max-w-[38.75rem] text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-base">
              {t.sellerTrust.description}
            </p>
          </header>

          <div className={`mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6 ${isRevealed ? "seller-trust-grid--revealed" : ""}`}>
            {t.sellerTrust.items.map((item, index) => {
              const value = index === 0
                ? <>{years}+ {yearsSuffix}</>
                : index === 1
                  ? <>{numberFormatter.format(carsPurchased)}+</>
                  : item.value
              const valueClassName = index < 2
                ? "text-[2.3rem] sm:text-[2.5rem] lg:text-[2.65rem]"
                : index === 2
                  ? "text-[2rem] sm:text-[2.2rem] lg:text-[2.3rem]"
                  : "text-[1.65rem] leading-[1.05] sm:text-[1.75rem] lg:text-[1.8rem]"

              return (
                <article
                  key={item.title}
                  aria-label={`${item.value}. ${item.title}. ${item.description}`}
                  className="seller-trust-card relative flex min-h-[195px] flex-col overflow-hidden rounded-[1.5rem] border border-[rgba(143,106,31,0.13)] bg-white p-6 shadow-[0_14px_34px_rgba(31,31,31,0.065),0_3px_10px_rgba(143,106,31,0.04)]"
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <span className={`relative z-10 font-extrabold leading-none tracking-tight text-[#B88922] ${index < 2 ? "tabular-nums" : ""} ${valueClassName}`}>
                    {value}
                  </span>
                  <h3 className="relative z-10 mt-5 text-[17px] font-bold leading-tight text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="relative z-10 mt-2 max-w-[15rem] text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 size-[6.25rem] text-[#B88922] opacity-[0.09]">
                    <TrackRecordIcon index={index} />
                  </span>
                </article>
              )
            })}
          </div>
        </div>
      </Container>

      <style>{`
        .seller-trust-card {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms ease, box-shadow 220ms ease;
        }

        .seller-trust-grid--revealed .seller-trust-card {
          opacity: 1;
          transform: translateY(0);
        }

        @media (hover: hover) and (pointer: fine) {
          .seller-trust-card:hover {
            transform: translateY(-2px);
            border-color: rgba(143, 106, 31, 0.24);
            box-shadow: 0 18px 40px rgba(31, 31, 31, 0.085), 0 5px 14px rgba(143, 106, 31, 0.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .seller-trust-card {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}
