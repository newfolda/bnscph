"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Container from "../ui/Container"

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
      className="relative z-20 isolate bg-[linear-gradient(180deg,#07080a_0%,#101216_48%,#17191e_100%)] pb-10 md:pb-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.22)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] h-[30rem] w-screen max-w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,160,68,0.09)_0%,rgba(200,160,68,0.035)_34%,transparent_68%)] md:h-[42rem] md:max-w-[70rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-6 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(214,224,232,0.07),transparent_68%)] md:block"
      />
      <div
        aria-hidden="true"
        className="process-showroom-grid pointer-events-none absolute inset-x-[-20%] bottom-[-18%] top-[45%] hidden md:block"
      />
      <div
        aria-hidden="true"
        className="process-grid-light-sweep pointer-events-none absolute inset-x-[10%] top-[45%] hidden h-24 bg-[linear-gradient(90deg,transparent,rgba(255,248,232,0.1),rgba(200,160,68,0.08),rgba(255,248,232,0.1),transparent)] blur-2xl md:block"
      />
      <div
        aria-hidden="true"
        className="process-light-streak process-light-streak-one pointer-events-none absolute left-[8%] top-[28%] hidden h-px w-[28%] bg-[linear-gradient(90deg,transparent,rgba(255,247,225,0.22),transparent)] blur-[1px] md:block"
      />
      <div
        aria-hidden="true"
        className="process-light-streak process-light-streak-two pointer-events-none absolute right-[6%] top-[51%] hidden h-px w-[24%] bg-[linear-gradient(90deg,transparent,rgba(200,160,68,0.2),transparent)] blur-[1px] md:block"
      />
      <div
        aria-hidden="true"
        className="process-light-streak process-light-streak-three pointer-events-none absolute left-[28%] top-[70%] hidden h-px w-[20%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] blur-[1px] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 0.55px, transparent 0.7px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[58%] h-48 w-screen max-w-[60rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(255,249,235,0.07)_0%,rgba(200,160,68,0.055)_38%,transparent_72%)]"
      />
      <Container className="relative z-10 -mt-6 sm:-mt-9 md:-mt-10 lg:-mt-14">
        <div className="mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-7 shadow-[0_34px_78px_rgba(0,0,0,0.46),0_12px_28px_rgba(200,160,68,0.12)] ring-1 ring-white/30 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_40px_88px_rgba(0,0,0,0.5),0_16px_34px_rgba(200,160,68,0.14)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14">
          <div className="mb-11 flex flex-col items-center text-center">
            <p className="mb-4 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              Process
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">How It Works?</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
              3 SIMPLE STEPS.
            </p>
          </div>
          <div
            ref={gridRef}
            className="group/process relative grid gap-6 md:grid-cols-3"
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
                className="group/card relative z-10 flex min-h-[290px] flex-col items-center rounded-[1.625rem] bg-[#F7F7F7] px-6 pb-7 pt-5 text-center shadow-[0_8px_22px_rgba(31,31,31,0.035)] transition-[transform,box-shadow,filter] duration-300 ease-out group-hover/process:brightness-[0.98] group-hover/process:saturate-[0.96] group-hover/process:shadow-[0_6px_16px_rgba(31,31,31,0.03)] hover:z-20 hover:-translate-y-1.5 hover:brightness-100 hover:saturate-100 hover:shadow-[0_22px_38px_rgba(31,31,31,0.14)] focus-within:z-20 focus-within:brightness-100 focus-within:saturate-100 focus-within:shadow-[0_22px_38px_rgba(31,31,31,0.14)] motion-reduce:transform-none motion-reduce:transition-none"
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
      </Container>
      <style>{`
        .process-showroom-grid {
          background-image:
            repeating-linear-gradient(90deg, rgba(220, 226, 232, 0.08) 0 1px, transparent 1px 92px),
            repeating-linear-gradient(0deg, rgba(220, 226, 232, 0.07) 0 1px, transparent 1px 58px),
            linear-gradient(66deg, transparent 46%, rgba(200, 160, 68, 0.1) 50%, transparent 54%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.9) 23%, rgba(0, 0, 0, 0.75) 68%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.9) 23%, rgba(0, 0, 0, 0.75) 68%, transparent 100%);
          transform-origin: top center;
          animation: process-showroom-grid-drift 20s linear infinite, process-showroom-grid-breathe 12s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .process-grid-light-sweep {
          animation: process-showroom-grid-sweep 21s linear infinite;
          will-change: transform, opacity;
        }

        .process-light-streak {
          animation: process-showroom-light-drift 18s ease-in-out infinite alternate;
          will-change: transform;
        }

        .process-light-streak-two {
          animation-duration: 22s;
          animation-delay: -7s;
        }

        .process-light-streak-three {
          animation-duration: 20s;
          animation-delay: -12s;
        }

        @keyframes process-showroom-light-drift {
          from { transform: translate3d(-10px, 0, 0); }
          to { transform: translate3d(10px, 0, 0); }
        }

        @keyframes process-showroom-grid-drift {
          from { transform: perspective(780px) rotateX(58deg) scale(1.3) translate3d(0, 0, 0); }
          to { transform: perspective(780px) rotateX(58deg) scale(1.3) translate3d(0, 16px, 0); }
        }

        @keyframes process-showroom-grid-breathe {
          0%, 100% { opacity: 0.14; }
          50% { opacity: 0.2; }
        }

        @keyframes process-showroom-grid-sweep {
          0% { transform: translate3d(0, -2rem, 0); opacity: 0; }
          10% { opacity: 0.1; }
          82% { opacity: 0.1; }
          100% { transform: translate3d(0, 28rem, 0); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .process-light-streak {
            animation: none;
          }

          .process-showroom-grid,
          .process-grid-light-sweep {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
