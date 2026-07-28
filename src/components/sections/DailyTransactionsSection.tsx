"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { latestTransactions } from "@/src/data/latestTransactions"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

function formatPurchasedAt(purchasedAt: string | undefined, recentlyPurchased: string, purchasedOn: string, locale: string) {
  if (!purchasedAt) return recentlyPurchased

  const dateParts = purchasedAt.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!dateParts) return recentlyPurchased

  const [, year, month, day] = dateParts
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return recentlyPurchased
  }

  const formatter = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" })
  return `${purchasedOn} ${formatter.format(date)}`
}

export default function DailyTransactionsSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [isMarqueePaused, setIsMarqueePaused] = useState(false)

  useEffect(() => {
    const reveal = () => window.requestAnimationFrame(() => setHasEntered(true))

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = reveal()
      return () => window.cancelAnimationFrame(frame)
    }

    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === "undefined") {
      const frame = reveal()
      return () => window.cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHasEntered(true)
        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="latest-transactions" className={`transactions-section overflow-hidden border-t border-[var(--border)] bg-[var(--background-alt)] py-14 md:py-16 ${hasEntered ? "transactions-section--entered" : ""}`}>
      <Container>
        <div className="flex flex-col items-center text-center">
          <div className="transactions-reveal transactions-reveal--pill">
            <SectionPill>
              {t.transactions.pill}
            </SectionPill>
          </div>
          <h2 className="transactions-reveal transactions-reveal--heading mx-auto mt-3 max-w-[760px] text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
            {t.transactions.title}
          </h2>
          <p className="transactions-reveal transactions-reveal--description mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
            {t.transactions.description}
          </p>
        </div>

        <div className="transactions-reveal transactions-reveal--cards relative mx-[-1rem] mt-10 pb-4 sm:mx-[-1.5rem] md:mt-12 md:pb-6 lg:mx-[-2.5rem]">
          <div
            className={`transactions-marquee relative z-10 overflow-hidden pb-2 ${isMarqueePaused ? "transactions-marquee--paused" : ""}`}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") setIsMarqueePaused(true)
            }}
            onPointerUp={() => setIsMarqueePaused(false)}
            onPointerCancel={() => setIsMarqueePaused(false)}
          >
            <div className="transactions-track flex w-max snap-x snap-mandatory gap-7 pr-7 md:gap-8 md:pr-8 md:snap-none">
              {[...latestTransactions, ...latestTransactions].map((transaction, index) => {
                const isDuplicate = index >= latestTransactions.length

                return (
                  <article
                    key={`${transaction.year}-${transaction.brand}-${transaction.model}-${isDuplicate ? "duplicate" : "original"}`}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : 0}
                    className="group flex h-[418px] w-[78vw] max-w-[290px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[0_6px_18px_rgba(31,31,31,0.055),0_1px_3px_rgba(31,31,31,0.03)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[2px] hover:border-[var(--primary)]/60 hover:shadow-[0_16px_30px_rgba(31,31,31,0.095),0_3px_8px_rgba(31,31,31,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] motion-reduce:transform-none motion-reduce:transition-none md:h-[400px] md:w-[250px] md:max-w-none lg:h-[420px] lg:w-[290px]"
                  >
                    <div className="relative h-[286px] shrink-0 overflow-hidden bg-[#F7F7F7] md:h-[270px] lg:h-[320px]">
                      <Image
                        src={transaction.imagePath}
                        alt={`${transaction.year} ${transaction.brand} ${transaction.model} recently purchased by Buy and Sell Cars Philippines`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 290px, (min-width: 768px) 250px, 78vw"
                        className="object-cover object-center transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.035] motion-reduce:transition-none"
                      />
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/[0.05] to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full border border-white/65 bg-white/80 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-[0_2px_7px_rgba(31,31,31,0.08)] backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90 motion-reduce:transition-none">
                        {formatPurchasedAt(transaction.purchasedAt, t.transactions.recentlyPurchased, t.transactions.purchasedOn, t.transactions.dateLocale)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5 md:p-5 lg:h-[100px] lg:flex-none lg:px-5 lg:pb-3 lg:pt-5">
                      <h3 className="text-[0.95rem] font-bold uppercase leading-snug tracking-[0.025em] text-[var(--text-primary)]">
                        {transaction.year} {transaction.brand} {transaction.model}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{t.transactions.sellerFrom} {transaction.location}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
          <div aria-hidden="true" className="transactions-fade-left pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-14 md:block lg:w-[72px]" />
          <div aria-hidden="true" className="transactions-fade-right pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-14 md:block lg:w-[72px]" />
        </div>
      </Container>
      <style>{`
        .transactions-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .transactions-section--entered .transactions-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        .transactions-reveal--heading {
          transition-delay: 100ms;
        }

        .transactions-reveal--description {
          transition-delay: 180ms;
        }

        .transactions-reveal--cards {
          transition-delay: 280ms;
        }

        .transactions-section--entered .transactions-track {
          animation: transactions-marquee 30s linear 800ms infinite;
        }

        .transactions-marquee--paused .transactions-track {
          animation-play-state: paused;
        }

        @media (min-width: 768px) {
          .transactions-section--entered .transactions-track {
            animation-duration: 34s;
          }

          .transactions-marquee:hover .transactions-track,
          .transactions-marquee:focus-within .transactions-track,
          .transactions-marquee:active .transactions-track {
            animation-play-state: paused;
          }

          .transactions-fade-left {
            background: linear-gradient(90deg, var(--background-alt), rgba(248, 248, 248, 0));
          }

          .transactions-fade-right {
            background: linear-gradient(270deg, var(--background-alt), rgba(248, 248, 248, 0));
          }
        }

        @media (min-width: 1024px) {
          .transactions-section--entered .transactions-track {
            animation-duration: 36s;
          }
        }

        @keyframes transactions-marquee {
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .transactions-reveal,
          .transactions-section--entered .transactions-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .transactions-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
