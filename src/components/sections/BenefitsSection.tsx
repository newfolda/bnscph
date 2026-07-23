import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const benefits = [
  {
    title: "Nationwide Reach",
    description: "Connect with verified buyers across the country instead of relying on just one or two offers.",
  },
  {
    title: "Right Price",
    description: "Get a market price informed by real buyer demand rather than guesswork.",
  },
  {
    title: "Defined Inspection",
    description: "Understand your car's value through clear, consistent inspection standards.",
  },
]

export default function BenefitsSection() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-[4.5rem]">
      <Container>
        <div className="benefits-main-panel relative mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-9 shadow-[0_34px_78px_rgba(0,0,0,0.32),0_12px_28px_rgba(200,160,68,0.1)] ring-1 ring-white/30 sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14">
          <div aria-hidden="true" className="benefits-panel-ambient pointer-events-none absolute inset-0 z-0">
            <span className="benefits-ambient-blob benefits-ambient-blob--mint" />
            <span className="benefits-ambient-blob benefits-ambient-blob--yellow" />
            <span className="benefits-ambient-blob benefits-ambient-blob--pink" />
            <span className="benefits-ambient-blob benefits-ambient-blob--blue" />
            <span className="benefits-ambient-blob benefits-ambient-blob--lavender" />
          </div>
          <div className="relative z-10">
            <div className="mb-11 flex flex-col items-center text-center">
              <SectionPill className="mb-4">
              Differences
              </SectionPill>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
              Why Choose Mobee Cars to Sell Your Car in the Philippines
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">See the difference before you decide.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="benefits-glass-card group/benefit relative flex min-h-[240px] flex-col items-center rounded-[1.625rem] px-6 pb-8 pt-7 text-center motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="benefits-icon-well flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl" aria-hidden="true">
                  {index === 0 && (
                    <svg viewBox="0 0 56 56" fill="none" className="h-14 w-14">
                      <path d="M17 16c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 4.7 6 10 6 10s6-5.3 6-10ZM51 16c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 4.7 6 10 6 10s6-5.3 6-10ZM34 8c-3.3 0-6 2.7-6 6 0 4.7 6 10 6 10s6-5.3 6-10c0-3.3-2.7-6-6-6Z" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11 26v8M45 26v8M34 24v8M11 34h34" stroke="var(--text-secondary)" strokeWidth="2.25" strokeLinecap="round" />
                      <path d="M16 38h24v5H16zM20 38l3-7h10l3 7M20 43h3M33 43h3" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="34" cy="14" r="1.5" fill="#E85D4A" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg viewBox="0 0 56 56" fill="none" className="h-14 w-14">
                      <path d="M6 38h29v6H6zM10 38l4-11h13l4 11M14 27h13M11 44h4M27 44h4" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="43" cy="18" r="8" stroke="var(--text-secondary)" strokeWidth="2.25" />
                      <path d="M43 13v10M46 15.5c-.7-.8-1.6-1.2-3-1.2-1.7 0-2.8.8-2.8 2 0 3 5.7 1.3 5.7 4.2 0 1.3-1.1 2.2-2.9 2.2-1.5 0-2.7-.5-3.5-1.4M37 39l5-5 3 3 6-7" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="51" cy="30" r="2" fill="#E85D4A" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg viewBox="0 0 56 56" fill="none" className="h-14 w-14">
                      <path d="M5 38h28v6H5zM9 38l4-11h13l4 11M13 27h13M10 44h4M26 44h4" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="35" y="11" width="12" height="18" rx="2" stroke="var(--text-secondary)" strokeWidth="2.25" />
                      <path d="m38 17 2 2 4-4M38 23h6" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="44" cy="39" r="6" stroke="var(--text-secondary)" strokeWidth="2.25" />
                      <path d="m48 43 4 4" stroke="var(--text-secondary)" strokeWidth="2.25" strokeLinecap="round" />
                      <circle cx="48" cy="17" r="2" fill="#E85D4A" />
                    </svg>
                  )}
                </div>
                <h3 className="mt-5 flex min-h-7 items-center text-xl font-bold leading-tight text-[var(--text-primary)] transition-colors duration-300 ease-out group-hover/benefit:text-[var(--primary)] motion-reduce:transition-none">{benefit.title}</h3>
                <p className="benefits-description relative isolate mt-3 overflow-hidden text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-300 ease-out group-hover/benefit:text-[#0A0A0A] motion-reduce:transition-none">
                  <span className="benefits-description-text">{benefit.description}</span>
                  <span aria-hidden="true" className="benefits-description-streak">{benefit.description}</span>
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </Container>
      <style>{`
        .benefits-panel-ambient {
          overflow: hidden;
          background: #ffffff;
        }

        .benefits-ambient-blob {
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity;
        }

        .benefits-ambient-blob::before {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          content: "";
          will-change: transform, opacity;
        }

        .benefits-ambient-blob--mint {
          top: -25%;
          right: -12%;
          width: 62%;
          height: 64%;
        }

        .benefits-ambient-blob--mint::before {
          background: radial-gradient(ellipse, rgba(190, 240, 215, 0.4) 0%, rgba(190, 240, 215, 0.17) 34%, transparent 70%);
          animation: benefits-ambient-mint-drift 29s ease-in-out infinite alternate;
        }

        .benefits-ambient-blob--yellow {
          top: 6%;
          left: -21%;
          width: 61%;
          height: 62%;
        }

        .benefits-ambient-blob--yellow::before {
          background: radial-gradient(ellipse, rgba(255, 235, 170, 0.38) 0%, rgba(255, 235, 170, 0.16) 34%, transparent 70%);
          animation: benefits-ambient-yellow-drift 33s ease-in-out infinite alternate;
        }

        .benefits-ambient-blob--pink {
          right: -11%;
          bottom: -32%;
          width: 59%;
          height: 63%;
        }

        .benefits-ambient-blob--pink::before {
          background: radial-gradient(ellipse, rgba(255, 210, 225, 0.36) 0%, rgba(255, 210, 225, 0.15) 34%, transparent 70%);
          animation: benefits-ambient-pink-drift 37s ease-in-out infinite alternate;
        }

        .benefits-ambient-blob--blue {
          bottom: -31%;
          left: -15%;
          width: 61%;
          height: 62%;
        }

        .benefits-ambient-blob--blue::before {
          background: radial-gradient(ellipse, rgba(195, 225, 255, 0.39) 0%, rgba(195, 225, 255, 0.16) 36%, transparent 70%);
          animation: benefits-ambient-blue-drift 41s ease-in-out infinite alternate;
        }

        .benefits-ambient-blob--lavender {
          top: -24%;
          left: -10%;
          width: 56%;
          height: 58%;
        }

        .benefits-ambient-blob--lavender::before {
          background: radial-gradient(ellipse, rgba(220, 215, 255, 0.31) 0%, rgba(220, 215, 255, 0.13) 34%, transparent 70%);
          animation: benefits-ambient-lavender-drift 27s ease-in-out infinite alternate;
        }

        .benefits-glass-card {
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.82);
          outline: 1px solid rgba(95, 115, 130, 0.1);
          outline-offset: -1px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.62) 0%,
            rgba(255, 255, 255, 0.34) 48%,
            rgba(255, 255, 255, 0.48) 100%
          );
          box-shadow:
            0 14px 32px rgba(20, 24, 32, 0.1),
            0 4px 10px rgba(20, 24, 32, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.95),
            inset 0 -1px 0 rgba(120, 135, 150, 0.12);
          backdrop-filter: blur(16px) saturate(130%);
          -webkit-backdrop-filter: blur(16px) saturate(130%);
          transition:
            background 300ms ease,
            border-color 300ms ease,
            outline-color 300ms ease,
            box-shadow 300ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .benefits-glass-card::before,
        .benefits-glass-card::after {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          content: "";
          border-radius: inherit;
          transition: transform 500ms ease, opacity 500ms ease;
        }

        .benefits-glass-card::before {
          inset: 0;
          background: radial-gradient(
            ellipse at 17% 12%,
            rgba(255, 255, 255, 0.78) 0%,
            rgba(255, 255, 255, 0.36) 14%,
            transparent 42%
          );
        }

        .benefits-glass-card::after {
          inset: 1px;
          background:
            radial-gradient(ellipse at 0% 20%, rgba(190, 240, 215, 0.1) 0%, transparent 58%),
            radial-gradient(ellipse at 100% 12%, rgba(255, 210, 225, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 5% 100%, rgba(195, 225, 255, 0.1) 0%, transparent 62%),
            linear-gradient(135deg, transparent 48%, rgba(168, 191, 204, 0.13) 76%, rgba(255, 255, 255, 0.48) 100%);
        }

        .benefits-glass-card > * {
          position: relative;
          z-index: 1;
        }

        .benefits-icon-well {
          border: 1px solid rgba(255, 255, 255, 0.82);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.3));
          box-shadow: 0 8px 18px rgba(20, 24, 32, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.92);
          transition: transform 300ms ease, box-shadow 300ms ease;
        }

        .benefits-description-text {
          position: relative;
          z-index: 1;
          display: block;
        }

        .benefits-description-streak {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
          color: transparent;
          opacity: 0;
          font: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          text-align: inherit;
          background: linear-gradient(
            105deg,
            transparent 0%,
            transparent 38%,
            rgba(255, 255, 255, 0.25) 44%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 245, 215, 0.55) 54%,
            transparent 62%,
            transparent 100%
          );
          background-position: 110% 0;
          background-repeat: no-repeat;
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .benefits-glass-card:is(:hover, :focus-within) {
          border-color: rgba(255, 255, 255, 0.94);
          outline-color: rgba(95, 115, 130, 0.16);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.56) 0%,
            rgba(255, 255, 255, 0.25) 48%,
            rgba(255, 255, 255, 0.4) 100%
          );
          box-shadow:
            0 24px 48px rgba(20, 24, 32, 0.11),
            0 10px 20px rgba(20, 24, 32, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 1),
            inset 0 -1px 0 rgba(120, 135, 150, 0.16);
          transform: translateY(-5px);
        }

        .benefits-glass-card:is(:hover, :focus-within)::before {
          transform: translate3d(8px, 8px, 0);
        }

        .benefits-glass-card:is(:hover, :focus-within)::after {
          transform: translate3d(5px, 5px, 0);
        }

        .benefits-glass-card:is(:hover, :focus-within) .benefits-icon-well {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(20, 24, 32, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.96);
        }

        .benefits-glass-card:focus-within h3 {
          color: var(--primary);
        }

        .benefits-glass-card:focus-within .benefits-description {
          color: #0A0A0A;
        }

        .benefits-glass-card:is(:hover, :focus-within) .benefits-description-streak {
          animation: benefits-description-streak 1200ms cubic-bezier(0.22, 1, 0.36, 1) 130ms both;
        }

        @keyframes benefits-ambient-mint-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.86; }
          to { transform: translate3d(12px, -10px, 0) scale(1.05); opacity: 0.94; }
        }

        @keyframes benefits-ambient-yellow-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.82; }
          to { transform: translate3d(-12px, 10px, 0) scale(1.05); opacity: 0.9; }
        }

        @keyframes benefits-ambient-pink-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.8; }
          to { transform: translate3d(14px, 8px, 0) scale(1.05); opacity: 0.88; }
        }

        @keyframes benefits-ambient-blue-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.82; }
          to { transform: translate3d(-10px, -12px, 0) scale(1.04); opacity: 0.9; }
        }

        @keyframes benefits-ambient-lavender-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.76; }
          to { transform: translate3d(-8px, 12px, 0) scale(1.05); opacity: 0.84; }
        }

        @keyframes benefits-description-streak {
          0% { background-position: 110% 0; opacity: 0; }
          14% { opacity: 1; }
          86% { opacity: 1; }
          100% { background-position: -10% 0; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .benefits-ambient-blob::before,
          .benefits-description-streak {
            animation: none !important;
          }

          .benefits-glass-card:is(:hover, :focus-within),
          .benefits-glass-card:is(:hover, :focus-within)::before,
          .benefits-glass-card:is(:hover, :focus-within)::after,
          .benefits-glass-card:is(:hover, :focus-within) .benefits-icon-well {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
