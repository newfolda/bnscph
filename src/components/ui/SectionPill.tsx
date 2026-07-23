import type { ReactNode } from "react"
import styles from "./SectionPill.module.css"

type SectionPillProps = {
  children: ReactNode
  className?: string
}

export default function SectionPill({ children, className }: SectionPillProps) {
  return (
    <p className={`${styles.pill} ${className ?? ""}`}>
      <span className={styles.label}>{children}</span>
    </p>
  )
}
