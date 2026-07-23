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
    <section className="bg-white py-12 sm:py-14 lg:py-[4.5rem]">
      <Container>
        <div className="benefits-main-panel relative mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-9 shadow-[0_34px_78px_rgba(0,0,0,0.32),0_12px_28px_rgba(200,160,68,0.1)] ring-1 ring-white/30 sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14">
          <div aria-hidden="true" className="benefits-panel-ambient pointer-events-none absolute inset-0 z-0">
            <span className="benefits-ambient-light benefits-ambient-light--ivory" />
            <span className="benefits-ambient-light benefits-ambient-light--champagne" />
            <span className="benefits-ambient-light benefits-ambient-light--mint" />
            <span className="benefits-ambient-light benefits-ambient-light--cream" />
            <span className="benefits-ambient-light benefits-ambient-light--lavender" />
          </div>
          <div className="relative z-10">
        <div className="max-w-[39rem]">
          <SectionPill className="mb-4">WHY CHOOSE US</SectionPill>
          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#0A0A0A] sm:text-5xl">
            The simpler, safer way to
            <br />
            sell your car—for a fair
            <br />
            market price.
          </h2>
          <p className="mt-6 max-w-[36rem] text-base leading-relaxed text-[var(--text-secondary)]">
            Skip the uncertainty of private selling. From valuation to payment, we
            handle the process so you can sell with confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,0.38fr)_5.5rem_minmax(0,0.52fr)] lg:items-end lg:gap-5">
          <article className="comparison-traditional-panel rounded-[2rem] p-4 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none sm:p-5 lg:min-h-[33rem]">
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
                      className="comparison-negative-icon flex h-6 w-6 items-center justify-center rounded-lg bg-stone-200 text-base leading-none text-stone-500"
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

          <div className="comparison-spine relative flex min-h-12 items-center justify-center lg:min-h-[34rem] lg:self-center lg:flex-col">
            <span className="comparison-spine-label comparison-spine-label--top hidden lg:block">
              More effort
            </span>
            <span className="comparison-vs-badge">VS</span>
            <span className="comparison-spine-label comparison-spine-label--bottom hidden lg:block">
              Less friction
            </span>
          </div>

          <article className="comparison-premium-panel rounded-[2rem] p-4 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[3px] motion-reduce:transform-none motion-reduce:transition-none sm:p-5 lg:min-h-[35rem]">
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
                      className="comparison-positive-icon flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(200,160,68,0.14)] text-sm font-bold text-[var(--primary)]"
                    >
                      ✓
                    </span>
                    <span className="min-w-0">
                      <strong className="font-semibold text-[#161616]">{item.lead}</strong>
                      <span className="comparison-premium-detail text-[var(--text-secondary)]"> — {item.detail}</span>
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
          </div>
        </div>
      </Container>

      <style>{`
        .benefits-panel-ambient {
          overflow: hidden;
          background: #ffffff;
        }

        .benefits-ambient-light {
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity;
        }

        .benefits-ambient-light::before {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          content: "";
          will-change: transform, opacity;
        }

        .benefits-ambient-light--ivory {
          top: -28%;
          left: 18%;
          width: 62%;
          height: 58%;
        }

        .benefits-ambient-light--ivory::before {
          background: radial-gradient(ellipse, rgba(255, 249, 226, 0.52) 0%, rgba(255, 249, 226, 0.2) 35%, transparent 72%);
          animation: benefits-ivory-drift 30s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--champagne {
          top: 8%;
          right: -20%;
          width: 59%;
          height: 60%;
        }

        .benefits-ambient-light--champagne::before {
          background: radial-gradient(ellipse, rgba(245, 220, 157, 0.28) 0%, rgba(245, 220, 157, 0.11) 36%, transparent 72%);
          animation: benefits-champagne-drift 36s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--mint {
          top: -18%;
          left: -18%;
          width: 56%;
          height: 62%;
        }

        .benefits-ambient-light--mint::before {
          background: radial-gradient(ellipse, rgba(210, 239, 223, 0.28) 0%, rgba(210, 239, 223, 0.11) 34%, transparent 72%);
          animation: benefits-mint-drift 34s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--cream {
          bottom: -34%;
          left: 12%;
          width: 66%;
          height: 62%;
        }

        .benefits-ambient-light--cream::before {
          background: radial-gradient(ellipse, rgba(255, 241, 203, 0.3) 0%, rgba(255, 241, 203, 0.12) 36%, transparent 72%);
          animation: benefits-cream-drift 40s ease-in-out infinite alternate;
        }

        .benefits-ambient-light--lavender {
          right: -16%;
          bottom: -30%;
          width: 54%;
          height: 58%;
        }

        .benefits-ambient-light--lavender::before {
          background: radial-gradient(ellipse, rgba(230, 223, 244, 0.2) 0%, rgba(230, 223, 244, 0.08) 34%, transparent 72%);
          animation: benefits-lavender-drift 28s ease-in-out infinite alternate;
        }

        .comparison-traditional-panel {
          border: 1px solid rgba(255, 255, 255, 0.62);
          background: linear-gradient(
            135deg,
            rgba(237, 238, 237, 0.92) 0%,
            rgba(210, 212, 211, 0.72) 52%,
            rgba(230, 231, 229, 0.84) 100%
          );
          box-shadow:
            0 18px 38px rgba(38, 40, 39, 0.1),
            0 5px 14px rgba(38, 40, 39, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            inset 0 -1px 0 rgba(104, 111, 108, 0.12);
          backdrop-filter: blur(12px) saturate(112%);
          -webkit-backdrop-filter: blur(12px) saturate(112%);
        }

        .comparison-traditional-panel:hover {
          box-shadow:
            0 22px 44px rgba(38, 40, 39, 0.13),
            0 8px 18px rgba(38, 40, 39, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.84),
            inset 0 -1px 0 rgba(104, 111, 108, 0.13);
        }

        .comparison-traditional-inset {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.58);
          background: linear-gradient(135deg, rgba(221, 223, 221, 0.74), rgba(198, 201, 199, 0.54));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68), inset 0 -1px 0 rgba(100, 108, 104, 0.12);
          backdrop-filter: blur(14px) saturate(108%);
          -webkit-backdrop-filter: blur(14px) saturate(108%);
        }

        .comparison-premium-panel {
          border: 1px solid rgba(200, 160, 68, 0.6);
          background: linear-gradient(
            135deg,
            rgba(255, 254, 248, 0.94) 0%,
            rgba(255, 247, 220, 0.7) 50%,
            rgba(255, 253, 245, 0.88) 100%
          );
          box-shadow:
            0 26px 54px rgba(112, 83, 23, 0.15),
            0 10px 24px rgba(200, 160, 68, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.92),
            inset 0 -1px 0 rgba(183, 139, 44, 0.16);
          backdrop-filter: blur(14px) saturate(120%);
          -webkit-backdrop-filter: blur(14px) saturate(120%);
        }

        .comparison-premium-panel:hover {
          border-color: rgba(200, 160, 68, 0.8);
          box-shadow:
            0 31px 62px rgba(112, 83, 23, 0.19),
            0 13px 28px rgba(200, 160, 68, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.96),
            inset 0 -1px 0 rgba(183, 139, 44, 0.19);
        }

        .comparison-premium-inset {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.78);
          outline: 1px solid rgba(200, 160, 68, 0.18);
          outline-offset: -1px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(255, 252, 240, 0.6));
          box-shadow:
            0 10px 20px rgba(138, 103, 26, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.96),
            inset 0 -1px 0 rgba(179, 154, 105, 0.11);
          backdrop-filter: blur(16px) saturate(125%);
          -webkit-backdrop-filter: blur(16px) saturate(125%);
        }

        .comparison-traditional-inset::before,
        .comparison-traditional-inset::after,
        .comparison-premium-inset::before,
        .comparison-premium-inset::after {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          content: "";
          border-radius: inherit;
          transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease;
        }

        .comparison-traditional-inset::before,
        .comparison-premium-inset::before {
          inset: 0;
          background: radial-gradient(ellipse at 16% 8%, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.25) 19%, transparent 48%);
        }

        .comparison-traditional-inset::after,
        .comparison-premium-inset::after {
          inset: 1px;
          background: linear-gradient(135deg, transparent 50%, rgba(160, 182, 193, 0.1) 78%, rgba(255, 255, 255, 0.52) 100%);
        }

        .comparison-traditional-inset > *,
        .comparison-premium-inset > * {
          position: relative;
          z-index: 1;
        }

        .comparison-traditional-panel:hover .comparison-traditional-inset::before,
        .comparison-premium-panel:hover .comparison-premium-inset::before {
          transform: translate3d(7px, 6px, 0);
        }

        .comparison-traditional-panel:hover .comparison-traditional-inset::after,
        .comparison-premium-panel:hover .comparison-premium-inset::after {
          transform: translate3d(5px, 4px, 0);
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 1.65rem 1.75rem minmax(0, 1fr);
          gap: 0.65rem;
          align-items: start;
          border-top: 1px solid rgba(95, 95, 92, 0.14);
          padding: 1rem 0;
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
          color: #72726e;
        }

        .comparison-traditional-row--highlighted {
          margin: 0 -0.45rem;
          border-radius: 0.85rem;
          border-top-color: transparent;
          background: rgba(255, 255, 255, 0.48);
          padding-right: 0.45rem;
          padding-left: 0.45rem;
        }

        .comparison-premium-row {
          color: #383834;
          padding-top: 1.05rem;
          padding-bottom: 1.05rem;
        }

        .comparison-premium-detail {
          display: block;
          margin-top: 0.18rem;
          color: #6c6c67;
        }

        .comparison-premium-row--highlighted {
          margin: 0 -0.45rem;
          border-radius: 0.85rem;
          border-top-color: transparent;
          border: 1px solid rgba(200, 160, 68, 0.22);
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 9px 20px rgba(200, 160, 68, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.88);
          padding-right: 0.45rem;
          padding-left: 0.45rem;
        }

        .comparison-traditional-result {
          border: 1px solid rgba(255, 255, 255, 0.78);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(245, 247, 246, 0.52));
          box-shadow: 0 8px 18px rgba(42, 45, 43, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.88), inset 0 -1px 0 rgba(118, 128, 124, 0.1);
          backdrop-filter: blur(12px) saturate(110%);
          -webkit-backdrop-filter: blur(12px) saturate(110%);
        }

        .comparison-premium-result {
          border: 1px solid rgba(200, 160, 68, 0.26);
          background: linear-gradient(135deg, rgba(255, 248, 220, 0.76), rgba(255, 237, 177, 0.48));
          box-shadow: 0 9px 20px rgba(143, 103, 20, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.76), inset 0 -1px 0 rgba(190, 148, 50, 0.12);
          backdrop-filter: blur(12px) saturate(115%);
          -webkit-backdrop-filter: blur(12px) saturate(115%);
        }

        .comparison-negative-icon,
        .comparison-positive-icon {
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow: 0 4px 10px rgba(41, 44, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.82), inset 0 -1px 0 rgba(96, 108, 104, 0.1);
        }

        .comparison-negative-icon {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.66), rgba(212, 215, 213, 0.7));
          color: #7b7e7a;
          box-shadow: 0 3px 8px rgba(41, 44, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.76), inset 0 -1px 0 rgba(96, 108, 104, 0.08);
        }

        .comparison-positive-icon {
          border-color: rgba(230, 196, 110, 0.5);
          background: linear-gradient(135deg, rgba(255, 247, 213, 0.82), rgba(232, 195, 92, 0.3));
          box-shadow: 0 5px 12px rgba(163, 121, 29, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.86), inset 0 -1px 0 rgba(176, 132, 37, 0.12);
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

        .comparison-traditional-inset h3 {
          color: #53514b;
        }

        .comparison-premium-inset header > div > p {
          margin-bottom: 0.28rem;
          letter-spacing: 0.21em;
          line-height: 1.2;
        }

        .comparison-premium-inset h3 {
          color: #080808;
          font-weight: 800;
          margin-top: 0;
        }

        .comparison-traditional-result > p:first-child,
        .comparison-premium-result > p:first-child {
          letter-spacing: 0.19em;
        }

        .comparison-traditional-result > p:last-child,
        .comparison-premium-result > p:last-child {
          font-weight: 600;
          line-height: 1.55;
        }

        .comparison-traditional-result > p:last-child {
          color: #5f605c;
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

        @media (prefers-reduced-motion: reduce) {
          .benefits-ambient-light::before {
            animation: none;
          }
        }

        @media (max-width: 1023px) {
          .comparison-row,
          .comparison-premium-row {
            padding-top: 0.85rem;
            padding-bottom: 0.85rem;
          }
        }
      `}</style>
    </section>
  )
}
