import type { ReactNode } from "react"
import { MAX_WIDTH } from "../../lib/design-tokens"

type ContainerProps = {
  children: ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  const classes = ["mx-auto w-full px-5 md:px-8 lg:px-10", className]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes} style={{ maxWidth: MAX_WIDTH }}>
      {children}
    </div>
  )
}
