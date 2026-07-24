"use client"

import { useState } from "react"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

const faqs = [
  {
    question: "How do I sell my car to Buy and Sell Cars Philippines?",
    answer:
      "Send us your vehicle details, including its make, model, year, mileage, condition, and recent photos. We’ll review the information and provide an initial valuation. If you’re interested in proceeding, we’ll arrange a free inspection at your preferred location. Once the final offer is accepted and the documents are verified, we’ll complete the sale and arrange payment.",
  },
  {
    question: "What vehicles do you buy?",
    answer:
      "We buy most makes and models from year 2010 onward, including sedans, hatchbacks, crossovers, SUVs, vans, pickups, sports cars, and luxury vehicles. Acceptance remains subject to the vehicle’s condition, ownership documents, and our final evaluation.",
  },
  {
    question: "How is my car’s value determined?",
    answer:
      "We consider its make, model, year, variant, mileage, overall condition, service history, ownership documents, and current market demand. The valuation is based on the information provided and is confirmed after the physical inspection.",
  },
  {
    question: "Is the initial valuation the final offer?",
    answer:
      "Not always. The initial valuation is based on the details and photos you provide. The final offer is confirmed after we inspect the vehicle and verify its condition and documents. If we identify anything that was not included in the original information, we’ll explain how it affects the offer.",
  },
  {
    question: "Do I need to bring my car to your office?",
    answer:
      "No. Our team can inspect the vehicle at your home, workplace, or another agreed location. The location must be safe, accessible, and suitable for a proper vehicle inspection.",
  },
  {
    question: "What documents do I need?",
    answer:
      "You’ll typically need the Original Certificate of Registration (CR), latest Official Receipt (OR), a valid government-issued ID of the registered owner, a Deed of Sale or other proof of ownership if applicable, and any available service and maintenance records. Additional documents may be requested depending on the vehicle’s ownership or registration status.",
  },
  {
    question: "Can I sell a car that is not registered in my name?",
    answer:
      "Possibly, but you must provide documents showing the legal transfer of ownership and your authority to sell the vehicle. We’ll review the documents before proceeding. Additional verification may be required.",
  },
  {
    question: "How will I receive payment?",
    answer:
      "Payment can be made in cash or through bank transfer, depending on the transaction and the agreed payment method. Payment is released only after the sale is completed and all required documents have been verified and signed.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We accommodate vehicle sellers across the Philippines, subject to team availability and location. Send us your location so we can confirm whether an inspection can be arranged in your area.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-[var(--background-alt)] py-16 md:py-20">
      <Container>
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
                      className={`faq-timeline-dot absolute -left-[1.45rem] top-7 z-10 h-3 w-3 rounded-full border-2 border-[var(--background-alt)] sm:-left-[1.7rem] ${
                        isOpen ? "faq-timeline-dot--open" : "bg-white"
                      }`}
                    />
                    <article
                      className={`faq-card relative overflow-hidden rounded-[1.625rem] border ${
                        isOpen ? "faq-card--open" : ""
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
                          <div className="faq-question-text-wrap">
                            <span className={`faq-question-text ${isOpen ? "faq-question-text--open" : ""}`}>
                              {faq.question}
                            </span>
                            <span aria-hidden="true" className="faq-question-text-streak">
                              {faq.question}
                            </span>
                          </div>
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
                        className={`faq-answer-region ${
                          isOpen ? "faq-answer-region--open" : ""
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

      <style>{`
        .faq-card {
          background: #ffffff;
          border-color: var(--border);
          box-shadow: 0 5px 16px rgba(31, 31, 31, 0.05);
          filter: none;
          transform: translateY(0);
          transition:
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 380ms ease,
            border-color 320ms ease,
            background-color 320ms ease,
            filter 320ms ease;
        }

        .faq-card::before {
          position: absolute;
          inset-block: 1rem;
          left: 0;
          width: 0.125rem;
          border-radius: 9999px;
          background: #c8a044;
          content: "";
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 300ms ease;
        }

        .faq-card--open {
          z-index: 1;
          transform: translateY(-3px);
          filter: brightness(1.012) saturate(1.06);
          border-color: #c8a044;
          background: #f8f3e7;
          box-shadow:
            0 14px 30px rgba(31, 31, 31, 0.085),
            0 3px 10px rgba(200, 160, 68, 0.045);
        }

        .faq-card--open::before {
          transform: scaleY(1);
        }

        .faq-question-text-wrap {
          position: relative;
          isolation: isolate;
          flex: 1;
          min-width: 0;
        }

        .faq-question-text {
          position: relative;
          z-index: 1;
          display: block;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
          transition:
            color 260ms ease,
            font-weight 260ms ease;
        }

        .faq-question-text--open {
          color: var(--text-primary);
          font-weight: 700;
        }

        .faq-question-text-streak {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: block;
          pointer-events: none;
          color: transparent;
          opacity: 0;
          font: inherit;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: inherit;
          text-align: inherit;
          background: linear-gradient(
            105deg,
            transparent 0%,
            transparent 36%,
            rgba(255, 255, 255, 0.18) 43%,
            rgba(255, 255, 255, 0.96) 50%,
            rgba(255, 241, 198, 0.58) 55%,
            transparent 63%,
            transparent 100%
          );
          background-repeat: no-repeat;
          background-size: 250% 100%;
          background-position: 110% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .faq-card--open .faq-question-text-streak {
          animation: faq-question-light-streak 1550ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
        }

        .faq-answer-region {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transform: translateY(-0.25rem);
          filter: blur(2px);
          transition:
            grid-template-rows 420ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 300ms ease,
            transform 360ms ease,
            filter 360ms ease;
        }

        .faq-answer-region--open {
          grid-template-rows: 1fr;
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        .faq-timeline-dot {
          transition:
            transform 280ms ease,
            background-color 280ms ease,
            box-shadow 280ms ease;
        }

        .faq-timeline-dot--open {
          transform: scale(1.12);
          background: var(--primary);
          box-shadow:
            0 0 0 4px rgba(200, 160, 68, 0.08),
            0 3px 8px rgba(143, 104, 25, 0.16);
        }

        @keyframes faq-question-light-streak {
          0% { background-position: 110% 0; opacity: 0; }
          14% { opacity: 1; }
          86% { opacity: 1; }
          100% { background-position: -10% 0; opacity: 0; }
        }

        @media (max-width: 639px) {
          .faq-card--open {
            transform: translateY(-2px);
            filter: brightness(1.008) saturate(1.035);
            box-shadow: 0 9px 20px rgba(31, 31, 31, 0.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-card,
          .faq-card--open,
          .faq-question-text,
          .faq-timeline-dot,
          .faq-answer-region {
            transition: none !important;
          }

          .faq-card--open {
            transform: none;
            filter: none;
          }

          .faq-question-text-streak,
          .faq-card--open .faq-question-text-streak {
            animation: none !important;
            opacity: 0;
          }

          .faq-timeline-dot--open {
            transform: none;
          }

          .faq-answer-region {
            transform: none;
            filter: none;
          }
        }
      `}</style>
    </section>
  )
}
