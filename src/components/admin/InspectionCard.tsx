"use client"

import { useState } from "react"
import type { SellCarInspection } from "@/src/server/sellCar/getInspection"

type InspectionCardProps = {
  leadId: string
  initialInspection: SellCarInspection | null
}

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

const toDateTimeLocalValue = (value: string | null) => {
  if (!value) return ""

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function InspectionCard({ leadId, initialInspection }: InspectionCardProps) {
  const [inspection, setInspection] = useState(initialInspection)
  const [scheduledAt, setScheduledAt] = useState(toDateTimeLocalValue(initialInspection?.scheduled_at ?? null))
  const [location, setLocation] = useState(initialInspection?.location ?? "")
  const [notes, setNotes] = useState(initialInspection?.notes ?? "")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedLocation = location.trim()
    const trimmedNotes = notes.trim()
    const timestamp = Date.parse(scheduledAt)

    if (!scheduledAt || !Number.isFinite(timestamp) || timestamp <= Date.now()) {
      setError("Choose a future date and time.")
      return
    }

    if (!trimmedLocation) {
      setError("Enter the inspection location.")
      return
    }

    if (trimmedLocation.length > 200) {
      setError("Keep the location to 200 characters or fewer.")
      return
    }

    if (trimmedNotes.length > 1000) {
      setError("Keep the notes to 1,000 characters or fewer.")
      return
    }

    const previousInspection = inspection
    const optimisticInspection: SellCarInspection = {
      id: previousInspection?.id ?? `temporary-${Date.now()}`,
      lead_id: leadId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      location: trimmedLocation,
      notes: trimmedNotes || null,
      created_at: previousInspection?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setInspection(optimisticInspection)
    setError("")
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/inspection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: optimisticInspection.scheduled_at,
          location: trimmedLocation,
          notes: trimmedNotes,
        }),
      })
      const result: unknown = await response.json()

      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("success" in result) ||
        result.success !== true ||
        !("inspection" in result)
      ) {
        throw new Error("Unable to schedule inspection.")
      }

      setInspection(result.inspection as SellCarInspection)
    } catch {
      setInspection(previousInspection)
      setError("Unable to save the inspection. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)] lg:col-span-2">
      <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Inspection</h2>

      {inspection ? (
        <dl className="mt-5 grid gap-x-6 gap-y-5 border-b border-[var(--border)] pb-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Scheduled Date</dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">{formatDate(inspection.scheduled_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Location</dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">{inspection.location}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Notes</dt>
            <dd className="mt-1.5 whitespace-pre-wrap text-sm font-medium text-[var(--text-primary)]">{inspection.notes || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Created</dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">{formatDate(inspection.created_at)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-5 text-sm text-[var(--text-secondary)]">No inspection scheduled.</p>
      )}

      <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
          Date &amp; Time
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => {
              setScheduledAt(event.target.value)
              if (error) setError("")
            }}
            disabled={isSaving}
            required
            className="h-10 rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value)
              if (error) setError("")
            }}
            disabled={isSaving}
            maxLength={200}
            required
            className="h-10 rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)] sm:col-span-2">
          Optional notes
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value)
              if (error) setError("")
            }}
            disabled={isSaving}
            maxLength={1000}
            className="min-h-24 resize-y rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
          {error ? (
            <p role="alert" className="text-sm text-red-700">{error}</p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Schedule Inspection"}
          </button>
        </div>
      </form>
    </article>
  )
}
