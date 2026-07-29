"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const numberFormatter = new Intl.NumberFormat("en-PH")
const COUNTER_DURATION_MS = 1250
const trackRecordImages = [
  "/images/track-record/experience-years.png",
  "/images/track-record/cars-purchased.png",
  "/images/track-record/models-accepted.png",
  "/images/track-record/safe-hassle-free.png",
]

export default function SellerTrustSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const hasAnimatedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const [metricValues, setMetricValues] = useState({
    years: 0,
    cars: 0,
    minimumYear: 0,
    safetyPercentage: 0,
  })
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const showFinalValues = () => {
      setMetricValues({ years: 5, cars: 1000, minimumYear: 2010, safetyPercentage: 100 })
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
          setMetricValues({
            years: Math.round(5 * easedProgress),
            cars: Math.round(1000 * easedProgress),
            minimumYear: Math.round(2010 * easedProgress),
            safetyPercentage: Math.round(100 * easedProgress),
          })

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
  const minimumYearSuffix = t.sellerTrust.items[2]?.value.replace(/^2010\s*/, "") ?? ""

  return (
    <section ref={sectionRef} id="seller-trust" aria-labelledby="seller-trust-title" className="border-y border-[rgba(143,106,31,0.10)] bg-[#F4F2EC] py-14 sm:py-16 lg:py-16">
      <Container>
        <div className="mx-auto max-w-[77rem]">
          <header className="mx-auto max-w-[52rem] text-center">
            <SectionPill className="mb-4">{t.sellerTrust.pill}</SectionPill>
            <h2 id="seller-trust-title" className="text-3xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[2.4rem]">
              {t.sellerTrust.title}
            </h2>
          </header>

          <div className={`mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-10 lg:grid-cols-4 lg:gap-6 ${isRevealed ? "seller-trust-grid--revealed" : ""}`}>
            {t.sellerTrust.items.map((item, index) => {
              const value = index === 0
                ? <>{metricValues.years}+ {yearsSuffix}</>
                : index === 1
                  ? <>{numberFormatter.format(metricValues.cars)}+</>
                  : index === 2
                    ? <>{metricValues.minimumYear}<span> {minimumYearSuffix}</span></>
                    : <>{metricValues.safetyPercentage}%</>

              return (
                <article
                  key={item.title}
                  aria-label={`${item.value}. ${item.title}. ${item.description}`}
                  className="seller-trust-card relative flex min-h-[195px] flex-col overflow-hidden rounded-[1.5rem] border border-[rgba(143,106,31,0.13)] bg-white p-6 shadow-[0_14px_34px_rgba(31,31,31,0.065),0_3px_10px_rgba(143,106,31,0.04)]"
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <span aria-hidden="true" className="relative z-10 whitespace-nowrap text-[2.3rem] font-extrabold leading-none tracking-tight text-[#B88922] tabular-nums sm:text-[2.5rem] lg:text-[2.65rem]">
                    {value}
                  </span>
                  <h3 className="relative z-10 mt-5 text-[17px] font-bold leading-tight text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="relative z-10 mt-2 max-w-[15rem] text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 -right-4 z-0 size-[7rem] overflow-visible sm:size-[7.25rem] lg:size-[7.75rem]">
                    <Image
                      src={trackRecordImages[index]}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="124px"
                      className="seller-trust-card-illustration object-contain"
                    />
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

        .seller-trust-card-illustration {
          opacity: 0.14;
          filter: grayscale(0.75) saturate(0.6) contrast(0.96);
          transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), filter 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (hover: hover) and (pointer: fine) {
          .seller-trust-card:hover {
            transform: translateY(-2px);
            border-color: rgba(143, 106, 31, 0.24);
            box-shadow: 0 18px 40px rgba(31, 31, 31, 0.085), 0 5px 14px rgba(143, 106, 31, 0.06);
          }

          .seller-trust-card:hover .seller-trust-card-illustration {
            opacity: 0.85;
            filter: grayscale(0) saturate(1);
            transform: translate3d(-3px, -2px, 0) scale(1.03);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .seller-trust-card {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .seller-trust-card-illustration {
            transition: opacity 180ms ease, filter 180ms ease;
          }

          .seller-trust-card:hover .seller-trust-card-illustration {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
