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
        <div className="py-20">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="mb-4 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              Differences
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
              Why Choose Mobee Cars to Sell Your Car in the Philippines
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-secondary)]">See the difference before you decide.</p>
          </div>
          <div className="flex gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex min-h-[200px] flex-1 flex-col items-center gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 text-center shadow-[0_8px_24px_rgba(25,25,112,0.08)] hover:border-[var(--primary)]/30 hover:shadow-md"
              >
                <span aria-hidden="true" className="h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--background)]" />
                <h3 className="text-lg font-bold leading-tight text-[var(--secondary)]">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
