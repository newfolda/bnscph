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
      className="relative z-20 bg-white pb-10 md:pb-12"
    >
      <Container className="relative -mt-5 sm:-mt-7 md:-mt-8 lg:-mt-12">
        <div
          className="mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-7 shadow-[0_34px_78px_rgba(0,0,0,0.46),0_12px_28px_rgba(200,160,68,0.12)] ring-1 ring-white/30 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_40px_88px_rgba(0,0,0,0.5),0_16px_34px_rgba(200,160,68,0.14)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14"
          style={{
            background:
              "radial-gradient(ellipse at 0% 20%, rgba(190, 240, 215, 0.34) 0%, rgba(190, 240, 215, 0.16) 28%, transparent 58%), radial-gradient(ellipse at 48% -8%, rgba(255, 235, 170, 0.3) 0%, rgba(255, 235, 170, 0.14) 30%, transparent 62%), radial-gradient(ellipse at 100% 12%, rgba(255, 210, 225, 0.3) 0%, rgba(255, 210, 225, 0.14) 30%, transparent 60%), radial-gradient(ellipse at 5% 100%, rgba(195, 225, 255, 0.32) 0%, rgba(195, 225, 255, 0.15) 32%, transparent 62%), radial-gradient(ellipse at 95% 100%, rgba(220, 215, 255, 0.24) 0%, rgba(220, 215, 255, 0.11) 30%, transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.82) 36%, transparent 72%), #ffffff",
          }}
        >
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
    </section>
  )
}
