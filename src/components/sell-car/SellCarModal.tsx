"use client"

import type { ChangeEvent, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import Modal from "../ui/Modal"
import { type ComboboxSelection } from "../ui/SearchableCombobox"
import { buildSellCarPayload } from "../../lib/sellCar/buildSellCarPayload"
import { submitSellCarLead } from "../../lib/sellCar/submitSellCarLead"
import type { VehicleFieldModes } from "../../types/sellCar"
import { initialCarDetails, initialContactDetails, initialVehicleFieldModes, sellCarDraftKey, type CarDetails, type CarDetailsField, type ContactDetails, type ContactDetailsField, type SubmitStatus, type VehiclePhoto } from "./types"
import { validateCarDetailsField, validateContactDetailsField } from "./helpers"
import { clearSellCarDraft, restoreSellCarDraft, saveSellCarDraft } from "./draft"
import { createVehiclePhoto, revokePhotoPreviews, validateVehiclePhoto } from "./photoUtils"
import SellCarDiscardConfirmation from "./SellCarDiscardConfirmation"
import SellCarSuccessPanel from "./SellCarSuccessPanel"
import SellCarForm from "./SellCarForm"

export type SellCarModalProps = { trigger: (open: () => void) => ReactNode }

export default function SellCarModal({ trigger }: SellCarModalProps) {
  const carFieldRefs = useRef<Partial<Record<CarDetailsField, HTMLElement | null>>>({})
  const contactFieldRefs = useRef<Partial<Record<ContactDetailsField, HTMLElement | null>>>({})
  const keepEditingRef = useRef<HTMLButtonElement>(null)
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

  const discardSellCarModal = () => {
    clearCatalogLoading()
    clearSellCarDraft(sellCarDraftKey)
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

    const restoredDraft = restoreSellCarDraft(sellCarDraftKey, currentYear)

    if (restoredDraft) {
      setCarDetails(restoredDraft.carDetails)
      setVehicleFieldModes(restoredDraft.vehicleFieldModes)
    }

    setIsSellCarModalOpen(true)
  }

  const handlePhotoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    const nextPhotos: VehiclePhoto[] = []
    const nextErrors: string[] = []

    selectedFiles.forEach((file, index) => {
      const validationError = validateVehiclePhoto(file)

      if (validationError) {
        nextErrors.push(validationError)
        return
      }

      if (vehiclePhotos.length + nextPhotos.length >= 8) {
        nextErrors.push("You can upload up to 8 photos.")
        return
      }

      nextPhotos.push(createVehiclePhoto(file, index))
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
        const result = await submitSellCarLead(
          buildSellCarPayload(carDetails, contactDetails, vehicleFieldModes, vehiclePhotos.length),
          vehiclePhotos.map((photo) => photo.file),
        )
        clearSellCarDraft(sellCarDraftKey)
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

    saveSellCarDraft(sellCarDraftKey, carDetails, vehicleFieldModes)
  }, [carDetails, hasSellCarFormData, isSellCarModalOpen, submitStatus, vehicleFieldModes])

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

  return <>
    {/* The trigger is an intentional render prop; the callback itself is only invoked by the trigger button. */}
    {/* eslint-disable-next-line react-hooks/refs */}
    {trigger(() => openSellCarModal())}
      <Modal
        isOpen={isSellCarModalOpen}
        labelledBy={showDiscardConfirmation ? "sell-car-discard-title" : "sell-car-modal-title"}
        onClose={requestSellCarModalClose}
      >
        {showDiscardConfirmation ? (
          <SellCarDiscardConfirmation keepEditingRef={keepEditingRef} onKeepEditing={() => setShowDiscardConfirmation(false)} onDiscard={discardSellCarModal} />
        ) : (
        <>
          {submitStatus === "success" ? (
            <SellCarSuccessPanel headingRef={successHeadingRef} referenceId={submissionReferenceId} onDone={discardSellCarModal} onSubmitAnotherVehicle={() => { discardSellCarModal(); setIsSellCarModalOpen(true); window.requestAnimationFrame(() => carFieldRefs.current.year?.focus()) }} />
          ) : <SellCarForm
            carDetails={carDetails}
            carDetailsErrors={carDetailsErrors}
            contactDetails={contactDetails}
            contactDetailsErrors={contactDetailsErrors}
            vehicleFieldModes={vehicleFieldModes}
            catalogLoading={catalogLoading}
            vehiclePhotos={vehiclePhotos}
            photoUploadErrors={photoUploadErrors}
            privacyConsent={privacyConsent}
            privacyConsentError={privacyConsentError}
            submitStatus={submitStatus}
            submissionError={submissionError}
            yearOptions={yearOptions}
            carFieldRefs={carFieldRefs}
            contactFieldRefs={contactFieldRefs}
            photoInputRef={photoInputRef}
            privacyConsentRef={privacyConsentRef}
            manualMakeRef={manualMakeRef}
            manualModelRef={manualModelRef}
            manualVariantRef={manualVariantRef}
            submissionErrorRef={submissionErrorRef}
            onClose={requestSellCarModalClose}
            onSubmit={(event) => { event.preventDefault(); handleSinglePageSubmit() }}
            onYearChange={handleYearChange}
            onCarDetailsChange={handleCarDetailsChange}
            onContactDetailsChange={handleContactDetailsChange}
            onMakeSelection={handleMakeSelection}
            onMakeManual={handleMakeManual}
            onModelSelection={handleModelSelection}
            onModelManual={handleModelManual}
            onVariantSelection={(value, mode) => { handleCarDetailsChange("variant", value); setVehicleFieldModes((modes) => ({ ...modes, variant: mode })) }}
            onVariantManual={handleVariantManual}
            onPhotoSelection={handlePhotoSelection}
            onRemovePhoto={removeVehiclePhoto}
            onPrivacyConsentChange={(checked) => { setPrivacyConsent(checked); setPrivacyConsentError(""); setSubmitStatus("idle"); setSubmissionError("") }}
            onManualMakeChange={(value) => { if (value !== carDetails.make) { handleCarDetailsChange("make", value); clearModelAndVariant() } }}
            onManualModelChange={(value) => { if (value !== carDetails.model) { handleCarDetailsChange("model", value); setCarDetails((details) => ({ ...details, variant: "" })); setVehicleFieldModes((modes) => ({ ...modes, variant: "catalog" })) } }}
          />}
        </>
        )}
      </Modal>
  </>
}
