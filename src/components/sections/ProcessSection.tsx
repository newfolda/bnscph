import Container from "../ui/Container"
import { processSteps } from "../../data/process"

export default function ProcessSection() {
  return (
    <section className="bg-[var(--background)]">
      <Container>
        <div className="py-20">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="mb-4 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              Our Process
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">How It Works?</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-secondary)]">
              500+ verified buyers. The right market price. A seamless process.
            </p>
          </div>
          <div className="grid grid-cols-6 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className={`col-span-2 flex min-h-[200px] flex-col items-center gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 text-center shadow-[0_8px_24px_rgba(25,25,112,0.08)] hover:border-[var(--primary)]/30 hover:shadow-md ${index === 3 ? "col-start-2" : ""}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] font-semibold text-[var(--secondary)]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold leading-tight text-[var(--secondary)]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
