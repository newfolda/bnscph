"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useLanguage } from "../language/LanguageProvider"
import Container from "../ui/Container"
import SectionPill from "../ui/SectionPill"

export default function FaqSection() {
  const { t } = useLanguage()
  const faqs = t.faq.items
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isEntranceReady, setIsEntranceReady] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [inquiryName, setInquiryName] = useState("")
  const [inquiryMobile, setInquiryMobile] = useState("")
  const [nameError, setNameError] = useState("")
  const [mobileError, setMobileError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const autoOpenTimerRef = useRef<number | null>(null)
  const entranceFrameRef = useRef<number | null>(null)
  const submissionTimerRef = useRef<number | null>(null)
  const successCloseButtonRef = useRef<HTMLButtonElement>(null)
  const sequenceStartedRef = useRef(false)
  const hasManuallyInteractedRef = useRef(false)

  const handleCloseSuccessModal = () => {
    setInquiryName("")
    setInquiryMobile("")
    setNameError("")
    setMobileError("")
    setShowSuccessModal(false)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section || sequenceStartedRef.current) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      entranceFrameRef.current = window.requestAnimationFrame(() => {
        setOpenIndex(0)
      })
      return () => {
        if (entranceFrameRef.current !== null) {
          window.cancelAnimationFrame(entranceFrameRef.current)
        }
      }
    }

    entranceFrameRef.current = window.requestAnimationFrame(() => {
      setIsEntranceReady(true)
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || sequenceStartedRef.current) return

        sequenceStartedRef.current = true
        observer.disconnect()
        entranceFrameRef.current = window.requestAnimationFrame(() => {
          setHasEntered(true)

          const itemDuration = 550
          const itemStagger = 80
          const finalItemDelay = Math.max(0, faqs.length - 1) * itemStagger
          const autoOpenDelay = finalItemDelay + itemDuration + 250

          autoOpenTimerRef.current = window.setTimeout(() => {
            if (!hasManuallyInteractedRef.current) {
              setOpenIndex(0)
            }
          }, autoOpenDelay)
        })
      },
      { threshold: 0.18 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      if (entranceFrameRef.current !== null) {
        window.cancelAnimationFrame(entranceFrameRef.current)
      }
      if (autoOpenTimerRef.current !== null) {
        window.clearTimeout(autoOpenTimerRef.current)
      }
    }
  }, [faqs.length])

  useEffect(() => {
    return () => {
      if (submissionTimerRef.current !== null) {
        window.clearTimeout(submissionTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!showSuccessModal) return

    const previousOverflow = document.body.style.overflow
    const focusFrame = window.requestAnimationFrame(() => {
      successCloseButtonRef.current?.focus()
    })
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseSuccessModal()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleEscape)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleEscape)
    }
  }, [showSuccessModal])

  const handleQuestionClick = (index: number) => {
    hasManuallyInteractedRef.current = true
    if (autoOpenTimerRef.current !== null) {
      window.clearTimeout(autoOpenTimerRef.current)
      autoOpenTimerRef.current = null
    }
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index))
  }

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const name = inquiryName.trim()
    const mobile = inquiryMobile.trim()
    const nextNameError = name ? "" : "Please enter your name"
    const nextMobileError = mobile ? "" : "Please enter your mobile number"

    setNameError(nextNameError)
    setMobileError(nextMobileError)

    if (nextNameError || nextMobileError) return

    // TODO: Connect this form to the real lead submission endpoint.
    setIsSubmitting(true)
    submissionTimerRef.current = window.setTimeout(() => {
      console.info({ name, mobile })
      setIsSubmitting(false)
      setShowSuccessModal(true)
      submissionTimerRef.current = null
    }, 1200)
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      className={`faq-section bg-[var(--background-alt)] py-16 md:py-20 ${
        isEntranceReady ? "faq-section--ready" : ""
      } ${hasEntered ? "faq-section--entered" : ""}`}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <header className="faq-entrance-header lg:sticky lg:top-28 lg:self-start">
            <SectionPill>
              {t.faq.pill}
            </SectionPill>
            <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">{t.faq.title}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-secondary)]">
              {t.faq.description}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              {t.faq.supporting}
            </p>
            <form
              onSubmit={handleInquirySubmit}
              className="mt-6 max-w-md space-y-4"
            >
              <div>
                <label className="sr-only" htmlFor="faq-inquiry-name">Name</label>
                <input
                  id="faq-inquiry-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Name"
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "faq-inquiry-name-error" : undefined}
                  value={inquiryName}
                  onChange={(event) => {
                    setInquiryName(event.target.value)
                    if (nameError) setNameError("")
                  }}
                  className="h-[52px] w-full rounded-[0.875rem] border border-[var(--border)] bg-white px-[18px] text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
                {nameError && (
                  <p id="faq-inquiry-name-error" role="alert" className="mt-1.5 text-sm text-red-600">
                    {nameError}
                  </p>
                )}
              </div>
              <div>
                <label className="sr-only" htmlFor="faq-inquiry-mobile">Mobile Number</label>
                <input
                  id="faq-inquiry-mobile"
                  type="tel"
                  name="mobile"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Mobile No."
                  aria-invalid={Boolean(mobileError)}
                  aria-describedby={mobileError ? "faq-inquiry-mobile-error" : undefined}
                  value={inquiryMobile}
                  onChange={(event) => {
                    setInquiryMobile(event.target.value)
                    if (mobileError) setMobileError("")
                  }}
                  className="h-[52px] w-full rounded-[0.875rem] border border-[var(--border)] bg-white px-[18px] text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
                {mobileError && (
                  <p id="faq-inquiry-mobile-error" role="alert" className="mt-1.5 text-sm text-red-600">
                    {mobileError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[52px] w-full rounded-full bg-[var(--primary)] px-6 text-[16px] font-bold text-white shadow-[0_7px_16px_rgba(143,104,25,0.16)] transition-[transform,box-shadow,opacity] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_10px_20px_rgba(143,104,25,0.22)] active:translate-y-0 active:shadow-[0_4px_10px_rgba(143,104,25,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none disabled:hover:translate-y-0 sm:w-[220px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center">
                    <span>Submitting</span>
                    <span className="faq-submit-dots" aria-hidden="true">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </span>
                ) : "Inquire Now"}
              </button>
            </form>
          </header>

          <div className="relative pl-5 sm:pl-6">
            <div aria-hidden="true" className="pointer-events-none absolute bottom-5 left-0 top-5 w-px bg-[var(--primary)]/30" />
            <ol className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index
                const answerId = `faq-answer-${index + 1}`
                const buttonId = `faq-question-${index + 1}`

                return (
                  <li
                    key={faq.question}
                    className={`faq-entrance-item faq-entrance-item--${index % 2 === 0 ? "left" : "right"} relative`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
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
                          onClick={() => handleQuestionClick(index)}
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

      {showSuccessModal && (
        <div
          className="faq-success-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleCloseSuccessModal()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-success-modal-title"
            aria-describedby="faq-success-modal-description"
            className="faq-success-modal-dialog relative w-full max-w-[460px] rounded-[24px] bg-white px-7 pb-8 pt-10 text-center shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:px-10 sm:pb-10 sm:pt-12"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseSuccessModal}
              aria-label="Close success message"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] motion-reduce:transition-none"
            >
              ×
            </button>
            <Image
              src="/images/brand/thankyou.webp"
              alt=""
              width={100}
              height={100}
              className="mx-auto h-auto w-[100px] object-contain"
            />
            <h2 id="faq-success-modal-title" className="mt-6 text-2xl font-bold tracking-tight text-[var(--text-primary)]">Thank you!</h2>
            <p id="faq-success-modal-description" className="mx-auto mt-3 max-w-sm leading-relaxed text-[var(--text-secondary)]">
              Our team will be in touch with you soon.
            </p>
            <button
              ref={successCloseButtonRef}
              type="button"
              onClick={handleCloseSuccessModal}
              className="mt-7 h-12 min-w-32 rounded-full bg-[var(--primary)] px-7 text-sm font-bold text-[var(--text-primary)] shadow-[0_7px_16px_rgba(143,104,25,0.16)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_10px_20px_rgba(143,104,25,0.22)] active:translate-y-0 active:shadow-[0_4px_10px_rgba(143,104,25,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .faq-entrance-header,
        .faq-entrance-item {
          transition:
            opacity 550ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .faq-section--ready .faq-entrance-header {
          opacity: 0;
          transform: translateY(18px);
        }

        .faq-section--ready .faq-entrance-item {
          opacity: 0;
        }

        .faq-section--ready .faq-entrance-item--left {
          transform: translate3d(-28px, 6px, 0);
        }

        .faq-section--ready .faq-entrance-item--right {
          transform: translate3d(28px, 6px, 0);
        }

        .faq-section--entered .faq-entrance-header,
        .faq-section--entered .faq-entrance-item {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

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

        .faq-submit-dots {
          display: inline-flex;
          width: 1rem;
          justify-content: flex-start;
        }

        .faq-submit-dots span {
          display: inline-block;
          animation: faq-submit-dot 900ms ease-in-out infinite;
        }

        .faq-submit-dots span:nth-child(2) {
          animation-delay: 150ms;
        }

        .faq-submit-dots span:nth-child(3) {
          animation-delay: 300ms;
        }

        @keyframes faq-submit-dot {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-1px); }
        }

        .faq-success-modal-backdrop {
          animation: faq-success-backdrop-in 240ms ease-out both;
        }

        .faq-success-modal-dialog {
          animation: faq-success-dialog-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes faq-success-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes faq-success-dialog-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 639px) {
          .faq-card--open {
            transform: translateY(-2px);
            filter: brightness(1.008) saturate(1.035);
            box-shadow: 0 9px 20px rgba(31, 31, 31, 0.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-entrance-header,
          .faq-entrance-item,
          .faq-section--ready .faq-entrance-header,
          .faq-section--ready .faq-entrance-item,
          .faq-section--ready .faq-entrance-item--left,
          .faq-section--ready .faq-entrance-item--right {
            opacity: 1;
            transform: none;
            transition: none !important;
          }

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

          .faq-submit-dots span {
            animation: none;
          }

          .faq-success-modal-backdrop,
          .faq-success-modal-dialog {
            animation: none;
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
