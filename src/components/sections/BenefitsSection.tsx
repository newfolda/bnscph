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
            <h2 className="max-w-[25rem] text-3xl font-bold leading-[0.99] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[3.35rem]">
              Sell Your Car.
              <br />
              Not Your Time.
            </h2>
            <p className="mt-[1.4rem] max-w-[26rem] text-base leading-[1.7] text-[var(--text-secondary)]">
              From valuation to payment, we handle every step so you can sell with confidence.
            </p>

            <div className="mt-8">
              <SellCarModal
                trigger={(openSellCarModal) => (
                  <Button
                    className="benefits-cta h-14 rounded-full px-7 text-sm font-semibold tracking-normal sm:px-8 sm:text-base"
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
              <span aria-hidden="true" />
              <span className="benefits-canvas-label benefits-canvas-label--traditional">PRIVATE SALE</span>
              <span className="benefits-canvas-label benefits-canvas-label--preferred">SELL DIRECTLY TO US</span>
            </header>

            <div className="benefits-transformation-rows" role="list">
              {comparisonItems.map((item, index) => (
                <article
                  key={item.traditional}
                  className={`benefits-transformation-row benefits-reveal ${item.preferred === "Secure payment options" ? "benefits-transformation-row--featured" : ""}`}
                  role="listitem"
                  style={{ "--benefits-delay": `${220 + index * 130}ms` } as CSSProperties}
                >
                  <span aria-hidden="true" className="benefits-row-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="benefits-traditional-outcome">
                    <p className="benefits-mobile-side-label">Private Sale</p>
                    <p>{item.traditional}</p>
                  </div>
                  <div className="benefits-preferred-outcome">
                    <p className="benefits-mobile-side-label">Professional Car Buyer</p>
                    <p>{item.preferred}</p>
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
          align-items: start;
          max-width: 77rem;
          margin: 0 auto;
          gap: 3rem;
        }

        .benefits-introduction { max-width: 26rem; }

        .benefits-canvas {
          overflow: hidden;
          max-width: 49rem;
          border: 1px solid rgba(31, 31, 31, 0.07);
          border-radius: 1.75rem;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 255, 255, 0.99) 42%, rgba(253, 251, 245, 0.985) 48%, rgba(250, 246, 234, 0.97) 56%, rgba(250, 246, 234, 0.97) 100%);
          box-shadow: 0 24px 60px rgba(23, 23, 23, 0.07), 0 8px 22px rgba(23, 23, 23, 0.035), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .benefits-canvas-header,
        .benefits-transformation-row {
          display: grid;
          grid-template-columns: 2.5rem minmax(0, 1fr) minmax(0, 1.1fr);
        }

        .benefits-canvas-header {
          align-items: center;
          padding: 1.65rem 1.5rem 1.45rem;
          border-bottom: 1px solid rgba(31, 31, 31, 0.08);
        }

        .benefits-canvas-label {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.075em;
          line-height: 1.35;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .benefits-canvas-label--traditional { color: #666c73; }
        .benefits-canvas-label--preferred { color: #8f6a1f; }

        .benefits-transformation-rows { padding: 0.15rem 1.5rem; }

        .benefits-transformation-row {
          position: relative;
          align-items: center;
          min-height: 5.2rem;
          padding: 0.15rem 0;
        }

        .benefits-transformation-row::after {
          position: absolute;
          right: 0.5rem;
          bottom: 0;
          left: 2.9rem;
          height: 1px;
          background: rgba(31, 31, 31, 0.075);
          content: "";
        }

        .benefits-transformation-row:last-child::after { display: none; }

        .benefits-row-number {
          align-self: start;
          padding-top: 1.48rem;
          color: #aa956a;
          font-size: 0.7rem;
          font-variant-numeric: tabular-nums;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .benefits-traditional-outcome {
          color: #666b72;
          font-size: 0.96rem;
          font-weight: 500;
          line-height: 1.45;
        }

        .benefits-preferred-outcome {
          padding: 1.25rem 0 1.25rem 1.2rem;
          color: #20201d;
          font-size: 0.99rem;
          font-weight: 600;
          line-height: 1.5;
        }

        .benefits-mobile-side-label { display: none; }

        .benefits-transformation-row--featured .benefits-preferred-outcome {
          background: linear-gradient(90deg, rgba(200, 160, 68, 0) 0%, rgba(200, 160, 68, 0.025) 28%, rgba(200, 160, 68, 0.06) 100%);
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

        .benefits-canvas.benefits-reveal { transition-duration: 360ms; }
        .benefits-transformation-row.benefits-reveal {
          opacity: 0;
          transform: translateY(14px) scale(0.985);
          transition: opacity 520ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--benefits-delay, 0ms);
        }
        .benefits-section--entered .benefits-reveal { opacity: 1; transform: translateY(0); }
        .benefits-section--entered .benefits-transformation-row.benefits-reveal { opacity: 1; transform: translateY(0) scale(1); }

        @media (hover: hover) and (pointer: fine) {
          .benefits-transformation-row { transition: background-color 200ms ease; }
          .benefits-transformation-row:hover { background: rgba(200, 160, 68, 0.016); }
          .benefits-transformation-row:hover .benefits-traditional-outcome { color: #585e65; }
          .benefits-transformation-row:hover .benefits-preferred-outcome { background: linear-gradient(90deg, rgba(200, 160, 68, 0) 0%, rgba(200, 160, 68, 0.022) 28%, rgba(200, 160, 68, 0.055) 100%); color: #171612; }
        }

        @media (min-width: 1024px) {
          .benefits-layout {
            grid-template-columns: minmax(18rem, 0.82fr) minmax(34rem, 1.45fr);
            gap: clamp(4rem, 5vw, 5.5rem);
          }

          .benefits-introduction { padding-top: 2.6rem; }
        }

        @media (max-width: 1023px) {
          .benefits-layout { max-width: 46rem; margin: 0 auto; }
          .benefits-introduction { max-width: 36rem; margin: 0 auto; text-align: center; }
          .benefits-introduction h2,
          .benefits-introduction p { margin-right: auto; margin-left: auto; }
          .benefits-canvas { max-width: 46rem; }

          .benefits-canvas-header { padding: 1.3rem 1.25rem 1.1rem; }
          .benefits-transformation-rows { padding: 0.1rem 1.25rem; }
          .benefits-transformation-row {
            display: block;
            min-height: 0;
            padding: 1.25rem 0;
          }

          .benefits-transformation-row::after { right: 0; left: 0; }
          .benefits-row-number { display: block; padding-top: 0; margin-bottom: 0.8rem; }
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
            margin-top: 0.75rem;
            padding: 0.85rem 0.9rem 0.85rem 1rem;
            border-left: 2px solid rgba(200, 160, 68, 0.6);
            border-radius: 0.75rem;
            background: rgba(200, 160, 68, 0.045);
          }

          .benefits-preferred-outcome .benefits-mobile-side-label { color: #97732b; }
        }

        @media (max-width: 639px) {
          .benefits-canvas { border-radius: 1.25rem; }
          .benefits-canvas-header { grid-template-columns: 1.7rem minmax(0, 1fr) minmax(0, 1.1fr); padding: 1.1rem 1rem 0.95rem; }
          .benefits-canvas-label { font-size: 0.68rem; letter-spacing: 0.055em; }
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
          .benefits-cta { transition: none; }
          .benefits-cta:hover { transform: none; }
        }
      `}</style>
    </section>
  )
}
