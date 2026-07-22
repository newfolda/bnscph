"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Inspections" },
  { label: "Purchased Cars" },
  { label: "Settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[var(--border)] bg-white p-6 md:flex md:flex-col">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
          Buy &amp; Sell Cars Philippines
        </p>
        <h1 className="mt-3 text-xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <nav aria-label="Admin navigation" className="mt-10">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = item.href === "/admin/leads"
              ? pathname === item.href || pathname.startsWith("/admin/leads/")
              : item.href === pathname
            const className = `flex rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--primary-light)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)]"
            }`

            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`${className} hover:bg-[#fcfcfb] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={className}>{item.label}</span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
