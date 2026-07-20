import Container from "../ui/Container"

export default function CTASection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="sell-my-car-cta">
      <Container>
        <div className="relative flex min-h-40 items-center justify-center overflow-hidden rounded-[2rem] border border-[rgba(200,160,68,0.65)] bg-white/65 px-6 py-12 shadow-[0_24px_60px_rgba(31,31,31,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(2rem-1px)] before:border before:border-white/65 md:min-h-52 md:px-10">
          <div className="relative grid w-full grid-cols-[minmax(3rem,1fr)_minmax(0,3fr)_minmax(3rem,1fr)] items-center gap-3 sm:gap-6 md:grid-cols-[minmax(5rem,1fr)_minmax(0,3fr)_minmax(5rem,1fr)]">
            <div className="flex justify-center text-sm font-semibold tracking-[0.16em] text-[var(--text-primary)] sm:text-base">CAR</div>
            <div className="flex min-w-0 items-center justify-center gap-3 sm:gap-5">
              <span aria-hidden="true" className="h-7 w-px shrink-0 bg-[var(--primary)] sm:h-9" />
              <p id="sell-my-car-cta" className="whitespace-nowrap text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] sm:text-base md:text-lg">
                Sell My Car
              </p>
            </div>
            <div className="flex justify-center">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-[var(--primary)] text-xl leading-none text-[var(--text-primary)] sm:size-12">
                →
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
