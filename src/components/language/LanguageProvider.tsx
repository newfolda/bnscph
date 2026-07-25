"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { translations, type Language, type Translation } from "@/src/lib/language/translations"

const LANGUAGE_STORAGE_KEY = "site-language"

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [hasRestoredLanguage, setHasRestoredLanguage] = useState(false)

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    const frame = window.requestAnimationFrame(() => {
      setLanguage(savedLanguage === "tgl" ? "tgl" : "en")
      setHasRestoredLanguage(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!hasRestoredLanguage) return

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language === "tgl" ? "fil" : "en"
  }, [hasRestoredLanguage, language])

  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
