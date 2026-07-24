"use client"

import { useState } from "react"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const faqs = [
  {
    question: "How do I sell my car to Buy and Sell Cars Philippines?",
    answer:
      "Simply send us your car details. We'll evaluate your vehicle and provide an initial offer. If you accept our offer, we'll schedule a free doorstep inspection at a time that's convenient for you. Once the inspection and documents are complete, we'll pay you on the same day.",
  },
  {
    question: "Is the doorstep inspection really free?",
    answer: "Yes. Our doorstep inspection is completely free and comes with no obligation to sell your vehicle.",
  },
  {
    question: "How long does the selling process take?",
    answer:
      "Once you accept our offer, we'll arrange a free doorstep inspection at your convenience. After the inspection and document verification, many transactions are completed and paid on the same day.",
  },
  {
    question: "What documents do I need to sell my car?",
    answer:
      "You'll typically need the Original OR/CR, a valid government-issued ID, and any available service records. Additional documents may be required depending on your vehicle.",
  },
  {
    question: "How do you determine my car's value?",
    answer:
      "We evaluate your vehicle based on its year, make, model, mileage, overall condition, maintenance history, and current market demand to provide a fair and competitive offer.",
  },
  {
    question: "Am I required to accept your offer?",
    answer:
      "No. Getting an offer or scheduling a free doorstep inspection does not obligate you to sell your vehicle.",
  },
  {
    question: "Do I need to bring my car anywhere for inspection?",
    answer:
      "No. Our team comes to you. We perform the inspection at your doorstep, saving you time and making the selling process more convenient.",
  },
  {
    question: "How will I receive payment?",
    answer:
      "Once the sale is completed and all required documents have been verified, we'll pay you on the same day. Payment can be made in cash or via bank transfer, depending on the transaction.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative isolate overflow-hidden bg-[#fffefd] py-16 md:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_84%_42%,rgba(222,215,249,0.07)_0%,rgba(222,215,249,0.025)_30%,transparent_62%)]"
      />
      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <SectionPill>
              FAQ
            </SectionPill>
            <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">Frequently Asked Questions</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-secondary)]">
              Answers to the most common questions about selling your car with Buy and Sell Cars Philippines.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              Still have questions? We&apos;re here to help every step of the way.
            </p>
          </header>

          <div className="relative pl-5 sm:pl-6">
            <div aria-hidden="true" className="pointer-events-none absolute bottom-5 left-0 top-5 w-px bg-[var(--primary)]/30" />
            <ol className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index
                const answerId = `faq-answer-${index + 1}`
                const buttonId = `faq-question-${index + 1}`

                return (
                  <li key={faq.question} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.45rem] top-7 z-10 h-3 w-3 rounded-full border-2 border-[var(--background-alt)] transition-colors duration-200 motion-reduce:transition-none sm:-left-[1.7rem] ${
                        isOpen ? "bg-[var(--primary)]" : "bg-white"
                      }`}
                    />
                    <article
                      className={`relative overflow-hidden rounded-[1.625rem] border bg-white shadow-[0_5px_16px_rgba(31,31,31,0.05)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(31,31,31,0.09)] motion-reduce:transform-none motion-reduce:transition-none ${
                        isOpen
                          ? "border-[#C8A044] bg-[#F7F1E3] shadow-[0_14px_28px_rgba(31,31,31,0.10)] before:absolute before:inset-y-4 before:left-0 before:w-0.5 before:origin-center before:scale-y-100 before:rounded-full before:bg-[#C8A044] before:transition-transform before:duration-300"
                          : "border-[var(--border)] before:absolute before:inset-y-4 before:left-0 before:w-0.5 before:origin-center before:scale-y-0 before:rounded-full before:bg-[#C8A044] before:transition-transform before:duration-300"
                      }`}
                    >
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          className="flex min-h-16 w-full items-center gap-3 px-5 py-4 text-left text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset sm:px-6"
                        >
                          <span className="shrink-0 text-xs font-bold tracking-wide text-[var(--primary)]">{String(index + 1).padStart(2, "0")}</span>
                          <span className={`flex-1 text-base leading-snug transition-[font-weight] duration-200 motion-reduce:transition-none ${isOpen ? "font-bold" : "font-semibold"}`}>
                            {faq.question}
                          </span>
                          <span aria-hidden="true" className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--primary)]/35 bg-white/70">
                            <span className="absolute h-0.5 w-3 rounded-full bg-[var(--primary)]" />
                            <span
                              className={`absolute h-3 w-0.5 rounded-full bg-[var(--primary)] transition-transform duration-200 ease-out motion-reduce:transition-none ${
                                isOpen ? "scale-y-0" : "scale-y-100"
                              }`}
                            />
                          </span>
                        </button>
                      </h3>
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                          isOpen ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-[var(--text-secondary)] sm:px-6 sm:pb-6 sm:pl-14">{faq.answer}</p>
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
