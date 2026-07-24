"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import SellCarModal from "../sell-car/SellCarModal"
import Button from "../ui/Button"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

type ComparisonItem = {
  traditional: string
  preferred: string
}

const comparisonItems: ComparisonItem[] = [
  { traditional: "Find and screen buyers", preferred: "We buy directly" },
  { traditional: "Schedule multiple viewings", preferred: "One professional inspection" },
  { traditional: "Manage negotiations", preferred: "Receive a clear offer" },
  { traditional: "Handle documents and follow-ups", preferred: "Paperwork assistance" },
  { traditional: "Wait for uncertain payment", preferred: "Secure payment options" },
  { traditional: "Days or weeks to complete", preferred: "A faster, coordinated process" },
]

function DirectionConnector() {
  return (
    <span aria-hidden="true" className="benefits-direction-connector">
      <span className="benefits-direction-line" />
      <svg fill="none" viewBox="0 0 12 12">
        <path d="M2 6h7M6.5 2.5 10 6 6.5 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
      </svg>
    </span>
  )
}

function PreferredMarker() {
  return (
    <svg aria-hidden="true" className="benefits-preferred-marker" fill="none" viewBox="0 0 16 16">
      <path d="m3.3 8.15 3 3.05 6.45-6.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => setHasEntered(true))
      return () => window.cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      className={`benefits-section bg-[#fffefd] py-16 sm:py-20 lg:py-24 ${hasEntered ? "benefits-section--entered" : ""}`}
    >
      <Container>
        <div className="benefits-layout">
          <div className="benefits-introduction benefits-reveal" style={{ "--benefits-delay": "0ms" } as CSSProperties}>
            <SectionPill className="mb-4">COMPARE YOUR OPTIONS</SectionPill>
            <h2 className="max-w-[28rem] text-3xl font-bold leading-[1.02] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[3.35rem]">
              Sell Your Car.
              <br />
              Not Your Time.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-[1.65] text-[var(--text-secondary)]">
              See how selling directly to a professional car buyer removes the work and uncertainty of a private sale.
            </p>

            <div className="mt-8">
              <SellCarModal
                trigger={(openSellCarModal) => (
                  <Button
                    className="benefits-cta h-14 rounded-full px-7 text-sm font-semibold tracking-[0.01em] sm:px-8 sm:text-base"
                    onClick={openSellCarModal}
                  >
                    Get My Free Car Valuation
                  </Button>
                )}
              />
              <p className="mt-3 text-sm text-[var(--text-secondary)]">No obligation. Free vehicle evaluation.</p>
            </div>
          </div>

          <div className="benefits-canvas benefits-reveal" style={{ "--benefits-delay": "80ms" } as CSSProperties}>
            <header className="benefits-canvas-header">
              <span className="benefits-canvas-label benefits-canvas-label--traditional">Private Sale</span>
              <span aria-hidden="true" className="benefits-canvas-header-arrow">→</span>
              <span className="benefits-canvas-label benefits-canvas-label--preferred">Professional Buyer</span>
            </header>

            <div className="benefits-transformation-rows" role="list">
              {comparisonItems.map((item, index) => (
                <article
                  key={item.traditional}
                  className={`benefits-transformation-row benefits-reveal ${item.preferred === "Secure payment options" ? "benefits-transformation-row--featured" : ""}`}
                  role="listitem"
                  style={{ "--benefits-delay": `${150 + index * 65}ms` } as CSSProperties}
                >
                  <span aria-hidden="true" className="benefits-row-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="benefits-traditional-outcome">
                    <p className="benefits-mobile-side-label">Private Sale</p>
                    <p>{item.traditional}</p>
                  </div>
                  <DirectionConnector />
                  <span aria-hidden="true" className="benefits-mobile-direction">↓</span>
                  <div className="benefits-preferred-outcome">
                    <p className="benefits-mobile-side-label">Professional Buyer</p>
                    <div className="benefits-preferred-content">
                      <PreferredMarker />
                      <p>{item.preferred}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .benefits-layout {
          display: grid;
          align-items: center;
          gap: 3rem;
        }

        .benefits-introduction { max-width: 28rem; }

        .benefits-canvas {
          overflow: hidden;
          border: 1px solid rgba(31, 31, 31, 0.07);
          border-radius: 1.75rem;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 46%, rgba(200, 160, 68, 0.035) 46%, rgba(200, 160, 68, 0.075) 100%);
          box-shadow: 0 24px 60px rgba(31, 31, 31, 0.08);
        }

        .benefits-canvas-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1.35rem 1.5rem 1.1rem;
          border-bottom: 1px solid rgba(31, 31, 31, 0.08);
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          line-height: 1.25;
          text-transform: uppercase;
        }

        .benefits-canvas-label--traditional { color: #83878d; }
        .benefits-canvas-header-arrow { color: #9a7425; font-size: 0.95rem; }
        .benefits-canvas-label--preferred { color: #9a7425; }

        .benefits-transformation-rows { position: relative; padding: 0.2rem 1.5rem; }

        .benefits-transformation-row {
          position: relative;
          display: grid;
          grid-template-columns: 2rem minmax(0, 0.9fr) 3.5rem minmax(0, 1.1fr);
          align-items: center;
          min-height: 5.55rem;
        }

        .benefits-transformation-row::after {
          position: absolute;
          right: 0.5rem;
          bottom: 0;
          left: 2.75rem;
          height: 1px;
          background: rgba(31, 31, 31, 0.075);
          content: "";
        }

        .benefits-transformation-row:last-child::after { display: none; }

        .benefits-row-number {
          align-self: start;
          padding-top: 1.62rem;
          color: #aa956a;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .benefits-traditional-outcome {
          color: #72777f;
          font-size: 0.94rem;
          font-weight: 400;
          line-height: 1.45;
        }

        .benefits-direction-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b68e33;
        }

        .benefits-direction-line {
          width: 2rem;
          height: 1px;
          background: linear-gradient(90deg, rgba(120, 120, 120, 0.32), rgba(200, 160, 68, 0.72));
        }

        .benefits-direction-connector svg { width: 0.85rem; height: 0.85rem; margin-left: -0.08rem; }
        .benefits-mobile-direction { display: none; }

        .benefits-preferred-outcome {
          position: relative;
          padding: 1.35rem 0 1.35rem 1.35rem;
          border-left: 1px solid rgba(200, 160, 68, 0.3);
          color: #20201d;
          font-size: 0.98rem;
          font-weight: 600;
          line-height: 1.45;
        }

        .benefits-preferred-outcome::before {
          position: absolute;
          top: 50%;
          left: -0.24rem;
          width: 0.44rem;
          height: 0.44rem;
          border-radius: 9999px;
          background: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 250, 236, 0.9);
          content: "";
        }

        .benefits-preferred-content { display: flex; align-items: center; gap: 0.65rem; }
        .benefits-preferred-marker { flex: 0 0 auto; width: 0.95rem; height: 0.95rem; color: #b68e33; }
        .benefits-mobile-side-label { display: none; }

        .benefits-transformation-row--featured .benefits-preferred-outcome {
          background: rgba(200, 160, 68, 0.035);
          font-weight: 650;
        }

        .benefits-cta {
          background: var(--primary) !important;
          box-shadow: 0 6px 15px rgba(143, 104, 25, 0.14);
          transition: transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
        }

        .benefits-cta:hover {
          background: var(--primary-hover) !important;
          box-shadow: 0 8px 18px rgba(143, 104, 25, 0.18);
          transform: translateY(-1px);
        }

        .benefits-reveal {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 520ms ease, transform 520ms ease;
          transition-delay: var(--benefits-delay, 0ms);
        }

        .benefits-transformation-row.benefits-reveal { transform: translateX(6px); transition-duration: 480ms; }
        .benefits-section--entered .benefits-reveal { opacity: 1; transform: translateY(0); }
        .benefits-section--entered .benefits-transformation-row.benefits-reveal { transform: translateX(0); }

        @media (hover: hover) and (pointer: fine) {
          .benefits-transformation-row { transition: background-color 200ms ease; }
          .benefits-transformation-row:hover { background: rgba(200, 160, 68, 0.018); }
          .benefits-transformation-row:hover .benefits-traditional-outcome { color: #5c6269; }
          .benefits-transformation-row:hover .benefits-direction-connector { color: #9a7425; }
          .benefits-transformation-row:hover .benefits-direction-line { background: linear-gradient(90deg, rgba(120, 120, 120, 0.38), rgba(200, 160, 68, 0.92)); }
          .benefits-transformation-row:hover .benefits-preferred-content { transform: translateX(2px); }
          .benefits-transformation-row:hover .benefits-preferred-outcome::before { opacity: 1; }
          .benefits-preferred-content { transition: transform 200ms ease; }
        }

        @media (min-width: 1024px) {
          .benefits-layout {
            grid-template-columns: minmax(17rem, 0.78fr) minmax(0, 1.5fr);
            gap: clamp(4rem, 6vw, 5.5rem);
          }
        }

        @media (max-width: 1023px) {
          .benefits-layout { max-width: 42rem; margin: 0 auto; }
          .benefits-introduction { max-width: 30rem; }
          .benefits-canvas { border-radius: 1.5rem; }

          .benefits-canvas-header { padding: 1.2rem 1.25rem 1rem; }
          .benefits-transformation-rows { padding: 0.1rem 1.25rem; }
          .benefits-transformation-row {
            display: block;
            min-height: 0;
            padding: 1.2rem 0;
          }

          .benefits-transformation-row::after { right: 0; left: 0; }
          .benefits-row-number { display: block; padding-top: 0; margin-bottom: 0.8rem; }

          .benefits-traditional-outcome,
          .benefits-preferred-outcome { font-size: 0.96rem; }

          .benefits-mobile-side-label {
            display: block;
            margin-bottom: 0.4rem;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.065em;
            line-height: 1.2;
            text-transform: uppercase;
          }

          .benefits-traditional-outcome .benefits-mobile-side-label { color: #858a91; }
          .benefits-preferred-outcome {
            margin-top: 0.7rem;
            padding: 0.85rem 0.9rem 0.85rem 1rem;
            border-left: 2px solid rgba(200, 160, 68, 0.6);
            border-radius: 0.85rem;
            background: rgba(200, 160, 68, 0.045);
          }

          .benefits-preferred-outcome::before { display: none; }
          .benefits-preferred-outcome .benefits-mobile-side-label { color: #97732b; }
          .benefits-direction-connector { display: none; }
          .benefits-mobile-direction { display: block; margin: 0.65rem 0; color: #b68e33; font-size: 1rem; line-height: 1; }
          .benefits-preferred-content { gap: 0.6rem; }
        }

        @media (max-width: 639px) {
          .benefits-canvas { border-radius: 1.25rem; }
          .benefits-canvas-header { gap: 0.45rem; padding: 1.1rem 1rem 0.95rem; font-size: 0.62rem; letter-spacing: 0.09em; }
          .benefits-transformation-rows { padding: 0.1rem 1rem; }
          .benefits-cta { width: 100%; max-width: 22rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .benefits-reveal,
          .benefits-section--entered .benefits-reveal,
          .benefits-section--entered .benefits-transformation-row.benefits-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .benefits-transformation-row,
          .benefits-preferred-content,
          .benefits-cta { transition: none; }
          .benefits-cta:hover { transform: none; }
        }
      `}</style>
    </section>
  )
}
