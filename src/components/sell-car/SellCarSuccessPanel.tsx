import type { RefObject } from "react"
import Button from "../ui/Button"

export type SellCarSuccessPanelProps = {
  headingRef: RefObject<HTMLHeadingElement | null>
  referenceId: string
  onDone: () => void
  onSubmitAnotherVehicle: () => void
}

export default function SellCarSuccessPanel({ headingRef, referenceId, onDone, onSubmitAnotherVehicle }: SellCarSuccessPanelProps) {
  return (
    <div className="mt-7 rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary-light)] p-6">
      <h3 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-[var(--text-primary)]">Your details have been received</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">Our team will review your vehicle details and contact you about your initial offer and free doorstep inspection.</p>
      <p className="mt-5 text-sm text-[var(--text-primary)]">Reference ID <strong>{referenceId}</strong></p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onDone} className="min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-primary)]">Done</button><Button type="button" onClick={onSubmitAnotherVehicle} className="min-h-11 rounded-xl px-6">Submit Another Vehicle</Button></div>
    </div>
  )
}
