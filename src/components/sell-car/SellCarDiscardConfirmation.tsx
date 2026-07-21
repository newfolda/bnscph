import type { RefObject } from "react"
import Button from "../ui/Button"

export type SellCarDiscardConfirmationProps = {
  keepEditingRef: RefObject<HTMLButtonElement | null>
  onKeepEditing: () => void
  onDiscard: () => void
}

export default function SellCarDiscardConfirmation({ keepEditingRef, onKeepEditing, onDiscard }: SellCarDiscardConfirmationProps) {
  return (
    <div>
      <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full bg-[var(--primary)]" />
      <h2 id="sell-car-discard-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        Discard your progress?
      </h2>
      <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">The car details you entered will be cleared.</p>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          data-modal-initial-focus
          ref={keepEditingRef}
          onClick={onKeepEditing}
          className="min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
        >
          Keep Editing
        </button>
        <Button type="button" onClick={onDiscard} className="min-h-11 rounded-xl px-6 focus-visible:ring-offset-white">
          Discard
        </Button>
      </div>
    </div>
  )
}
