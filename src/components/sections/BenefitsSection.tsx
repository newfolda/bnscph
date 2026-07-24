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

function TraditionalMarker() {
  return <span aria-hidden="true" className="benefits-marker benefits-marker--traditional" />
}

function PreferredMarker() {
  return (
    <svg
      aria-hidden="true"
      className="benefits-marker benefits-marker--preferred"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="m3.3 8.15 3 3.05 6.45-6.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
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
        <header
          className="benefits-reveal mx-auto max-w-[46rem] text-center"
          style={{ "--benefits-delay": "0ms" } as CSSProperties}
        >
          <SectionPill className="mb-4">COMPARE YOUR OPTIONS</SectionPill>
          <h2 className="mx-auto max-w-[42rem] text-3xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem]">
            Sell Your Car. Not Your Time.
          </h2>
          <p className="mx-auto mt-4 max-w-[36rem] text-base leading-[1.65] text-[var(--text-secondary)]">
            See the difference between managing a private sale and selling directly to a professional car buyer.
          </p>
        </header>

        <div className="benefits-comparison mt-11 sm:mt-12 lg:mt-14">
          <div
            className="benefits-column-headers benefits-reveal hidden lg:grid"
            style={{ "--benefits-delay": "80ms" } as CSSProperties}
          >
            <header className="benefits-column-header benefits-column-header--traditional">
              <h3>Traditional Private Sale</h3>
              <p>You manage the transaction</p>
            </header>
            <header className="benefits-column-header benefits-column-header--preferred">
              <h3>Buy &amp; Sell Cars Philippines</h3>
              <p>We coordinate the purchase</p>
              <span aria-hidden="true" className="benefits-preferred-rule" />
            </header>
          </div>

          <div className="benefits-rows" role="list">
            {comparisonItems.map((item, index) => (
              <article
                key={item.traditional}
                className="benefits-row benefits-reveal"
                role="listitem"
                style={{ "--benefits-delay": `${130 + index * 70}ms` } as CSSProperties}
              >
                <div className="benefits-cell benefits-cell--traditional">
                  <p className="benefits-mobile-label">Traditional Private Sale</p>
                  <div className="benefits-cell-content">
                    <TraditionalMarker />
                    <p>{item.traditional}</p>
                  </div>
                </div>
                <div
                  className={`benefits-cell benefits-cell--preferred ${item.preferred === "Secure payment options" ? "benefits-cell--featured" : ""}`}
                >
                  <p className="benefits-mobile-label">Buy &amp; Sell Cars PH</p>
                  <div className="benefits-cell-content">
                    <PreferredMarker />
                    <p>{item.preferred}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          className="benefits-cta-grid benefits-reveal mt-7 sm:mt-8"
          style={{ "--benefits-delay": "600ms" } as CSSProperties}
        >
          <div aria-hidden="true" className="hidden lg:block" />
          <div className="benefits-cta-area text-center lg:text-left">
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
      </Container>

      <style>{`
        .benefits-comparison {
          position: relative;
          max-width: 63rem;
          margin-right: auto;
          margin-left: auto;
        }

        .benefits-column-headers,
        .benefits-row,
        .benefits-cta-grid {
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
        }

        .benefits-column-headers,
        .benefits-row {
          display: grid;
        }

        .benefits-column-headers {
          border-bottom: 1px solid rgba(31, 31, 31, 0.14);
        }

        .benefits-column-header {
          position: relative;
          padding: 0 1.25rem 1.3rem;
        }

        .benefits-column-header h3 {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .benefits-column-header p {
          margin-top: 0.45rem;
          font-size: 0.875rem;
          line-height: 1.45;
        }

        .benefits-column-header--traditional { color: #737880; }
        .benefits-column-header--preferred {
          padding-left: 1.6rem;
          color: #24211c;
        }
        .benefits-column-header--preferred h3 { color: #9a7425; }

        .benefits-preferred-rule {
          display: block;
          width: 2.75rem;
          height: 1px;
          margin-top: 0.9rem;
          background: #c8a044;
        }

        .benefits-comparison::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 46%;
          width: 1px;
          background: rgba(200, 160, 68, 0.38);
          content: "";
          pointer-events: none;
        }

        .benefits-cell {
          position: relative;
          min-width: 0;
          padding: 1.35rem 1.25rem;
        }

        .benefits-cell::after {
          position: absolute;
          right: 1.25rem;
          bottom: 0;
          left: 2.5rem;
          height: 1px;
          background: rgba(31, 31, 31, 0.1);
          content: "";
        }

        .benefits-cell--traditional {
          color: #666b72;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.45;
        }

        .benefits-cell--preferred {
          padding-left: 1.6rem;
          background: rgba(200, 160, 68, 0.025);
          color: #20201d;
          font-size: 0.98rem;
          font-weight: 600;
          line-height: 1.45;
        }

        .benefits-cell--preferred::after { background: rgba(200, 160, 68, 0.16); }
        .benefits-cell--featured { background: rgba(200, 160, 68, 0.042); font-weight: 650; }
        .benefits-row:last-child .benefits-cell::after { display: none; }

        .benefits-cell-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .benefits-marker { flex: 0 0 1.15rem; }
        .benefits-marker--traditional { width: 0.75rem; height: 1px; margin-left: 0.2rem; background: #9aa0a6; }
        .benefits-marker--preferred { width: 0.95rem; height: 0.95rem; color: #b68e33; }
        .benefits-mobile-label { display: none; }

        .benefits-cta-grid {
          display: grid;
          max-width: 63rem;
          margin-right: auto;
          margin-left: auto;
        }

        .benefits-cta-area { padding-left: 1.6rem; }

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
          transform: translateY(6px);
          transition: opacity 480ms ease, transform 480ms ease;
          transition-delay: var(--benefits-delay, 0ms);
        }

        .benefits-section--entered .benefits-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        @media (hover: hover) and (pointer: fine) {
          .benefits-row:hover .benefits-cell--traditional { color: #555a61; }
          .benefits-row:hover .benefits-cell--preferred { color: #151410; }
          .benefits-row:hover .benefits-marker--preferred { opacity: 0.92; }
        }

        @media (max-width: 1023px) {
          .benefits-comparison { max-width: 42rem; }
          .benefits-comparison::before { display: none; }

          .benefits-row {
            display: block;
            padding: 1.25rem 0;
          }

          .benefits-cell {
            padding: 0;
          }

          .benefits-cell::after { display: none; }

          .benefits-cell--preferred {
            margin-top: 0.8rem;
            padding: 0.85rem 0.9rem;
            border-left: 2px solid rgba(200, 160, 68, 0.6);
            border-radius: 0.75rem;
            background: rgba(200, 160, 68, 0.045);
          }

          .benefits-cell-content { margin-top: 0.45rem; }

          .benefits-mobile-label {
            display: block;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.065em;
            line-height: 1.2;
            text-transform: uppercase;
          }

          .benefits-cell--traditional .benefits-mobile-label { color: #8a8f96; }
          .benefits-cell--preferred .benefits-mobile-label { color: #97732b; }

          .benefits-cta-grid {
            display: block;
            max-width: 42rem;
          }

          .benefits-cta-area { padding-left: 0; text-align: center; }
        }

        @media (max-width: 639px) {
          .benefits-cell { font-size: 0.94rem; }
          .benefits-cta { width: 100%; max-width: 22rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .benefits-reveal,
          .benefits-section--entered .benefits-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .benefits-row,
          .benefits-cta { transition: none; }
          .benefits-cta:hover { transform: none; }
        }
      `}</style>
    </section>
  )
}
