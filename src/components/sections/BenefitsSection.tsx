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
          className="benefits-reveal mx-auto max-w-3xl text-center"
          style={{ "--benefits-delay": "0ms" } as CSSProperties}
        >
          <SectionPill className="mb-4">COMPARE YOUR OPTIONS</SectionPill>
          <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Sell Your Car. Not Your Time.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] lg:text-lg">
            See the difference between managing a private sale and selling directly to a professional car buyer.
          </p>
        </header>

        <div className="benefits-comparison mt-11 sm:mt-12 lg:mt-14">
          <div
            className="benefits-column-headers benefits-reveal hidden lg:grid"
            style={{ "--benefits-delay": "90ms" } as CSSProperties}
          >
            <header className="benefits-column-header benefits-column-header--traditional">
              <h3>Traditional Private Sale</h3>
              <p>You manage the transaction</p>
            </header>
            <header className="benefits-column-header benefits-column-header--preferred">
              <h3>Buy &amp; Sell Cars Philippines</h3>
              <p>We coordinate the purchase</p>
            </header>
          </div>

          <div className="benefits-rows" role="list">
            {comparisonItems.map((item, index) => (
              <article
                key={item.traditional}
                className="benefits-row benefits-reveal"
                role="listitem"
                style={{ "--benefits-delay": `${160 + index * 80}ms` } as CSSProperties}
              >
                <div className="benefits-cell benefits-cell--traditional">
                  <p className="benefits-mobile-label">Traditional Private Sale</p>
                  <TraditionalMarker />
                  <p>{item.traditional}</p>
                </div>
                <div className="benefits-cell benefits-cell--preferred">
                  <p className="benefits-mobile-label">Buy &amp; Sell Cars Philippines</p>
                  <PreferredMarker />
                  <p>{item.preferred}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          className="benefits-reveal mt-8 text-center sm:mt-10"
          style={{ "--benefits-delay": "690ms" } as CSSProperties}
        >
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
      </Container>

      <style>{`
        .benefits-comparison {
          max-width: 70rem;
          margin-right: auto;
          margin-left: auto;
          border-top: 1px solid rgba(31, 31, 31, 0.14);
          border-bottom: 1px solid rgba(31, 31, 31, 0.14);
        }

        .benefits-column-headers,
        .benefits-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .benefits-column-headers {
          border-bottom: 1px solid rgba(31, 31, 31, 0.14);
        }

        .benefits-column-header {
          padding: 1.35rem 1.5rem 1.25rem;
        }

        .benefits-column-header h3 {
          font-size: 0.76rem;
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

        .benefits-column-header--traditional { color: #6b7077; }
        .benefits-column-header--preferred {
          border-left: 1px solid rgba(200, 160, 68, 0.38);
          color: #1f1f1f;
        }
        .benefits-column-header--preferred h3 { color: #9a7425; }

        .benefits-row {
          border-bottom: 1px solid rgba(31, 31, 31, 0.11);
          transition: background-color 200ms ease;
        }

        .benefits-row:last-child { border-bottom: 0; }

        .benefits-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
          padding: 1.55rem 1.5rem;
          font-size: 0.975rem;
          line-height: 1.5;
        }

        .benefits-cell--traditional { color: #656a71; }
        .benefits-cell--preferred {
          border-left: 1px solid rgba(200, 160, 68, 0.28);
          background: rgba(200, 160, 68, 0.035);
          color: #24211c;
          font-weight: 600;
        }

        .benefits-marker { flex: 0 0 auto; }
        .benefits-marker--traditional { width: 0.65rem; height: 1px; background: #9aa0a6; }
        .benefits-marker--preferred { width: 1rem; height: 1rem; color: #b68e33; }
        .benefits-mobile-label { display: none; }

        .benefits-cta {
          background: var(--primary) !important;
          box-shadow: 0 8px 18px rgba(143, 104, 25, 0.16);
          transition: transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
        }

        .benefits-cta:hover {
          background: var(--primary-hover) !important;
          box-shadow: 0 10px 22px rgba(143, 104, 25, 0.2);
          transform: translateY(-1px);
        }

        .benefits-reveal {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 500ms ease, transform 500ms ease;
          transition-delay: var(--benefits-delay, 0ms);
        }

        .benefits-section--entered .benefits-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        @media (hover: hover) and (pointer: fine) {
          .benefits-row:hover { background: rgba(31, 31, 31, 0.018); }
          .benefits-row:hover .benefits-cell--preferred { color: #171511; }
        }

        @media (max-width: 1023px) {
          .benefits-comparison { max-width: 44rem; }

          .benefits-row {
            display: block;
            padding: 1.25rem 0;
          }

          .benefits-cell {
            position: relative;
            padding: 0.65rem 0;
            font-size: 0.975rem;
          }

          .benefits-cell--traditional { color: #656a71; }
          .benefits-cell--preferred {
            margin-top: 0.65rem;
            padding: 0.8rem 0.9rem;
            border-left: 2px solid rgba(200, 160, 68, 0.58);
            background: rgba(200, 160, 68, 0.045);
          }

          .benefits-mobile-label {
            display: block;
            position: absolute;
            top: -0.1rem;
            left: 1.6rem;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.065em;
            line-height: 1;
            text-transform: uppercase;
          }

          .benefits-cell--traditional .benefits-mobile-label { color: #8a8f96; }
          .benefits-cell--preferred .benefits-mobile-label { color: #97732b; }
          .benefits-cell > p:last-child { padding-top: 0.8rem; }
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
