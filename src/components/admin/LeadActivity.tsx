"use client"

import { useState } from "react"
import type { SellCarLeadNote } from "@/src/server/sellCar/getLeadNotes"

type LeadActivityProps = {
  leadId: string
  initialNotes: SellCarLeadNote[]
}

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export default function LeadActivity({ leadId, initialNotes }: LeadActivityProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedNote = note.trim()

    if (trimmedNote.length < 2) {
      setError("Enter at least 2 characters.")
      return
    }

    if (trimmedNote.length > 2000) {
      setError("Keep the note to 2,000 characters or fewer.")
      return
    }

    const temporaryId = `temporary-${Date.now()}`
    const optimisticNote: SellCarLeadNote = {
      id: temporaryId,
      lead_id: leadId,
      note: trimmedNote,
      created_at: new Date().toISOString(),
      author: null,
    }

    setNotes((currentNotes) => [optimisticNote, ...currentNotes])
    setNote("")
    setError("")
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: trimmedNote }),
      })
      const result: unknown = await response.json()

      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("success" in result) ||
        result.success !== true ||
        !("note" in result)
      ) {
        throw new Error("Unable to save activity.")
      }

      const savedNote = result.note as SellCarLeadNote
      setNotes((currentNotes) => currentNotes.map((entry) => (entry.id === temporaryId ? savedNote : entry)))
    } catch {
      setNotes((currentNotes) => currentNotes.filter((entry) => entry.id !== temporaryId))
      setNote(trimmedNote)
      setError("Unable to save activity. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="mt-5 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
      <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Activity</h2>

      <form className="mt-5" onSubmit={handleSubmit} noValidate>
        <label htmlFor="lead-note" className="sr-only">
          Add activity note
        </label>
        <textarea
          id="lead-note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value)
            if (error) setError("")
          }}
          aria-describedby={error ? "lead-note-error" : undefined}
          aria-invalid={Boolean(error)}
          disabled={isSaving}
          maxLength={2000}
          placeholder="Add an internal note"
          className="min-h-28 w-full resize-y rounded-xl border border-[var(--border)] bg-[#fcfcfb] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            {error && (
              <p id="lead-note-error" className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Add Note"}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No activity yet.</p>
        ) : (
          <ol className="space-y-4">
            {notes.map((entry) => (
              <li key={entry.id} className="border-l-2 border-[var(--primary-light)] pl-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">{entry.note}</p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {formatDate(entry.created_at)} · {entry.author?.trim() || "System"}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  )
}
