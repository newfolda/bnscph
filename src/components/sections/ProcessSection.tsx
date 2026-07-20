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
    <section className="relative z-20 bg-[var(--background)] pb-16 md:pb-20">
      <Container className="relative -mt-14 sm:-mt-16 md:-mt-24 lg:-mt-32">
        <div className="mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] bg-white px-7 py-7 shadow-[0_24px_60px_rgba(31,31,31,0.14)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(31,31,31,0.18)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14">
          <div className="mb-10 flex flex-col items-center text-center">
            <p className="mb-3 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              3 Simple Steps
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">How It Works?</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
              500+ verified buyers. The right market price. A seamless process.
            </p>
          </div>
          <div
            ref={gridRef}
            className="relative grid gap-6 md:grid-cols-3"
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
                className="group relative z-10 flex min-h-[290px] flex-col items-center rounded-[1.625rem] bg-[#F7F7F7] px-6 pb-7 pt-5 text-center shadow-[0_8px_22px_rgba(31,31,31,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,31,31,0.10)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span
                  className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--primary)] shadow-[0_4px_12px_rgba(31,31,31,0.10)] transition-[transform,box-shadow] duration-200 ease-out group-hover:scale-130 group-hover:shadow-[0_8px_18px_rgba(31,31,31,0.14)] motion-reduce:transform-none"
                >
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:scale-200 motion-reduce:transform-none">
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
                      className="object-contain"
                    />
                  )}
                  {index === 1 && (
                    <Image
                      src="/images/brand/process-inspection.png"
                      alt="Schedule a car inspection"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  )}
                  {index === 2 && (
                    <Image
                      src="/images/brand/process-payment.png"
                      alt="Receive payment for your car"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="mt-3 flex w-full flex-col items-center text-center">
                  <h3 className="flex min-h-12 items-center text-xl font-bold leading-[1.2] text-[var(--text-primary)] transition-colors duration-200 ease-out group-hover:text-[var(--primary)] motion-reduce:transition-none">
                    {step.title}
                  </h3>
                  <p className="mt-2 min-h-10 max-w-[16rem] text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-200 ease-out group-hover:text-[var(--text-primary)] motion-reduce:transition-none">
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
