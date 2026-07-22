import { redirect } from "next/navigation"
import AdminLoginForm from "@/src/components/admin/AdminLoginForm"
import { createSupabaseServerClient } from "@/src/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/admin")
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
        Buy &amp; Sell Cars Philippines
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)]">Admin Sign In</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Use your authorized staff account to continue.</p>
      <AdminLoginForm />
    </section>
  )
}
