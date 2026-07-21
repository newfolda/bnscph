"use client"

import { useState } from "react"
import type { SellCarLeadStatus } from "@/src/server/sellCar/getRecentLeads"

type LeadStatusSelectProps = {
  leadId: string
  initialStatus: SellCarLeadStatus
}

const statusLabels: Record<SellCarLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  inspection_scheduled: "Inspection Scheduled",
  purchased: "Purchased",
  rejected: "Rejected",
  archived: "Archived",
}

const statusClassNames: Record<SellCarLeadStatus, string> = {
  new: "bg-[var(--primary-light)] text-[#805d18]",
  contacted: "bg-sky-50 text-sky-800",
  inspection_scheduled: "bg-violet-50 text-violet-800",
  purchased: "bg-emerald-50 text-emerald-800",
  rejected: "bg-rose-50 text-rose-800",
  archived: "bg-stone-100 text-stone-700",
}

const statuses = Object.keys(statusLabels) as SellCarLeadStatus[]

export default function LeadStatusSelect({ leadId, initialStatus }: LeadStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = async (nextStatus: SellCarLeadStatus) => {
    const previousStatus = status
    setStatus(nextStatus)
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      const result: unknown = await response.json()

      if (!response.ok || !result || typeof result !== "object" || !("success" in result) || result.success !== true) {
        throw new Error("Unable to update lead status.")
      }
    } catch {
      setStatus(previousStatus)
      setError("Unable to save status.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-w-[9.5rem]">
      <select
        aria-describedby={error ? `lead-status-error-${leadId}` : undefined}
        aria-invalid={Boolean(error)}
        aria-label="Lead status"
        className={`w-full cursor-pointer appearance-none rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60 ${statusClassNames[status]}`}
        disabled={isSaving}
        value={status}
        onChange={(event) => handleChange(event.target.value as SellCarLeadStatus)}
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {statusLabels[option]}
          </option>
        ))}
      </select>
      {isSaving && <p className="mt-1 text-xs text-[var(--text-secondary)]">Saving…</p>}
      {error && (
        <p id={`lead-status-error-${leadId}`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
