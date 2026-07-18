import Footer from "@/src/components/layout/Footer"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/ui/Button"
import Container from "@/src/components/ui/Container"
import { teamMembers, values } from "@/src/data/about"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="hidden md:block">
      <Header />
      <main>
        <section aria-label="About hero" className="py-24">
          <Container>
            <div className="grid h-[440px] grid-cols-2 gap-12">
              <div className="flex flex-col justify-center gap-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">About Us</p>
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-[var(--secondary)]">
                  Building a Better Way to Buy and Sell Cars
                </h1>
                <p className="text-lg leading-8 text-[var(--muted)]">
                  Mobee Cars is an automotive technology platform built to bring transparency, structure, and trust to used car transactions across Southeast Asia.
                </p>
                <Button className="mt-2 self-start">Learn More</Button>
              </div>
              <div className="relative overflow-hidden rounded-[var(--radius)]">
                <Image
                  fill
                  preload
                  alt="Mobee Cars team and vehicles"
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src="/images/about/about-hero.jpg"
                />
              </div>
            </div>
          </Container>
        </section>

        <section aria-label="Company story" className="py-24">
          <Container>
            <div className="grid grid-cols-2 gap-12">
              <div className="relative h-80 overflow-hidden rounded-[var(--radius)]">
                <Image
                  fill
                  alt="Mobee Cars company story"
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src="/images/about/our-story.jpg"
                />
              </div>
              <div className="flex flex-col justify-center gap-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Our Story</p>
                <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">How Mobee Cars Started</h2>
                <p className="text-base leading-7 text-[var(--muted)]">
                  Started in 2023, Mobee Cars set out to make used-car transactions clearer and more dependable for sellers and buyers.
                </p>
                <p className="text-base leading-7 text-[var(--muted)]">
                  We saw that selling a car often meant uncertainty around price, inspection, paperwork, and finding the right buyer.
                </p>
                <p className="text-base leading-7 text-[var(--muted)]">
                  Our mission is to bring more transparency, structure, and trust to every step of the journey.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section aria-label="Mission and vision" className="py-24">
          <Container>
            <div className="grid grid-cols-2 gap-8">
              <article className="flex h-72 flex-col gap-6 rounded-[var(--radius)] border border-[var(--border)] bg-white p-10 shadow-sm">
                <span aria-hidden="true" className="h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--background)]" />
                <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">Our Mission</h2>
                <p className="text-base leading-7 text-[var(--muted)]">
                  To bring transparency, structure, and trust to used-car transactions, helping sellers navigate every step with more confidence.
                </p>
              </article>
              <article className="flex h-72 flex-col gap-6 rounded-[var(--radius)] border border-[var(--border)] bg-white p-10 shadow-sm">
                <span aria-hidden="true" className="h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--background)]" />
                <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">Our Vision</h2>
                <p className="text-base leading-7 text-[var(--muted)]">
                  To help shape a more transparent and trusted future for used-car transactions across Southeast Asia.
                </p>
              </article>
            </div>
          </Container>
        </section>

        <section aria-label="Values" className="py-24">
          <Container>
            <div className="grid grid-cols-4 gap-8">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="flex h-56 flex-col gap-5 rounded-[var(--radius)] border border-[var(--border)] bg-white p-7 shadow-sm"
                >
                  <span aria-hidden="true" className="h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--background)]" />
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--secondary)]">{value.title}</h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">{value.description}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section aria-label="Team preview" className="py-24">
          <Container>
            <div className="mb-12 flex flex-col items-center text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Meet the Team</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--secondary)]">The People Behind Mobee Cars</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Meet the people working to make every used-car transaction more transparent and dependable.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="flex h-72 flex-col gap-5 rounded-[var(--radius)] border border-[var(--border)] bg-white p-7 shadow-sm"
                >
                  <span aria-hidden="true" className="h-16 w-16 rounded-full bg-gray-200" />
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--secondary)]">{member.name}</h3>
                  <p className="text-sm font-medium text-[var(--secondary)]">{member.title}</p>
                  <p className="text-sm leading-6 text-[var(--muted)]">{member.description}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section aria-label="Call to action" className="py-24">
          <Container>
            <div className="flex flex-col items-center rounded-[var(--radius)] bg-[var(--secondary)] px-8 py-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">Ready to Sell Your Car?</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/85">
                Get a free valuation and take the first step toward selling your car with confidence.
              </p>
              <Button className="mt-8">Get a Free Valuation</Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
