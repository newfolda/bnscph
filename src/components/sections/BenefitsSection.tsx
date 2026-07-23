"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

type ScoreRow = {
  category: "Stress" | "Time" | "Risk" | "Paperwork" | "Payment Security"
  description: string
  score: number
  status: string
}

const traditionalPrivateSaleRows: ScoreRow[] = [
  { category: "Stress", description: "Constant calls, texts, and negotiations.", score: 8, status: "EXTREME" },
  { category: "Time", description: "Days or weeks of waiting.", score: 7, status: "HIGH" },
  { category: "Risk", description: "Scams, no-shows, payment issues.", score: 10, status: "EXTREME" },
  { category: "Paperwork", description: "Forms, transfers, follow-ups.", score: 7, status: "HIGH" },
  { category: "Payment Security", description: "Uncertain until the last step.", score: 7, status: "HIGH" },
]

const buyAndSellCarsRows: ScoreRow[] = [
  { category: "Stress", description: "We handle the entire process.", score: 2, status: "VERY LOW" },
  { category: "Time", description: "Fast, efficient, and on your terms.", score: 2, status: "LOW" },
  { category: "Risk", description: "Verified buyers, secure process.", score: 1, status: "VERY LOW" },
  { category: "Paperwork", description: "We handle everything for you.", score: 1, status: "VERY LOW" },
  { category: "Payment Security", description: "Secure payment before transfer.", score: 1, status: "VERY LOW" },
]

type ScorecardTone = "traditional" | "recommended"

type AnimatedScores = Record<ScorecardTone, number[]>

const SCORE_SEGMENT_COLORS = [
  { color: "#34D399", glow: "rgba(52, 211, 153, 0.22)" },
  { color: "#22C55E", glow: "rgba(34, 197, 94, 0.22)" },
  { color: "#84CC16", glow: "rgba(132, 204, 22, 0.2)" },
  { color: "#EAB308", glow: "rgba(234, 179, 8, 0.2)" },
  { color: "#FACC15", glow: "rgba(250, 204, 21, 0.2)" },
  { color: "#F59E0B", glow: "rgba(245, 158, 11, 0.2)" },
  { color: "#FB923C", glow: "rgba(251, 146, 60, 0.2)" },
  { color: "#F97316", glow: "rgba(249, 115, 22, 0.22)" },
  { color: "#EF4444", glow: "rgba(239, 68, 68, 0.22)" },
  { color: "#B91C1C", glow: "rgba(185, 28, 28, 0.24)" },
] as const

const SCORE_ANIMATION_DURATION_MS = 2400
const SCORE_ROW_STAGGER_MS = 80
const SCORE_ROW_ANIMATION_DURATION_MS = SCORE_ANIMATION_DURATION_MS - SCORE_ROW_STAGGER_MS * (traditionalPrivateSaleRows.length - 1)

function getInitialScores(): AnimatedScores {
  return {
    traditional: traditionalPrivateSaleRows.map(() => 0),
    recommended: buyAndSellCarsRows.map(() => 10),
  }
}

function getFinalScores(): AnimatedScores {
  return {
    traditional: traditionalPrivateSaleRows.map((row) => row.score),
    recommended: buyAndSellCarsRows.map((row) => row.score),
  }
}

function easeOutQuart(progress: number) {
  return 1 - (1 - progress) ** 4
}

function getStatusForScore(score: number) {
  if (score === 0) return null
  if (score <= 2) return "VERY LOW"
  if (score <= 4) return "LOW"
  if (score <= 6) return "MEDIUM"
  if (score <= 8) return "HIGH"
  return "EXTREME"
}

function getStatusClassName(status: string | null) {
  return status ? status.toLowerCase().replace(" ", "-") : "empty"
}

function CategoryIcon({ category }: { category: ScoreRow["category"] }) {
  if (category === "Stress") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 18h10a4 4 0 0 0 .7-7.94A5.8 5.8 0 0 0 6.6 11.4 3.3 3.3 0 0 0 7 18Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 7.5 7 6m8.5 1.5L17 6m-5 1V4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (category === "Time") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4.5l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (category === "Risk") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4.5 20 19H4l8-14.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 9v4.2m0 2.6h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (category === "Paperwork") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3.8h7l3.2 3.2v12.8H7V3.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M14 3.8V7h3.2M9.7 11h4.7m-4.7 3.2h4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6.2" y="10.5" width="11.6" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.8 10.5V8.3a3.2 3.2 0 0 1 6.4 0v2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 14v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ScorecardRow({
  row,
  tone,
  currentScore,
  rowIndex,
  isActive,
}: {
  row: ScoreRow
  tone: ScorecardTone
  currentScore: number
  rowIndex: number
  isActive: boolean
}) {
  const status = getStatusForScore(currentScore)

  return (
    <li
      className={`scorecard-row scorecard-row--${tone} ${isActive ? "scorecard-row--active" : ""}`}
      data-row-index={rowIndex}
    >
      <span className={`scorecard-icon scorecard-icon--${tone}`}>
        <CategoryIcon category={row.category} />
      </span>
      <span className="min-w-0">
        <strong className="scorecard-category">{row.category}</strong>
        <span className="scorecard-description">{row.description}</span>
      </span>
      <span
        className="scorecard-segments"
        aria-label={status ? `${currentScore} out of 10, ${status.toLowerCase()}` : "0 out of 10"}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`scorecard-segment ${index < currentScore ? "scorecard-segment--active" : ""}`}
            style={{
              "--score-segment-color": SCORE_SEGMENT_COLORS[index].color,
              "--score-segment-glow": SCORE_SEGMENT_COLORS[index].glow,
            } as CSSProperties}
          />
        ))}
      </span>
      <span
        aria-hidden={status === null}
        className={`scorecard-status scorecard-status--${getStatusClassName(status)}`}
      >
        {status ?? "\u00a0"}
      </span>
    </li>
  )
}

function OutcomeCarSilhouette() {
  return (
    <svg
      aria-hidden="true"
      className="scorecard-outcome-car"
      viewBox="0 0 220 76"
      fill="none"
    >
      <path
        d="M13 52.5h8.5l8.5-20.8c1.5-3.7 5.2-6.2 9.2-6.2h67.6c4.3 0 8.3 1.8 11.1 5l16.6 18.6h43.6c10.9 0 19.8 8.8 19.8 19.7v1.2H13V52.5Z"
        fill="currentColor"
      />
      <path
        d="M44.5 30.8h30.1v17.6H35.8l5.5-13.4c.5-1.2 1.7-2.2 3.2-2.2ZM81.5 30.8h23.4c2.1 0 4 .9 5.4 2.5l13.5 15.1H81.5V30.8Z"
        fill="rgba(255,255,255,0.14)"
      />
      <circle cx="52" cy="68" r="10" fill="currentColor" />
      <circle cx="52" cy="68" r="4.2" fill="rgba(255,255,255,0.18)" />
      <circle cx="159" cy="68" r="10" fill="currentColor" />
      <circle cx="159" cy="68" r="4.2" fill="rgba(255,255,255,0.18)" />
      <path d="M21 53h177" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function BenefitsSection() {
  const comparisonRef = useRef<HTMLDivElement>(null)
  const currentlyAnimatingRef = useRef(false)
  const hasEnteredViewportRef = useRef(false)
  const comparisonIsVisibleRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const spotlightStartTimeoutRef = useRef<number | null>(null)
  const spotlightIntervalRef = useRef<number | null>(null)
  const [animatedScores, setAnimatedScores] = useState<AnimatedScores>(getInitialScores)
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null
        setAnimatedScores(getFinalScores())
      })

      return () => {
        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }

    const comparisonElement = comparisonRef.current
    if (!comparisonElement) return

    const clearSpotlightTimers = () => {
      if (spotlightStartTimeoutRef.current !== null) {
        window.clearTimeout(spotlightStartTimeoutRef.current)
        spotlightStartTimeoutRef.current = null
      }

      if (spotlightIntervalRef.current !== null) {
        window.clearInterval(spotlightIntervalRef.current)
        spotlightIntervalRef.current = null
      }
    }

    const startSpotlight = () => {
      clearSpotlightTimers()

      spotlightStartTimeoutRef.current = window.setTimeout(() => {
        spotlightStartTimeoutRef.current = null

        if (!comparisonIsVisibleRef.current) return

        setActiveRowIndex(0)
        spotlightIntervalRef.current = window.setInterval(() => {
          setActiveRowIndex((currentIndex) => (
            currentIndex === null
              ? 0
              : (currentIndex + 1) % traditionalPrivateSaleRows.length
          ))
        }, 2000)
      }, 320)
    }

    const startAnimation = () => {
      if (currentlyAnimatingRef.current || hasEnteredViewportRef.current) return

      currentlyAnimatingRef.current = true
      hasEnteredViewportRef.current = true
      const startTime = performance.now()

      const animateScores = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const nextScores: AnimatedScores = {
          traditional: traditionalPrivateSaleRows.map((row, index) => {
            const progress = Math.min(
              Math.max((elapsed - index * SCORE_ROW_STAGGER_MS) / SCORE_ROW_ANIMATION_DURATION_MS, 0),
              1,
            )
            return Math.round(row.score * easeOutQuart(progress))
          }),
          recommended: buyAndSellCarsRows.map((row, index) => {
            const progress = Math.min(
              Math.max((elapsed - index * SCORE_ROW_STAGGER_MS) / SCORE_ROW_ANIMATION_DURATION_MS, 0),
              1,
            )
            return Math.round(10 + (row.score - 10) * easeOutQuart(progress))
          }),
        }

        setAnimatedScores(nextScores)

        if (elapsed < SCORE_ANIMATION_DURATION_MS) {
          animationFrameRef.current = window.requestAnimationFrame(animateScores)
        } else {
          animationFrameRef.current = null
          currentlyAnimatingRef.current = false
          setAnimatedScores(getFinalScores())
          startSpotlight()
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(animateScores)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        comparisonIsVisibleRef.current = entry.intersectionRatio >= 0.1

        if (entry.intersectionRatio < 0.1 && hasEnteredViewportRef.current) {
          if (animationFrameRef.current !== null) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }

          clearSpotlightTimers()
          currentlyAnimatingRef.current = false
          hasEnteredViewportRef.current = false
          setActiveRowIndex(null)
          setAnimatedScores(getInitialScores())
          return
        }

        if (entry.intersectionRatio >= 0.3) {
          startAnimation()
        }
      },
      { threshold: [0.1, 0.3] },
    )

    observer.observe(comparisonElement)

    return () => {
      observer.disconnect()

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }

      clearSpotlightTimers()
    }
  }, [])

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#090B0D_0%,#050607_100%)] py-14 sm:py-16 lg:py-24">
      <div aria-hidden="true" className="benefits-panel-ambient pointer-events-none absolute inset-0 z-0">
        <span className="benefits-ambient-light benefits-ambient-light--ivory" />
        <span className="benefits-ambient-light benefits-ambient-light--champagne" />
        <span className="benefits-ambient-light benefits-ambient-light--mint" />
        <span className="benefits-ambient-light benefits-ambient-light--cream" />
        <span className="benefits-ambient-light benefits-ambient-light--lavender" />
      </div>

      <Container className="relative z-10">
        <header className="benefits-dark-header mx-auto max-w-[42rem] text-center">
              <SectionPill className="benefits-dark-pill mb-4">WHY CHOOSE US</SectionPill>
              <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#0A0A0A] sm:text-5xl">
                The simpler, safer way to
                <br />
                <span className="text-[var(--primary)]">sell your car</span> for a fair price.
              </h2>
              <p className="mx-auto mt-5 max-w-[34rem] text-base leading-relaxed text-[var(--text-secondary)]">
                We remove the uncertainty, handle the process,
                <br className="hidden sm:block" />
                and get you paid securely.
              </p>
        </header>

            <div ref={comparisonRef} className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:items-stretch lg:gap-5">
              <article
                tabIndex={0}
                className="scorecard-panel scorecard-panel--traditional rounded-[1.625rem] p-5 sm:p-6 lg:p-8"
              >
                <header className="text-center">
                    <h3 className="text-lg font-bold tracking-tight text-[#494841] sm:text-xl">
                      TRADITIONAL PRIVATE SALE
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#71716b]">
                      High stress. High risk. Too much effort.
                    </p>
                </header>

                <ul className="mt-7 space-y-0">
                    {traditionalPrivateSaleRows.map((row, index) => (
                      <ScorecardRow
                        key={row.category}
                        row={row}
                        tone="traditional"
                        currentScore={animatedScores.traditional[index]}
                        rowIndex={index}
                        isActive={activeRowIndex === index}
                      />
                    ))}
                </ul>

                <footer className="scorecard-outcome scorecard-outcome--traditional mt-6 rounded-2xl p-4">
                    <OutcomeCarSilhouette />
                    <span aria-hidden="true" className="scorecard-outcome-icon">{"\u2639"}</span>
                    <div>
                      <h4>Unpredictable outcome.</h4>
                      <p>More hassle. More risk. Lower peace of mind.</p>
                    </div>
                </footer>
              </article>

              <div className="scorecard-vs-column flex min-h-12 items-center justify-center lg:self-center">
                <span className="scorecard-vs-badge">VS</span>
              </div>

              <article
                tabIndex={0}
                className="scorecard-panel scorecard-panel--recommended rounded-[1.625rem] p-5 sm:p-6 lg:p-8"
              >
                <header className="text-center">
                    <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] sm:text-xl">
                      BUY &amp; SELL CARS PHILIPPINES
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5f5d54]">
                      Low stress. Low risk. Zero guesswork.
                    </p>
                </header>

                <ul className="mt-7 space-y-0">
                    {buyAndSellCarsRows.map((row, index) => (
                      <ScorecardRow
                        key={row.category}
                        row={row}
                        tone="recommended"
                        currentScore={animatedScores.recommended[index]}
                        rowIndex={index}
                        isActive={activeRowIndex === index}
                      />
                    ))}
                </ul>

                <footer className="scorecard-outcome scorecard-outcome--recommended mt-6 rounded-2xl p-4">
                    <OutcomeCarSilhouette />
                    <span aria-hidden="true" className="scorecard-outcome-icon">{"\u263A"}</span>
                    <div>
                      <h4>Predictable outcome.</h4>
                      <p>Less hassle. Lower risk. Total peace of mind.</p>
                    </div>
                </footer>
              </article>
            </div>
      </Container>

      <style>{`
        .benefits-panel-ambient {
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% -12%, rgba(246, 248, 250, 0.08) 0%, transparent 43%),
            radial-gradient(ellipse at 10% 54%, rgba(75, 94, 110, 0.09) 0%, transparent 42%),
            radial-gradient(ellipse at 92% 58%, rgba(200, 160, 68, 0.09) 0%, transparent 44%),
            radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.26) 100%);
        }

        .benefits-ambient-light {
          position: absolute;
          border-radius: 50%;
          opacity: 0.72;
        }

        .benefits-ambient-light::before {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          content: "";
        }

        .benefits-ambient-light--ivory { top: -30%; left: 18%; width: 62%; height: 58%; }
        .benefits-ambient-light--champagne { top: 8%; right: -20%; width: 59%; height: 60%; }
        .benefits-ambient-light--mint { top: -14%; left: -18%; width: 56%; height: 62%; }
        .benefits-ambient-light--cream { bottom: -34%; left: 12%; width: 66%; height: 62%; }
        .benefits-ambient-light--lavender { right: -16%; bottom: -30%; width: 54%; height: 58%; }

        .benefits-ambient-light--ivory::before {
          background: radial-gradient(ellipse, rgba(244, 247, 250, 0.11) 0%, rgba(244, 247, 250, 0.03) 35%, transparent 72%);
        }

        .benefits-ambient-light--champagne::before {
          background: radial-gradient(ellipse, rgba(218, 179, 83, 0.12) 0%, rgba(218, 179, 83, 0.03) 36%, transparent 72%);
        }

        .benefits-ambient-light--mint::before {
          background: radial-gradient(ellipse, rgba(88, 108, 126, 0.1) 0%, rgba(88, 108, 126, 0.025) 34%, transparent 72%);
        }

        .benefits-ambient-light--cream::before {
          background: radial-gradient(ellipse, rgba(255, 255, 255, 0.035) 0%, transparent 65%);
        }

        .benefits-ambient-light--lavender::before {
          background: radial-gradient(ellipse, rgba(95, 103, 117, 0.055) 0%, transparent 65%);
        }

        .scorecard-panel {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          outline: 1px solid transparent;
          outline-offset: -1px;
          backdrop-filter: blur(16px) saturate(112%);
          -webkit-backdrop-filter: blur(16px) saturate(112%);
          transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1), border-color 360ms cubic-bezier(0.22, 1, 0.36, 1), outline-color 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), background 360ms cubic-bezier(0.22, 1, 0.36, 1), filter 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scorecard-panel--traditional {
          border: 1px solid rgba(150, 160, 168, 0.34);
          outline: 1px solid rgba(188, 199, 209, 0.08);
          background: linear-gradient(135deg, rgba(27, 31, 35, 0.88) 0%, rgba(13, 16, 19, 0.92) 52%, rgba(22, 25, 29, 0.86) 100%);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.34), 0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(226, 232, 238, 0.1), inset 0 -1px 0 rgba(86, 105, 120, 0.17);
        }

        .scorecard-panel--recommended {
          border: 1px solid rgba(200, 160, 68, 0.72);
          outline: 1px solid rgba(238, 214, 147, 0.1);
          background: linear-gradient(135deg, rgba(31, 27, 18, 0.92) 0%, rgba(12, 13, 14, 0.94) 48%, rgba(26, 22, 15, 0.9) 100%);
          box-shadow: 0 26px 52px rgba(0, 0, 0, 0.38), 0 10px 24px rgba(174, 130, 35, 0.13), inset 0 1px 0 rgba(255, 242, 204, 0.15), inset 0 -1px 0 rgba(183, 139, 44, 0.22);
        }

        .scorecard-panel::before,
        .scorecard-panel::after {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          content: "";
          border-radius: inherit;
          transition: transform 520ms ease, opacity 520ms ease;
        }

        .scorecard-panel::before {
          inset: 0;
          background: radial-gradient(ellipse at 16% 8%, rgba(239, 246, 252, 0.14) 0%, rgba(239, 246, 252, 0.035) 20%, transparent 48%);
        }

        .scorecard-panel--traditional::after {
          inset: 1px;
          background: linear-gradient(135deg, transparent 50%, rgba(82, 112, 139, 0.15) 78%, rgba(218, 230, 240, 0.07) 100%);
        }

        .scorecard-panel--recommended::after {
          inset: 1px;
          background: linear-gradient(135deg, transparent 50%, rgba(214, 170, 71, 0.2) 78%, rgba(255, 240, 196, 0.1) 100%);
        }

        .scorecard-panel > * {
          position: relative;
          z-index: 1;
        }

        .scorecard-panel:is(:hover, :focus-within, :focus-visible) {
          transform: translateY(-4px);
          filter: brightness(1.02);
        }

        .scorecard-panel:is(:hover, :focus-within, :focus-visible)::before {
          transform: translate3d(7px, 6px, 0);
          opacity: 1;
        }

        .scorecard-panel:is(:hover, :focus-within, :focus-visible)::after {
          transform: translate3d(5px, 4px, 0);
          opacity: 0.92;
        }

        .scorecard-panel--traditional:is(:hover, :focus-within, :focus-visible) {
          border-color: rgba(181, 194, 204, 0.5);
          box-shadow: 0 30px 58px rgba(0, 0, 0, 0.42), 0 11px 24px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(226, 232, 238, 0.14), inset 0 -1px 0 rgba(86, 105, 120, 0.2);
        }

        .scorecard-panel--recommended:is(:hover, :focus-within, :focus-visible) {
          border-color: rgba(222, 186, 88, 0.84);
          box-shadow: 0 32px 62px rgba(0, 0, 0, 0.46), 0 13px 28px rgba(174, 130, 35, 0.18), inset 0 1px 0 rgba(255, 242, 204, 0.2), inset 0 -1px 0 rgba(183, 139, 44, 0.25);
        }

        .scorecard-panel--traditional:focus-visible {
          outline-color: rgba(214, 228, 239, 0.68);
          outline-offset: 3px;
        }

        .scorecard-panel--recommended:focus-visible {
          outline-color: rgba(234, 199, 109, 0.72);
          outline-offset: 3px;
        }

        .benefits-dark-header h2 {
          color: #f5f5f3;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.24);
        }

        .benefits-dark-header p {
          color: rgba(245, 245, 243, 0.68);
        }

        .benefits-dark-pill {
          border-color: rgba(200, 160, 68, 0.58) !important;
          outline-color: rgba(240, 211, 132, 0.15) !important;
          background: linear-gradient(135deg, rgba(35, 37, 38, 0.78), rgba(10, 12, 14, 0.72)) !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 245, 214, 0.13), inset 0 -1px 0 rgba(200, 160, 68, 0.14) !important;
          color: var(--primary) !important;
        }

        .benefits-dark-pill::before {
          background: radial-gradient(ellipse at 18% 12%, rgba(255, 244, 209, 0.15) 0%, transparent 34%) !important;
          opacity: 0.68 !important;
        }

        .benefits-dark-pill::after {
          background: linear-gradient(135deg, transparent 48%, rgba(200, 160, 68, 0.14) 76%, rgba(255, 245, 214, 0.16) 100%) !important;
        }

        .benefits-dark-pill:is(:hover, :focus-visible, :focus-within) {
          border-color: rgba(220, 183, 83, 0.68) !important;
          outline-color: rgba(240, 211, 132, 0.2) !important;
          background: linear-gradient(135deg, rgba(42, 39, 31, 0.82), rgba(10, 12, 14, 0.76)) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 245, 214, 0.16), inset 0 -1px 0 rgba(200, 160, 68, 0.18) !important;
        }

        .scorecard-panel--traditional h3 {
          color: #f0f1ee;
          font-size: 1.18rem;
          letter-spacing: -0.025em;
          line-height: 1.18;
        }

        .scorecard-panel--traditional header p {
          color: #9b9e9d;
        }

        .scorecard-panel--recommended h3 {
          color: var(--primary);
          font-size: 1.18rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.18;
        }

        .scorecard-panel header > p {
          color: rgba(205, 208, 205, 0.64);
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .scorecard-panel--recommended header p {
          color: #c9c4b5;
        }

        .scorecard-row {
          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns: 3rem minmax(8rem, 1fr) minmax(8rem, 1.25fr) 5.5rem;
          gap: 0.75rem;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.13);
          padding: 0.95rem 0;
          transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scorecard-row::before {
          position: absolute;
          inset: 0.35rem -0.38rem;
          z-index: 0;
          border-radius: 0.78rem;
          opacity: 0;
          pointer-events: none;
          content: "";
          transition: opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scorecard-row > * {
          position: relative;
          z-index: 1;
        }

        .scorecard-row:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .scorecard-row--traditional.scorecard-row--active {
          transform: translate3d(1px, -2px, 0);
        }

        .scorecard-row--traditional.scorecard-row--active::before {
          background: rgba(185, 28, 28, 0.09);
          box-shadow: inset 0 1px 0 rgba(255, 133, 122, 0.12), inset 0 -1px 0 rgba(115, 17, 17, 0.2);
          opacity: 1;
        }

        .scorecard-row--recommended.scorecard-row--active {
          transform: translate3d(-1px, -2px, 0);
        }

        .scorecard-row--recommended.scorecard-row--active::before {
          background: rgba(52, 211, 153, 0.065);
          box-shadow: inset 0 1px 0 rgba(244, 210, 126, 0.13), inset 0 -1px 0 rgba(43, 116, 81, 0.16);
          opacity: 1;
        }

        .scorecard-icon {
          display: flex;
          height: 2.5rem;
          width: 2.5rem;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 0.8rem;
          background: rgba(5, 7, 9, 0.54);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.32), 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scorecard-icon svg {
          height: 1.3rem;
          width: 1.3rem;
        }

        .scorecard-icon--traditional {
          border-color: rgba(204, 83, 72, 0.45);
          color: #d95b50;
          box-shadow: inset 0 1px 0 rgba(255, 157, 148, 0.09), inset 0 0 14px rgba(180, 48, 38, 0.11), 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .scorecard-icon--recommended {
          border-color: rgba(218, 181, 79, 0.62);
          color: var(--primary);
          box-shadow: inset 0 1px 0 rgba(255, 235, 174, 0.11), inset 0 0 14px rgba(207, 166, 68, 0.1), 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .scorecard-panel--traditional:is(:hover, :focus-within, :focus-visible) .scorecard-icon--traditional {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255, 157, 148, 0.12), inset 0 0 16px rgba(180, 48, 38, 0.16), 0 6px 12px rgba(0, 0, 0, 0.24);
        }

        .scorecard-panel--recommended:is(:hover, :focus-within, :focus-visible) .scorecard-icon--recommended {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255, 235, 174, 0.14), inset 0 0 16px rgba(207, 166, 68, 0.15), 0 6px 12px rgba(0, 0, 0, 0.24);
        }

        .scorecard-row--active .scorecard-icon--traditional {
          border-color: rgba(238, 107, 95, 0.62);
          color: #f17a6e;
          box-shadow: inset 0 1px 0 rgba(255, 170, 160, 0.14), inset 0 0 17px rgba(185, 28, 28, 0.22), 0 5px 11px rgba(0, 0, 0, 0.24);
        }

        .scorecard-row--active .scorecard-icon--recommended {
          border-color: rgba(238, 205, 112, 0.72);
          color: #f0cc72;
          box-shadow: inset 0 1px 0 rgba(255, 241, 190, 0.16), inset 0 0 17px rgba(218, 181, 79, 0.2), 0 5px 11px rgba(0, 0, 0, 0.24);
        }

        .scorecard-category {
          display: block;
          color: #e6e7e4;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          line-height: 1.25;
          text-transform: uppercase;
        }

        .scorecard-description {
          display: block;
          margin-top: 0.28rem;
          color: #aeb0ae;
          opacity: 0.84;
          font-size: 0.78rem;
          line-height: 1.42;
        }

        .scorecard-row--active .scorecard-category {
          color: #f2f3ef;
        }

        .scorecard-row--active .scorecard-description {
          opacity: 0.96;
        }

        .scorecard-segments {
          display: grid;
          grid-template-columns: repeat(10, minmax(0, 1fr));
          gap: 0.28rem;
        }

        .scorecard-segment {
          display: block;
          height: 0.74rem;
          border-radius: 0.18rem;
          background: rgba(90, 96, 101, 0.32);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          opacity: 0.72;
          transition: opacity 220ms ease-out, background 220ms ease-out, box-shadow 220ms ease-out, filter 220ms ease-out, transform 220ms ease-out;
        }

        .scorecard-segment--active {
          background: var(--score-segment-color);
          box-shadow: 0 0 8px var(--score-segment-glow), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.18);
          opacity: 1;
        }

        .scorecard-panel:is(:hover, :focus-within, :focus-visible) .scorecard-segment--active {
          filter: brightness(1.08);
          box-shadow: 0 0 10px var(--score-segment-glow), inset 0 1px 0 rgba(255, 255, 255, 0.34), inset 0 -1px 0 rgba(0, 0, 0, 0.16);
        }

        .scorecard-row--active .scorecard-segment--active {
          filter: brightness(1.13);
          box-shadow: 0 0 11px var(--score-segment-glow), inset 0 1px 0 rgba(255, 255, 255, 0.36), inset 0 -1px 0 rgba(0, 0, 0, 0.14);
        }

        .scorecard-row--active .scorecard-segment:not(.scorecard-segment--active) {
          opacity: 0.8;
        }

        .scorecard-status {
          justify-self: end;
          min-width: 4.4rem;
          border-radius: 9999px;
          padding: 0.24rem 0.4rem;
          color: #b8e178;
          font-size: 0.53rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1;
          text-align: center;
          transition: color 200ms ease-out, opacity 200ms ease-out;
        }

        .scorecard-status--empty {
          opacity: 0;
        }

        .scorecard-status--very-low {
          color: #34d399;
        }

        .scorecard-status--low {
          color: #84cc16;
        }

        .scorecard-status--medium {
          color: #eab308;
        }

        .scorecard-status--high {
          color: #fb923c;
        }

        .scorecard-status--extreme {
          color: #ef4444;
          font-weight: 800;
        }

        .scorecard-row--active .scorecard-status {
          background: rgba(255, 255, 255, 0.04);
          font-weight: 800;
          opacity: 1;
        }

        .scorecard-outcome {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-top: 1.8rem;
          transition: background 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scorecard-outcome-car {
          position: absolute;
          right: -1rem;
          bottom: -0.8rem;
          z-index: 0;
          width: 10.5rem;
          height: auto;
          pointer-events: none;
          mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 18%, black 52%, black 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 18%, black 52%, black 100%);
          transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scorecard-outcome > :not(.scorecard-outcome-car) {
          position: relative;
          z-index: 1;
        }

        .scorecard-outcome > div {
          min-width: 0;
          max-width: calc(100% - 5rem);
        }

        .scorecard-outcome-icon {
          display: flex;
          height: 2.25rem;
          width: 2.25rem;
          flex: none;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          font-size: 1.15rem;
        }

        .scorecard-outcome h4 {
          color: #f1f2ef;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .scorecard-outcome p {
          margin-top: 0.2rem;
          color: #acafad;
          font-size: 0.75rem;
          line-height: 1.42;
        }

        .scorecard-outcome--traditional {
          background: rgba(255, 255, 255, 0.055);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        .scorecard-outcome--traditional .scorecard-outcome-icon {
          background: rgba(172, 57, 46, 0.13);
          color: #e26357;
        }

        .scorecard-outcome--traditional .scorecard-outcome-car {
          color: #151d24;
          opacity: 0.22;
        }

        .scorecard-outcome--recommended {
          background: linear-gradient(135deg, rgba(232, 183, 63, 0.94), rgba(202, 150, 42, 0.88));
          box-shadow: inset 0 1px 0 rgba(255, 244, 201, 0.5), inset 0 -1px 0 rgba(104, 66, 7, 0.22);
        }

        .scorecard-outcome--recommended .scorecard-outcome-icon {
          background: rgba(30, 25, 15, 0.16);
          color: #11100d;
        }

        .scorecard-outcome--recommended .scorecard-outcome-car {
          color: #2a1c0d;
          opacity: 0.2;
        }

        .scorecard-outcome--recommended h4,
        .scorecard-outcome--recommended p {
          color: #17140d;
        }

        .scorecard-panel--traditional:is(:hover, :focus-within, :focus-visible) .scorecard-outcome--traditional {
          background: rgba(255, 255, 255, 0.075);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.22);
        }

        .scorecard-panel--traditional:is(:hover, :focus-within, :focus-visible) .scorecard-outcome--traditional .scorecard-outcome-car {
          transform: translateX(-5px);
          opacity: 0.25;
        }

        .scorecard-panel--recommended:is(:hover, :focus-within, :focus-visible) .scorecard-outcome--recommended {
          background: linear-gradient(135deg, rgba(239, 192, 73, 0.96), rgba(211, 158, 47, 0.91));
          box-shadow: inset 0 1px 0 rgba(255, 248, 211, 0.58), inset 0 -1px 0 rgba(104, 66, 7, 0.24);
        }

        .scorecard-panel--recommended:is(:hover, :focus-within, :focus-visible) .scorecard-outcome--recommended .scorecard-outcome-car {
          transform: translateX(-5px);
          opacity: 0.23;
        }

        .scorecard-vs-badge {
          display: inline-flex;
          height: 2.8rem;
          width: 2.8rem;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(222, 190, 110, 0.5);
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(31, 34, 36, 0.96), rgba(8, 10, 12, 0.96));
          color: #f4f3ee;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 247, 220, 0.12), inset 0 -1px 0 rgba(200, 160, 68, 0.16);
        }

        @media (max-width: 1150px) {
          .scorecard-row {
            grid-template-columns: 2.65rem minmax(0, 1fr);
            gap: 0.7rem;
          }

          .scorecard-segments {
            grid-column: 2;
            margin-top: 0.1rem;
          }

          .scorecard-status {
            grid-column: 2;
            justify-self: start;
          }

          .scorecard-outcome-car {
            right: -0.75rem;
            bottom: -0.55rem;
            width: 7.85rem;
            opacity: 0.18 !important;
          }
        }

        @media (max-width: 639px) {
          .scorecard-row--traditional.scorecard-row--active,
          .scorecard-row--recommended.scorecard-row--active {
            transform: translate3d(0, -1px, 0);
          }
        }

        @media (min-width: 640px) {
          .scorecard-panel--traditional h3,
          .scorecard-panel--recommended h3 {
            font-size: 1.32rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scorecard-panel,
          .scorecard-panel::before,
          .scorecard-panel::after,
          .scorecard-row,
          .scorecard-row::before,
          .scorecard-icon,
          .scorecard-segment,
          .scorecard-status,
          .scorecard-outcome,
          .scorecard-outcome-car {
            transition: none;
          }

          .scorecard-panel:is(:hover, :focus-within, :focus-visible),
          .scorecard-panel:is(:hover, :focus-within, :focus-visible)::before,
          .scorecard-panel:is(:hover, :focus-within, :focus-visible)::after,
          .scorecard-panel:is(:hover, :focus-within, :focus-visible) .scorecard-icon {
            transform: none;
          }

          .scorecard-row--traditional.scorecard-row--active,
          .scorecard-row--recommended.scorecard-row--active {
            transform: none;
          }

          .scorecard-panel:is(:hover, :focus-within, :focus-visible) .scorecard-outcome-car {
            transform: none;
          }

          .scorecard-panel:is(:hover, :focus-within, :focus-visible) {
            filter: none;
          }

          .scorecard-panel:is(:hover, :focus-within, :focus-visible) .scorecard-segment--traditional,
          .scorecard-panel:is(:hover, :focus-within, :focus-visible) .scorecard-segment--recommended {
            filter: none;
          }
        }

      `}</style>
    </section>
  )
}
