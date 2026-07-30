"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { latestTransactions } from "@/src/data/latestTransactions"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

function formatPurchasedAt(purchasedAt: string | undefined, recentlyPurchased: string, purchasedOn: string, locale: string) {
  if (!purchasedAt) return recentlyPurchased

  const dateParts = purchasedAt.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!dateParts) return recentlyPurchased

  const [, year, month, day] = dateParts
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return recentlyPurchased
  }

  const formatter = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" })
  return `${purchasedOn} ${formatter.format(date)}`
}

type Transaction = (typeof latestTransactions)[number]

function TransactionCard({
  transaction,
  isDuplicate,
  recentlyPurchased,
  purchasedOn,
  locale,
  sellerFrom,
}: {
  transaction: Transaction
  isDuplicate: boolean
  recentlyPurchased: string
  purchasedOn: string
  locale: string
  sellerFrom: string
}) {
  return (
    <article
      aria-hidden={isDuplicate || undefined}
      tabIndex={isDuplicate ? -1 : 0}
      className="group flex h-[390px] w-[78vw] max-w-[290px] shrink-0 flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[0_6px_18px_rgba(31,31,31,0.055),0_1px_3px_rgba(31,31,31,0.03)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[2px] hover:border-[var(--primary)]/60 hover:shadow-[0_16px_30px_rgba(31,31,31,0.095),0_3px_8px_rgba(31,31,31,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] motion-reduce:transform-none motion-reduce:transition-none md:h-[410px] md:w-[250px] md:max-w-none lg:h-[420px] lg:w-[290px]"
    >
      <div className="relative h-[286px] shrink-0 overflow-hidden bg-[#F7F7F7] md:h-[270px] lg:h-[320px]">
        <Image
          src={transaction.imagePath}
          alt={`${transaction.year} ${transaction.brand} ${transaction.model} recently purchased by Buy and Sell Cars Philippines`}
          fill
          draggable={false}
          sizes="(min-width: 1024px) 290px, (min-width: 768px) 250px, 78vw"
          className="object-cover object-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.035] motion-reduce:transition-none"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/[0.05] to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/65 bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-[0_2px_7px_rgba(31,31,31,0.08)] backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90 motion-reduce:transition-none md:text-xs lg:text-[13px]">
          {formatPurchasedAt(transaction.purchasedAt, recentlyPurchased, purchasedOn, locale)}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 md:p-5 lg:px-5 lg:py-3">
        <h3 className="text-base font-bold uppercase leading-snug tracking-[0.025em] text-[var(--text-primary)] lg:text-[17px]">
          {transaction.year} {transaction.brand} {transaction.model}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)] lg:text-sm">{sellerFrom} {transaction.location}</p>
      </div>
    </article>
  )
}

function TransactionGroup({
  groupIndex,
  recentlyPurchased,
  purchasedOn,
  locale,
  sellerFrom,
}: {
  groupIndex: number
  recentlyPurchased: string
  purchasedOn: string
  locale: string
  sellerFrom: string
}) {
  return (
    <div className="transactions-group flex shrink-0 gap-7 pr-7 md:gap-8 md:pr-8">
      {latestTransactions.map((transaction) => (
        <TransactionCard
          key={`${transaction.year}-${transaction.brand}-${transaction.model}-${groupIndex}`}
          transaction={transaction}
          isDuplicate={groupIndex > 0}
          recentlyPurchased={recentlyPurchased}
          purchasedOn={purchasedOn}
          locale={locale}
          sellerFrom={sellerFrom}
        />
      ))}
    </div>
  )
}

export default function DailyTransactionsSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hasTriggeredEntranceRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const phaseRef = useRef<"idle" | "entrance" | "reversing" | "marquee" | "paused" | "static">("idle")
  const phaseBeforePauseRef = useRef<"entrance" | "reversing" | "marquee">("marquee")
  const previousTimestampRef = useRef<number | null>(null)
  const phaseElapsedRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const groupWidthRef = useRef(0)
  const cardPitchRef = useRef(0)
  const entranceStartRef = useRef(0)
  const entranceEndRef = useRef(0)
  const reversalEndRef = useRef(0)
  const pauseAnimationRef = useRef<(() => void) | null>(null)
  const resumeAnimationRef = useRef<(() => void) | null>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"idle" | "entrance" | "marquee" | "static">("idle")

  useEffect(() => {
    let isDisposed = false
    let resizeObserver: ResizeObserver | null = null

    const stopFrame = () => {
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const applyTransform = () => {
      const track = trackRef.current
      if (track) track.style.transform = `translate3d(${currentOffsetRef.current}px, 0, 0)`
    }

    const remeasure = () => {
      const marquee = marqueeRef.current
      const track = trackRef.current
      const group = track?.firstElementChild as HTMLDivElement | null
      const card = group?.firstElementChild as HTMLElement | null
      const viewportWidth = marquee?.clientWidth ?? 0
      const groupWidth = group?.getBoundingClientRect().width ?? 0
      const gap = group ? Number.parseFloat(window.getComputedStyle(group).gap) || 0 : 0
      const cardWidth = card?.getBoundingClientRect().width ?? 0
      const cardPitch = cardWidth + gap

      if (viewportWidth <= 0 || groupWidth <= 0 || cardPitch <= 0) return false

      const previousGroupWidth = groupWidthRef.current
      if (previousGroupWidth > 0 && previousGroupWidth !== groupWidth) {
        const groupProgress = ((-currentOffsetRef.current % previousGroupWidth) + previousGroupWidth) % previousGroupWidth
        currentOffsetRef.current = -3 * groupWidth - groupProgress
      }

      groupWidthRef.current = groupWidth
      cardPitchRef.current = cardPitch
      return true
    }

    const scheduleFrame = () => {
      if (isDisposed || animationFrameRef.current !== null || phaseRef.current === "static" || phaseRef.current === "paused") return
      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    const tick = (timestamp: number) => {
      animationFrameRef.current = null
      if (isDisposed || phaseRef.current === "static" || phaseRef.current === "paused") return

      const previousTimestamp = previousTimestampRef.current ?? timestamp
      const deltaMs = Math.min(Math.max(timestamp - previousTimestamp, 0), 50)
      previousTimestampRef.current = timestamp
      phaseElapsedRef.current += deltaMs

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches
      const isTablet = window.matchMedia("(min-width: 640px)").matches

      if (phaseRef.current === "entrance") {
        const duration = isDesktop ? 1250 : isTablet ? 1050 : 900
        const progress = Math.min(phaseElapsedRef.current / duration, 1)
        const easedProgress = progress <= 0.8
          ? progress * 1.05
          : 0.84 + (1 - Math.pow(1 - (progress - 0.8) / 0.2, 2)) * 0.16
        currentOffsetRef.current = entranceStartRef.current + (entranceEndRef.current - entranceStartRef.current) * easedProgress

        if (progress >= 1) {
          currentOffsetRef.current = entranceEndRef.current
          reversalEndRef.current = entranceEndRef.current - Math.min(cardPitchRef.current * 0.08, 28)
          phaseRef.current = "reversing"
          phaseElapsedRef.current = 0
        }
      } else if (phaseRef.current === "reversing") {
        const duration = isDesktop ? 160 : 120
        const progress = Math.min(phaseElapsedRef.current / duration, 1)
        currentOffsetRef.current = entranceEndRef.current + (reversalEndRef.current - entranceEndRef.current) * Math.pow(progress, 3)

        if (progress >= 1) {
          currentOffsetRef.current = reversalEndRef.current
          phaseRef.current = "marquee"
          phaseElapsedRef.current = 0
          setAnimationPhase("marquee")
        }
      } else if (phaseRef.current === "marquee") {
        const duration = isDesktop ? 36_000 : isTablet ? 34_000 : 30_000
        currentOffsetRef.current -= (groupWidthRef.current / duration) * deltaMs

        while (currentOffsetRef.current <= -4 * groupWidthRef.current) currentOffsetRef.current += groupWidthRef.current
        while (currentOffsetRef.current >= -2 * groupWidthRef.current) currentOffsetRef.current -= groupWidthRef.current
      }

      applyTransform()
      scheduleFrame()
    }

    const beginAfterMeasurement = (attempt = 0) => {
      if (isDisposed) return
      if (!remeasure()) {
        if (attempt < 60) {
          animationFrameRef.current = window.requestAnimationFrame(() => beginAfterMeasurement(attempt + 1))
          return
        }

        phaseRef.current = "static"
        setAnimationPhase("static")
        return
      }

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches
      const isTablet = window.matchMedia("(min-width: 640px)").matches
      const cardCount = isDesktop ? 9 : isTablet ? 7 : 5
      const entranceDistance = cardPitchRef.current * cardCount
      entranceStartRef.current = -2 * groupWidthRef.current - entranceDistance
      entranceEndRef.current = -2 * groupWidthRef.current
      currentOffsetRef.current = entranceStartRef.current
      phaseRef.current = "entrance"
      phaseElapsedRef.current = 0
      previousTimestampRef.current = performance.now()

      const track = trackRef.current
      if (track) track.style.visibility = "visible"
      applyTransform()
      setAnimationPhase("entrance")
      scheduleFrame()
    }

    const startEntrance = () => {
      if (hasTriggeredEntranceRef.current) return
      hasTriggeredEntranceRef.current = true
      setHasEntered(true)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        phaseRef.current = "static"
        setAnimationPhase("static")
        return
      }

      animationFrameRef.current = window.requestAnimationFrame(() => beginAfterMeasurement())
    }

    const pauseAnimation = () => {
      if (phaseRef.current === "static" || phaseRef.current === "paused") return
      if (phaseRef.current === "entrance" || phaseRef.current === "reversing" || phaseRef.current === "marquee") {
        phaseBeforePauseRef.current = phaseRef.current
      }
      phaseRef.current = "paused"
      previousTimestampRef.current = null
      stopFrame()
    }

    const resumeAnimation = () => {
      if (phaseRef.current !== "paused") return
      phaseRef.current = phaseBeforePauseRef.current
      previousTimestampRef.current = performance.now()
      phaseElapsedRef.current = 0
      scheduleFrame()
    }

    pauseAnimationRef.current = pauseAnimation
    resumeAnimationRef.current = resumeAnimation

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopFrame()
        previousTimestampRef.current = null
        return
      }

      if (phaseRef.current === "idle" && hasTriggeredEntranceRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(() => beginAfterMeasurement())
        return
      }

      if (phaseRef.current !== "static" && phaseRef.current !== "paused") {
        previousTimestampRef.current = performance.now()
        scheduleFrame()
      }
    }

    const observeResize = () => {
      if (typeof ResizeObserver === "undefined" || !marqueeRef.current) return

      resizeObserver = new ResizeObserver(() => {
        if (remeasure()) applyTransform()
      })
      resizeObserver.observe(marqueeRef.current)
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setHasEntered(true)
        setAnimationPhase("static")
      })
      return () => {
        window.cancelAnimationFrame(frame)
        isDisposed = true
        stopFrame()
      }
    }

    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === "undefined") {
      startEntrance()
      observeResize()
      document.addEventListener("visibilitychange", handleVisibilityChange)
      return () => {
        isDisposed = true
        stopFrame()
        resizeObserver?.disconnect()
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        startEntrance()
        observer.disconnect()
      },
      { threshold: 0.25 },
    )

    observer.observe(section)
    observeResize()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      observer.disconnect()
      resizeObserver?.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      isDisposed = true
      stopFrame()
      pauseAnimationRef.current = null
      resumeAnimationRef.current = null
    }
  }, [])

  const canPauseMarquee = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches

  return (
    <section ref={sectionRef} id="latest-transactions" className={`transactions-section overflow-hidden border-t border-[var(--border)] bg-[var(--background-alt)] py-14 md:py-16 lg:pb-16 lg:pt-10 ${hasEntered ? "transactions-section--entered" : ""}`}>
      <Container>
        <div className="flex flex-col items-center text-center">
          <div className="transactions-reveal transactions-reveal--pill">
            <SectionPill>
              {t.transactions.pill}
            </SectionPill>
          </div>
          <h2 className="transactions-reveal transactions-reveal--heading mx-auto mt-3 max-w-[760px] text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem]">
            {t.transactions.title}
          </h2>
          <p className="transactions-reveal transactions-reveal--description mt-2 max-w-[40rem] text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-base lg:text-[17px]">
            {t.transactions.description}
          </p>
        </div>

        <div className="transactions-reveal transactions-reveal--cards relative mx-[-1rem] mt-10 pb-4 sm:mx-[-1.5rem] md:mt-12 md:pb-6 lg:mx-[-2.5rem]">
          <div
            ref={marqueeRef}
            className={`transactions-marquee transactions-marquee--${animationPhase} relative z-10 overflow-hidden pb-2`}
            onMouseEnter={() => {
              if (canPauseMarquee()) pauseAnimationRef.current?.()
            }}
            onMouseLeave={() => {
              if (canPauseMarquee()) resumeAnimationRef.current?.()
            }}
            onFocusCapture={() => {
              if (canPauseMarquee()) pauseAnimationRef.current?.()
            }}
            onBlurCapture={(event) => {
              if (canPauseMarquee() && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
                resumeAnimationRef.current?.()
              }
            }}
          >
            <div ref={trackRef} className="transactions-track flex w-max">
              {Array.from({ length: 6 }, (_, groupIndex) => (
                <TransactionGroup
                  key={groupIndex}
                  groupIndex={groupIndex}
                  recentlyPurchased={t.transactions.recentlyPurchased}
                  purchasedOn={t.transactions.purchasedOn}
                  locale={t.transactions.dateLocale}
                  sellerFrom={t.transactions.sellerFrom}
                />
              ))}
            </div>
          </div>
          <div aria-hidden="true" className="transactions-fade-left pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-14 md:block lg:w-[72px]" />
          <div aria-hidden="true" className="transactions-fade-right pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-14 md:block lg:w-[72px]" />
        </div>
      </Container>
      <style>{`
        .transactions-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .transactions-section--entered .transactions-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        .transactions-reveal--heading {
          transition-delay: 100ms;
        }

        .transactions-reveal--description {
          transition-delay: 180ms;
        }

        .transactions-reveal--cards {
          transition: none;
        }

        .transactions-marquee--idle .transactions-track {
          visibility: hidden;
        }

        .transactions-marquee--entrance .transactions-track,
        .transactions-marquee--marquee .transactions-track {
          visibility: visible;
          will-change: transform;
        }

        @media (min-width: 768px) {
          .transactions-fade-left {
            background: linear-gradient(90deg, var(--background-alt), rgba(248, 248, 248, 0));
          }

          .transactions-fade-right {
            background: linear-gradient(270deg, var(--background-alt), rgba(248, 248, 248, 0));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .transactions-reveal,
          .transactions-section--entered .transactions-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .transactions-track,
          .transactions-marquee--entrance .transactions-track,
          .transactions-marquee--marquee .transactions-track {
            transform: none;
            visibility: visible;
            will-change: auto;
          }
        }
      `}</style>
    </section>
  )
}
