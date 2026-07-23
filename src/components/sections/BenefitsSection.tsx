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

function ScorecardRow({ row, tone }: { row: ScoreRow; tone: "traditional" | "recommended" }) {
  return (
    <li className="scorecard-row">
      <span className={`scorecard-icon scorecard-icon--${tone}`}>
        <CategoryIcon category={row.category} />
      </span>
      <span className="min-w-0">
        <strong className="scorecard-category">{row.category}</strong>
        <span className="scorecard-description">{row.description}</span>
      </span>
      <span className="scorecard-segments" aria-label={`${row.score} out of 10 ${row.status.toLowerCase()}`}>
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`scorecard-segment ${
              index < row.score ? `scorecard-segment--${tone}` : ""
            }`}
          />
        ))}
      </span>
      <span className={`scorecard-status scorecard-status--${tone}`}>{row.status}</span>
    </li>
  )
}

export default function BenefitsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#FCFBF7] py-14 sm:py-16 lg:py-24">
      <div aria-hidden="true" className="benefits-panel-ambient pointer-events-none absolute inset-0 z-0">
        <span className="benefits-ambient-light benefits-ambient-light--ivory" />
        <span className="benefits-ambient-light benefits-ambient-light--champagne" />
        <span className="benefits-ambient-light benefits-ambient-light--mint" />
        <span className="benefits-ambient-light benefits-ambient-light--cream" />
        <span className="benefits-ambient-light benefits-ambient-light--lavender" />
      </div>

      <Container className="relative z-10">
        <header className="mx-auto max-w-[42rem] text-center">
              <SectionPill className="mb-4">WHY CHOOSE US</SectionPill>
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

            <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:items-stretch lg:gap-5">
              <article className="scorecard-panel scorecard-panel--traditional rounded-[1.625rem] p-5 sm:p-6 lg:p-8">
                <header className="text-center">
                    <h3 className="text-lg font-bold tracking-tight text-[#494841] sm:text-xl">
                      TRADITIONAL PRIVATE SALE
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#71716b]">
                      High stress. High risk. Too much effort.
                    </p>
                </header>

                <ul className="mt-7 space-y-0">
                    {traditionalPrivateSaleRows.map((row) => (
                      <ScorecardRow key={row.category} row={row} tone="traditional" />
                    ))}
                </ul>

                <footer className="scorecard-outcome scorecard-outcome--traditional mt-6 rounded-2xl p-4">
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

              <article className="scorecard-panel scorecard-panel--recommended rounded-[1.625rem] p-5 sm:p-6 lg:p-8">
                <header className="text-center">
                    <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] sm:text-xl">
                      BUY &amp; SELL CARS PHILIPPINES
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5f5d54]">
                      Low stress. Low risk. Zero guesswork.
                    </p>
                </header>

                <ul className="mt-7 space-y-0">
                    {buyAndSellCarsRows.map((row) => (
                      <ScorecardRow key={row.category} row={row} tone="recommended" />
                    ))}
                </ul>

                <footer className="scorecard-outcome scorecard-outcome--recommended mt-6 rounded-2xl p-4">
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
          background: transparent;
        }

        .benefits-ambient-light {
          position: absolute;
          border-radius: 50%;
          opacity: 0.88;
          will-change: transform, opacity;
        }

        .benefits-ambient-light::before {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          content: "";
          will-change: transform, opacity;
        }

        .benefits-ambient-light--ivory { top: -28%; left: 18%; width: 62%; height: 58%; }
        .benefits-ambient-light--champagne { top: 8%; right: -20%; width: 59%; height: 60%; }
        .benefits-ambient-light--mint { top: -18%; left: -18%; width: 56%; height: 62%; }
        .benefits-ambient-light--cream { bottom: -34%; left: 12%; width: 66%; height: 62%; }
        .benefits-ambient-light--lavender { right: -16%; bottom: -30%; width: 54%; height: 58%; }

        .benefits-ambient-light--ivory::before {
          background: radial-gradient(ellipse, rgba(255, 249, 226, 0.52) 0%, rgba(255, 249, 226, 0.2) 35%, transparent 72%);
          animation: benefits-ivory-drift 30s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--champagne::before {
          background: radial-gradient(ellipse, rgba(245, 220, 157, 0.28) 0%, rgba(245, 220, 157, 0.11) 36%, transparent 72%);
          animation: benefits-champagne-drift 36s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--mint::before {
          background: radial-gradient(ellipse, rgba(210, 239, 223, 0.28) 0%, rgba(210, 239, 223, 0.11) 34%, transparent 72%);
          animation: benefits-mint-drift 34s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--cream::before {
          background: radial-gradient(ellipse, rgba(255, 241, 203, 0.3) 0%, rgba(255, 241, 203, 0.12) 36%, transparent 72%);
          animation: benefits-cream-drift 40s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--lavender::before {
          background: radial-gradient(ellipse, rgba(230, 223, 244, 0.2) 0%, rgba(230, 223, 244, 0.08) 34%, transparent 72%);
          animation: benefits-lavender-drift 28s ease-in-out infinite alternate;
        }

        .scorecard-panel {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          outline-offset: -1px;
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
        }

        .scorecard-panel--traditional {
          border: 1px solid rgba(255, 255, 255, 0.66);
          outline: 1px solid rgba(95, 115, 130, 0.1);
          background: linear-gradient(135deg, rgba(240, 241, 239, 0.8), rgba(206, 210, 207, 0.62));
          box-shadow: 0 18px 38px rgba(38, 40, 39, 0.1), 0 5px 14px rgba(38, 40, 39, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.78), inset 0 -1px 0 rgba(104, 111, 108, 0.12);
        }

        .scorecard-panel--recommended {
          border: 1px solid rgba(200, 160, 68, 0.54);
          background: linear-gradient(135deg, rgba(255, 255, 252, 0.88), rgba(255, 245, 214, 0.56));
          box-shadow: 0 24px 50px rgba(112, 83, 23, 0.14), 0 9px 22px rgba(200, 160, 68, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(183, 139, 44, 0.14);
        }

        .scorecard-panel::before,
        .scorecard-panel::after {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          content: "";
          border-radius: inherit;
        }

        .scorecard-panel::before {
          inset: 0;
          background: radial-gradient(ellipse at 16% 8%, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.24) 19%, transparent 48%);
        }

        .scorecard-panel--traditional::after {
          inset: 1px;
          background: linear-gradient(135deg, transparent 50%, rgba(160, 182, 193, 0.1) 78%, rgba(255, 255, 255, 0.42) 100%);
        }

        .scorecard-panel--recommended::after {
          inset: 1px;
          background: linear-gradient(135deg, transparent 50%, rgba(211, 172, 80, 0.12) 78%, rgba(255, 255, 255, 0.48) 100%);
        }

        .scorecard-panel > * {
          position: relative;
          z-index: 1;
        }

        .scorecard-row {
          display: grid;
          grid-template-columns: 3rem minmax(8rem, 1fr) minmax(8rem, 1.25fr) 5.5rem;
          gap: 0.75rem;
          align-items: center;
          border-top: 1px solid rgba(102, 102, 96, 0.13);
          padding: 0.95rem 0;
        }

        .scorecard-row:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .scorecard-icon {
          display: flex;
          height: 2.5rem;
          width: 2.5rem;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 0.8rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86), 0 4px 10px rgba(35, 38, 36, 0.05);
        }

        .scorecard-icon svg {
          height: 1.3rem;
          width: 1.3rem;
        }

        .scorecard-icon--traditional {
          background: rgba(255, 255, 255, 0.48);
          color: #73756f;
        }

        .scorecard-icon--recommended {
          border-color: rgba(224, 190, 99, 0.46);
          background: rgba(255, 245, 210, 0.58);
          color: var(--primary);
        }

        .scorecard-category {
          display: block;
          color: #252525;
          font-size: 0.72rem;
          letter-spacing: 0.07em;
          line-height: 1.25;
          text-transform: uppercase;
        }

        .scorecard-description {
          display: block;
          margin-top: 0.28rem;
          color: #696964;
          font-size: 0.78rem;
          line-height: 1.42;
        }

        .scorecard-segments {
          display: grid;
          grid-template-columns: repeat(10, minmax(0, 1fr));
          gap: 0.22rem;
        }

        .scorecard-segment {
          display: block;
          height: 0.42rem;
          border-radius: 9999px;
          background: rgba(128, 130, 124, 0.16);
        }

        .scorecard-segment--traditional {
          background: #8b8d87;
        }

        .scorecard-segment--recommended {
          background: var(--primary);
        }

        .scorecard-status {
          justify-self: end;
          border-radius: 9999px;
          padding: 0.32rem 0.48rem;
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1;
          text-align: center;
        }

        .scorecard-status--traditional {
          background: rgba(101, 104, 97, 0.13);
          color: #656860;
        }

        .scorecard-status--recommended {
          background: rgba(200, 160, 68, 0.15);
          color: #8d6a17;
        }

        .scorecard-outcome {
          display: flex;
          align-items: center;
          gap: 0.8rem;
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
          color: #272727;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .scorecard-outcome p {
          margin-top: 0.2rem;
          color: #696964;
          font-size: 0.75rem;
          line-height: 1.42;
        }

        .scorecard-outcome--traditional {
          background: rgba(255, 255, 255, 0.44);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.64);
        }

        .scorecard-outcome--traditional .scorecard-outcome-icon {
          background: rgba(126, 130, 123, 0.13);
          color: #74776f;
        }

        .scorecard-outcome--recommended {
          background: rgba(255, 244, 207, 0.5);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(190, 148, 50, 0.08);
        }

        .scorecard-outcome--recommended .scorecard-outcome-icon {
          background: rgba(200, 160, 68, 0.16);
          color: var(--primary);
        }

        .scorecard-vs-badge {
          display: inline-flex;
          height: 2.8rem;
          width: 2.8rem;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(200, 160, 68, 0.64);
          border-radius: 9999px;
          background: #ffffff;
          color: #6f571e;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          box-shadow: 0 8px 18px rgba(82, 64, 19, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        @keyframes benefits-ivory-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.84; }
          to { transform: translate3d(10px, 8px, 0) scale(1.05); opacity: 0.94; }
        }

        @keyframes benefits-champagne-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.76; }
          to { transform: translate3d(12px, -10px, 0) scale(1.04); opacity: 0.86; }
        }

        @keyframes benefits-mint-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.72; }
          to { transform: translate3d(-10px, 10px, 0) scale(1.04); opacity: 0.82; }
        }

        @keyframes benefits-cream-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.76; }
          to { transform: translate3d(8px, -12px, 0) scale(1.05); opacity: 0.86; }
        }

        @keyframes benefits-lavender-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.7; }
          to { transform: translate3d(10px, 8px, 0) scale(1.04); opacity: 0.78; }
        }

        @media (max-width: 1023px) {
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
        }

        @media (prefers-reduced-motion: reduce) {
          .benefits-ambient-light::before {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
