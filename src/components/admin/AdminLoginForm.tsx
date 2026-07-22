"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/src/lib/supabase/browser"

export default function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError("Unable to sign in with those credentials.")
        return
      }

      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Unable to sign in right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        Email
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
        />
      </label>

      <label className="block text-sm font-medium text-[var(--text-primary)]">
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[var(--text-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}
