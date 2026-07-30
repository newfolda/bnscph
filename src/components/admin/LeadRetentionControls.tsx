"use client"

import { useState } from "react"

export default function LeadRetentionControls({ leadId, initialLegalHold, deletionDate, isEligible }: { leadId: string; initialLegalHold: boolean; deletionDate: string | null; isEligible: boolean }) {
  const [legalHold, setLegalHold] = useState(initialLegalHold)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const setHold = async (next: boolean) => {
    setIsSaving(true); setMessage("")
    try { const response = await fetch(`/api/admin/leads/${leadId}/retention`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ legalHold: next }) }); if (!response.ok) throw new Error(); setLegalHold(next); setMessage(next ? "Legal hold enabled." : "Legal hold removed.") } catch { setMessage("Unable to update retention settings.") } finally { setIsSaving(false) }
  }
  const deleteNow = async () => {
    if (!window.confirm("Delete this eligible inquiry and all related photos, notes, and inspection records? This cannot be undone.")) return
    setIsSaving(true); setMessage("")
    try { const response = await fetch(`/api/admin/leads/${leadId}/delete`, { method: "DELETE" }); const result: unknown = await response.json(); if (!response.ok || !result || typeof result !== "object" || !("success" in result) || result.success !== true) throw new Error(); window.location.assign("/admin/leads") } catch { setMessage("Unable to delete this inquiry. It may no longer be eligible.") } finally { setIsSaving(false) }
  }
  return <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)] lg:col-span-2"><h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Retention</h2><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{deletionDate ? `Scheduled deletion: ${new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(deletionDate))}.` : "This lead is not scheduled for retention deletion."}</p><label className="mt-5 flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]"><input type="checkbox" checked={legalHold} disabled={isSaving} onChange={(event) => setHold(event.target.checked)} className="size-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" />Legal hold — prevent automated deletion</label>{isEligible && !legalHold && <button type="button" disabled={isSaving} onClick={deleteNow} className="mt-5 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:opacity-60">Delete eligible inquiry</button>}{message && <p role="status" className="mt-3 text-sm text-[var(--text-secondary)]">{message}</p>}</article>
}
