"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import SellCarModal from "../sell-car/SellCarModal"
import Button from "../ui/Button"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

type ComparisonItem = {
  category: string
  traditional: string
  preferred: string
}

const comparisonItems: ComparisonItem[] = [
  {
    category: "Selling Effort",
    traditional: "You manage listings, messages, viewings, and negotiations.",
    preferred: "We coordinate the evaluation and buying process.",
  },
  {
    category: "Time Required",
    traditional: "Finding the right buyer can take days or weeks.",
    preferred: "Inspection and payment can be completed quickly.",
  },
  {
    category: "Buyer Reliability",
    traditional: "No-shows, low offers, and payment uncertainty are common.",
    preferred: "You deal directly with a professional vehicle buyer.",
  },
  {
    category: "Paperwork",
    traditional: "You coordinate documents, transfers, and follow-ups.",
    preferred: "We assist with the required documents and transfer process.",
  },
  {
    category: "Payment Security",
    traditional: "Payment may remain uncertain until the transaction is complete.",
    preferred: "Receive payment through cash, bank transfer, or bank deposit.",
  },
]

function TraditionalMarker() {
  return <span aria-hidden="true" className="benefits-marker benefits-marker--traditional" />
}

function PreferredMarker() {
  return (
    <svg aria-hidden="true" className="benefits-marker benefits-marker--preferred" fill="none" viewBox="0 0 16 16">
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reducedMotion.matches) {
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
      className={`benefits-section relative isolate overflow-hidden bg-[#fffefd] py-16 sm:py-20 lg:py-28 ${hasEntered ? "benefits-section--entered" : ""}`}
    >
      <div aria-hidden="true" className="benefits-ambience pointer-events-none absolute inset-0 -z-10">
        <span className="benefits-ambience__mint" />
        <span className="benefits-ambience__gold" />
        <span className="benefits-ambience__lavender" />
      </div>

      <Container>
        <header className="benefits-reveal mx-auto max-w-3xl text-center" style={{ "--benefits-delay": "0ms" } as CSSProperties}>
          <SectionPill className="mb-5">WHY CHOOSE US</SectionPill>
          <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Sell Your Car. Not Your Time.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Skip the listings, repeated inquiries, uncertain buyers, and complicated paperwork.
          </p>
        </header>

        <div className="benefits-comparison benefits-reveal mt-12 sm:mt-14 lg:mt-16" style={{ "--benefits-delay": "100ms" } as CSSProperties}>
          <div className="benefits-grid benefits-grid--headers hidden lg:grid">
            <div />
            <header className="benefits-column-header benefits-column-header--traditional">
              <h3>Traditional Private Sale</h3>
              <p>You manage the entire transaction.</p>
            </header>
            <header className="benefits-column-header benefits-column-header--preferred">
              <h3>Buy &amp; Sell Cars Philippines</h3>
              <p>We make the selling process easier.</p>
            </header>
          </div>

          <div className="benefits-rows" role="list">
            {comparisonItems.map((item, index) => (
              <article
                key={item.category}
                className="benefits-row benefits-reveal"
                role="listitem"
                style={{ "--benefits-delay": `${180 + index * 90}ms` } as CSSProperties}
              >
                <h3 className="benefits-category">{item.category}</h3>
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

          <div className="benefits-summary benefits-reveal" style={{ "--benefits-delay": "670ms" } as CSSProperties}>
            <p className="benefits-summary__traditional">More effort. More uncertainty.</p>
            <p className="benefits-summary__preferred">Less hassle. Clearer process.</p>
          </div>
        </div>

        <div className="benefits-reveal mt-10 text-center sm:mt-12" style={{ "--benefits-delay": "760ms" } as CSSProperties}>
          <SellCarModal
            trigger={(openSellCarModal) => (
              <Button
                className="benefits-cta h-14 rounded-full px-7 text-sm font-semibold uppercase tracking-[0.04em] sm:px-8"
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
        .benefits-ambience {
          background:
            radial-gradient(ellipse at 15% 46%, rgba(197, 233, 216, 0.18) 0%, transparent 35%),
            radial-gradient(ellipse at 82% 43%, rgba(249, 225, 162, 0.22) 0%, transparent 38%),
            radial-gradient(ellipse at 58% 106%, rgba(222, 215, 249, 0.16) 0%, transparent 42%);
        }

        .benefits-ambience span {
          position: absolute;
          border-radius: 9999px;
          filter: blur(38px);
          opacity: 0.26;
        }

        .benefits-ambience__mint { top: 20%; left: -8%; width: 28rem; height: 28rem; background: #cdebdc; }
        .benefits-ambience__gold { top: 12%; right: -10%; width: 32rem; height: 30rem; background: #f7dfa1; }
        .benefits-ambience__lavender { bottom: -24rem; left: 36%; width: 34rem; height: 30rem; background: #e3dffc; }

        .benefits-grid,
        .benefits-row {
          display: grid;
          grid-template-columns: minmax(0, 22%) minmax(0, 39%) minmax(0, 39%);
        }

        .benefits-grid--headers {
          align-items: stretch;
          border-bottom: 1px solid rgba(31, 31, 31, 0.12);
        }

        .benefits-column-header {
          padding: 1.15rem 1.35rem 1.2rem;
        }

        .benefits-column-header h3 {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.065em;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .benefits-column-header p { margin-top: 0.45rem; font-size: 0.875rem; line-height: 1.45; }
        .benefits-column-header--traditional { color: #5f6368; }
        .benefits-column-header--preferred {
          border: 1px solid rgba(200, 160, 68, 0.35);
          border-bottom: 0;
          border-radius: 1rem 1rem 0 0;
          background: rgba(253, 246, 223, 0.7);
          color: #1f1f1f;
        }
        .benefits-column-header--preferred h3 { color: #9a7425; }

        .benefits-row { position: relative; border-bottom: 1px solid rgba(31, 31, 31, 0.12); transition: background-color 240ms ease; }
        .benefits-category { display: flex; align-items: center; padding: 1.5rem 1.1rem 1.5rem 0; font-size: 0.95rem; font-weight: 650; line-height: 1.35; color: #1f1f1f; }
        .benefits-cell { position: relative; display: flex; gap: 0.7rem; padding: 1.5rem 1.35rem; font-size: 0.94rem; line-height: 1.6; color: #5f6368; }
        .benefits-cell--preferred {
          border-right: 1px solid rgba(200, 160, 68, 0.35);
          border-left: 1px solid rgba(200, 160, 68, 0.35);
          background: rgba(253, 246, 223, 0.58);
          color: #3f3d36;
          font-weight: 500;
        }
        .benefits-marker { flex: 0 0 auto; margin-top: 0.52rem; }
        .benefits-marker--traditional { width: 0.55rem; height: 1px; background: #a1a1aa; }
        .benefits-marker--preferred { width: 1rem; height: 1rem; color: #b68e33; }
        .benefits-mobile-label { display: none; }

        .benefits-summary { display: grid; grid-template-columns: minmax(0, 22%) minmax(0, 39%) minmax(0, 39%); margin-top: 1.25rem; }
        .benefits-summary p { margin: 0; padding: 1rem 1.35rem; font-size: 0.95rem; font-weight: 600; line-height: 1.45; }
        .benefits-summary__traditional { grid-column: 2; color: #62656a; background: rgba(242, 243, 244, 0.82); border-radius: 0.85rem 0 0 0.85rem; }
        .benefits-summary__preferred { color: #735719; background: rgba(251, 239, 199, 0.8); border: 1px solid rgba(200, 160, 68, 0.26); border-radius: 0 0.85rem 0.85rem 0; }

        .benefits-cta { background: linear-gradient(135deg, #d5b15d, #c8a044 55%, #b68e33) !important; box-shadow: 0 12px 24px rgba(143, 104, 25, 0.18); transition: transform 240ms ease, box-shadow 240ms ease, background 240ms ease; }
        .benefits-cta:hover { background: linear-gradient(135deg, #dfc477, #c8a044 55%, #a77f29) !important; box-shadow: 0 16px 30px rgba(143, 104, 25, 0.24); transform: translateY(-1px); }

        .benefits-reveal { opacity: 0; transform: translateY(10px); transition: opacity 560ms ease, transform 560ms ease; transition-delay: var(--benefits-delay, 0ms); }
        .benefits-section--entered .benefits-reveal { opacity: 1; transform: translateY(0); }

        @media (hover: hover) and (pointer: fine) {
          .benefits-row:hover { background: rgba(255, 251, 238, 0.66); }
          .benefits-row:hover .benefits-cell--preferred { background: rgba(250, 237, 192, 0.72); }
        }

        @media (max-width: 1023px) {
          .benefits-comparison { max-width: 46rem; margin-right: auto; margin-left: auto; }
          .benefits-row { display: block; padding: 1.4rem 0; }
          .benefits-row + .benefits-row { border-top: 0; }
          .benefits-category { padding: 0 0 1rem; font-size: 1rem; }
          .benefits-cell { padding: 0.95rem 1rem; }
          .benefits-cell--traditional { background: rgba(245, 246, 247, 0.7); border-radius: 0.9rem 0.9rem 0 0; }
          .benefits-cell--preferred { margin-top: 0.35rem; border: 1px solid rgba(200, 160, 68, 0.3); border-radius: 0 0 0.9rem 0.9rem; }
          .benefits-mobile-label { display: block; position: absolute; top: 0.6rem; left: 1rem; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #777a80; }
          .benefits-cell > p:last-child { padding-top: 1.1rem; }
          .benefits-summary { grid-template-columns: 1fr; gap: 0.35rem; margin-top: 1.5rem; }
          .benefits-summary p { padding: 1rem 1.1rem; border-radius: 0.85rem; }
          .benefits-summary__traditional { grid-column: auto; }
          .benefits-summary__preferred { border-radius: 0.85rem; }
        }

        @media (max-width: 639px) {
          .benefits-ambience span { filter: blur(30px); opacity: 0.18; }
          .benefits-ambience__mint { width: 18rem; height: 18rem; }
          .benefits-ambience__gold { width: 20rem; height: 20rem; }
          .benefits-cell { font-size: 0.9rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .benefits-reveal, .benefits-section--entered .benefits-reveal { opacity: 1; transform: none; transition: none; }
          .benefits-cta, .benefits-row { transition: none; }
          .benefits-cta:hover { transform: none; }
        }
      `}</style>
    </section>
  )
}
