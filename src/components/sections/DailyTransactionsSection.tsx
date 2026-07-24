import Image from "next/image"
import { latestTransactions } from "@/src/data/latestTransactions"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const purchasedAtFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function formatPurchasedAt(purchasedAt?: string) {
  if (!purchasedAt) return "Recently Purchased"

  const dateParts = purchasedAt.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!dateParts) return "Recently Purchased"

  const [, year, month, day] = dateParts
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return "Recently Purchased"
  }

  return `Purchased on ${purchasedAtFormatter.format(date)}`
}

export default function DailyTransactionsSection() {
  return (
    <section id="latest-transactions" className="overflow-hidden bg-[var(--background-alt)] py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-center text-center">
          <SectionPill>
            Latest Transactions
          </SectionPill>
          <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
            Cars Recently Purchased by Buy and Sell Cars Philippines
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
            Helping car owners across the Philippines sell their vehicles with ease.
          </p>
        </div>

        <div className="relative mx-[-1rem] mt-14 pb-10 sm:mx-[-1.5rem] md:pb-12 lg:mx-[-2.5rem]">
          <div aria-hidden="true" className="mobee-transactions-backdrop pointer-events-none absolute inset-x-0 bottom-5 top-5 rounded-[2rem]" />
          <div className="mobee-transactions-marquee relative z-10 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-hidden">
            <div className="mobee-transactions-track flex w-max snap-x snap-mandatory gap-5 pr-5 md:snap-none">
              {[...latestTransactions, ...latestTransactions].map((transaction, index) => {
                const transactionIndex = index % latestTransactions.length
                const isDuplicate = index >= latestTransactions.length

                return (
                  <article
                    key={`${transaction.year}-${transaction.brand}-${transaction.model}-${isDuplicate ? "duplicate" : "original"}`}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : 0}
                    className={`group w-[86%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-[0_10px_24px_rgba(31,31,31,0.07),0_2px_5px_rgba(31,31,31,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--primary)]/60 hover:shadow-[0_18px_34px_rgba(31,31,31,0.12),0_4px_10px_rgba(200,160,68,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] motion-reduce:transform-none motion-reduce:transition-none md:w-[250px] lg:w-[282px] ${
                      isDuplicate ? "hidden md:block" : ""
                    }`}
                  >
                    <div className="relative h-[184px] overflow-hidden bg-[#F7F7F7]">
                      <Image
                        src={transaction.imagePath}
                        alt={`${transaction.year} ${transaction.brand} ${transaction.model} recently purchased by Buy and Sell Cars Philippines`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 306px, (min-width: 768px) 250px, 86vw"
                        className={`object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none ${
                          transactionIndex === 0
                            ? "object-[68%_center]"
                            : transactionIndex === 1
                              ? "object-[51%_center]"
                              : transactionIndex === 2
                                ? "object-[85%_center]"
                                : "object-[38%_center]"
                        }`}
                      />
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full border border-white/75 bg-white/80 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-[0_3px_10px_rgba(31,31,31,0.10)] backdrop-blur-md transition-colors duration-300 group-hover:bg-white/95 motion-reduce:transition-none">
                        {formatPurchasedAt(transaction.purchasedAt)}
                      </span>
                    </div>
                    <div className="p-5 md:p-5">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
                        {transaction.year} {transaction.brand} {transaction.model}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">Seller from {transaction.location}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
          <div aria-hidden="true" className="mobee-transactions-fade-left pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-16 md:block lg:w-24" />
          <div aria-hidden="true" className="mobee-transactions-fade-right pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-16 md:block lg:w-24" />
        </div>
      </Container>
      <style>{`
        .mobee-transactions-backdrop {
          background:
            radial-gradient(circle at 18% 48%, rgba(200, 160, 68, 0.09), transparent 31%),
            radial-gradient(circle at 84% 38%, rgba(200, 160, 68, 0.07), transparent 28%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(248, 248, 248, 0.12));
        }

        @media (min-width: 768px) {
          .mobee-transactions-track {
            animation: mobee-transactions-marquee 36s linear infinite;
          }

          .mobee-transactions-marquee:hover .mobee-transactions-track,
          .mobee-transactions-marquee:focus-within .mobee-transactions-track,
          .mobee-transactions-marquee:active .mobee-transactions-track {
            animation-play-state: paused;
          }

          .mobee-transactions-fade-left {
            background: linear-gradient(90deg, var(--background-alt), rgba(248, 248, 248, 0));
          }

          .mobee-transactions-fade-right {
            background: linear-gradient(270deg, var(--background-alt), rgba(248, 248, 248, 0));
          }
        }

        @keyframes mobee-transactions-marquee {
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobee-transactions-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
