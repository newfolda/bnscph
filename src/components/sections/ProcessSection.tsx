"use client"

import { type PointerEvent, useEffect, useRef, useState } from "react"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const processVideoSizes = [
  "w-[225px] h-[141px]",
  "w-[285px] h-[195px]",
  "w-[285px] h-[195px]",
]

export default function ProcessSection() {
  const { t } = useLanguage()
  const processSteps = t.process.steps
  const [activeMobileCard, setActiveMobileCard] = useState<number | null>(null)
  const [processActivationSequence, setProcessActivationSequence] = useState(0)
  const processCardRefs = useRef<Array<HTMLDivElement | null>>([])
  const activeMobileCardRef = useRef<number | null>(null)

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 1023px)")
    let observer: IntersectionObserver | null = null
    const activeCards = new Set<number>()

    const updateActiveCard = () => {
      if (!mobileQuery.matches || activeCards.size === 0) {
        return
      }

      const viewportCenter = window.innerHeight / 2
      let closestIndex: number | null = null
      let closestDistance = Number.POSITIVE_INFINITY

      activeCards.forEach((index) => {
        const card = processCardRefs.current[index]
        if (!card) return

        const bounds = card.getBoundingClientRect()
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestIndex !== null) {
        if (closestIndex !== activeMobileCardRef.current) {
          activeMobileCardRef.current = closestIndex
          setActiveMobileCard(closestIndex)
          setProcessActivationSequence((sequence) => sequence + 1)
        }
      }
    }

    const observeCards = () => {
      observer?.disconnect()
      activeCards.clear()

      if (!mobileQuery.matches) {
        activeMobileCardRef.current = null
        setActiveMobileCard(null)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute("data-process-card-index"))
            if (entry.isIntersecting) {
              activeCards.add(index)
            } else {
              activeCards.delete(index)
            }
          })

          updateActiveCard()
        },
        {
          root: null,
          rootMargin: "-40% 0px -40% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      )

      processCardRefs.current.forEach((card) => {
        if (card) observer?.observe(card)
      })
    }

    observeCards()
    mobileQuery.addEventListener("change", observeCards)

    return () => {
      observer?.disconnect()
      mobileQuery.removeEventListener("change", observeCards)
    }
  }, [processSteps.length])

  const resetCardPointerPhysics = (card: HTMLDivElement) => {
    card.style.setProperty("--tilt-x", "0deg")
    card.style.setProperty("--tilt-y", "0deg")
    card.style.setProperty("--reflection-x", "0px")
    card.style.setProperty("--reflection-y", "0px")
    card.style.setProperty("--reflection-secondary-x", "0px")
    card.style.setProperty("--reflection-secondary-y", "0px")
    card.style.setProperty("--shadow-x", "0px")
    card.style.setProperty("--shadow-y", "0px")
  }

  const handleCardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const normalizedX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
    const normalizedY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))

    card.style.setProperty("--tilt-x", `${normalizedY * -0.7}deg`)
    card.style.setProperty("--tilt-y", `${normalizedX * 0.9}deg`)
    card.style.setProperty("--reflection-x", `${normalizedX * 8}px`)
    card.style.setProperty("--reflection-y", `${normalizedY * 7}px`)
    card.style.setProperty("--reflection-secondary-x", `${normalizedX * 4.4}px`)
    card.style.setProperty("--reflection-secondary-y", `${normalizedY * 3.85}px`)
    card.style.setProperty("--shadow-x", `${normalizedX * -4}px`)
    card.style.setProperty("--shadow-y", `${normalizedY * -3}px`)
  }

  return (
    <section
      id="how-it-works"
      className="relative z-20 bg-white pb-10 md:pb-12"
    >
      <Container className="relative -mt-12 sm:-mt-5 md:-mt-6 lg:-mt-8">
        <div
          className={`process-main-panel relative mx-auto max-w-[75rem] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white px-7 py-7 shadow-[0_34px_78px_rgba(0,0,0,0.46),0_12px_28px_rgba(200,160,68,0.12)] ring-1 ring-white/30 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_40px_88px_rgba(0,0,0,0.5),0_16px_34px_rgba(200,160,68,0.14)] motion-reduce:transform-none motion-reduce:transition-none sm:px-8 md:px-14 md:py-12 lg:px-16 lg:py-14${activeMobileCard !== null ? ` process-main-panel--active-${activeMobileCard + 1}` : ""}`}
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
              {t.process.pill}
            </SectionPill>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">{t.process.title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
              {t.process.supporting}
            </p>
          </div>
            <div className="process-cards-grid group/process relative grid gap-6 md:gap-7 md:grid-cols-3 xl:gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                ref={(card) => {
                  processCardRefs.current[index] = card
                }}
                data-process-card-index={index}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={(event) => resetCardPointerPhysics(event.currentTarget)}
                className={`process-glass-card process-glass-card--${index + 1}${activeMobileCard === index ? " process-glass-card--mobile-active" : ""} group/card relative z-10 flex min-h-[360px] flex-col items-center rounded-[1.625rem] px-6 pb-7 pt-7 text-center md:min-h-[382px] group-hover/process:brightness-[0.98] group-hover/process:saturate-[0.96] hover:z-20 focus-within:z-20 motion-reduce:transform-none motion-reduce:transition-none`}
              >
                <span
                  className="process-step-number relative z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--primary)] shadow-[0_4px_12px_rgba(31,31,31,0.10)] transition-[transform,box-shadow] duration-300 ease-out group-hover/card:scale-110 group-hover/card:shadow-[0_8px_18px_rgba(31,31,31,0.14)] motion-reduce:transform-none"
                >
                  <span className="inline-block transition-transform duration-300 ease-out group-hover/card:scale-125 motion-reduce:transform-none">
                    {index + 1}
                  </span>
                </span>
                <div className="mt-4 flex h-[180px] w-[260px] items-center justify-center">
                  {index === 0 && (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controls={false}
                      aria-hidden="true"
                      tabIndex={-1}
                      draggable={false}
                      className={`process-video ${processVideoSizes[index]} object-contain transition-transform duration-300 ease-out group-hover/card:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none`}
                    >
                      <source src="/videos/step-1.webm" type="video/webm" />
                      <source src="/videos/step-1.mp4" type="video/mp4" />
                    </video>
                  )}
                  {index === 1 && (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controls={false}
                      aria-hidden="true"
                      tabIndex={-1}
                      draggable={false}
                      className={`process-video ${processVideoSizes[index]} object-contain transition-transform duration-300 ease-out group-hover/card:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none`}
                    >
                      <source src="/videos/step-2.webm" type="video/webm" />
                      <source src="/videos/step-2.mp4" type="video/mp4" />
                    </video>
                  )}
                  {index === 2 && (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controls={false}
                      aria-hidden="true"
                      tabIndex={-1}
                      draggable={false}
                      className={`process-video ${processVideoSizes[index]} object-contain transition-transform duration-300 ease-out group-hover/card:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none`}
                    >
                      <source src="/videos/step-3.webm" type="video/webm" />
                      <source src="/videos/step-3.mp4" type="video/mp4" />
                    </video>
                  )}
                </div>
                <div className="mt-1 flex w-full flex-col items-center text-center">
                  <h3 className="flex min-h-[3.5rem] items-center text-xl font-bold leading-[1.2] text-[var(--text-primary)] transition-colors duration-300 ease-out group-hover/card:text-[var(--primary)] motion-reduce:transition-none">
                    {step.title}
                  </h3>
                  <p className="relative isolate mt-2 min-h-10 max-w-[16rem] overflow-hidden text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-300 ease-out group-hover/card:text-[var(--text-primary)] motion-reduce:transition-none">
                    <span className="process-card-description-text">
                      {step.description}
                    </span>
                    <span
                      key={`${index}-${activeMobileCard === index ? processActivationSequence : "idle"}`}
                      aria-hidden="true"
                      className="process-card-description-streak"
                    >
                      {step.description}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </Container>
      <style>{`
        .process-video {
          -webkit-mask-image: radial-gradient(ellipse at center, #000 0%, #000 93%, transparent 100%);
          mask-image: radial-gradient(ellipse at center, #000 0%, #000 93%, transparent 100%);
        }

        .process-panel-ambient {
          overflow: hidden;
          background: #ffffff;
        }

        .process-ambient-blob {
          position: absolute;
          border-radius: 50%;
          transition: transform 720ms cubic-bezier(0.22, 1, 0.36, 1), opacity 720ms cubic-bezier(0.22, 1, 0.36, 1);
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
          top: -18%;
          left: -9%;
          width: 62%;
          height: 62%;
        }

        .process-ambient-blob--mint::before {
          background: radial-gradient(ellipse, rgba(255, 247, 233, 0.38) 0%, rgba(255, 247, 233, 0.15) 34%, rgba(194, 207, 213, 0.025) 52%, transparent 70%);
          animation: process-ambient-mint-drift 24s ease-in-out infinite alternate;
        }

        .process-ambient-blob--yellow {
          top: -25%;
          left: 25%;
          width: 58%;
          height: 56%;
        }

        .process-ambient-blob--yellow::before {
          background: radial-gradient(ellipse, rgba(239, 219, 173, 0.28) 0%, rgba(239, 219, 173, 0.1) 34%, transparent 70%);
          animation: process-ambient-yellow-drift 28s ease-in-out infinite alternate;
        }

        .process-ambient-blob--pink {
          top: -16%;
          right: -10%;
          width: 58%;
          height: 60%;
        }

        .process-ambient-blob--pink::before {
          background: radial-gradient(ellipse, rgba(226, 196, 122, 0.22) 0%, rgba(226, 196, 122, 0.08) 34%, transparent 70%);
          animation: process-ambient-pink-drift 31s ease-in-out infinite alternate;
        }

        .process-ambient-blob--blue {
          bottom: -20%;
          left: -16%;
          width: 60%;
          height: 62%;
        }

        .process-ambient-blob--blue::before {
          background: radial-gradient(ellipse, rgba(247, 225, 181, 0.22) 0%, rgba(247, 225, 181, 0.08) 36%, transparent 70%);
          animation: process-ambient-blue-drift 34s ease-in-out infinite alternate;
        }

        .process-ambient-blob--lavender {
          right: -10%;
          bottom: -21%;
          width: 56%;
          height: 60%;
        }

        .process-ambient-blob--lavender::before {
          background: radial-gradient(ellipse, rgba(210, 185, 146, 0.18) 0%, rgba(210, 185, 146, 0.06) 34%, transparent 70%);
          animation: process-ambient-lavender-drift 38s ease-in-out infinite alternate;
        }

        .process-main-panel:has(.process-glass-card--1:hover) .process-ambient-blob--mint,
        .process-main-panel:has(.process-glass-card--1:focus-within) .process-ambient-blob--mint {
          transform: translate3d(-36px, 6px, 0) scaleX(1.14) scaleY(0.94);
        }

        .process-main-panel:has(.process-glass-card--1:hover) .process-ambient-blob--yellow,
        .process-main-panel:has(.process-glass-card--1:focus-within) .process-ambient-blob--yellow {
          transform: translate3d(24px, -28px, 0) scaleX(1.1) scaleY(0.96);
        }

        .process-main-panel:has(.process-glass-card--1:hover) .process-ambient-blob--blue,
        .process-main-panel:has(.process-glass-card--1:focus-within) .process-ambient-blob--blue {
          transform: translate3d(-12px, 30px, 0) scaleX(0.95) scaleY(1.12);
          transition-delay: 60ms;
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--yellow,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--yellow {
          transform: translate3d(0, -32px, 0) scaleX(0.95) scaleY(1.14);
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--mint,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--mint {
          transform: translate3d(-28px, 6px, 0) scaleX(1.12) scaleY(0.95);
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--pink,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--pink {
          transform: translate3d(30px, 4px, 0) scaleX(1.12) scaleY(0.95);
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--lavender,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--lavender {
          transform: translate3d(6px, 30px, 0) scaleX(0.95) scaleY(1.12);
          transition-delay: 60ms;
        }

        .process-main-panel:has(.process-glass-card--2:hover) .process-ambient-blob--blue,
        .process-main-panel:has(.process-glass-card--2:focus-within) .process-ambient-blob--blue {
          transform: translate3d(8px, 24px, 0) scaleX(0.96) scaleY(1.1);
          transition-delay: 60ms;
        }

        .process-main-panel:has(.process-glass-card--3:hover) .process-ambient-blob--pink,
        .process-main-panel:has(.process-glass-card--3:focus-within) .process-ambient-blob--pink {
          transform: translate3d(36px, 6px, 0) scaleX(1.14) scaleY(0.94);
        }

        .process-main-panel:has(.process-glass-card--3:hover) .process-ambient-blob--lavender,
        .process-main-panel:has(.process-glass-card--3:focus-within) .process-ambient-blob--lavender {
          transform: translate3d(28px, 32px, 0) scaleX(1.1) scaleY(0.96);
          transition-delay: 60ms;
        }

        .process-main-panel:has(.process-glass-card--3:hover) .process-ambient-blob--yellow,
        .process-main-panel:has(.process-glass-card--3:focus-within) .process-ambient-blob--yellow {
          transform: translate3d(-28px, -8px, 0) scaleX(1.12) scaleY(0.95);
        }

        .process-glass-card {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          --reflection-x: 0px;
          --reflection-y: 0px;
          --reflection-secondary-x: 0px;
          --reflection-secondary-y: 0px;
          --shadow-x: 0px;
          --shadow-y: 0px;
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
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
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

        .process-card-description-text {
          display: block;
          position: relative;
          z-index: 1;
        }

        .process-card-description-streak {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          display: block;
          pointer-events: none;
          font: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          text-align: inherit;
          color: transparent;
          opacity: 0;
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

        .process-glass-card:is(:hover, :focus-within) {
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
          filter: brightness(1.01) saturate(1.08);
          transform: translateY(-5px);
        }

        .process-glass-card:is(:hover, :focus-within)::before {
          transform: translate3d(8px, 8px, 0);
          opacity: 0.84;
        }

        .process-glass-card:is(:hover, :focus-within)::after {
          transform: translate3d(6px, 6px, 0) scale(1.02);
          opacity: 0.8;
        }

        .process-glass-card:is(:hover, :focus-within) .process-card-description-streak {
          animation: process-card-description-streak 1200ms cubic-bezier(0.22, 1, 0.36, 1) 130ms both;
        }

        @media (hover: hover) and (pointer: fine) {
          .process-glass-card:is(:hover, :focus-within) {
            transform:
              perspective(900px)
              translateY(-5px)
              rotateX(var(--tilt-x))
              rotateY(var(--tilt-y));
            box-shadow:
              var(--shadow-x) calc(24px + var(--shadow-y)) 48px rgba(20, 24, 32, 0.11),
              var(--shadow-x) calc(10px + var(--shadow-y)) 20px rgba(20, 24, 32, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 1),
              inset 0 -1px 0 rgba(120, 135, 150, 0.16);
          }

          .process-glass-card:is(:hover, :focus-within)::before {
            transform: translate3d(var(--reflection-x), var(--reflection-y), 0);
          }

          .process-glass-card:is(:hover, :focus-within)::after {
            transform: translate3d(
              var(--reflection-secondary-x),
              var(--reflection-secondary-y),
              0
            ) scale(1.02);
            transition-duration: 540ms;
          }
        }

        @keyframes process-ambient-mint-drift {
          from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.9; }
          to { transform: translate3d(-12px, 10px, 0) scale(1.05); opacity: 0.96; }
        }

        @keyframes process-card-description-streak {
          0% {
            background-position: 110% 0;
            opacity: 0;
          }

          14% {
            opacity: 1;
          }

          86% {
            opacity: 1;
          }

          100% {
            background-position: -10% 0;
            opacity: 0;
          }
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

        @media (max-width: 1023px) {
          .process-glass-card--mobile-active {
            z-index: 20;
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
            filter: brightness(1.01) saturate(1.08);
            transform: translateY(-5px) scale(1.01);
          }

          .process-glass-card--mobile-active::before {
            transform: translate3d(8px, 8px, 0);
            opacity: 0.84;
          }

          .process-glass-card--mobile-active::after {
            transform: translate3d(6px, 6px, 0) scale(1.02);
            opacity: 0.8;
          }

          .process-glass-card--mobile-active .process-step-number {
            transform: scale(1.1);
            box-shadow: 0 8px 18px rgba(31, 31, 31, 0.14);
          }

          .process-glass-card--mobile-active .process-video {
            transform: translateY(-0.25rem);
          }

          .process-glass-card--mobile-active h3 {
            color: var(--primary);
          }

          .process-glass-card--mobile-active .process-card-description-text {
            color: var(--text-primary);
          }

          .process-glass-card--mobile-active .process-card-description-streak {
            background: linear-gradient(105deg, transparent 0%, transparent 30%, rgba(189, 140, 33, 0.08) 38%, rgba(221, 174, 65, 0.88) 48%, rgba(255, 250, 225, 1) 53%, rgba(190, 139, 31, 0.7) 59%, transparent 70%, transparent 100%);
            background-size: 260% 100%;
            animation: process-card-description-streak 1500ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .process-main-panel--active-1 .process-ambient-blob--mint { transform: translate3d(-16px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel--active-1 .process-ambient-blob--yellow { transform: translate3d(14px, -14px, 0) scaleX(1.06) scaleY(0.98); }
          .process-main-panel--active-1 .process-ambient-blob--blue { transform: translate3d(-6px, 18px, 0) scaleX(0.97) scaleY(1.08); }
          .process-main-panel--active-2 .process-ambient-blob--yellow { transform: translate3d(0, -18px, 0) scaleX(0.97) scaleY(1.08); }
          .process-main-panel--active-2 .process-ambient-blob--mint { transform: translate3d(-14px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel--active-2 .process-ambient-blob--pink { transform: translate3d(16px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel--active-2 .process-ambient-blob--lavender { transform: translate3d(4px, 18px, 0) scaleX(0.97) scaleY(1.08); }
          .process-main-panel--active-2 .process-ambient-blob--blue { transform: translate3d(4px, 16px, 0) scaleX(0.98) scaleY(1.07); }
          .process-main-panel--active-3 .process-ambient-blob--pink { transform: translate3d(18px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel--active-3 .process-ambient-blob--lavender { transform: translate3d(16px, 18px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel--active-3 .process-ambient-blob--yellow { transform: translate3d(-16px, -4px, 0) scaleX(1.08) scaleY(0.97); }
        }

        @media (max-width: 767px) {
          .process-main-panel:has(.process-glass-card--1:is(:hover, :focus-within)) .process-ambient-blob--mint { transform: translate3d(-16px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel:has(.process-glass-card--1:is(:hover, :focus-within)) .process-ambient-blob--yellow { transform: translate3d(14px, -14px, 0) scaleX(1.06) scaleY(0.98); }
          .process-main-panel:has(.process-glass-card--1:is(:hover, :focus-within)) .process-ambient-blob--blue { transform: translate3d(-6px, 18px, 0) scaleX(0.97) scaleY(1.08); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--yellow { transform: translate3d(0, -18px, 0) scaleX(0.97) scaleY(1.08); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--mint { transform: translate3d(-14px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--pink { transform: translate3d(16px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--lavender { transform: translate3d(4px, 18px, 0) scaleX(0.97) scaleY(1.08); }
          .process-main-panel:has(.process-glass-card--2:is(:hover, :focus-within)) .process-ambient-blob--blue { transform: translate3d(4px, 16px, 0) scaleX(0.98) scaleY(1.07); }
          .process-main-panel:has(.process-glass-card--3:is(:hover, :focus-within)) .process-ambient-blob--pink { transform: translate3d(18px, 4px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel:has(.process-glass-card--3:is(:hover, :focus-within)) .process-ambient-blob--lavender { transform: translate3d(16px, 18px, 0) scaleX(1.08) scaleY(0.97); }
          .process-main-panel:has(.process-glass-card--3:is(:hover, :focus-within)) .process-ambient-blob--yellow { transform: translate3d(-16px, -4px, 0) scaleX(1.08) scaleY(0.97); }
        }

        @media (prefers-reduced-motion: reduce) {
          .process-ambient-blob::before {
            animation: none;
          }

          .process-glass-card:is(:hover, :focus-within),
          .process-glass-card--mobile-active {
            transform: none;
            filter: none;
          }

          .process-glass-card:is(:hover, :focus-within)::before,
          .process-glass-card:is(:hover, :focus-within)::after,
          .process-glass-card--mobile-active::before,
          .process-glass-card--mobile-active::after {
            transform: none;
          }

          .process-card-description-streak {
            animation: none !important;
          }

          .process-main-panel:has(.process-glass-card:is(:hover, :focus-within)) .process-ambient-blob,
          .process-main-panel[class*="process-main-panel--active-"] .process-ambient-blob {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
