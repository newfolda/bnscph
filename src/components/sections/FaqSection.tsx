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
