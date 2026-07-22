import type { ReactNode } from "react"
import AdminSidebar from "@/src/components/admin/AdminSidebar"
import AdminSignOutButton from "@/src/components/admin/AdminSignOutButton"

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[var(--text-primary)]">
      <AdminSidebar />

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
