"use client"

import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react"

export type ComboboxSelection = "catalog" | "manual" | "unsure"

const fallbackOptions = ["Other / Not Listed", "Not Sure"]

export function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/[\s-]+/g, "")
}

export function createOptionKey(value: string) {
  return normalizeSearchValue(value).replace(/[^a-z0-9]+/g, "") || "option"
}

export type SearchableComboboxProps = {
  disabled?: boolean
  disabledMessage?: string
  error?: string
  id: string
  inputRef?: (element: HTMLInputElement | null) => void
  isLoading?: boolean
  label: string
  onManualSelect: () => void
  onSelect: (value: string, selection: ComboboxSelection) => void
  options: string[]
  placeholder: string
  selectedValue: string
}

export default function SearchableCombobox({
  disabled = false,
  disabledMessage,
  error,
  id,
  inputRef,
  isLoading = false,
  label,
  onManualSelect,
  onSelect,
  options,
  placeholder,
  selectedValue,
}: SearchableComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const listboxId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [query, setQuery] = useState(selectedValue)

  const catalogOptions = useMemo(() => {
    const optionsByKey = new Map<string, string>()
    options.forEach((option) => {
      const trimmedOption = option.trim()
      const normalizedOption = normalizeSearchValue(trimmedOption)
      if (trimmedOption && !fallbackOptions.some((fallback) => normalizeSearchValue(fallback) === normalizedOption)) {
        optionsByKey.set(normalizedOption, trimmedOption)
      }
    })
    return [...optionsByKey.values()].sort((first, second) => first.localeCompare(second))
  }, [options])

  const filteredCatalogOptions = useMemo(
    () => catalogOptions.filter((option) => normalizeSearchValue(option).includes(normalizeSearchValue(query))),
    [catalogOptions, query],
  )
  const choices = useMemo(() => [...filteredCatalogOptions, ...fallbackOptions], [filteredCatalogOptions])
  const exactMatchIndex = useMemo(
    () => filteredCatalogOptions.findIndex((option) => normalizeSearchValue(option) === normalizeSearchValue(query)),
    [filteredCatalogOptions, query],
  )
  const activeChoice = activeIndex >= 0 && activeIndex < choices.length ? choices[activeIndex] : undefined

  useEffect(() => {
    if (!isOpen || isLoading) {
      const timeout = window.setTimeout(() => {
        setQuery(selectedValue)
        setActiveIndex(-1)
      }, 0)
      return () => window.clearTimeout(timeout)
    }
  }, [isLoading, isOpen, selectedValue])

  useEffect(() => {
    if (!isOpen || isLoading) return
    const timeout = window.setTimeout(() => setActiveIndex(exactMatchIndex), 0)
    return () => window.clearTimeout(timeout)
  }, [exactMatchIndex, isLoading, isOpen, query])

  useEffect(() => {
    Object.keys(optionRefs.current).forEach((optionId) => {
      if (!choices.some((choice, index) => `${createOptionKey(choice)}-${index}` === optionId)) {
        delete optionRefs.current[optionId]
      }
    })
  }, [choices])

  useEffect(() => {
    if (!activeChoice) return
    optionRefs.current[`${createOptionKey(activeChoice)}-${activeIndex}`]?.scrollIntoView({ block: "nearest" })
  }, [activeChoice, activeIndex])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setQuery(selectedValue)
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [selectedValue])

  const closeList = () => {
    setQuery(selectedValue)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const choose = (choice: string) => {
    if (choice === "Other / Not Listed") onManualSelect()
    else onSelect(choice, choice === "Not Sure" ? "unsure" : "catalog")
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || isLoading) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((currentIndex) => currentIndex < 0 ? 0 : Math.min(currentIndex + 1, choices.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((currentIndex) => currentIndex < 0 ? choices.length - 1 : Math.max(currentIndex - 1, 0))
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault()
      if (activeChoice) choose(activeChoice)
    } else if (event.key === "Escape") {
      closeList()
    }
  }

  const activeOptionId = activeChoice ? `${listboxId}-option-${createOptionKey(activeChoice)}-${activeIndex}` : undefined

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen && !isLoading}
          aria-activedescendant={isOpen && !isLoading ? activeOptionId : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          disabled={disabled || isLoading}
          placeholder={isLoading ? "Loading options…" : placeholder}
          value={isOpen ? query : selectedValue}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setQuery(selectedValue)
            setIsOpen(true)
          }}
          onBlur={() => window.setTimeout(() => {
            if (!containerRef.current?.contains(document.activeElement)) closeList()
          }, 0)}
          onKeyDown={handleKeyDown}
          className={`mt-2 h-11 w-full rounded-xl border bg-white py-0 pl-3 pr-12 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)]/65 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:bg-[var(--background-alt)] disabled:text-[var(--text-secondary)] ${error ? "border-red-700" : "border-[var(--border)]"}`}
        />
        <button
          type="button"
          aria-label={`${isOpen ? "Close" : "Open"} ${label} options`}
          aria-expanded={isOpen && !isLoading}
          aria-controls={listboxId}
          disabled={disabled || isLoading}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setQuery(selectedValue)
            setIsOpen((open) => !open)
            setActiveIndex(-1)
          }}
          className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center rounded-r-xl text-[var(--text-secondary)] transition-transform disabled:cursor-not-allowed"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`size-5 transition-transform ${isOpen ? "rotate-180" : ""}`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {(disabledMessage && disabled || isLoading) && <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{isLoading ? "Loading options…" : disabledMessage}</p>}
      {isOpen && !disabled && !isLoading && (
        <ul id={listboxId} role="listbox" aria-label={`${label} options`} className="absolute z-30 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-1 shadow-lg">
          {filteredCatalogOptions.length === 0 && <li className="px-3 py-2 text-sm text-[var(--text-secondary)]">{catalogOptions.length === 0 ? "No catalog matches found." : "No matches found."}</li>}
          {choices.map((choice, index) => {
            const optionKey = `${createOptionKey(choice)}-${index}`
            return (
              <li
                key={optionKey}
                id={`${listboxId}-option-${optionKey}`}
                ref={(element) => { optionRefs.current[optionKey] = element }}
                role="option"
                aria-selected={selectedValue === choice}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] ${activeIndex === index ? "bg-[var(--primary-light)]" : "hover:bg-[var(--background-alt)]"}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(choice)}
              >
                {choice}
              </li>
            )
          })}
        </ul>
      )}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  )
}
