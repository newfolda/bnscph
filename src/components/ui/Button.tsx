"use client"

import type { ButtonHTMLAttributes } from "react"
import { BORDER_RADIUS } from "../../lib/design-tokens"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  className,
  disabled,
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center bg-[var(--primary)] px-5 py-3 font-medium text-white transition-colors hover:bg-[#c8160b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--primary)]",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      className={classes}
      disabled={disabled}
      style={{ borderRadius: BORDER_RADIUS, ...style }}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
