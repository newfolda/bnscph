type SectionTitleProps = {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  const classes = [
    "flex flex-col gap-3",
    align === "center" ? "items-center text-center" : "items-start text-left",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes}>
      <h2 className="text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">{title}</h2>
      {subtitle ? <p className="text-base text-[var(--text-secondary)] md:text-lg">{subtitle}</p> : null}
    </div>
  )
}
