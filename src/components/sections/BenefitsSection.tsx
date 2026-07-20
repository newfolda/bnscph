import Container from "../ui/Container"

const benefits = [
  {
    title: "Nationwide Reach",
    description: "Connect with verified buyers across the country instead of relying on just one or two offers.",
  },
  {
    title: "Right Price",
    description: "Get a market price informed by real buyer demand rather than guesswork.",
  },
  {
    title: "Defined Inspection",
    description: "Understand your car's value through clear, consistent inspection standards.",
  },
]

export default function BenefitsSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="pb-20 pt-14 md:pt-16 lg:pt-20">
          <div className="mb-10 flex flex-col items-center text-center">
            <p className="mb-3 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              Differences
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
              Why Choose Mobee Cars to Sell Your Car in the Philippines
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">See the difference before you decide.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="flex min-h-[240px] flex-col items-center rounded-[1.625rem] bg-[#F7F7F7] px-6 pb-8 pt-7 text-center shadow-[0_8px_22px_rgba(31,31,31,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,31,31,0.10)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="flex h-14 w-14 items-center justify-center" aria-hidden="true">
                  {index === 0 && (
                    <svg viewBox="0 0 56 56" fill="none" className="h-14 w-14">
                      <path d="M17 16c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 4.7 6 10 6 10s6-5.3 6-10ZM51 16c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 4.7 6 10 6 10s6-5.3 6-10ZM34 8c-3.3 0-6 2.7-6 6 0 4.7 6 10 6 10s6-5.3 6-10c0-3.3-2.7-6-6-6Z" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11 26v8M45 26v8M34 24v8M11 34h34" stroke="var(--text-secondary)" strokeWidth="2.25" strokeLinecap="round" />
                      <path d="M16 38h24v5H16zM20 38l3-7h10l3 7M20 43h3M33 43h3" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="34" cy="14" r="1.5" fill="#E85D4A" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg viewBox="0 0 56 56" fill="none" className="h-14 w-14">
                      <path d="M6 38h29v6H6zM10 38l4-11h13l4 11M14 27h13M11 44h4M27 44h4" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="43" cy="18" r="8" stroke="var(--text-secondary)" strokeWidth="2.25" />
                      <path d="M43 13v10M46 15.5c-.7-.8-1.6-1.2-3-1.2-1.7 0-2.8.8-2.8 2 0 3 5.7 1.3 5.7 4.2 0 1.3-1.1 2.2-2.9 2.2-1.5 0-2.7-.5-3.5-1.4M37 39l5-5 3 3 6-7" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="51" cy="30" r="2" fill="#E85D4A" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg viewBox="0 0 56 56" fill="none" className="h-14 w-14">
                      <path d="M5 38h28v6H5zM9 38l4-11h13l4 11M13 27h13M10 44h4M26 44h4" stroke="var(--primary)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="35" y="11" width="12" height="18" rx="2" stroke="var(--text-secondary)" strokeWidth="2.25" />
                      <path d="m38 17 2 2 4-4M38 23h6" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="44" cy="39" r="6" stroke="var(--text-secondary)" strokeWidth="2.25" />
                      <path d="m48 43 4 4" stroke="var(--text-secondary)" strokeWidth="2.25" strokeLinecap="round" />
                      <circle cx="48" cy="17" r="2" fill="#E85D4A" />
                    </svg>
                  )}
                </div>
                <h3 className="mt-5 flex min-h-7 items-center text-xl font-bold leading-tight text-[var(--text-primary)]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
