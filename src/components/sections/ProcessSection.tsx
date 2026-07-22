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
      className="relative z-20 isolate overflow-hidden bg-[#08090b] pb-10 md:pb-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#08090b_0%,#15171b_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,160,68,0.12)_0%,rgba(200,160,68,0.05)_34%,transparent_68%)] md:h-[42rem] md:w-[70rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 0.55px, transparent 0.7px)",
          backgroundSize: "4px 4px",
        }}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 720"
      >
        <path
          d="M-120 600C180 440 300 680 570 476C820 286 1050 370 1560 86"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1.25"
        />
        <path
          d="M-90 210C210 96 374 274 612 188C898 84 1080 216 1512 16"
          stroke="rgba(200,160,68,0.16)"
          strokeDasharray="9 13"
          strokeWidth="1.15"
        />
        <path
          d="M68 766C300 504 438 614 690 430C924 258 1118 458 1464 248"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 12"
          strokeWidth="1"
        />
        <path
          className="hidden md:block"
          d="M-110 492C188 336 330 408 588 370C878 328 1072 146 1544 204"
          stroke="rgba(200,160,68,0.14)"
          strokeWidth="1.1"
        />
        <path
          className="hidden lg:block"
          d="M150 -28C302 160 452 128 670 260C932 420 1186 214 1488 410"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="14 16"
          strokeWidth="1"
        />
        <circle cx="274" cy="505" fill="rgba(200,160,68,0.58)" r="3" />
        <circle cx="616" cy="188" fill="rgba(255,255,255,0.42)" r="2.5" />
        <circle cx="1044" cy="374" fill="rgba(200,160,68,0.52)" r="3" />
        <circle className="hidden md:block" cx="1210" cy="278" fill="rgba(255,255,255,0.4)" r="2.5" />
      </svg>
      <Container className="relative -mt-14 sm:-mt-16 md:-mt-24 lg:-mt-32">
        <div className="mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/70 bg-white px-7 py-7 shadow-[0_32px_72px_rgba(0,0,0,0.42),0_10px_24px_rgba(200,160,68,0.12)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_38px_82px_rgba(0,0,0,0.48),0_14px_30px_rgba(200,160,68,0.15)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14">
          <div className="mb-10 flex flex-col items-center text-center">
            <p className="mb-3 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              Process
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">How It Works?</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
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
                className="group/card relative z-10 flex min-h-[290px] flex-col items-center rounded-[1.625rem] bg-[#F7F7F7] px-6 pb-7 pt-5 text-center shadow-[0_8px_22px_rgba(31,31,31,0.04)] transition-[transform,box-shadow,filter] duration-300 ease-out group-hover/process:brightness-[0.98] group-hover/process:saturate-[0.96] group-hover/process:shadow-[0_6px_16px_rgba(31,31,31,0.035)] hover:z-20 hover:-translate-y-1 hover:brightness-100 hover:saturate-100 hover:shadow-[0_18px_34px_rgba(31,31,31,0.13)] focus-within:z-20 focus-within:brightness-100 focus-within:saturate-100 focus-within:shadow-[0_18px_34px_rgba(31,31,31,0.13)] motion-reduce:transform-none motion-reduce:transition-none"
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
    </section>
  )
}
