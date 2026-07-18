import Container from "../ui/Container"

const faqs = [
  {
    question: "How can I sell my car fast?",
    answer:
      "Submit your car details, get your estimated value, complete the free inspection, and receive offers from the dealer network when your documents are ready.",
  },
  {
    question: "How much does it cost to sell my car?",
    answer: "There is no seller fee for car owners, and the Mobee Cars inspection is free.",
  },
  {
    question: "Does Mobee Cars charge sellers a fee?",
    answer: "No. Mobee Cars does not charge car owners a seller fee.",
  },
  {
    question: "What is the best way to sell my car?",
    answer:
      "Compare real dealer offers, complete a proper inspection, and avoid risky direct-buyer negotiations. Mobee Cars helps make this process simple and safe.",
  },
  {
    question: "What documents do I need to sell my car?",
    answer:
      "You may need your OR/CR, valid ID, deed of sale, loan clearance or chattel release if financed, and service records if available.",
  },
  {
    question: "Why do I need to take photos of my car?",
    answer:
      "Photos help confirm your car's generation and assess its overall exterior condition, supporting a more accurate valuation before inspection.",
  },
]

export default function FaqSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-20">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="mb-4 w-fit rounded-full border border-[var(--border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
              FAQ
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">Frequently Asked Questions</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-secondary)]">
              Everything you need to know before selling your car online with Mobee Cars in the Philippines.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-white px-6 py-5 shadow-sm hover:border-[var(--primary)]/30 hover:shadow-md"
              >
                <summary className="cursor-pointer font-semibold text-[var(--secondary)]">{faq.question}</summary>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
