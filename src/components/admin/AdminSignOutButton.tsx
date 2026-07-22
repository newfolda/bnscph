"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/src/lib/supabase/browser"

export default function AdminSignOutButton() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
    } finally {
      router.replace("/admin/login")
      router.refresh()
      setIsSigningOut(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
    >
      {isSigningOut ? "Signing out…" : "Sign Out"}
    </button>
  )
}
