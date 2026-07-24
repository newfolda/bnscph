"use client"

import { type PointerEvent, useEffect, useRef, useState } from "react"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

type Commitment = {
  label: string
}

const commitments: Commitment[] = [
  { label: "Professional Vehicle Evaluation" },
  { label: "Transparent Offers" },
  { label: "Secure Payment Process" },
  { label: "Paperwork Assistance" },
  { label: "Licensed Business" },
  { label: "Responsive Customer Support" },
]

const numberFormatter = new Intl.NumberFormat("en-PH")
const COUNTER_DURATION_MS = 1500

function resetSurfacePhysics(surface: HTMLDivElement) {
  surface.style.setProperty("--seller-trust-tilt-x", "0deg")
  surface.style.setProperty("--seller-trust-tilt-y", "0deg")
  surface.style.setProperty("--seller-trust-reflection-x", "0px")
  surface.style.setProperty("--seller-trust-reflection-y", "0px")
}

function handleSurfacePointerMove(event: PointerEvent<HTMLDivElement>) {
  if (
    event.pointerType !== "mouse" ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return
  }

  const surface = event.currentTarget
  const rect = surface.getBoundingClientRect()
  const normalizedX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
  const normalizedY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))

  surface.style.setProperty("--seller-trust-tilt-x", `${normalizedY * -0.65}deg`)
  surface.style.setProperty("--seller-trust-tilt-y", `${normalizedX * 0.8}deg`)
  surface.style.setProperty("--seller-trust-reflection-x", `${normalizedX * 7}px`)
  surface.style.setProperty("--seller-trust-reflection-y", `${normalizedY * 6}px`)
}

export default function SellerTrustSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const yearsRef = useRef(0)
  const carsRef = useRef(0)
  const [years, setYears] = useState(0)
  const [carsPurchased, setCarsPurchased] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const revealFinalValues = () => {
      yearsRef.current = 7
      carsRef.current = 1000
      setYears(7)
      setCarsPurchased(1000)
      setIsRevealed(true)
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null
        revealFinalValues()
      })

      return () => {
        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || hasAnimatedRef.current) {
          return
        }

        hasAnimatedRef.current = true
        observer.disconnect()
        setIsRevealed(true)
        const startTime = performance.now()

        const animateCounters = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / COUNTER_DURATION_MS, 1)
          const easedProgress = 1 - (1 - progress) ** 4
          const nextYears = Math.round(7 * easedProgress)
          const nextCars = Math.round(1000 * easedProgress)

          if (nextYears !== yearsRef.current) {
            yearsRef.current = nextYears
            setYears(nextYears)
          }

          if (nextCars !== carsRef.current) {
            carsRef.current = nextCars
            setCarsPurchased(nextCars)
          }

          if (progress < 1) {
            animationFrameRef.current = window.requestAnimationFrame(animateCounters)
            return
          }

          animationFrameRef.current = null
          revealFinalValues()
        }

        animationFrameRef.current = window.requestAnimationFrame(animateCounters)
      },
      { threshold: 0.28 },
    )

    observer.observe(content)

    return () => {
      observer.disconnect()
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <section id="seller-trust" className="bg-white py-14 sm:py-16 lg:py-24">
      <Container>
        <div
          ref={contentRef}
          className={`seller-trust-main-panel relative mx-auto max-w-[75rem] overflow-hidden rounded-[2rem] border border-white/80 bg-white px-6 py-8 shadow-[0_30px_72px_rgba(20,24,32,0.16),0_12px_28px_rgba(200,160,68,0.1)] ring-1 ring-white/30 sm:rounded-[2.25rem] sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 ${
            isRevealed ? "seller-trust-is-revealed" : ""
          }`}
        >
          <div aria-hidden="true" className="seller-trust-ambient pointer-events-none absolute inset-0 z-0">
            <span className="seller-trust-ambient-blob seller-trust-ambient-blob--mint" />
            <span className="seller-trust-ambient-blob seller-trust-ambient-blob--yellow" />
            <span className="seller-trust-ambient-blob seller-trust-ambient-blob--pink" />
            <span className="seller-trust-ambient-blob seller-trust-ambient-blob--blue" />
            <span className="seller-trust-ambient-blob seller-trust-ambient-blob--lavender" />
          </div>

          <div className="relative z-10">
            <header className="mx-auto max-w-4xl text-center">
              <SectionPill className="mb-4">WHY SELLERS TRUST US</SectionPill>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                Why Thousands of Sellers Trust Buy &amp; Sell Cars Philippines
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                Built on years of experience, professional vehicle evaluation, and a secure, transparent buying process.
              </p>
            </header>

            <div className="mt-10 grid gap-7 lg:mt-12 lg:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)] lg:gap-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <div
                  onPointerLeave={(event) => resetSurfacePhysics(event.currentTarget)}
                  onPointerMove={handleSurfacePointerMove}
                  className="seller-trust-surface seller-trust-reveal flex min-h-52 flex-col justify-between rounded-[1.5rem] p-6 sm:p-7"
                >
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Years in Business</p>
                  <p className="seller-trust-metric-value mt-7 tabular-nums text-[clamp(3.75rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.06em] text-[var(--primary)]">
                    {years}<span className="ml-1 text-[0.62em]">+</span>
                  </p>
                </div>

                <div
                  onPointerLeave={(event) => resetSurfacePhysics(event.currentTarget)}
                  onPointerMove={handleSurfacePointerMove}
                  className="seller-trust-surface seller-trust-reveal flex min-h-52 flex-col justify-between rounded-[1.5rem] p-6 sm:p-7"
                  style={{ transitionDelay: "90ms" }}
                >
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Cars Purchased</p>
                  <p className="seller-trust-metric-value mt-7 whitespace-nowrap tabular-nums text-[clamp(3.25rem,7.4vw,5rem)] font-bold leading-none tracking-[-0.06em] text-[var(--primary)]">
                    {numberFormatter.format(carsPurchased)}<span className="ml-1 text-[0.62em]">+</span>
                  </p>
                </div>

                <div
                  onPointerLeave={(event) => resetSurfacePhysics(event.currentTarget)}
                  onPointerMove={handleSurfacePointerMove}
                  className="seller-trust-surface seller-trust-same-day seller-trust-reveal relative overflow-hidden rounded-[1.5rem] p-6 sm:col-span-2 sm:p-7"
                  style={{ transitionDelay: "180ms" }}
                >
                  <p className="seller-trust-same-day-value text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-none tracking-[-0.05em] text-[var(--primary)]">
                    SAME-DAY
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">Payment Available</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">For qualified transactions</p>
                </div>
              </div>

              <div
                onPointerLeave={(event) => resetSurfacePhysics(event.currentTarget)}
                onPointerMove={handleSurfacePointerMove}
                className="seller-trust-surface seller-trust-commitments seller-trust-reveal rounded-[1.5rem] p-5 sm:p-6"
                style={{ transitionDelay: "140ms" }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                  Our Professional Commitments
                </h3>
                <ol className="mt-4 divide-y divide-[rgba(95,115,130,0.14)]">
                  {commitments.map((commitment, index) => (
                    <li
                      key={commitment.label}
                      className="seller-trust-commitment-row flex items-center gap-3 py-3.5 first:pt-1 last:pb-1"
                      style={{ transitionDelay: `${260 + index * 115}ms` }}
                    >
                      <span className="w-6 shrink-0 text-xs font-bold tabular-nums text-[var(--primary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--text-primary)]">
                        {commitment.label}
                      </span>
                      <span aria-hidden="true" className="seller-trust-verification-mark">✓</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .seller-trust-ambient {
          overflow: hidden;
          background: #ffffff;
        }

        .seller-trust-ambient-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.88;
        }

        .seller-trust-ambient-blob::before {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          content: "";
        }

        .seller-trust-ambient-blob--mint { top: -24%; left: -14%; width: 57%; height: 62%; }
        .seller-trust-ambient-blob--yellow { top: -29%; left: 28%; width: 52%; height: 58%; }
        .seller-trust-ambient-blob--pink { top: -20%; right: -14%; width: 55%; height: 61%; }
        .seller-trust-ambient-blob--blue { bottom: -28%; left: -13%; width: 54%; height: 58%; }
        .seller-trust-ambient-blob--lavender { right: -14%; bottom: -29%; width: 52%; height: 59%; }

        .seller-trust-ambient-blob--mint::before {
          background: radial-gradient(ellipse, rgba(190, 240, 215, 0.34) 0%, rgba(190, 240, 215, 0.13) 38%, transparent 71%);
          animation: seller-trust-ambient-mint-drift 28s ease-in-out infinite alternate;
        }

        .seller-trust-ambient-blob--yellow::before {
          background: radial-gradient(ellipse, rgba(255, 235, 170, 0.34) 0%, rgba(255, 235, 170, 0.13) 38%, transparent 71%);
          animation: seller-trust-ambient-yellow-drift 32s ease-in-out infinite alternate;
        }

        .seller-trust-ambient-blob--pink::before {
          background: radial-gradient(ellipse, rgba(255, 210, 225, 0.3) 0%, rgba(255, 210, 225, 0.12) 38%, transparent 71%);
          animation: seller-trust-ambient-pink-drift 35s ease-in-out infinite alternate;
        }

        .seller-trust-ambient-blob--blue::before {
          background: radial-gradient(ellipse, rgba(195, 225, 255, 0.32) 0%, rgba(195, 225, 255, 0.12) 38%, transparent 71%);
          animation: seller-trust-ambient-blue-drift 38s ease-in-out infinite alternate;
        }

        .seller-trust-ambient-blob--lavender::before {
          background: radial-gradient(ellipse, rgba(220, 215, 255, 0.27) 0%, rgba(220, 215, 255, 0.1) 38%, transparent 71%);
          animation: seller-trust-ambient-lavender-drift 42s ease-in-out infinite alternate;
        }

        .seller-trust-surface {
          --seller-trust-tilt-x: 0deg;
          --seller-trust-tilt-y: 0deg;
          --seller-trust-reflection-x: 0px;
          --seller-trust-reflection-y: 0px;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.84);
          outline: 1px solid rgba(95, 115, 130, 0.1);
          outline-offset: -1px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.35) 48%, rgba(255, 255, 255, 0.54) 100%);
          box-shadow: 0 16px 34px rgba(20, 24, 32, 0.1), 0 5px 12px rgba(20, 24, 32, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.96), inset 0 -1px 0 rgba(120, 135, 150, 0.12);
          backdrop-filter: blur(16px) saturate(128%);
          -webkit-backdrop-filter: blur(16px) saturate(128%);
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms ease, border-color 280ms ease, filter 280ms ease, opacity 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .seller-trust-surface::before,
        .seller-trust-surface::after {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          content: "";
          border-radius: inherit;
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease;
        }

        .seller-trust-surface::before {
          inset: 0;
          background: radial-gradient(ellipse at 16% 10%, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.3) 18%, transparent 46%);
        }

        .seller-trust-surface::after {
          inset: 1px;
          background: linear-gradient(135deg, transparent 48%, rgba(168, 191, 204, 0.13) 76%, rgba(255, 255, 255, 0.46) 100%);
        }

        .seller-trust-surface > * {
          position: relative;
          z-index: 1;
        }

        .seller-trust-same-day::after {
          background: linear-gradient(135deg, transparent 45%, rgba(200, 160, 68, 0.14) 76%, rgba(255, 248, 218, 0.45) 100%);
        }

        .seller-trust-reveal,
        .seller-trust-commitment-row {
          opacity: 0;
          transform: translate3d(0, 8px, 0);
          transition: opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .seller-trust-is-revealed .seller-trust-reveal,
        .seller-trust-is-revealed .seller-trust-commitment-row {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .seller-trust-verification-mark {
          display: flex;
          width: 1.2rem;
          height: 1.2rem;
          flex: none;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(200, 160, 68, 0.28);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.58);
          color: var(--primary);
          font-size: 0.7rem;
          font-weight: 700;
        }

        @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
          .seller-trust-surface:hover {
            border-color: rgba(255, 255, 255, 0.98);
            box-shadow: 0 23px 46px rgba(20, 24, 32, 0.13), 0 9px 18px rgba(200, 160, 68, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(120, 135, 150, 0.16);
            filter: saturate(1.04) brightness(1.01);
            transform: perspective(1200px) translateY(-4px) rotateX(var(--seller-trust-tilt-x)) rotateY(var(--seller-trust-tilt-y));
          }

          .seller-trust-surface:hover::before {
            transform: translate3d(var(--seller-trust-reflection-x), var(--seller-trust-reflection-y), 0);
          }

          .seller-trust-surface:hover::after {
            transform: translate3d(var(--seller-trust-reflection-x), var(--seller-trust-reflection-y), 0);
            opacity: 0.82;
          }
        }

        @keyframes seller-trust-ambient-mint-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(-10px, 9px, 0) scale(1.05); }
        }

        @keyframes seller-trust-ambient-yellow-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(11px, -8px, 0) scale(1.04); }
        }

        @keyframes seller-trust-ambient-pink-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(12px, 8px, 0) scale(1.05); }
        }

        @keyframes seller-trust-ambient-blue-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(-8px, -10px, 0) scale(1.04); }
        }

        @keyframes seller-trust-ambient-lavender-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(9px, 10px, 0) scale(1.05); }
        }

        @media (prefers-reduced-motion: reduce) {
          .seller-trust-ambient-blob::before {
            animation: none;
          }

          .seller-trust-surface,
          .seller-trust-surface::before,
          .seller-trust-surface::after,
          .seller-trust-reveal,
          .seller-trust-commitment-row {
            transition: none;
          }

          .seller-trust-reveal,
          .seller-trust-commitment-row {
            opacity: 1;
            transform: none;
          }

          .seller-trust-surface:hover,
          .seller-trust-surface:hover::before,
          .seller-trust-surface:hover::after {
            filter: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
