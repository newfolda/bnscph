import type { ReactNode } from "react"

type SectionPillProps = {
  children: ReactNode
  className?: string
}

export default function SectionPill({ children, className }: SectionPillProps) {
  return (
    <p className={`w-fit whitespace-nowrap rounded-full border border-[rgba(20,20,20,0.10)] bg-[linear-gradient(135deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.42)_34%,rgba(255,255,255,0.34)_100%)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.015em] text-[#0A0A0A] shadow-[0_6px_18px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(20,20,20,0.03)] backdrop-blur-[12px] ${className ?? ""}`}>
      {children}
    </p>
  )
}
