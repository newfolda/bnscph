import type { ReactNode } from "react"
import AdminSignOutButton from "@/src/components/admin/AdminSignOutButton"

const sidebarItems = ["Dashboard", "Leads", "Inspections", "Purchased Cars", "Settings"]

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[var(--text-primary)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[var(--border)] bg-white p-6 md:flex md:flex-col">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
            Buy &amp; Sell Cars Philippines
          </p>
          <h1 className="mt-3 text-xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <nav aria-label="Admin navigation" className="mt-10">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={item}>
                <span
                  aria-current={index === 0 ? "page" : undefined}
                  className={`flex rounded-xl px-4 py-3 text-sm font-medium ${
                    index === 0
                      ? "bg-[var(--primary-light)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-white/95 px-5 py-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
              Buy &amp; Sell Cars Philippines
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight">Admin Dashboard</h2>
          </div>
          <AdminSignOutButton />
        </header>
        <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  )
}
