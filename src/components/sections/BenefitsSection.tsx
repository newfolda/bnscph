import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const traditionalSellingItems = [
  "Deal with countless inquiries",
  "Meet strangers and no-shows",
  "Negotiate with lowball buyers",
  "Handle all paperwork yourself",
  "Worry about payment security",
  "Wait days or weeks to sell",
]

const sellCarPhilippinesItems = [
  {
    lead: "Serious buyers only",
    detail: "No endless inquiries or time wasters.",
  },
  {
    lead: "Fair market valuation",
    detail: "Receive an offer based on current market conditions.",
  },
  {
    lead: "Free doorstep inspection",
    detail: "We inspect your vehicle at your preferred location.",
  },
  {
    lead: "We handle the paperwork",
    detail: "We'll guide you through the ownership transfer process.",
  },
  {
    lead: "Secure payment",
    detail: "Receive payment before ownership is transferred.",
  },
  {
    lead: "End-to-end service",
    detail: "From your first inquiry to final payment, we handle the process.",
  },
]

export default function BenefitsSection() {
  return (
    <section className="bg-[#F8F7F3] py-14 sm:py-16 lg:py-24">
      <Container>
        <div className="max-w-[39rem]">
          <SectionPill className="mb-4">WHY CHOOSE US</SectionPill>
          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#0A0A0A] sm:text-5xl">
            The simpler, safer way to
            <br />
            sell your car—for a fair
            <br />
            market price.
          </h2>
          <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-[var(--text-secondary)]">
            Skip the uncertainty of private selling. From valuation to payment, we
            handle the process so you can sell with confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,0.38fr)_5.5rem_minmax(0,0.52fr)] lg:items-end lg:gap-5">
          <article className="comparison-traditional-panel rounded-[2rem] p-4 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none sm:p-5">
            <div className="comparison-traditional-inset rounded-[1.5rem] p-5 sm:p-6">
              <header className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-300 bg-white text-lg font-semibold text-stone-500"
                >
                  ×
                </span>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
                    The usual route
                  </p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#252525]">
                    Traditional Selling
                  </h3>
                </div>
              </header>

              <ol className="mt-7">
                {traditionalSellingItems.map((item, index) => (
                  <li
                    key={item}
                    className={`comparison-row comparison-traditional-row ${
                      index === 3 ? "comparison-traditional-row--highlighted" : ""
                    }`}
                  >
                    <span className="comparison-row-number">{String(index + 1).padStart(2, "0")}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-stone-200 text-base leading-none text-stone-500"
                    >
                      ×
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <div className="comparison-traditional-result mt-6 rounded-2xl p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Result
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#3D3D3D]">
                  More time, more uncertainty, and more effort.
                </p>
              </div>
            </div>
          </article>

          <div className="comparison-spine relative flex min-h-12 items-center justify-center lg:min-h-[34rem] lg:flex-col">
            <span className="comparison-spine-label comparison-spine-label--top hidden lg:block">
              More effort
            </span>
            <span className="comparison-vs-badge">VS</span>
            <span className="comparison-spine-label comparison-spine-label--bottom hidden lg:block">
              Less friction
            </span>
          </div>

          <article className="comparison-premium-panel rounded-[2rem] p-4 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[3px] motion-reduce:transform-none motion-reduce:transition-none sm:p-5">
            <div className="comparison-premium-inset rounded-[1.5rem] p-5 sm:p-6">
              <header className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-base font-bold text-white shadow-[0_6px_14px_rgba(200,160,68,0.24)]"
                >
                  ✓
                </span>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                    ✓ Recommended
                  </p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#0A0A0A]">
                    Buy &amp; Sell Cars Philippines
                  </h3>
                </div>
              </header>

              <ol className="mt-7">
                {sellCarPhilippinesItems.map((item, index) => (
                  <li
                    key={item.lead}
                    className={`comparison-row comparison-premium-row ${
                      index === 3 ? "comparison-premium-row--highlighted" : ""
                    }`}
                  >
                    <span className="comparison-row-number">{String(index + 1).padStart(2, "0")}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(200,160,68,0.14)] text-sm font-bold text-[var(--primary)]"
                    >
                      ✓
                    </span>
                    <span className="min-w-0">
                      <strong className="font-semibold text-[#161616]">{item.lead}</strong>
                      <span className="text-[var(--text-secondary)]"> — {item.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="comparison-premium-result mt-6 rounded-2xl p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Result
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#3A2B08]">
                  A simpler, safer, and faster way to sell your car.
                </p>
              </div>
            </div>
          </article>
        </div>
      </Container>

      <style>{`
        .comparison-traditional-panel {
          background: #ececea;
          box-shadow: 0 14px 32px rgba(33, 33, 33, 0.08);
        }

        .comparison-traditional-panel:hover {
          box-shadow: 0 18px 38px rgba(33, 33, 33, 0.12);
        }

        .comparison-traditional-inset {
          background: rgba(218, 218, 215, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.48);
        }

        .comparison-premium-panel {
          border: 1px solid rgba(200, 160, 68, 0.55);
          background: #fffdfa;
          box-shadow: 0 22px 46px rgba(112, 83, 23, 0.14), 0 8px 20px rgba(200, 160, 68, 0.1);
        }

        .comparison-premium-panel:hover {
          border-color: rgba(200, 160, 68, 0.76);
          box-shadow: 0 28px 54px rgba(112, 83, 23, 0.18), 0 12px 26px rgba(200, 160, 68, 0.13);
        }

        .comparison-premium-inset {
          border: 1px solid rgba(200, 160, 68, 0.2);
          background: rgba(255, 255, 255, 0.78);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 1.65rem 1.75rem minmax(0, 1fr);
          gap: 0.65rem;
          align-items: start;
          border-top: 1px solid rgba(95, 95, 92, 0.14);
          padding: 0.9rem 0;
          font-size: 0.875rem;
          line-height: 1.45;
        }

        .comparison-row:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .comparison-row-number {
          padding-top: 0.2rem;
          color: #8d8d88;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .comparison-traditional-row {
          color: #555552;
        }

        .comparison-traditional-row--highlighted {
          margin: 0 -0.45rem;
          border-radius: 0.85rem;
          border-top-color: transparent;
          background: rgba(255, 255, 255, 0.56);
          padding-right: 0.45rem;
          padding-left: 0.45rem;
        }

        .comparison-premium-row {
          color: #383834;
        }

        .comparison-premium-row--highlighted {
          margin: 0 -0.45rem;
          border-radius: 0.85rem;
          border-top-color: transparent;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 8px 18px rgba(200, 160, 68, 0.1);
          padding-right: 0.45rem;
          padding-left: 0.45rem;
        }

        .comparison-traditional-result {
          border: 1px solid rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.72);
        }

        .comparison-premium-result {
          border: 1px solid rgba(200, 160, 68, 0.26);
          background: rgba(255, 243, 205, 0.66);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.66);
        }

        .comparison-vs-badge {
          position: relative;
          z-index: 1;
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

        .comparison-spine-label {
          position: absolute;
          color: #948f80;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
          writing-mode: vertical-rl;
        }

        .comparison-spine-label--top {
          top: 2.25rem;
        }

        .comparison-spine-label--bottom {
          bottom: 2.25rem;
          color: #a58229;
        }
      `}</style>
    </section>
  )
}
