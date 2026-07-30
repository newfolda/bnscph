import Link from "next/link"
import type { ReactNode } from "react"
import Header from "@/src/components/layout/Header"
import Footer from "@/src/components/layout/Footer"

export type LegalSection = { id: string; title: string; content: ReactNode }

export default function LegalPage({ title, subtitle, sections }: { title: string; subtitle: string; sections: LegalSection[] }) {
  return (
    <>
      <Header />
      <main className="bg-[#fcfbf8] pb-20 pt-24 sm:pt-28">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <header className="border-b border-[var(--border)] pb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Buy and Sell Cars Philippines</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">{subtitle}</p>
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--text-secondary)]"><div><dt className="inline font-semibold text-[var(--text-primary)]">Effective date: </dt><dd className="inline">July 30, 2026</dd></div><div><dt className="inline font-semibold text-[var(--text-primary)]">Version: </dt><dd className="inline">1.0</dd></div></dl>
          </header>
          <nav aria-label={`${title} contents`} className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">Contents</h2>
            <ol className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{sections.map((section, index) => <li key={section.id}><a className="rounded-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]" href={`#${section.id}`}>{String(index + 1).padStart(2, "0")}. {section.title}</a></li>)}</ol>
          </nav>
          <div className="mt-12 space-y-12">{sections.map((section, index) => <section id={section.id} key={section.id} className="scroll-mt-28"><h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"><span className="mr-3 text-[var(--primary)]">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2><div className="mt-4 space-y-4 text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">{section.content}</div></section>)}</div>
          <p className="mt-14 border-t border-[var(--border)] pt-6 text-sm leading-6 text-[var(--text-secondary)]">Questions about these documents may be sent to <a className="font-medium text-[var(--primary)] underline underline-offset-2" href="mailto:buyandsellcarph@gmail.com">buyandsellcarph@gmail.com</a>. Return to the <Link href="/" className="font-medium text-[var(--primary)] underline underline-offset-2">homepage</Link>.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
