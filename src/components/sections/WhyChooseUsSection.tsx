"use client"

import { useEffect, useState } from "react"
import Container from "../ui/Container"

const PAIR_COUNT = 6
const PAIR_DURATION_MS = 2400

const traditionalItems = [
  "Deal with countless inquiries",
  "Meet strangers and no-shows",
  "Negotiate with lowball buyers",
  "Handle all paperwork yourself",
  "Worry about payment security",
  "Wait days or weeks to sell",
]

const premiumItems = [
  "Serious buyers only — No endless inquiries or time wasters.",
  "Fair market valuation — Receive an offer based on current market conditions.",
  "Free doorstep inspection — We inspect your vehicle at your preferred location.",
  "We handle the paperwork — We'll guide you through the ownership transfer process.",
  "Secure payment — Receive payment before ownership is transferred.",
  "End-to-end service — From your first inquiry to final payment, we handle the process.",
]

type LaneProps = {
  premium?: boolean
  activePairIndex: number
}

function Lane({ premium = false, activePairIndex }: LaneProps) {
  const title = premium ? "Buy & Sell Cars Philippines" : "Traditional Selling"
  const items = premium ? premiumItems : traditionalItems
  const result = premium
    ? "A simpler, safer, and faster way to sell your car."
    : "More time, more uncertainty, and more effort."

  return (
    <article className={`relative ${premium ? "lg:-mt-6" : ""}`}>
      {premium && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-5 rounded-[2.25rem] bg-[var(--primary)]/10 blur-3xl"
        />
      )}

      <div
        className={`relative overflow-hidden rounded-[2rem] p-px ${
          premium
            ? "bg-gradient-to-br from-[var(--primary)]/75 via-[var(--primary)]/20 to-white shadow-[0_28px_65px_rgba(155,113,28,0.22)]"
            : "bg-[var(--border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
        }`}
      >
        {premium && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(200,160,68,0.12),transparent_58%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[80%] top-[34%] size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,255,255,0.2)] blur-3xl"
            />
          </>
        )}

        <div
          className={`relative rounded-[calc(2rem-1px)] p-5 sm:p-7 ${
            premium
              ? "bg-[linear-gradient(135deg,#fffdf8,white_38%,#f7f1e3)]"
              : "bg-[#efefed]"
          }`}
        >
          <div
            className={`rounded-[1.45rem] border p-5 sm:p-6 ${
              premium
                ? "border-[var(--primary)]/20 bg-white/75 shadow-[inset_0_1px_0_white]"
                : "border-black/5 bg-[#e7e7e4] shadow-[inset_0_2px_10px_rgba(0,0,0,0.035)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex size-9 items-center justify-center rounded-xl ${
                  premium
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white text-[#a07575]"
                }`}
              >
                {premium ? "✓" : "×"}
              </span>
              <div>
                <p
                  className={`mb-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    premium
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {premium ? "✓ Recommended" : "The Usual Route"}
                </p>
                <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  {title}
                </h3>
              </div>
            </div>

            <ul className="mt-7 space-y-2.5">
              {items.map((item, index) => {
                const [lead, ...rest] = item.split(" — ")
                const active = activePairIndex === index
                const muted = !active
                const label = `${
                  premium
                    ? "Buy and Sell Cars Philippines solution"
                    : "Traditional selling problem"
                } ${index + 1} of 6: ${item}`

                return (
                  <li
                    key={item}
                    tabIndex={0}
                    aria-label={label}
                    style={premium ? { transitionDelay: `${index * 28}ms` } : undefined}
                    className={`flex cursor-default gap-3 border-b px-2 py-3 outline-none transition-[transform,opacity,background-color,border-color,box-shadow] duration-300 last:border-0 focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                      premium
                        ? "border-[var(--primary)]/10 bg-white/45"
                        : "border-black/5"
                    } ${muted ? "opacity-70" : ""} ${
                      active
                        ? premium
                          ? "translate-x-[-3px] border-[var(--primary)]/35 bg-[var(--primary-light)] shadow-[0_8px_18px_rgba(155,113,28,0.12)] motion-reduce:translate-x-0"
                          : "translate-x-3 border-[#b88989]/35 bg-white/70 motion-reduce:translate-x-0"
                        : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 text-[10px] tabular-nums ${
                        active
                          ? "text-[var(--primary)]"
                          : "text-[var(--text-secondary)]/55"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center text-xs ${
                        premium
                          ? "text-[var(--primary)]"
                          : "text-[#a07575]"
                      }`}
                    >
                      {premium ? "✓" : "×"}
                    </span>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {premium && rest.length ? (
                        <>
                          <strong className="font-semibold text-[var(--text-primary)]">
                            {lead}
                          </strong>{" "}
                          — {rest.join(" — ")}
                        </>
                      ) : (
                        item
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>

            <div
              className={`mt-6 rounded-xl p-4 ${
                premium
                  ? "bg-[var(--primary-light)] ring-1 ring-[var(--primary)]/15"
                  : "bg-white/55"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                  premium
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                Result
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text-primary)]">
                {result}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function WhyChooseUsSection() {
  const [activePairIndex, setActivePairIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    let intervalId: number | undefined

    const stopSequence = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
        intervalId = undefined
      }
    }

    const startSequence = () => {
      if (document.hidden || intervalId !== undefined) {
        return
      }

      intervalId = window.setInterval(() => {
        setActivePairIndex((currentIndex) => (currentIndex + 1) % PAIR_COUNT)
      }, PAIR_DURATION_MS)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSequence()
        return
      }

      startSequence()
    }

    startSequence()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stopSequence()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [prefersReducedMotion])

  const displayedPairIndex = prefersReducedMotion ? 0 : activePairIndex

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f6f2] pb-20 pt-14 md:pb-24 md:pt-16 lg:pb-28 lg:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 size-96 rounded-full bg-white/80 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 size-[34rem] rounded-full bg-[var(--primary)]/[0.09] blur-3xl"
      />

      <Container>
        <header className="relative max-w-3xl">
          <p className="w-fit rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
            WHY CHOOSE US
          </p>
          <h2 className="mt-3 text-4xl font-bold leading-[1.06] tracking-[-.04em] text-[var(--text-primary)] md:text-5xl lg:max-w-2xl lg:text-[3.35rem]">
            The simpler, safer way to sell your car—for a fair market price.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            Skip the uncertainty of private selling. From valuation to payment, we
            handle the process so you can sell with confidence.
          </p>
        </header>

        <div className="relative mt-14 grid gap-7 lg:grid-cols-[42fr_8fr_50fr] lg:items-center">
          <Lane activePairIndex={displayedPairIndex} />

          <div
            aria-hidden="true"
            className="relative flex min-h-16 items-center justify-center lg:min-h-[31rem]"
          >
            <div className="absolute rounded-full border border-[var(--primary)]/55 bg-white px-3 py-2 text-xs font-bold tracking-[.16em] text-[var(--text-secondary)] shadow-[0_0_14px_rgba(200,160,68,.18)]">
              VS
            </div>
            <span className="absolute hidden text-[9px] font-bold tracking-[.12em] text-[var(--text-secondary)] lg:top-16 lg:block">
              MORE EFFORT
            </span>
            <span className="absolute text-[9px] font-bold tracking-[.12em] text-[var(--text-secondary)] lg:hidden">
              {`PAIR ${String(displayedPairIndex + 1).padStart(2, "0")}`}
            </span>
            <span className="absolute bottom-16 hidden text-[9px] font-bold tracking-[.12em] text-[var(--primary)] lg:block">
              LESS FRICTION
            </span>
          </div>

          <Lane premium activePairIndex={displayedPairIndex} />
        </div>
      </Container>
    </section>
  )
}
