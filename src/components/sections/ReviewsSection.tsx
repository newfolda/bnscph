import Container from "../ui/Container"

const testimonials = [
  {
    name: "Car Seller A",
    quote: "The process was straightforward, and I appreciated receiving real offers after the inspection.",
  },
  {
    name: "Car Seller B",
    quote: "The team explained each step clearly and made the handover feel simple and secure.",
  },
  {
    name: "Car Seller C",
    quote: "Getting a market quotation first gave me the confidence to move forward with selling my car.",
  },
]

export default function ReviewsSection() {
  return (
    <section className="bg-[var(--background)]">
      <Container>
        <div className="py-20">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="mb-4 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              Reviews
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">Trusted by Thousands of Car Sellers Nationwide</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-secondary)]">
              Real experiences from car sellers who chose Mobee Cars.
            </p>
          </div>
          <div className="flex gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="flex min-h-[220px] flex-1 flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 shadow-[0_8px_24px_rgba(25,25,112,0.08)] hover:border-[var(--primary)]/30 hover:shadow-md"
              >
                <span aria-hidden="true" className="h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--background)]" />
                <h3 className="text-lg font-bold leading-tight text-[var(--secondary)]">{testimonial.name}</h3>
                <p className="flex-1 text-sm leading-relaxed text-[var(--muted)]">{testimonial.quote}</p>
                <p aria-label="5 out of 5 stars" className="text-sm tracking-wide text-[var(--primary)]">
                  ★★★★★
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
