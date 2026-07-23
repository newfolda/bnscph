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
          className="relative mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-7 shadow-[0_34px_78px_rgba(0,0,0,0.46),0_12px_28px_rgba(200,160,68,0.12)] ring-1 ring-white/30 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_40px_88px_rgba(0,0,0,0.5),0_16px_34px_rgba(200,160,68,0.14)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14"
        >
          <div
            aria-hidden="true"
            className="process-panel-ambient pointer-events-none absolute -inset-[18%] z-0"
          />
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
            <span
              aria-hidden="true"
              className="process-card-ripple process-card-ripple--1 process-card-ripple--primary pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="process-card-ripple process-card-ripple--1 process-card-ripple--secondary pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="process-card-ripple process-card-ripple--2 process-card-ripple--primary pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="process-card-ripple process-card-ripple--2 process-card-ripple--secondary pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="process-card-ripple process-card-ripple--3 process-card-ripple--primary pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="process-card-ripple process-card-ripple--3 process-card-ripple--secondary pointer-events-none"
            />
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
          background:
            radial-gradient(ellipse at 0% 20%, rgba(190, 240, 215, 0.34) 0%, rgba(190, 240, 215, 0.16) 28%, transparent 58%),
            radial-gradient(ellipse at 48% -8%, rgba(255, 235, 170, 0.3) 0%, rgba(255, 235, 170, 0.14) 30%, transparent 62%),
            radial-gradient(ellipse at 100% 12%, rgba(255, 210, 225, 0.3) 0%, rgba(255, 210, 225, 0.14) 30%, transparent 60%),
            radial-gradient(ellipse at 5% 100%, rgba(195, 225, 255, 0.32) 0%, rgba(195, 225, 255, 0.15) 32%, transparent 62%),
            radial-gradient(ellipse at 95% 100%, rgba(220, 215, 255, 0.24) 0%, rgba(220, 215, 255, 0.11) 30%, transparent 60%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.82) 36%, transparent 72%),
            #ffffff;
          background-size: 140% 140%;
          opacity: 0.92;
          animation: process-panel-ambient-flow 30s ease-in-out infinite;
          will-change: transform, opacity, background-position;
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
          background: linear-gradient(
            135deg,
            transparent 48%,
            rgba(168, 191, 204, 0.13) 76%,
            rgba(255, 255, 255, 0.48) 100%
          );
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
            0 20px 40px rgba(20, 24, 32, 0.14),
            0 6px 14px rgba(20, 24, 32, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.98),
            inset 0 -1px 0 rgba(120, 135, 150, 0.16);
          filter: brightness(1.03) saturate(1.05);
          transform: translateY(-5px);
        }

        .process-card-ripple {
          position: absolute;
          z-index: 0;
          top: 0;
          width: calc((100% - 3rem) / 3);
          height: 290px;
          border: 1.5px solid rgba(255, 255, 255, 0.72);
          border-radius: 1.625rem;
          box-shadow:
            0 0 24px rgba(218, 235, 245, 0.12),
            0 0 0 1px rgba(170, 205, 220, 0.32),
            0 0 0 2px rgba(200, 160, 68, 0.08);
          opacity: 0;
          transform: scale(1.08);
          transform-origin: center;
        }

        .process-card-ripple--1 {
          left: 0;
        }

        .process-card-ripple--2 {
          left: calc((100% - 3rem) / 3 + 1.5rem);
        }

        .process-card-ripple--3 {
          right: 0;
        }

        .process-card-ripple--secondary {
          border-width: 1px;
          border-color: rgba(170, 205, 220, 0.32);
          box-shadow:
            0 0 20px rgba(218, 235, 245, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.34),
            0 0 0 2px rgba(200, 160, 68, 0.06);
        }

        .process-cards-grid:has(.process-glass-card--1:hover) .process-card-ripple--1.process-card-ripple--primary,
        .process-cards-grid:has(.process-glass-card--2:hover) .process-card-ripple--2.process-card-ripple--primary,
        .process-cards-grid:has(.process-glass-card--3:hover) .process-card-ripple--3.process-card-ripple--primary,
        .process-cards-grid:has(.process-glass-card--1:focus-within) .process-card-ripple--1.process-card-ripple--primary,
        .process-cards-grid:has(.process-glass-card--2:focus-within) .process-card-ripple--2.process-card-ripple--primary,
        .process-cards-grid:has(.process-glass-card--3:focus-within) .process-card-ripple--3.process-card-ripple--primary {
          animation: process-card-ripple-primary 1050ms cubic-bezier(0.22, 1, 0.36, 1) 60ms;
        }

        .process-cards-grid:has(.process-glass-card--1:hover) .process-card-ripple--1.process-card-ripple--secondary,
        .process-cards-grid:has(.process-glass-card--2:hover) .process-card-ripple--2.process-card-ripple--secondary,
        .process-cards-grid:has(.process-glass-card--3:hover) .process-card-ripple--3.process-card-ripple--secondary,
        .process-cards-grid:has(.process-glass-card--1:focus-within) .process-card-ripple--1.process-card-ripple--secondary,
        .process-cards-grid:has(.process-glass-card--2:focus-within) .process-card-ripple--2.process-card-ripple--secondary,
        .process-cards-grid:has(.process-glass-card--3:focus-within) .process-card-ripple--3.process-card-ripple--secondary {
          animation: process-card-ripple-secondary 1250ms cubic-bezier(0.22, 1, 0.36, 1) 170ms;
        }

        @keyframes process-card-ripple-primary {
          0% { opacity: 0.65; transform: scale(1.08); }
          100% { opacity: 0; transform: scale(1.36); }
        }

        @keyframes process-card-ripple-secondary {
          0% { opacity: 0.42; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.44); }
        }

        @media (max-width: 767px) {
          .process-card-ripple {
            left: 0;
            width: 100%;
            height: 290px;
            opacity: 0;
          }

          .process-card-ripple--1 {
            top: 0;
          }

          .process-card-ripple--2 {
            top: 314px;
          }

          .process-card-ripple--3 {
            top: 628px;
          }

          @keyframes process-card-ripple-primary {
            0% { opacity: 0.5; transform: scale(1.06); }
            100% { opacity: 0; transform: scale(1.22); }
          }

          @keyframes process-card-ripple-secondary {
            0% { opacity: 0.3; transform: scale(1.08); }
            100% { opacity: 0; transform: scale(1.28); }
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          @keyframes process-card-ripple-primary {
            0% { opacity: 0.65; transform: scale(1.08); }
            100% { opacity: 0; transform: scale(1.3); }
          }

          @keyframes process-card-ripple-secondary {
            0% { opacity: 0.42; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(1.36); }
          }
        }

        @keyframes process-panel-ambient-flow {
          0%, 100% {
            transform: translate3d(-2%, -1%, 0) scale(1.03);
            background-position: 0% 0%;
            opacity: 0.92;
          }
          33% {
            transform: translate3d(2%, 1%, 0) scale(1.06);
            background-position: 40% 20%;
            opacity: 1;
          }
          66% {
            transform: translate3d(-1%, 2%, 0) scale(1.04);
            background-position: 70% 60%;
            opacity: 0.95;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .process-panel-ambient {
            animation: none;
          }

          .process-glass-card:is(:hover, :focus-within) {
            transform: none;
          }

          .process-card-ripple {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
