"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const processSteps = [
  {
    title: "Tell Us About Your Car",
    description: "Upload your car details and a few photos.",
  },
  {
    title: "We’ll Inspect It at Your Doorstep",
    description: "Schedule an inspection at a time that’s convenient for you.",
  },
  {
    title: "Get Paid the Same Day",
    description: "Receive payment by cash, bank transfer, or bank deposit.",
  },
]

export default function ProcessSection() {
  const [progress, setProgress] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  return (
    <section
      id="how-it-works"
      className="relative z-20 bg-white pb-10 md:pb-12"
    >
      <Container className="relative -mt-5 sm:-mt-7 md:-mt-8 lg:-mt-12">
        <div
          className="process-main-panel relative mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-7 shadow-[0_34px_78px_rgba(0,0,0,0.46),0_12px_28px_rgba(200,160,68,0.12)] ring-1 ring-white/30 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_40px_88px_rgba(0,0,0,0.5),0_16px_34px_rgba(200,160,68,0.14)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14"
        >
          <div aria-hidden="true" className="process-panel-ambient pointer-events-none absolute inset-0 z-0">
            <span className="process-ambient-blob process-ambient-blob--mint" />
            <span className="process-ambient-blob process-ambient-blob--yellow" />
            <span className="process-ambient-blob process-ambient-blob--pink" />
            <span className="process-ambient-blob process-ambient-blob--blue" />
            <span className="process-ambient-blob process-ambient-blob--lavender" />
          </div>
          <div className="relative z-10">
            <div className="mb-11 flex flex-col items-center text-center">
            <SectionPill className="mb-4">
              Process
            </SectionPill>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">How It Works?</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
              3 SIMPLE STEPS.
            </p>
          </div>
            <div
            ref={gridRef}
            className="process-cards-grid group/process relative grid gap-6 md:grid-cols-3"
            onPointerMove={(event) => {
              if (!gridRef.current) return

              let nearestCardIndex = 0
              let shortestDistance = Number.POSITIVE_INFINITY

              cardRefs.current.forEach((card, index) => {
                if (!card) return

                const rect = card.getBoundingClientRect()
                const dx = event.clientX < rect.left ? rect.left - event.clientX : event.clientX > rect.right ? event.clientX - rect.right : 0
                const dy = event.clientY < rect.top ? rect.top - event.clientY : event.clientY > rect.bottom ? event.clientY - rect.bottom : 0
                const distance = Math.hypot(dx, dy)

                if (distance < shortestDistance) {
                  shortestDistance = distance
                  nearestCardIndex = index
                }
              })

              setProgress(nearestCardIndex * 50)
            }}
            onPointerLeave={() => setProgress(0)}
            >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[calc((100%-3rem)/6)] right-[calc((100%-3rem)/6)] top-[2.375rem] z-0 hidden h-1 rounded-full bg-white/70 shadow-[inset_0_1px_2px_rgba(31,31,31,0.10)] md:block"
            >
              <div
                className="h-full rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(200,160,68,0.35)] transition-[width] duration-150 ease-out motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                className={`process-glass-card process-glass-card--${index + 1} group/card relative z-10 flex min-h-[290px] flex-col items-center rounded-[1.625rem] px-6 pb-7 pt-5 text-center group-hover/process:brightness-[0.98] group-hover/process:saturate-[0.96] hover:z-20 focus-within:z-20 motion-reduce:transform-none motion-reduce:transition-none`}
              >
                <span
                  className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--primary)] shadow-[0_4px_12px_rgba(31,31,31,0.10)] transition-[transform,box-shadow] duration-300 ease-out group-hover/card:scale-110 group-hover/card:shadow-[0_8px_18px_rgba(31,31,31,0.14)] motion-reduce:transform-none"
                >
                  <span className="inline-block transition-transform duration-300 ease-out group-hover/card:scale-125 motion-reduce:transform-none">
                    {index + 1}
                  </span>
                </span>
                <div className="mt-1 flex h-[120px] w-[120px] items-center justify-center">
                  {index === 0 && (
                    <Image
                      src="/images/brand/process-upload.png"
                      alt="Upload car details and photos"
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-300 ease-out group-hover/card:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  )}
                  {index === 1 && (
                    <Image
                      src="/images/brand/process-inspection.png"
                      alt="Schedule a car inspection"
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-300 ease-out group-hover/card:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  )}
                  {index === 2 && (
                    <Image
                      src="/images/brand/process-payment.png"
                      alt="Receive payment for your car"
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-300 ease-out group-hover/card:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  )}
                </div>
                <div className="mt-3 flex w-full flex-col items-center text-center">
                  <h3 className="flex min-h-12 items-center text-xl font-bold leading-[1.2] text-[var(--text-primary)] transition-colors duration-300 ease-out group-hover/card:text-[var(--primary)] motion-reduce:transition-none">
                    {step.title}
                  </h3>
                  <p className="mt-2 min-h-10 max-w-[16rem] text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-300 ease-out group-hover/card:text-[var(--text-primary)] motion-reduce:transition-none">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </Container>
      <style>{`
        .process-panel-ambient {
          overflow: hidden;
          background: #ffffff;
        }

        .process-ambient-blob {
          position: absolute;
          border-radius: 50%;
          transition: transform 780ms cubic-bezier(0.22, 1, 0.36, 1), opacity 780ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        .process-ambient-blob::before {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          content: "";
          will-change: transform, opacity;
        }

        .process-ambient-blob--mint {
          top: -20%;
          left: -16%;
          width: 62%;
          height: 62%;
        }

        .process-ambient-blob--mint::before {
          background: radial-gradient(ellipse, rgba(190, 240, 215, 0.34) 0%, rgba(190, 240, 215, 0.16) 34%, transparent 70%);
          animation: process-ambient-mint-drift 24s ease-in-out infinite alternate;
        }

        .process-ambient-blob--yellow {
          top: -30%;
          left: 25%;
          width: 58%;
          height: 56%;
        }

        .process-ambient-blob--yellow::before {
          background: radial-gradient(ellipse, rgba(255, 235, 170, 0.3) 0%, rgba(255, 235, 170, 0.14) 34%, transparent 70%);
          animation: process-ambient-yellow-drift 28s ease-in-out infinite alternate;
        }

        .process-ambient-blob--pink {
          top: -16%;
          right: -18%;
          width: 58%;
          height: 60%;
        }

        .process-ambient-blob--pink::before {
          background: radial-gradient(ellipse, rgba(255, 210, 225, 0.3) 0%, rgba(255, 210, 225, 0.14) 34%, transparent 70%);
          animation: process-ambient-pink-drift 31s ease-in-out infinite alternate;
        }

        .process-ambient-blob--blue {
          bottom: -28%;
          left: -16%;
          width: 60%;
          height: 62%;
        }

        .process-ambient-blob--blue::before {
          background: radial-gradient(ellipse, rgba(195, 225, 255, 0.32) 0%, rgba(195, 225, 255, 0.15) 36%, transparent 70%);
          animation: process-ambient-blue-drift 34s ease-in-out infinite alternate;
        }

        .process-ambient-blob--lavender {
          right: -16%;
          bottom: -30%;
          width: 56%;
          height: 60%;
        }

        .process-ambient-blob--lavender::before {
          background: radial-gradient(ellipse, rgba(220, 215, 255, 0.24) 0%, rgba(220, 215, 255, 0.11) 34%, transparent 70%);
          animation: process-ambient-lavender-drift 38s ease-in-out infinite alternate;
        }

        .process-main-panel:has(.process-glass-card--1:hover) .process-ambient-blob--mint,
        .process-main-panel:has(.process-glass-card--1:focus-within) .process-ambient-blob--mint {
          transform: translate3d(-24px, 4px, 0) scaleX(1.1) scaleY(0.96);
        }

        .process-main-panel:has(.process-glass-card--1:hover) .process-ambient-blob--yellow,
        .process-main-panel:has(.process-glass-card--1:focus-within) .process-ambient-blob--yellow {
          transform: translate3d(14px, -16px, 0) scaleX(1.06) scaleY(0.98);
        }

        .process-main-panel:has(.process-glass-card--1:hover) .process-ambient-blob--blue,
        .process-main-panel:has(.process-glass-card--1:focus-within) .process-ambient-blob--blue {
          transform: translate3d(-4px, 20px, 0) scaleX(0.98) scaleY(1.08);
          transition-delay: 140ms;
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--yellow,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--yellow {
          transform: translate3d(0, -22px, 0) scaleX(0.97) scaleY(1.1);
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--mint,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--mint {
          transform: translate3d(-16px, 4px, 0) scaleX(1.07) scaleY(0.97);
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--pink,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--pink {
          transform: translate3d(18px, 2px, 0) scaleX(1.08) scaleY(0.96);
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--lavender,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--lavender {
          transform: translate3d(2px, 20px, 0) scaleX(0.98) scaleY(1.08);
          transition-delay: 140ms;
        }

        .process-main-panel:has(.process-glass-card--3:hover) .process-ambient-blob--pink,
        .process-main-panel:has(.process-glass-card--3:focus-within) .process-ambient-blob--pink {
          transform: translate3d(24px, 4px, 0) scaleX(1.1) scaleY(0.96);
        }

        .process-main-panel:has(.process-glass-card--3:hover) .process-ambient-blob--lavender,
        .process-main-panel:has(.process-glass-card--3:focus-within) .process-ambient-blob--lavender {
          transform: translate3d(18px, 20px, 0) scaleX(1.08) scaleY(0.98);
          transition-delay: 140ms;
        }

        .process-main-panel:has(.process-glass-card--3:hover) .process-ambient-blob--yellow,
        .process-main-panel:has(.process-glass-card--3:focus-within) .process-ambient-blob--yellow {
          transform: translate3d(-18px, -4px, 0) scaleX(1.07) scaleY(0.97);
        }

        .process-glass-card {
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
            background 270ms ease,
            border-color 270ms ease,
            outline-color 270ms ease,
            box-shadow 270ms ease,
            filter 270ms ease,
            transform 270ms ease;
        }

        .process-glass-card::before,
        .process-glass-card::after {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          content: "";
          border-radius: inherit;
          transition: transform 500ms ease, opacity 500ms ease;
        }

        .process-glass-card::before {
          inset: 0;
          background: radial-gradient(
            ellipse at 17% 12%,
            rgba(255, 255, 255, 0.78) 0%,
            rgba(255, 255, 255, 0.36) 14%,
            transparent 42%
          );
        }

        .process-glass-card::after {
          inset: 1px;
          background:
            radial-gradient(ellipse at 0% 20%, rgba(190, 240, 215, 0.1) 0%, transparent 58%),
            radial-gradient(ellipse at 100% 12%, rgba(255, 210, 225, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 5% 100%, rgba(195, 225, 255, 0.1) 0%, transparent 62%),
            linear-gradient(135deg, transparent 48%, rgba(168, 191, 204, 0.13) 76%, rgba(255, 255, 255, 0.48) 100%);
          background-size: 140% 140%;
          background-position: 50% 50%;
        }

        .process-glass-card > * {
          position: relative;
          z-index: 1;
        }

        .process-glass-card:is(:hover, :focus-within) {
          border-color: rgba(255, 255, 255, 0.94);
          outline-color: rgba(95, 115, 130, 0.16);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.44) 48%,
            rgba(255, 255, 255, 0.58) 100%
          );
          box-shadow:
            0 24px 48px rgba(20, 24, 32, 0.11),
            0 10px 20px rgba(20, 24, 32, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.98),
            inset 0 -1px 0 rgba(120, 135, 150, 0.16);
          filter: brightness(1.03) saturate(1.05);
          transform: translateY(-5px);
        }

        .process-glass-card:is(:hover, :focus-within)::before {
          transform: translate3d(8px, 8px, 0);
        }

        .process-glass-card:is(:hover, :focus-within)::after {
          transform: translate3d(6px, 6px, 0) scale(1.02);
        }
        @keyframes process-ambient-mint-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.9; }
          to { transform: translate3d(-12px, 10px, 0) scale(1.05); opacity: 0.96; }
        }

        @keyframes process-ambient-yellow-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.86; }
          to { transform: translate3d(12px, -8px, 0) scale(1.04); opacity: 0.92; }
        }

        @keyframes process-ambient-pink-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.84; }
          to { transform: translate3d(14px, 8px, 0) scale(1.05); opacity: 0.9; }
        }

        @keyframes process-ambient-blue-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.82; }
          to { transform: translate3d(-8px, -12px, 0) scale(1.04); opacity: 0.88; }
        }

        @keyframes process-ambient-lavender-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.78; }
          to { transform: translate3d(10px, 12px, 0) scale(1.06); opacity: 0.84; }
        }

        @media (max-width: 767px) {
          .process-main-panel:has(.process-glass-card--1:is(:hover, :focus-within)) .process-ambient-blob--mint { transform: translate3d(-12px, 2px, 0) scaleX(1.05) scaleY(0.98); }
          .process-main-panel:has(.process-glass-card--1:is(:hover, :focus-within)) .process-ambient-blob--yellow { transform: translate3d(8px, -10px, 0) scaleX(1.04) scaleY(0.99); }
          .process-main-panel:has(.process-glass-card--1:is(:hover, :focus-within)) .process-ambient-blob--blue { transform: translate3d(-2px, 12px, 0) scaleX(0.99) scaleY(1.05); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--yellow { transform: translate3d(0, -12px, 0) scaleX(0.99) scaleY(1.05); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--mint { transform: translate3d(-10px, 2px, 0) scaleX(1.05) scaleY(0.99); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--pink { transform: translate3d(12px, 2px, 0) scaleX(1.05) scaleY(0.99); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--lavender { transform: translate3d(2px, 12px, 0) scaleX(0.99) scaleY(1.05); }
          .process-main-panel:has(.process-glass-card--3:is(:hover, :focus-within)) .process-ambient-blob--pink { transform: translate3d(12px, 2px, 0) scaleX(1.05) scaleY(0.99); }
          .process-main-panel:has(.process-glass-card--3:is(:hover, :focus-within)) .process-ambient-blob--lavender { transform: translate3d(10px, 12px, 0) scaleX(1.05) scaleY(0.99); }
          .process-main-panel:has(.process-glass-card--3:is(:hover, :focus-within)) .process-ambient-blob--yellow { transform: translate3d(-10px, -2px, 0) scaleX(1.05) scaleY(0.99); }
        }

        @media (prefers-reduced-motion: reduce) {
          .process-ambient-blob::before {
            animation: none;
          }

          .process-glass-card:is(:hover, :focus-within) {
            transform: none;
          }

          .process-glass-card:is(:hover, :focus-within)::before,
          .process-glass-card:is(:hover, :focus-within)::after {
            transform: none;
          }

          .process-main-panel:has(.process-glass-card:is(:hover, :focus-within)) .process-ambient-blob {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
