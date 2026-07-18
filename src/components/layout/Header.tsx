import Link from "next/link"
import Container from "../ui/Container"

const learnLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Team", href: "/team" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-[var(--border)] bg-white/95 shadow-sm backdrop-blur md:block">
      <Container>
        <nav
          aria-label="Primary navigation"
          className="flex h-20 items-center justify-between gap-8"
        >
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
          >
            Mobee
          </Link>

          <ul className="flex items-center gap-10 text-sm text-[var(--foreground)]">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
              >
                Sell My Car
              </Link>
            </li>
            <li>
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4">
                  Learn
                  <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <ul className="absolute left-0 top-full mt-3 w-44 rounded-xl border border-[var(--border)] bg-white p-2 shadow-lg">
                  {learnLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--background)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>

          <div className="flex items-center gap-3 text-sm" aria-label="Language selector">
            <Link
              href="/"
              aria-current="page"
              className="font-semibold text-[var(--primary)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            >
              EN
            </Link>
            <Link
              href="/?locale=tgl"
              className="transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4"
            >
              TGL
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  )
}
