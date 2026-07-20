"use client"

import Image from "next/image"
import { type ChangeEvent, type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import { getBrands, getModels, getVariants } from "../../data/vehicleCatalog"
import Container from "../ui/Container"
import Button from "../ui/Button"
import Modal from "../ui/Modal"
import ReusableSearchableCombobox, { type ComboboxSelection } from "../ui/SearchableCombobox"
import { buildSellCarPayload } from "../../lib/sellCar/buildSellCarPayload"
import { submitSellCarLead } from "../../lib/sellCar/submitSellCarLead"
import type { VehicleFieldMode, VehicleFieldModes } from "../../types/sellCar"
import { formFieldClass, initialCarDetails, initialContactDetails, initialVehicleFieldModes, sellCarDraftKey, type CarDetails, type CarDetailsField, type ContactDetails, type ContactDetailsField, type SubmitStatus, type VehiclePhoto } from "../sell-car/types"
import { formatFileSize, restoreStringFields, validateCarDetailsField, validateContactDetailsField } from "../sell-car/helpers"

const particles = [
  { left: 5, top: 17, size: 3, duration: 19, delay: -5, opacity: 0.34, color: "var(--primary)", blur: false },
  { left: 11, top: 68, size: 2, duration: 23, delay: -11, opacity: 0.28, color: "var(--primary-hover)", blur: false },
  { left: 16, top: 35, size: 4, duration: 21, delay: -7, opacity: 0.2, color: "rgba(255, 255, 255, 0.7)", blur: true },
  { left: 22, top: 82, size: 3, duration: 25, delay: -16, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 29, top: 9, size: 2, duration: 18, delay: -8, opacity: 0.36, color: "var(--primary-hover)", blur: false },
  { left: 34, top: 53, size: 5, duration: 27, delay: -20, opacity: 0.18, color: "var(--primary)", blur: true },
  { left: 41, top: 27, size: 3, duration: 20, delay: -12, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 47, top: 73, size: 2, duration: 24, delay: -4, opacity: 0.26, color: "rgba(255, 255, 255, 0.7)", blur: false },
  { left: 52, top: 14, size: 4, duration: 22, delay: -15, opacity: 0.24, color: "var(--primary-hover)", blur: true },
  { left: 58, top: 62, size: 3, duration: 26, delay: -9, opacity: 0.34, color: "var(--primary)", blur: false },
  { left: 64, top: 38, size: 2, duration: 17, delay: -6, opacity: 0.32, color: "var(--primary-hover)", blur: false },
  { left: 69, top: 88, size: 4, duration: 28, delay: -18, opacity: 0.18, color: "rgba(255, 255, 255, 0.7)", blur: true },
  { left: 73, top: 20, size: 3, duration: 21, delay: -10, opacity: 0.33, color: "var(--primary)", blur: false },
  { left: 77, top: 56, size: 5, duration: 24, delay: -14, opacity: 0.19, color: "var(--primary-hover)", blur: true },
  { left: 81, top: 7, size: 2, duration: 19, delay: -3, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 84, top: 76, size: 3, duration: 27, delay: -21, opacity: 0.27, color: "rgba(255, 255, 255, 0.7)", blur: false },
  { left: 88, top: 43, size: 4, duration: 23, delay: -13, opacity: 0.24, color: "var(--primary)", blur: true },
  { left: 92, top: 25, size: 2, duration: 20, delay: -2, opacity: 0.36, color: "var(--primary-hover)", blur: false },
  { left: 95, top: 65, size: 3, duration: 25, delay: -17, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 3, top: 48, size: 4, duration: 22, delay: -19, opacity: 0.2, color: "rgba(255, 255, 255, 0.7)", blur: true },
  { left: 38, top: 92, size: 2, duration: 18, delay: -1, opacity: 0.3, color: "var(--primary-hover)", blur: false },
  { left: 56, top: 45, size: 3, duration: 26, delay: -22, opacity: 0.26, color: "var(--primary)", blur: false },
  { left: 70, top: 4, size: 2, duration: 21, delay: -11, opacity: 0.28, color: "rgba(255, 255, 255, 0.7)", blur: false },
  { left: 98, top: 84, size: 4, duration: 28, delay: -7, opacity: 0.19, color: "var(--primary)", blur: true },
]

const rotatingWords = ["Easiest", "Fastest", "Simplest", "Smartest"]
const typewriterWords = ["hassle.", "headache.", "time wasted."]


export default function HeroSection() {
  const particleLayerRef = useRef<HTMLDivElement>(null)
  const rotatingWordMeasureRef = useRef<HTMLSpanElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const targetOffsetRef = useRef({ x: 0, y: 0 })
  const currentOffsetRef = useRef({ x: 0, y: 0 })
  const prefersReducedMotionRef = useRef(false)
  const carFieldRefs = useRef<Partial<Record<CarDetailsField, HTMLElement | null>>>({})
  const contactFieldRefs = useRef<Partial<Record<ContactDetailsField, HTMLElement | null>>>({})
  const keepEditingRef = useRef<HTMLButtonElement>(null)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [wordPhase, setWordPhase] = useState<"idle" | "enter" | "exit">("idle")
  const [rotatingWordWidth, setRotatingWordWidth] = useState<number>()
  const [typedWord, setTypedWord] = useState("")
  const [isTypewriterReducedMotion, setIsTypewriterReducedMotion] = useState(false)
  const [isSellCarModalOpen, setIsSellCarModalOpen] = useState(false)
  const [carDetails, setCarDetails] = useState<CarDetails>(initialCarDetails)
  const [carDetailsErrors, setCarDetailsErrors] = useState<Partial<Record<CarDetailsField, string>>>({})
  const [contactDetails, setContactDetails] = useState<ContactDetails>(initialContactDetails)
  const [contactDetailsErrors, setContactDetailsErrors] = useState<Partial<Record<ContactDetailsField, string>>>({})
  const [vehicleFieldModes, setVehicleFieldModes] = useState<VehicleFieldModes>(initialVehicleFieldModes)
  const [catalogLoading, setCatalogLoading] = useState({ brand: false, model: false, variant: false })
  const [vehiclePhotos, setVehiclePhotos] = useState<VehiclePhoto[]>([])
  const [photoUploadErrors, setPhotoUploadErrors] = useState<string[]>([])
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [privacyConsentError, setPrivacyConsentError] = useState("")
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [submissionReferenceId, setSubmissionReferenceId] = useState("")
  const [submissionError, setSubmissionError] = useState("")
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const latestPhotosRef = useRef<VehiclePhoto[]>([])
  const privacyConsentRef = useRef<HTMLInputElement>(null)
  const manualMakeRef = useRef<HTMLInputElement>(null)
  const manualModelRef = useRef<HTMLInputElement>(null)
  const manualVariantRef = useRef<HTMLInputElement>(null)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const submissionErrorRef = useRef<HTMLParagraphElement>(null)
  const catalogLoadingTimersRef = useRef<Record<"brand" | "model" | "variant", number | null>>({ brand: null, model: null, variant: null })

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1990 + 1 }, (_, index) => String(currentYear - index))

  const handleCarDetailsChange = (field: CarDetailsField, value: string) => {
    setCarDetails((currentDetails) => ({ ...currentDetails, [field]: value }))
    setSubmitStatus("idle")
    setSubmissionError("")

    if (carDetailsErrors[field]) {
      setCarDetailsErrors((currentErrors) => ({ ...currentErrors, [field]: validateCarDetailsField(field, value, currentYear) || undefined }))
    }
  }

  const clearModelAndVariant = () => {
    setCarDetails((currentDetails) => ({ ...currentDetails, model: "", variant: "" }))
    setCarDetailsErrors((currentErrors) => ({ ...currentErrors, model: undefined, variant: undefined }))
    setVehicleFieldModes((currentModes) => ({ ...currentModes, model: "catalog", variant: "catalog" }))
  }

  const cancelCatalogLoading = (field: "brand" | "model" | "variant") => {
    const timer = catalogLoadingTimersRef.current[field]
    if (timer) window.clearTimeout(timer)
    catalogLoadingTimersRef.current[field] = null
    setCatalogLoading((currentLoading) => ({ ...currentLoading, [field]: false }))
  }

  const clearCatalogLoading = () => {
    ;(["brand", "model", "variant"] as const).forEach(cancelCatalogLoading)
  }

  const showCatalogLoading = (field: "brand" | "model" | "variant") => {
    cancelCatalogLoading(field)
    setCatalogLoading((currentLoading) => ({ ...currentLoading, [field]: true }))
    catalogLoadingTimersRef.current[field] = window.setTimeout(() => {
      catalogLoadingTimersRef.current[field] = null
      setCatalogLoading((currentLoading) => ({ ...currentLoading, [field]: false }))
    }, 125)
  }

  const handleMakeSelection = (value: string, mode: ComboboxSelection) => {
    handleCarDetailsChange("make", value)
    setVehicleFieldModes((currentModes) => ({ ...currentModes, make: mode, model: "catalog", variant: "catalog" }))
    clearModelAndVariant()
    cancelCatalogLoading("variant")
    if (mode === "catalog") showCatalogLoading("model")
  }

  const handleMakeManual = () => {
    handleCarDetailsChange("make", "")
    setVehicleFieldModes((currentModes) => ({ ...currentModes, make: "manual", model: "catalog", variant: "catalog" }))
    clearModelAndVariant()
    cancelCatalogLoading("model")
    cancelCatalogLoading("variant")
    window.requestAnimationFrame(() => manualMakeRef.current?.focus())
  }

  const handleYearChange = (value: string) => {
    handleCarDetailsChange("year", value)
    setCarDetails((currentDetails) => ({ ...currentDetails, make: "", model: "", variant: "" }))
    setCarDetailsErrors((currentErrors) => ({ ...currentErrors, make: undefined, model: undefined, variant: undefined }))
    setVehicleFieldModes(initialVehicleFieldModes)
    cancelCatalogLoading("model")
    cancelCatalogLoading("variant")
    showCatalogLoading("brand")
  }

  const handleModelSelection = (value: string, mode: ComboboxSelection) => {
    handleCarDetailsChange("model", value)
    setCarDetails((currentDetails) => ({ ...currentDetails, variant: "" }))
    setCarDetailsErrors((currentErrors) => ({ ...currentErrors, variant: undefined }))
    setVehicleFieldModes((currentModes) => ({ ...currentModes, model: mode, variant: "catalog" }))
    if (mode === "catalog") showCatalogLoading("variant")
  }

  const handleModelManual = () => {
    handleCarDetailsChange("model", "")
    setCarDetails((currentDetails) => ({ ...currentDetails, variant: "" }))
    setCarDetailsErrors((currentErrors) => ({ ...currentErrors, variant: undefined }))
    setVehicleFieldModes((currentModes) => ({ ...currentModes, model: "manual", variant: "catalog" }))
    cancelCatalogLoading("variant")
    window.requestAnimationFrame(() => manualModelRef.current?.focus())
  }

  const handleVariantManual = () => {
    handleCarDetailsChange("variant", "")
    setVehicleFieldModes((currentModes) => ({ ...currentModes, variant: "manual" }))
    window.requestAnimationFrame(() => manualVariantRef.current?.focus())
  }

  const handleContactDetailsChange = (field: ContactDetailsField, value: string) => {
    setContactDetails((currentDetails) => ({ ...currentDetails, [field]: value }))
    setSubmitStatus("idle")
    setSubmissionError("")

    if (contactDetailsErrors[field]) {
      setContactDetailsErrors((currentErrors) => ({ ...currentErrors, [field]: validateContactDetailsField(field, value) || undefined }))
    }
  }

  const revokePhotoPreviews = (photos: VehiclePhoto[]) => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
  }

  const clearSellCarDraft = () => {
    try {
      window.sessionStorage.removeItem(sellCarDraftKey)
    } catch {
      // sessionStorage may be unavailable in restricted browser contexts.
    }
  }

  const discardSellCarModal = () => {
    clearCatalogLoading()
    clearSellCarDraft()
    revokePhotoPreviews(latestPhotosRef.current)
    latestPhotosRef.current = []
    setIsSellCarModalOpen(false)
    setCarDetails(initialCarDetails)
    setCarDetailsErrors({})
    setVehicleFieldModes(initialVehicleFieldModes)
    setContactDetails(initialContactDetails)
    setContactDetailsErrors({})
    setVehiclePhotos([])
    setPhotoUploadErrors([])
    setPrivacyConsent(false)
    setPrivacyConsentError("")
    setSubmitStatus("idle")
    setSubmissionReferenceId("")
    setSubmissionError("")
    setShowDiscardConfirmation(false)
  }

  const hasSellCarFormData =
    Object.values(carDetails).some(Boolean) || Object.values(contactDetails).some(Boolean) || Object.values(vehicleFieldModes).some((mode) => mode !== "catalog") || vehiclePhotos.length > 0 || privacyConsent

  const requestSellCarModalClose = () => {
    if (submitStatus === "submitting") return
    if (hasSellCarFormData) {
      setShowDiscardConfirmation(true)
      return
    }

    discardSellCarModal()
  }

  const openSellCarModal = () => {
    clearCatalogLoading()
    setCarDetails(initialCarDetails)
    setContactDetails(initialContactDetails)
    setCarDetailsErrors({})
    setVehicleFieldModes(initialVehicleFieldModes)
    setContactDetailsErrors({})
    setPhotoUploadErrors([])
    setPrivacyConsent(false)
    setPrivacyConsentError("")
    setSubmitStatus("idle")
    setSubmissionReferenceId("")
    setSubmissionError("")
    setShowDiscardConfirmation(false)

    try {
      const savedDraft = window.sessionStorage.getItem(sellCarDraftKey)

      if (savedDraft) {
        const parsedDraft: unknown = JSON.parse(savedDraft)

        if (parsedDraft && typeof parsedDraft === "object") {
          const draft = parsedDraft as Record<string, unknown>
          const restoredCarDetails = restoreStringFields(initialCarDetails, draft.carDetails)
          const restoredYear = Number(restoredCarDetails.year)
          const hasRestoredYear = /^\d{4}$/.test(restoredCarDetails.year) && restoredYear >= 1990 && restoredYear <= currentYear
          const normalizedMake = restoredCarDetails.make.trim().toLowerCase()
          const knownMake = getBrands().some((brand) => brand.toLowerCase() === normalizedMake)
          const makeAvailable = getBrands(restoredYear).some((brand) => brand.toLowerCase() === normalizedMake)

          if (!hasRestoredYear || (knownMake && !makeAvailable)) {
            restoredCarDetails.make = ""
            restoredCarDetails.model = ""
            restoredCarDetails.variant = ""
          } else if (restoredCarDetails.make) {
            const normalizedModel = restoredCarDetails.model.trim().toLowerCase()
            const knownModel = getModels(restoredCarDetails.make).some((model) => model.toLowerCase() === normalizedModel)
            const modelAvailable = getModels(restoredCarDetails.make, restoredYear).some((model) => model.toLowerCase() === normalizedModel)

            if (knownModel && !modelAvailable) {
              restoredCarDetails.model = ""
              restoredCarDetails.variant = ""
            } else if (restoredCarDetails.model) {
              const normalizedVariant = restoredCarDetails.variant.trim().toLowerCase()
              const knownVariant = getVariants(restoredCarDetails.make, restoredCarDetails.model).some((variant) => variant.toLowerCase() === normalizedVariant)
              const variantAvailable = getVariants(restoredCarDetails.make, restoredCarDetails.model, restoredYear).some((variant) => variant.toLowerCase() === normalizedVariant)

              if (knownVariant && !variantAvailable) restoredCarDetails.variant = ""
            }
          }

          const savedModes = draft.vehicleFieldModes as Partial<VehicleFieldModes> | undefined
          const inferMode = (value: string, options: string[]): VehicleFieldMode => value === "Not Sure" ? "unsure" : value && !options.some((option) => option.toLowerCase() === value.trim().toLowerCase()) ? "manual" : "catalog"
          const restoredModes: VehicleFieldModes = {
            make: savedModes?.make === "manual" || savedModes?.make === "unsure" || savedModes?.make === "catalog" ? savedModes.make : inferMode(restoredCarDetails.make, getBrands(restoredYear)),
            model: savedModes?.model === "manual" || savedModes?.model === "unsure" || savedModes?.model === "catalog" ? savedModes.model : inferMode(restoredCarDetails.model, getModels(restoredCarDetails.make, restoredYear)),
            variant: savedModes?.variant === "manual" || savedModes?.variant === "unsure" || savedModes?.variant === "catalog" ? savedModes.variant : inferMode(restoredCarDetails.variant, getVariants(restoredCarDetails.make, restoredCarDetails.model, restoredYear)),
          }
          setCarDetails(restoredCarDetails)
          setVehicleFieldModes(restoredModes)
          setContactDetails(restoreStringFields(initialContactDetails, draft.contactDetails))
          setPrivacyConsent(draft.privacyConsent === true)
        }
      }
    } catch {
      clearSellCarDraft()
    }

    setIsSellCarModalOpen(true)
  }

  const handlePhotoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    const nextPhotos: VehiclePhoto[] = []
    const nextErrors: string[] = []

    selectedFiles.forEach((file, index) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        nextErrors.push("Only JPG, PNG, and WebP images are allowed.")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        nextErrors.push("Each photo must be 5 MB or smaller.")
        return
      }

      if (vehiclePhotos.length + nextPhotos.length >= 8) {
        nextErrors.push("You can upload up to 8 photos.")
        return
      }

      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `photo-${Date.now()}-${index}`
      nextPhotos.push({ id, file, previewUrl: URL.createObjectURL(file) })
    })

    if (nextPhotos.length > 0) {
      setVehiclePhotos((currentPhotos) => [...currentPhotos, ...nextPhotos])
      setSubmitStatus("idle")
      setSubmissionError("")
    }

    setPhotoUploadErrors(Array.from(new Set(nextErrors)))
    event.target.value = ""
  }

  const removeVehiclePhoto = (photoId: string) => {
    setVehiclePhotos((currentPhotos) => {
      const photo = currentPhotos.find((item) => item.id === photoId)

      if (photo) URL.revokeObjectURL(photo.previewUrl)

      return currentPhotos.filter((item) => item.id !== photoId)
    })
    setPhotoUploadErrors([])
    setSubmitStatus("idle")
    setSubmissionError("")
  }

  const focusInvalidCarField = (field: CarDetailsField) => {
    const manualFieldRef = field === "make" ? manualMakeRef : field === "model" ? manualModelRef : field === "variant" ? manualVariantRef : null
    const isManual = field === "make" ? vehicleFieldModes.make === "manual" : field === "model" ? vehicleFieldModes.model === "manual" : field === "variant" ? vehicleFieldModes.variant === "manual" : false
    window.requestAnimationFrame(() => (isManual ? manualFieldRef?.current : carFieldRefs.current[field])?.focus())
  }

  const handleSinglePageSubmit = async () => {
    if (submitStatus === "submitting") return
    const nextCarErrors: Partial<Record<CarDetailsField, string>> = {}
    const nextContactErrors: Partial<Record<ContactDetailsField, string>> = {}

    ;(Object.keys(carDetails) as CarDetailsField[]).forEach((field) => {
      const error = validateCarDetailsField(field, carDetails[field], currentYear)
      if (error) nextCarErrors[field] = error
    })

    ;(Object.keys(contactDetails) as ContactDetailsField[]).forEach((field) => {
      const error = validateContactDetailsField(field, contactDetails[field])
      if (error) nextContactErrors[field] = error
    })

    const consentError = privacyConsent ? "" : "Please agree to the Privacy Policy to continue."

    setCarDetailsErrors(nextCarErrors)
    setContactDetailsErrors(nextContactErrors)
    setPrivacyConsentError(consentError)
    setSubmitStatus("idle")
    setSubmissionError("")

    const firstInvalidCarField = Object.keys(nextCarErrors)[0] as CarDetailsField | undefined
    const firstInvalidContactField = Object.keys(nextContactErrors)[0] as ContactDetailsField | undefined

    if (firstInvalidCarField) {
      focusInvalidCarField(firstInvalidCarField)
    } else if (firstInvalidContactField) {
      window.requestAnimationFrame(() => contactFieldRefs.current[firstInvalidContactField]?.focus())
    } else if (consentError) {
      window.requestAnimationFrame(() => privacyConsentRef.current?.focus())
    } else {
      setSubmitStatus("submitting")
      try {
        const result = await submitSellCarLead(buildSellCarPayload(carDetails, contactDetails, vehicleFieldModes, vehiclePhotos.length))
        clearSellCarDraft()
        setSubmissionReferenceId(result.referenceId)
        setSubmitStatus("success")
        window.requestAnimationFrame(() => successHeadingRef.current?.focus())
      } catch {
        setSubmitStatus("error")
        setSubmissionError("We couldn’t submit your details right now. Please try again.")
        window.requestAnimationFrame(() => submissionErrorRef.current?.focus())
      }
    }
  }

  useEffect(() => {
    if (!isSellCarModalOpen) return

    if (submitStatus !== "idle" && submitStatus !== "error") return

    if (!hasSellCarFormData) return

    try {
      window.sessionStorage.setItem(
        sellCarDraftKey,
        JSON.stringify({ carDetails, contactDetails, privacyConsent, vehicleFieldModes }),
      )
    } catch {
      // sessionStorage may be unavailable in restricted browser contexts.
    }
  }, [carDetails, contactDetails, hasSellCarFormData, isSellCarModalOpen, privacyConsent, submitStatus, vehicleFieldModes])

  useEffect(() => {
    if (!isSellCarModalOpen) return

    const focusFrame = window.requestAnimationFrame(() => {
      if (showDiscardConfirmation) {
        keepEditingRef.current?.focus()
      } else {
        carFieldRefs.current.year?.focus()
      }
    })

    return () => window.cancelAnimationFrame(focusFrame)
  }, [isSellCarModalOpen, showDiscardConfirmation])

  useEffect(() => {
    latestPhotosRef.current = vehiclePhotos
  }, [vehiclePhotos])

  useEffect(() => {
    return () => revokePhotoPreviews(latestPhotosRef.current)
  }, [])

  useEffect(() => {
    const loadingTimers = catalogLoadingTimersRef.current
    return () => {
      Object.values(loadingTimers).forEach((timer) => {
        if (timer) window.clearTimeout(timer)
      })
    }
  }, [])

  const animateParallax = () => {
    const particleLayer = particleLayerRef.current

    if (!particleLayer || prefersReducedMotionRef.current) {
      animationFrameRef.current = null
      return
    }

    const target = targetOffsetRef.current
    const current = currentOffsetRef.current

    current.x += (target.x - current.x) * 0.08
    current.y += (target.y - current.y) * 0.08

    particleLayer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`

    if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
      animationFrameRef.current = window.requestAnimationFrame(animateParallax)
    } else {
      animationFrameRef.current = null
    }
  }

  const scheduleParallax = () => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame(animateParallax)
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotionRef.current) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5

    targetOffsetRef.current = {
      x: horizontalPosition * 16,
      y: verticalPosition * 12,
    }
    scheduleParallax()
  }

  const handlePointerLeave = () => {
    targetOffsetRef.current = { x: 0, y: 0 }
    scheduleParallax()
  }

  useLayoutEffect(() => {
    const measuredWidth = rotatingWordMeasureRef.current?.getBoundingClientRect().width

    if (measuredWidth) {
      setRotatingWordWidth(measuredWidth)
    }
  }, [activeWordIndex])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateMotionPreference = () => {
      prefersReducedMotionRef.current = reducedMotionQuery.matches

      if (reducedMotionQuery.matches) {
        targetOffsetRef.current = { x: 0, y: 0 }
        currentOffsetRef.current = { x: 0, y: 0 }

        if (particleLayerRef.current) {
          particleLayerRef.current.style.transform = "translate3d(0, 0, 0)"
        }

        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }
    }

    updateMotionPreference()
    reducedMotionQuery.addEventListener("change", updateMotionPreference)

    return () => {
      reducedMotionQuery.removeEventListener("change", updateMotionPreference)

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let typewriterTimeout: number | undefined
    let currentWordIndex = 0
    let characterIndex = 0
    let isDeleting = false

    const clearTypewriter = () => {
      if (typewriterTimeout !== undefined) {
        window.clearTimeout(typewriterTimeout)
      }
    }

    const typeNextCharacter = () => {
      const currentWord = typewriterWords[currentWordIndex]

      if (isDeleting) {
        characterIndex -= 1
        setTypedWord(currentWord.slice(0, characterIndex))

        if (characterIndex === 0) {
          isDeleting = false
          currentWordIndex = (currentWordIndex + 1) % typewriterWords.length
          typewriterTimeout = window.setTimeout(typeNextCharacter, 300)
          return
        }

        typewriterTimeout = window.setTimeout(typeNextCharacter, 65)
        return
      }

      characterIndex += 1
      setTypedWord(currentWord.slice(0, characterIndex))

      if (characterIndex === currentWord.length) {
        isDeleting = true
        typewriterTimeout = window.setTimeout(typeNextCharacter, 1400)
        return
      }

      typewriterTimeout = window.setTimeout(typeNextCharacter, 95)
    }

    const updateTypewriter = () => {
      clearTypewriter()
      currentWordIndex = 0
      characterIndex = 0
      isDeleting = false
      setIsTypewriterReducedMotion(reducedMotionQuery.matches)

      if (reducedMotionQuery.matches || document.hidden) {
        setTypedWord("hassle.")
        return
      }

      setTypedWord("")
      typewriterTimeout = window.setTimeout(typeNextCharacter, 250)
    }

    updateTypewriter()
    reducedMotionQuery.addEventListener("change", updateTypewriter)
    document.addEventListener("visibilitychange", updateTypewriter)

    return () => {
      clearTypewriter()
      reducedMotionQuery.removeEventListener("change", updateTypewriter)
      document.removeEventListener("visibilitychange", updateTypewriter)
    }
  }, [])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let rotationTimeout: number | undefined
    let entranceFrame: number | undefined

    const clearRotation = () => {
      if (rotationTimeout !== undefined) {
        window.clearTimeout(rotationTimeout)
      }

      if (entranceFrame !== undefined) {
        window.cancelAnimationFrame(entranceFrame)
      }
    }

    const scheduleRotation = () => {
      rotationTimeout = window.setTimeout(() => {
        setWordPhase("exit")

        rotationTimeout = window.setTimeout(() => {
          setActiveWordIndex((currentIndex) => (currentIndex + 1) % rotatingWords.length)
          setWordPhase("enter")
          entranceFrame = window.requestAnimationFrame(() => setWordPhase("idle"))
          scheduleRotation()
        }, 400)
      }, 2800)
    }

    const updateRotation = () => {
      clearRotation()
      setActiveWordIndex(0)
      setWordPhase("idle")

      if (!reducedMotionQuery.matches && !document.hidden) {
        scheduleRotation()
      }
    }

    updateRotation()
    reducedMotionQuery.addEventListener("change", updateRotation)
    document.addEventListener("visibilitychange", updateRotation)

    return () => {
      clearRotation()
      reducedMotionQuery.removeEventListener("change", updateRotation)
      document.removeEventListener("visibilitychange", updateRotation)
    }
  }, [])

  return (
    <>
      <section
      className="relative isolate overflow-hidden bg-[var(--primary-light)]"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-24 top-2 h-80 w-80 rounded-full border border-[color:var(--primary)] opacity-20 md:h-[30rem] md:w-[30rem]" />
        <div className="absolute right-[16%] top-20 hidden h-48 w-48 rounded-full border-2 border-[color:var(--primary-hover)] opacity-10 md:block" />
        <div className="absolute bottom-12 right-[5%] h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.07] blur-3xl md:h-96 md:w-96" />
      </div>
      <div
        ref={particleLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] transform-gpu will-change-transform"
      >
        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className={`mobee-hero-particle absolute rounded-full transform-gpu ${particle.blur ? "blur-[1px]" : ""}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      <Container className="relative z-20">
        <div className="flex gap-8 pb-32 pt-20">
          <div className="flex flex-1 flex-col justify-center gap-7">
            <h1
              aria-label="The Easiest Way to Sell Your Car"
              className="max-w-xl text-5xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)]"
            >
              <span className="block lg:whitespace-nowrap">
                The{" "}
                <span
                  aria-hidden="true"
                  className="mobee-hero-rotating-word relative inline-block align-baseline leading-[1.1] transition-[width] duration-[350ms] ease-out"
                  style={rotatingWordWidth ? { width: `${rotatingWordWidth}px` } : undefined}
                >
                  <span ref={rotatingWordMeasureRef} className="invisible whitespace-nowrap">
                    {rotatingWords[activeWordIndex]}
                  </span>
                  <span
                    className={`absolute inset-0 inline-block text-[var(--primary)] transition-[transform,opacity] duration-[400ms] ease-out ${
                      wordPhase === "exit" ? "-translate-y-1 opacity-0" : wordPhase === "enter" ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    {rotatingWords[activeWordIndex]}
                  </span>
                </span>{" "}
                Way
              </span>
              <span className="block">to Sell Your Car</span>
            </h1>
            <p aria-label="Maximum value. Zero hassle." className="max-w-md text-lg leading-relaxed text-[var(--text-secondary)]">
              <span aria-hidden="true">Maximum value. Zero </span>
              <span aria-hidden="true" className="relative inline-block align-baseline text-[var(--primary-hover)]">
                <span className="invisible">time wasted.</span>
                <span className="absolute left-0 top-0 inline-flex items-baseline whitespace-nowrap">
                  {typedWord}
                  {!isTypewriterReducedMotion && <span className="mobee-hero-typewriter-caret" />}
                </span>
              </span>
            </p>
            <Button
              aria-label="Sell My Car"
              onClick={openSellCarModal}
              className="group relative !grid h-[3.875rem] w-full max-w-[19.5rem] grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2 overflow-hidden border border-[rgba(200,160,68,0.55)] !bg-white/35 px-3 !py-0 font-semibold !text-[var(--text-primary)] shadow-[0_12px_28px_rgba(31,31,31,0.1),0_8px_20px_rgba(200,160,68,0.08)] ring-1 ring-inset ring-white/55 backdrop-blur-2xl transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:!bg-white/45 hover:shadow-[0_16px_34px_rgba(31,31,31,0.12),0_12px_24px_rgba(200,160,68,0.12)] active:translate-y-0 active:shadow-[0_9px_20px_rgba(31,31,31,0.09),0_6px_16px_rgba(200,160,68,0.07)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--primary-light)] motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 sm:gap-3 sm:px-4"
              style={{ borderRadius: "2rem" }}
            >
              <Image
                aria-hidden="true"
                alt=""
                className="relative z-10 h-auto w-16 shrink-0 object-contain transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:w-20"
                height={60}
                src="/images/brand/cta logo.png"
                width={96}
              />
              <span aria-hidden="true" className="relative z-10 h-5 w-px shrink-0 bg-[var(--primary)] opacity-60 sm:h-6" />
              <span className="relative z-10 justify-self-center whitespace-nowrap text-[0.8rem] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)] sm:text-[0.9rem]">
                Sell My Car
              </span>
              <span aria-hidden="true" className="relative z-10 mr-1 flex size-[2.375rem] items-center justify-center rounded-full bg-[var(--primary)] text-white transition-[background-color,transform] duration-200 ease-out group-hover:translate-x-1 group-hover:bg-[var(--primary-hover)] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:size-10">
                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="20">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
              <span aria-hidden="true" className="pointer-events-none absolute -top-8 left-[12%] z-0 h-14 w-2/3 rounded-full bg-white/35 blur-2xl" />
            </Button>
          </div>
          <div className="relative flex h-[440px] flex-1 items-center justify-end">
            <div aria-hidden="true" className="pointer-events-none absolute right-[4%] top-1/2 z-0 h-64 w-[72%] -translate-y-1/2 rounded-full bg-[var(--primary)] opacity-[0.12] blur-3xl" />
            <Image
              src="/images/hero/hero.png"
              alt=""
              width={3840}
              height={1140}
              className="mobee-hero-vehicle relative z-10 h-auto w-[760px] max-w-none drop-shadow-2xl"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </Container>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 w-full md:h-24"
        preserveAspectRatio="none"
        viewBox="0 0 1440 96"
      >
        <path d="M0 46C240 92 472 20 736 54C1000 88 1204 22 1440 48V96H0Z" fill="var(--background)" />
      </svg>
      <style>{`
        @keyframes mobee-hero-dust-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(8px, -12px, 0); }
        }

        .mobee-hero-particle {
          animation-name: mobee-hero-dust-drift;
          animation-direction: alternate;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes mobee-hero-vehicle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .mobee-hero-vehicle {
          animation: mobee-hero-vehicle-float 9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobee-hero-rotating-word {
            transition: none;
          }
        }

        @keyframes mobee-hero-typewriter-caret {
          0%, 45% { opacity: 1; }
          55%, 100% { opacity: 0; }
        }

        .mobee-hero-typewriter-caret {
          display: inline-block;
          width: 1px;
          height: 1.1em;
          margin-left: 2px;
          vertical-align: -0.15em;
          background: currentColor;
          animation: mobee-hero-typewriter-caret 900ms steps(1, end) infinite;
        }

        .mobee-hero-particle:nth-child(n + 13) {
          display: none;
        }

        @media (min-width: 768px) {
          .mobee-hero-particle:nth-child(n + 13) {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobee-hero-particle {
            animation: none;
          }

          .mobee-hero-vehicle {
            animation: none;
          }

          .mobee-hero-typewriter-caret {
            animation: none;
          }
        }
      `}</style>
      </section>
      <Modal
        isOpen={isSellCarModalOpen}
        labelledBy={showDiscardConfirmation ? "sell-car-discard-title" : "sell-car-modal-title"}
        onClose={requestSellCarModalClose}
      >
        {showDiscardConfirmation ? (
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
                onClick={() => setShowDiscardConfirmation(false)}
                className="min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                Keep Editing
              </button>
              <Button type="button" onClick={discardSellCarModal} className="min-h-11 rounded-xl px-6 focus-visible:ring-offset-white">
                Discard
              </Button>
            </div>
          </div>
        ) : (
        <>
        <div className="flex items-start justify-between gap-6">
          <div>
            <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full bg-[var(--primary)]" />
            <h2 id="sell-car-modal-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Tell Us About Your Car</h2>
            <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">Share your vehicle and contact details to receive an initial offer.</p>
          </div>
          <button type="button" data-modal-initial-focus aria-label="Close dialog" onClick={requestSellCarModalClose} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {submitStatus === "success" ? (
          <div className="mt-7 rounded-2xl border border-[var(--primary)]/35 bg-[var(--primary-light)] p-6">
            <h3 ref={successHeadingRef} tabIndex={-1} className="text-xl font-bold text-[var(--text-primary)]">Your details have been received</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">Our team will review your vehicle details and contact you about your initial offer and free doorstep inspection.</p>
            <p className="mt-5 text-sm text-[var(--text-primary)]">Reference ID <strong>{submissionReferenceId}</strong></p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={discardSellCarModal} className="min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-primary)]">Done</button><Button type="button" onClick={() => { discardSellCarModal(); setIsSellCarModalOpen(true); window.requestAnimationFrame(() => carFieldRefs.current.year?.focus()) }} className="min-h-11 rounded-xl px-6">Submit Another Vehicle</Button></div>
          </div>
        ) : <form noValidate onSubmit={(event) => { event.preventDefault(); handleSinglePageSubmit() }} className="mt-7">
          <section aria-labelledby="vehicle-details-title">
            <div className="flex items-center gap-3"><h3 id="vehicle-details-title" className="text-base font-semibold text-[var(--text-primary)]">Vehicle Details</h3><span aria-hidden="true" className="h-px flex-1 bg-[var(--border)]" /></div>
            <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <div><label htmlFor="car-year" className="text-sm font-medium text-[var(--text-primary)]">Year</label><select id="car-year" ref={(element) => { carFieldRefs.current.year = element }} required value={carDetails.year} onChange={(event) => handleYearChange(event.target.value)} aria-invalid={Boolean(carDetailsErrors.year)} aria-describedby={carDetailsErrors.year ? "car-year-error" : undefined} className={formFieldClass}><option value="">Select year</option>{yearOptions.map((year) => <option key={year}>{year}</option>)}</select>{carDetailsErrors.year && <p id="car-year-error" className="mt-1.5 text-xs text-red-700">{carDetailsErrors.year}</p>}</div>
              <div><ReusableSearchableCombobox id="car-make" inputRef={(element) => { carFieldRefs.current.make = element }} label="Brand / Make" placeholder={carDetails.year ? "Search brands" : "Select a year first"} selectedValue={vehicleFieldModes.make === "manual" ? "" : carDetails.make} options={getBrands(Number(carDetails.year))} error={carDetailsErrors.make} disabled={!carDetails.year} isLoading={catalogLoading.brand} disabledMessage={!carDetails.year ? "Select a year first." : undefined} onSelect={handleMakeSelection} onManualSelect={handleMakeManual} />{vehicleFieldModes.make === "manual" && <><label htmlFor="car-make-manual" className="mt-3 block text-sm font-medium text-[var(--text-primary)]">Enter Brand / Make</label><input id="car-make-manual" ref={manualMakeRef} type="text" required aria-invalid={Boolean(carDetailsErrors.make)} aria-describedby={carDetailsErrors.make ? "car-make-error" : undefined} placeholder="e.g. Chevrolet" value={carDetails.make} onChange={(event) => { if (event.target.value !== carDetails.make) { handleCarDetailsChange("make", event.target.value); clearModelAndVariant() } }} className={`${formFieldClass} ${carDetailsErrors.make ? "border-red-700" : ""}`} /></>}</div>
              <div><ReusableSearchableCombobox id="car-model" inputRef={(element) => { carFieldRefs.current.model = element }} label="Model" placeholder={!carDetails.year ? "Select a year first" : "Search models"} selectedValue={vehicleFieldModes.model === "manual" ? "" : carDetails.model} options={vehicleFieldModes.make === "catalog" ? getModels(carDetails.make, Number(carDetails.year)) : []} error={carDetailsErrors.model} disabled={!carDetails.year || (vehicleFieldModes.make === "catalog" && !carDetails.make)} isLoading={catalogLoading.model} disabledMessage={!carDetails.year ? "Select a year first." : vehicleFieldModes.make === "manual" ? "Enter the model manually or choose Not Sure." : vehicleFieldModes.make === "catalog" && !carDetails.make ? "Select a brand first." : undefined} onSelect={handleModelSelection} onManualSelect={handleModelManual} />{vehicleFieldModes.model === "manual" && <><label htmlFor="car-model-manual" className="mt-3 block text-sm font-medium text-[var(--text-primary)]">Enter Model</label><input id="car-model-manual" ref={manualModelRef} type="text" required aria-invalid={Boolean(carDetailsErrors.model)} aria-describedby={carDetailsErrors.model ? "car-model-error" : undefined} placeholder="e.g. Trailblazer" value={carDetails.model} onChange={(event) => { if (event.target.value !== carDetails.model) { handleCarDetailsChange("model", event.target.value); setCarDetails((details) => ({ ...details, variant: "" })); setVehicleFieldModes((modes) => ({ ...modes, variant: "catalog" })) } }} className={`${formFieldClass} ${carDetailsErrors.model ? "border-red-700" : ""}`} /></>}</div>
              <div><ReusableSearchableCombobox id="car-variant" label="Variant (Optional)" placeholder={!carDetails.model ? "Select a model first" : "Search variants"} selectedValue={vehicleFieldModes.variant === "manual" ? "" : carDetails.variant} options={vehicleFieldModes.make === "catalog" && vehicleFieldModes.model === "catalog" ? getVariants(carDetails.make, carDetails.model, Number(carDetails.year)) : []} disabled={!carDetails.year || !carDetails.make || !carDetails.model} isLoading={catalogLoading.variant} disabledMessage={!carDetails.model ? "Select a model first." : vehicleFieldModes.model === "manual" ? "Enter the variant manually or choose Not Sure." : undefined} onSelect={(value, mode) => { handleCarDetailsChange("variant", value); setVehicleFieldModes((modes) => ({ ...modes, variant: mode })) }} onManualSelect={handleVariantManual} />{vehicleFieldModes.variant === "manual" && <><label htmlFor="car-variant-manual" className="mt-3 block text-sm font-medium text-[var(--text-primary)]">Enter Variant</label><input id="car-variant-manual" ref={manualVariantRef} type="text" placeholder="e.g. 2.8 LTZ AT" value={carDetails.variant} onChange={(event) => handleCarDetailsChange("variant", event.target.value)} className={formFieldClass} /></>}</div>
              <div><label htmlFor="car-mileage" className="text-sm font-medium text-[var(--text-primary)]">Mileage</label><div className="relative"><input id="car-mileage" ref={(element) => { carFieldRefs.current.mileage = element }} type="number" inputMode="numeric" autoComplete="off" min="0" required placeholder="45,000" value={carDetails.mileage} onChange={(event) => handleCarDetailsChange("mileage", event.target.value)} aria-invalid={Boolean(carDetailsErrors.mileage)} aria-describedby={carDetailsErrors.mileage ? "car-mileage-error" : undefined} className={`${formFieldClass} pr-11`} /><span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)]">km</span></div>{carDetailsErrors.mileage && <p id="car-mileage-error" className="mt-1.5 text-xs text-red-700">{carDetailsErrors.mileage}</p>}</div>
              <div><label htmlFor="car-transmission" className="text-sm font-medium text-[var(--text-primary)]">Transmission</label><select id="car-transmission" ref={(element) => { carFieldRefs.current.transmission = element }} value={carDetails.transmission} required onChange={(event) => handleCarDetailsChange("transmission", event.target.value)} aria-invalid={Boolean(carDetailsErrors.transmission)} aria-describedby={carDetailsErrors.transmission ? "car-transmission-error" : undefined} className={formFieldClass}><option value="">Select transmission</option><option>Automatic</option><option>Manual</option><option>CVT</option><option>DCT</option><option>Other</option></select>{carDetailsErrors.transmission && <p id="car-transmission-error" className="mt-1.5 text-xs text-red-700">{carDetailsErrors.transmission}</p>}</div>
              <div><label htmlFor="car-fuel-type" className="text-sm font-medium text-[var(--text-primary)]">Fuel Type</label><select id="car-fuel-type" ref={(element) => { carFieldRefs.current.fuelType = element }} value={carDetails.fuelType} required onChange={(event) => handleCarDetailsChange("fuelType", event.target.value)} aria-invalid={Boolean(carDetailsErrors.fuelType)} aria-describedby={carDetailsErrors.fuelType ? "car-fuel-type-error" : undefined} className={formFieldClass}><option value="">Select fuel type</option><option>Gasoline</option><option>Diesel</option><option>Hybrid</option><option>Electric</option><option>Other</option></select>{carDetailsErrors.fuelType && <p id="car-fuel-type-error" className="mt-1.5 text-xs text-red-700">{carDetailsErrors.fuelType}</p>}</div>
              <div><label htmlFor="car-condition" className="text-sm font-medium text-[var(--text-primary)]">Vehicle Condition</label><select id="car-condition" ref={(element) => { carFieldRefs.current.condition = element }} value={carDetails.condition} required onChange={(event) => handleCarDetailsChange("condition", event.target.value)} aria-invalid={Boolean(carDetailsErrors.condition)} aria-describedby={carDetailsErrors.condition ? "car-condition-error" : undefined} className={formFieldClass}><option value="">Select condition</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Repair</option></select>{carDetailsErrors.condition && <p id="car-condition-error" className="mt-1.5 text-xs text-red-700">{carDetailsErrors.condition}</p>}</div>
            </div>
          </section>

          <section aria-labelledby="contact-details-title" className="mt-8 border-t border-[var(--border)] pt-7">
            <div className="flex items-center gap-3"><h3 id="contact-details-title" className="text-base font-semibold text-[var(--text-primary)]">Contact Details</h3><span aria-hidden="true" className="h-px flex-1 bg-[var(--border)]" /></div>
            <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label htmlFor="contact-full-name" className="text-sm font-medium text-[var(--text-primary)]">Full Name</label><input id="contact-full-name" ref={(element) => { contactFieldRefs.current.fullName = element }} type="text" autoComplete="name" required placeholder="Juan Dela Cruz" value={contactDetails.fullName} onChange={(event) => handleContactDetailsChange("fullName", event.target.value)} aria-invalid={Boolean(contactDetailsErrors.fullName)} aria-describedby={contactDetailsErrors.fullName ? "contact-full-name-error" : undefined} className={formFieldClass} />{contactDetailsErrors.fullName && <p id="contact-full-name-error" className="mt-1.5 text-xs text-red-700">{contactDetailsErrors.fullName}</p>}</div>
              <div><label htmlFor="contact-mobile-number" className="text-sm font-medium text-[var(--text-primary)]">Mobile Number</label><input id="contact-mobile-number" ref={(element) => { contactFieldRefs.current.mobileNumber = element }} type="tel" inputMode="tel" autoComplete="tel" required placeholder="09XX XXX XXXX" value={contactDetails.mobileNumber} onChange={(event) => handleContactDetailsChange("mobileNumber", event.target.value)} aria-invalid={Boolean(contactDetailsErrors.mobileNumber)} aria-describedby={contactDetailsErrors.mobileNumber ? "contact-mobile-number-error" : undefined} className={formFieldClass} />{contactDetailsErrors.mobileNumber && <p id="contact-mobile-number-error" className="mt-1.5 text-xs text-red-700">{contactDetailsErrors.mobileNumber}</p>}</div>
              <div><label htmlFor="contact-city" className="text-sm font-medium text-[var(--text-primary)]">City / Municipality</label><input id="contact-city" ref={(element) => { contactFieldRefs.current.city = element }} type="text" autoComplete="address-level2" required placeholder="Quezon City" value={contactDetails.city} onChange={(event) => handleContactDetailsChange("city", event.target.value)} aria-invalid={Boolean(contactDetailsErrors.city)} aria-describedby={contactDetailsErrors.city ? "contact-city-error" : undefined} className={formFieldClass} />{contactDetailsErrors.city && <p id="contact-city-error" className="mt-1.5 text-xs text-red-700">{contactDetailsErrors.city}</p>}</div>
            </div>
          </section>

          <section aria-labelledby="vehicle-photos-title" className="mt-8 border-t border-[var(--border)] pt-7">
            <div className="flex items-center gap-3"><h3 id="vehicle-photos-title" className="text-base font-semibold text-[var(--text-primary)]">Vehicle Photos <span className="font-normal text-[var(--text-secondary)]">(Optional)</span></h3><span aria-hidden="true" className="h-px flex-1 bg-[var(--border)]" /></div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Add 2–3 clear photos to help us evaluate your car faster.</p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">Please do not upload IDs, OR/CR documents, or other sensitive personal information.</p>
            <p className="mt-2 text-xs font-medium text-[var(--text-primary)]">Suggested: Front · Rear · Side · Interior · Odometer</p>
            <label htmlFor="vehicle-photos" className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-alt)] px-4 text-center transition-colors hover:border-[var(--primary)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
              <input ref={photoInputRef} id="vehicle-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoSelection} className="sr-only" />
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7 text-[var(--primary)]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0L8 8m4-4 4 4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></svg>
              <span className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Choose Photos</span><span className="mt-1 text-xs text-[var(--text-secondary)]">JPG, PNG or WebP · Up to 8 photos · 5 MB each</span>
            </label>
            {photoUploadErrors.length > 0 && <div role="alert" className="mt-3 space-y-1 text-xs text-red-700">{photoUploadErrors.map((error) => <p key={error}>{error}</p>)}</div>}
            {vehiclePhotos.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{vehiclePhotos.map((photo) => <div key={photo.id} className="flex min-w-0 gap-3 rounded-xl border border-[var(--border)] bg-white p-2"><div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--background-alt)]"><Image src={photo.previewUrl} alt={`Preview of ${photo.file.name}`} fill unoptimized draggable={false} className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[var(--text-primary)]">{photo.file.name}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{formatFileSize(photo.file.size)}</p><button type="button" onClick={() => removeVehiclePhoto(photo.id)} className="mt-2 min-h-7 text-xs font-medium text-[var(--primary)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">Remove<span className="sr-only"> {photo.file.name}</span></button></div></div>)}</div>}
          </section>

          <section className="mt-8 border-t border-[var(--border)] pt-6">
            <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-primary)]"><input ref={privacyConsentRef} type="checkbox" checked={privacyConsent} onChange={(event) => { setPrivacyConsent(event.target.checked); setPrivacyConsentError(""); setSubmitStatus("idle"); setSubmissionError("") }} aria-invalid={Boolean(privacyConsentError)} aria-describedby={privacyConsentError ? "privacy-consent-error" : undefined} className="mt-0.5 size-5 shrink-0 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" /><span>I agree to the <span className="font-medium text-[var(--primary)] underline underline-offset-2">Privacy Policy</span> and consent to being contacted about my vehicle inquiry.</span></label>
            {privacyConsentError && <p id="privacy-consent-error" className="mt-2 text-xs text-red-700">{privacyConsentError}</p>}
          </section>
          {submitStatus === "error" && <p ref={submissionErrorRef} tabIndex={-1} role="alert" className="mt-5 text-sm text-red-700">{submissionError}</p>}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={requestSellCarModalClose} disabled={submitStatus === "submitting"} className="min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Cancel</button><Button type="submit" disabled={submitStatus === "submitting"} className="min-h-11 rounded-xl px-6 focus-visible:ring-offset-white">{submitStatus === "submitting" ? <><span aria-hidden="true" className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />Submitting…</> : "Get My Offer"}</Button></div>
        </form>}
        </>
        )}
      </Modal>
    </>
  )
}
