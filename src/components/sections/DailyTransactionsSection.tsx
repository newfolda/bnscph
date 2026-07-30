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
  const entranceAnimationRef = useRef<Animation | null>(null)
  const marqueeAnimationRef = useRef<Animation | null>(null)
  const entranceFallbackTimerRef = useRef<number | null>(null)
  const entranceFrameRef = useRef<number | null>(null)
  const currentOffsetRef = useRef(0)
  const groupWidthRef = useRef(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"idle" | "entrance" | "marquee" | "static">("idle")

  useEffect(() => {
    let isDisposed = false
    let hasStartedMarquee = false

    const clearAnimations = () => {
      if (entranceFallbackTimerRef.current !== null) window.clearTimeout(entranceFallbackTimerRef.current)
      if (entranceFrameRef.current !== null) window.cancelAnimationFrame(entranceFrameRef.current)
      entranceAnimationRef.current?.cancel()
      marqueeAnimationRef.current?.cancel()
    }

    const getCurrentTranslateX = (track: HTMLDivElement) => {
      const transform = window.getComputedStyle(track).transform
      if (!transform || transform === "none") return currentOffsetRef.current

      const matrixValues = transform.match(/^matrix\((.+)\)$/)?.[1]?.split(",")
      return matrixValues ? Number.parseFloat(matrixValues[4]) || currentOffsetRef.current : currentOffsetRef.current
    }

    const startContinuousMarqueeFromCurrentPosition = () => {
      if (isDisposed || hasStartedMarquee) return

      const track = trackRef.current
      const groupWidth = groupWidthRef.current
      if (!track || groupWidth <= 0) return

      hasStartedMarquee = true
      if (entranceFallbackTimerRef.current !== null) window.clearTimeout(entranceFallbackTimerRef.current)
      currentOffsetRef.current = getCurrentTranslateX(track)
      const duration = window.matchMedia("(min-width: 1024px)").matches
        ? 36_000
        : window.matchMedia("(min-width: 768px)").matches
          ? 34_000
          : 30_000

      entranceAnimationRef.current?.commitStyles()
      entranceAnimationRef.current?.cancel()
      track.style.transform = `translate3d(${currentOffsetRef.current}px, 0, 0)`

      const marqueeAnimation = track.animate(
        [
          { transform: `translate3d(${currentOffsetRef.current}px, 0, 0)` },
          { transform: `translate3d(${currentOffsetRef.current - groupWidth}px, 0, 0)` },
        ],
        { duration, easing: "linear", iterations: Infinity },
      )

      marqueeAnimationRef.current = marqueeAnimation
      setAnimationPhase("marquee")
    }

    const runEntrance = (attempt = 0) => {
      const track = trackRef.current
      const marquee = marqueeRef.current

      if (!track || !marquee) {
        if (attempt < 10) {
          entranceFrameRef.current = window.requestAnimationFrame(() => runEntrance(attempt + 1))
        }
        return
      }

      const viewportWidth = marquee.clientWidth
      const group = track.firstElementChild as HTMLDivElement | null
      const card = group?.firstElementChild as HTMLElement | null
      const groupWidth = group?.getBoundingClientRect().width ?? 0
      const gap = group ? Number.parseFloat(window.getComputedStyle(group).gap) || 0 : 0
      const cardWidth = card?.getBoundingClientRect().width ?? 0
      const cardPitch = cardWidth + gap

      if (viewportWidth <= 0 || groupWidth <= 0 || cardPitch <= 0) {
        if (attempt < 10) {
          entranceFrameRef.current = window.requestAnimationFrame(() => runEntrance(attempt + 1))
        }
        return
      }

      groupWidthRef.current = groupWidth
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches
      const isTablet = window.matchMedia("(min-width: 640px)").matches
      const cardCount = isDesktop ? 8 : isTablet ? 7 : 5
      const duration = isDesktop ? 1250 : isTablet ? 1050 : 900
      const startOffset = -(cardPitch * cardCount)
      const steadyOffset = startOffset * 0.2

      track.style.transform = `translate3d(${startOffset}px, 0, 0)`
      track.style.visibility = "visible"
      currentOffsetRef.current = startOffset
      setAnimationPhase("entrance")

      const animation = track.animate(
        [
          { transform: `translate3d(${startOffset}px, 0, 0)`, offset: 0 },
          { transform: `translate3d(${steadyOffset}px, 0, 0)`, offset: 0.8, easing: "linear" },
          { transform: "translate3d(0, 0, 0)", offset: 1, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        ],
        {
          duration,
          fill: "forwards",
        },
      )

      entranceAnimationRef.current = animation
      animation.onfinish = () => {
        animation.commitStyles()
        currentOffsetRef.current = getCurrentTranslateX(track)
        startContinuousMarqueeFromCurrentPosition()
      }
      entranceFallbackTimerRef.current = window.setTimeout(() => {
        currentOffsetRef.current = getCurrentTranslateX(track)
        startContinuousMarqueeFromCurrentPosition()
      }, duration + 200)
    }

    const startEntrance = () => {
      if (hasTriggeredEntranceRef.current) return
      hasTriggeredEntranceRef.current = true

      setHasEntered(true)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAnimationPhase("static")
        return
      }

      entranceFrameRef.current = window.requestAnimationFrame(() => {
        entranceFrameRef.current = window.requestAnimationFrame(runEntrance)
      })
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setHasEntered(true)
        setAnimationPhase("static")
      })
      return () => {
        window.cancelAnimationFrame(frame)
        clearAnimations()
      }
    }

    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === "undefined") {
      startEntrance()
      return clearAnimations
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
    return () => {
      observer.disconnect()
      isDisposed = true
      clearAnimations()
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
              if (canPauseMarquee()) marqueeAnimationRef.current?.pause()
            }}
            onMouseLeave={() => {
              if (canPauseMarquee()) marqueeAnimationRef.current?.play()
            }}
            onFocusCapture={() => {
              if (canPauseMarquee()) marqueeAnimationRef.current?.pause()
            }}
            onBlurCapture={(event) => {
              if (canPauseMarquee() && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
                marqueeAnimationRef.current?.play()
              }
            }}
          >
            <div ref={trackRef} className="transactions-track flex w-max">
              {Array.from({ length: 4 }, (_, groupIndex) => (
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
