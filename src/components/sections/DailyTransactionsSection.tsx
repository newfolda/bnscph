"use client"

import Image from "next/image"
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

  return (
    <section id="latest-transactions" className="overflow-hidden bg-[var(--background-alt)] py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-center text-center">
          <SectionPill>
            {t.transactions.pill}
          </SectionPill>
          <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
            {t.transactions.title}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
            {t.transactions.description}
          </p>
        </div>

        <div className="relative mx-[-1rem] mt-14 pb-10 sm:mx-[-1.5rem] md:pb-12 lg:mx-[-2.5rem]">
          <div className="transactions-marquee relative z-10 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-hidden">
            <div className="transactions-track flex w-max snap-x snap-mandatory gap-7 pr-7 md:gap-8 md:pr-8 md:snap-none">
              {[...latestTransactions, ...latestTransactions].map((transaction, index) => {
                const isDuplicate = index >= latestTransactions.length

                return (
                  <article
                    key={`${transaction.year}-${transaction.brand}-${transaction.model}-${isDuplicate ? "duplicate" : "original"}`}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : 0}
                    className={`group flex h-[418px] w-[78vw] max-w-[290px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-[0_8px_20px_rgba(31,31,31,0.06),0_2px_5px_rgba(31,31,31,0.035)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--primary)]/60 hover:shadow-[0_14px_28px_rgba(31,31,31,0.09),0_3px_8px_rgba(31,31,31,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] motion-reduce:transform-none motion-reduce:transition-none md:h-[400px] md:w-[250px] md:max-w-none lg:h-[420px] lg:w-[290px] ${
                      isDuplicate ? "hidden md:block" : ""
                    }`}
                  >
                    <div className="relative h-[286px] shrink-0 overflow-hidden bg-[#F7F7F7] md:h-[270px] lg:h-[320px]">
                      <Image
                        src={transaction.imagePath}
                        alt={`${transaction.year} ${transaction.brand} ${transaction.model} recently purchased by Buy and Sell Cars Philippines`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 290px, (min-width: 768px) 250px, 78vw"
                        className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-white/75 bg-white/80 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-[0_3px_10px_rgba(31,31,31,0.10)] backdrop-blur-md transition-colors duration-300 group-hover:bg-white/95 motion-reduce:transition-none">
                        {formatPurchasedAt(transaction.purchasedAt, t.transactions.recentlyPurchased, t.transactions.purchasedOn, t.transactions.dateLocale)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5 md:p-5 lg:h-[100px] lg:flex-none lg:px-5 lg:py-4">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
                        {transaction.year} {transaction.brand} {transaction.model}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{t.transactions.sellerFrom} {transaction.location}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
          <div aria-hidden="true" className="transactions-fade-left pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-16 md:block lg:w-24" />
          <div aria-hidden="true" className="transactions-fade-right pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-16 md:block lg:w-24" />
        </div>
      </Container>
      <style>{`
        @media (min-width: 768px) {
          .transactions-track {
            animation: transactions-marquee 36s linear infinite;
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

        @keyframes transactions-marquee {
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .transactions-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
