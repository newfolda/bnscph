/* eslint-disable react-hooks/immutability */
import Image from "next/image"
import type { ChangeEvent, FormEvent, MutableRefObject, ReactNode, RefObject } from "react"
import { getBrands, getModels, getVariants, OLDER_THAN_2010_VALUE } from "../../data/vehicleCatalog"
import type { VehicleFieldModes } from "../../types/sellCar"
import Button from "../ui/Button"
import ReusableSearchableCombobox, { type ComboboxSelection } from "../ui/SearchableCombobox"
import { formatFileSize } from "./helpers"
import { formFieldClass, type CarDetails, type CarDetailsField, type ContactDetails, type ContactDetailsField, type SellCarFormStep, type SubmitStatus, type VehiclePhoto } from "./types"

export type SellCarFormProps = {
  carDetails: CarDetails
  carDetailsErrors: Partial<Record<CarDetailsField, string>>
  contactDetails: ContactDetails
  contactDetailsErrors: Partial<Record<ContactDetailsField, string>>
  vehicleFieldModes: VehicleFieldModes
  catalogLoading: { brand: boolean; model: boolean; variant: boolean }
  vehiclePhotos: VehiclePhoto[]
  photoUploadErrors: string[]
  privacyConsent: boolean
  privacyConsentError: string
  submitStatus: SubmitStatus
  submissionError: string
  yearOptions: number[]
  currentStep: SellCarFormStep
  usesManualYear: boolean
  stepHeadingRef: RefObject<HTMLHeadingElement | null>
  carFieldRefs: MutableRefObject<Partial<Record<CarDetailsField, HTMLElement | null>>>
  contactFieldRefs: MutableRefObject<Partial<Record<ContactDetailsField, HTMLElement | null>>>
  photoInputRef: RefObject<HTMLInputElement | null>
  privacyConsentRef: RefObject<HTMLInputElement | null>
  manualMakeRef: RefObject<HTMLInputElement | null>
  manualModelRef: RefObject<HTMLInputElement | null>
  manualVariantRef: RefObject<HTMLInputElement | null>
  submissionErrorRef: RefObject<HTMLParagraphElement | null>
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onNext: () => void
  onBack: () => void
  onEditStep: (step: SellCarFormStep) => void
  onYearChange: (value: string) => void
  onManualYearChange: (value: string) => void
  onCarDetailsChange: (field: CarDetailsField, value: string) => void
  onContactDetailsChange: (field: ContactDetailsField, value: string) => void
  onMakeSelection: (value: string, mode: ComboboxSelection) => void
  onMakeManual: () => void
  onModelSelection: (value: string, mode: ComboboxSelection) => void
  onModelManual: () => void
  onVariantSelection: (value: string, mode: ComboboxSelection) => void
  onVariantManual: () => void
  onPhotoSelection: (event: ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: (photoId: string) => void
  onPrivacyConsentChange: (checked: boolean) => void
  onManualMakeChange: (value: string) => void
  onManualModelChange: (value: string) => void
}

const steps: Array<{ number: SellCarFormStep; label: string }> = [
  { number: 1, label: "Vehicle" },
  { number: 2, label: "Photos" },
  { number: 3, label: "Contact" },
  { number: 4, label: "Review" },
]

const secondaryButtonClass = "min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
const primaryButtonClass = "min-h-11 rounded-xl px-6 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] focus-visible:ring-offset-white"

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={id} className="mt-1.5 text-xs text-red-700">{error}</p> : null
}

function ReviewGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)]/55 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
        <button type="button" onClick={onEdit} className="rounded-md px-2 py-1 text-sm font-semibold text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">Edit {title}</button>
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">{label}</dt><dd className="mt-1 break-words font-medium text-[var(--text-primary)]">{value || "Not provided"}</dd></div>
}

export default function SellCarForm(props: SellCarFormProps) {
  const {
    carDetails, carDetailsErrors, contactDetails, contactDetailsErrors, vehicleFieldModes, catalogLoading,
    vehiclePhotos, photoUploadErrors, privacyConsent, privacyConsentError, submitStatus, submissionError,
    yearOptions, currentStep, usesManualYear, stepHeadingRef, carFieldRefs, contactFieldRefs, photoInputRef,
    privacyConsentRef, manualMakeRef, manualModelRef, manualVariantRef, submissionErrorRef, onClose, onSubmit,
    onNext, onBack, onEditStep, onYearChange, onManualYearChange, onCarDetailsChange, onContactDetailsChange,
    onMakeSelection, onMakeManual, onModelSelection, onModelManual, onVariantSelection, onVariantManual,
    onPhotoSelection, onRemovePhoto, onPrivacyConsentChange, onManualMakeChange, onManualModelChange,
  } = props
  const carFields = carFieldRefs.current
  const contactFields = contactFieldRefs.current
  const stepName = steps[currentStep - 1].label

  const renderManualInput = (
    id: string,
    label: string,
    value: string,
    inputRef: RefObject<HTMLInputElement | null>,
    onChange: (value: string) => void,
    error?: string,
    optional = false,
  ) => (
    <>
      <label htmlFor={id} className="mt-3 block text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <input id={id} ref={inputRef} type="text" required={!optional} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`${formFieldClass} ${error ? "border-red-700" : ""}`} />
      <FieldError id={`${id}-error`} error={error} />
    </>
  )

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div>
          <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full bg-[var(--primary)]" />
          <h2 id="sell-car-modal-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Sell My Car</h2>
          <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">Tell us about your vehicle and get an initial offer.</p>
        </div>
        <button type="button" data-modal-initial-focus aria-label="Close dialog" onClick={onClose} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <ol aria-label="Sell My Car progress" className="relative mt-6 grid grid-cols-4 gap-1">
        <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-3 h-px bg-[var(--border)]" />
        {steps.map((step) => {
          const completed = step.number < currentStep
          const active = step.number === currentStep
          return (
            <li key={step.number} aria-current={active ? "step" : undefined} className="relative flex min-w-0 flex-col items-center text-center">
              <span className={`relative z-10 flex size-6 items-center justify-center rounded-full border bg-white text-[11px] font-semibold ${active ? "border-[var(--primary)] text-[var(--primary)]" : completed ? "border-[var(--text-primary)] text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
                {completed ? <><span aria-hidden="true">✓</span><span className="sr-only">Completed</span></> : step.number}
              </span>
              <span className={`mt-1.5 truncate text-[11px] font-medium sm:text-xs ${active ? "text-[var(--primary)]" : completed ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{step.label}</span>
            </li>
          )
        })}
      </ol>

      <form noValidate onSubmit={onSubmit} className="mt-6">
        <h3 ref={stepHeadingRef} tabIndex={-1} className="text-lg font-semibold text-[var(--text-primary)]">Step {currentStep}: {stepName}</h3>

        {currentStep === 1 && (
          <section aria-label="Vehicle details" className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <div>
              <label htmlFor="car-year-select" className="text-sm font-medium text-[var(--text-primary)]">Year</label>
              <select id="car-year-select" ref={(element) => { if (!usesManualYear) carFields.year = element }} value={usesManualYear ? OLDER_THAN_2010_VALUE : carDetails.year} onChange={(event) => onYearChange(event.target.value)} className={formFieldClass}>
                <option value="">Select year</option>
                {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
                <option value={OLDER_THAN_2010_VALUE}>Older than 2010</option>
              </select>
              {usesManualYear && <>
                <label htmlFor="car-year" className="mt-3 block text-sm font-medium text-[var(--text-primary)]">Exact Year</label>
                <input id="car-year" ref={(element) => { carFields.year = element }} inputMode="numeric" maxLength={4} required placeholder="e.g. 2008" value={carDetails.year} onChange={(event) => onManualYearChange(event.target.value)} aria-invalid={Boolean(carDetailsErrors.year)} aria-describedby={carDetailsErrors.year ? "car-year-error" : undefined} className={`${formFieldClass} ${carDetailsErrors.year ? "border-red-700" : ""}`} />
              </>}
              <FieldError id="car-year-error" error={carDetailsErrors.year} />
            </div>

            <div>
              <ReusableSearchableCombobox id="car-make" inputRef={(element) => { carFields.make = element }} label="Brand / Make" placeholder={carDetails.year ? "Search brands" : "Select a year first"} selectedValue={vehicleFieldModes.make === "manual" ? "" : carDetails.make} options={usesManualYear ? [] : getBrands(Number(carDetails.year))} error={vehicleFieldModes.make === "manual" ? undefined : carDetailsErrors.make} disabled={!carDetails.year} isLoading={catalogLoading.brand} disabledMessage={!carDetails.year ? "Select a year first." : undefined} onSelect={onMakeSelection} onManualSelect={onMakeManual} />
              {vehicleFieldModes.make === "manual" && renderManualInput("car-make-manual", "Enter Brand / Make", carDetails.make, manualMakeRef, onManualMakeChange, carDetailsErrors.make)}
            </div>

            <div>
              <ReusableSearchableCombobox id="car-model" inputRef={(element) => { carFields.model = element }} label="Model" placeholder={!carDetails.make ? "Select a brand first" : "Search models"} selectedValue={vehicleFieldModes.model === "manual" ? "" : carDetails.model} options={!usesManualYear && vehicleFieldModes.make === "catalog" ? getModels(carDetails.make, Number(carDetails.year)) : []} error={vehicleFieldModes.model === "manual" ? undefined : carDetailsErrors.model} disabled={!carDetails.year || !carDetails.make} isLoading={catalogLoading.model} disabledMessage={!carDetails.year ? "Select a year first." : !carDetails.make ? "Select or enter a brand first." : undefined} onSelect={onModelSelection} onManualSelect={onModelManual} />
              {vehicleFieldModes.model === "manual" && renderManualInput("car-model-manual", "Enter Model", carDetails.model, manualModelRef, onManualModelChange, carDetailsErrors.model)}
            </div>

            <div>
              <ReusableSearchableCombobox id="car-variant" label="Variant (Optional)" placeholder={!carDetails.model ? "Select a model first" : "Search variants"} selectedValue={vehicleFieldModes.variant === "manual" ? "" : carDetails.variant} options={!usesManualYear && vehicleFieldModes.make === "catalog" && vehicleFieldModes.model === "catalog" ? getVariants(carDetails.make, carDetails.model, Number(carDetails.year)) : []} disabled={!carDetails.year || !carDetails.make || !carDetails.model} isLoading={catalogLoading.variant} disabledMessage={!carDetails.model ? "Select or enter a model first." : undefined} onSelect={onVariantSelection} onManualSelect={onVariantManual} />
              {vehicleFieldModes.variant === "manual" && renderManualInput("car-variant-manual", "Enter Variant (Optional)", carDetails.variant, manualVariantRef, (value) => onCarDetailsChange("variant", value), undefined, true)}
            </div>

            <div>
              <label htmlFor="car-mileage" className="text-sm font-medium text-[var(--text-primary)]">Mileage</label>
              <div className="relative"><input id="car-mileage" ref={(element) => { carFields.mileage = element }} type="number" inputMode="numeric" min="0" required placeholder="45,000" value={carDetails.mileage} onChange={(event) => onCarDetailsChange("mileage", event.target.value)} aria-invalid={Boolean(carDetailsErrors.mileage)} aria-describedby={carDetailsErrors.mileage ? "car-mileage-error" : undefined} className={`${formFieldClass} pr-11`} /><span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-sm text-[var(--text-secondary)]">km</span></div>
              <FieldError id="car-mileage-error" error={carDetailsErrors.mileage} />
            </div>

            {([
              ["transmission", "Transmission", ["Automatic", "Manual", "CVT", "DCT", "Other"]],
              ["fuelType", "Fuel Type", ["Gasoline", "Diesel", "Hybrid", "Electric", "Other"]],
              ["condition", "Vehicle Condition", ["Excellent", "Good", "Fair", "Needs Repair"]],
            ] as const).map(([field, label, options]) => (
              <div key={field}>
                <label htmlFor={`car-${field}`} className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
                <select id={`car-${field}`} ref={(element) => { carFields[field] = element }} value={carDetails[field]} required onChange={(event) => onCarDetailsChange(field, event.target.value)} aria-invalid={Boolean(carDetailsErrors[field])} aria-describedby={carDetailsErrors[field] ? `car-${field}-error` : undefined} className={formFieldClass}>
                  <option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}
                </select>
                <FieldError id={`car-${field}-error`} error={carDetailsErrors[field]} />
              </div>
            ))}
          </section>
        )}

        {currentStep === 2 && (
          <section aria-label="Vehicle photos" className="mt-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)]/45 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="font-semibold text-[var(--text-primary)]">Vehicle Photos <span className="font-normal text-[var(--text-secondary)]">(Optional)</span></h4><p className="mt-1 text-sm text-[var(--text-secondary)]">Front · Rear · Side · Interior · Odometer</p></div><span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">{vehiclePhotos.length} of 8 photos</span></div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">Please do not upload IDs, OR/CR documents, or other sensitive personal information.</p>
              <label htmlFor="vehicle-photos" className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-white px-4 text-center transition-colors hover:border-[var(--primary)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
                <input ref={photoInputRef} id="vehicle-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPhotoSelection} className="sr-only" />
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-7 text-[var(--primary)]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0L8 8m4-4 4 4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></svg>
                <span className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Choose Photos</span>
                <span className="mt-1 text-xs text-[var(--text-secondary)]">JPG, PNG or WebP · Up to 8 photos · 5 MB each</span>
              </label>
            </div>
            {photoUploadErrors.length > 0 && <div role="alert" className="mt-3 space-y-1 text-xs text-red-700">{photoUploadErrors.map((error) => <p key={error}>{error}</p>)}</div>}
            {vehiclePhotos.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{vehiclePhotos.map((photo) => <div key={photo.id} className="flex min-w-0 gap-3 rounded-xl border border-[var(--border)] bg-white p-2"><div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--background-alt)]"><Image src={photo.previewUrl} alt={`Preview of ${photo.file.name}`} fill unoptimized draggable={false} className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[var(--text-primary)]">{photo.file.name}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{formatFileSize(photo.file.size)}</p><button type="button" onClick={() => onRemovePhoto(photo.id)} className="mt-2 min-h-7 text-xs font-medium text-[var(--primary)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">Remove<span className="sr-only"> {photo.file.name}</span></button></div></div>)}</div>}
          </section>
        )}

        {currentStep === 3 && (
          <section aria-label="Contact details" className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label htmlFor="contact-full-name" className="text-sm font-medium text-[var(--text-primary)]">Full Name</label><input id="contact-full-name" ref={(element) => { contactFields.fullName = element }} type="text" autoComplete="name" required value={contactDetails.fullName} onChange={(event) => onContactDetailsChange("fullName", event.target.value)} aria-invalid={Boolean(contactDetailsErrors.fullName)} aria-describedby={contactDetailsErrors.fullName ? "contact-full-name-error" : undefined} className={formFieldClass} /><FieldError id="contact-full-name-error" error={contactDetailsErrors.fullName} /></div>
            <div><label htmlFor="contact-mobile-number" className="text-sm font-medium text-[var(--text-primary)]">Mobile Number</label><input id="contact-mobile-number" ref={(element) => { contactFields.mobileNumber = element }} type="tel" inputMode="tel" autoComplete="tel" required placeholder="09XX XXX XXXX" value={contactDetails.mobileNumber} onChange={(event) => onContactDetailsChange("mobileNumber", event.target.value)} aria-invalid={Boolean(contactDetailsErrors.mobileNumber)} aria-describedby={contactDetailsErrors.mobileNumber ? "contact-mobile-number-error" : undefined} className={formFieldClass} /><FieldError id="contact-mobile-number-error" error={contactDetailsErrors.mobileNumber} /></div>
            <div><label htmlFor="contact-city" className="text-sm font-medium text-[var(--text-primary)]">City / Municipality</label><input id="contact-city" ref={(element) => { contactFields.city = element }} type="text" autoComplete="address-level2" required value={contactDetails.city} onChange={(event) => onContactDetailsChange("city", event.target.value)} aria-invalid={Boolean(contactDetailsErrors.city)} aria-describedby={contactDetailsErrors.city ? "contact-city-error" : undefined} className={formFieldClass} /><FieldError id="contact-city-error" error={contactDetailsErrors.city} /></div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)] sm:col-span-2">Your contact details are used for this inquiry and are not stored in the browser draft.</p>
          </section>
        )}

        {currentStep === 4 && (
          <section aria-label="Review submission" className="mt-5 space-y-4">
            <ReviewGroup title="Vehicle" onEdit={() => onEditStep(1)}>
              <ReviewItem label="Year" value={carDetails.year} /><ReviewItem label="Make" value={carDetails.make} />
              <ReviewItem label="Model" value={carDetails.model} /><ReviewItem label="Variant" value={carDetails.variant} />
              <ReviewItem label="Mileage" value={carDetails.mileage ? `${Number(carDetails.mileage).toLocaleString("en-PH")} km` : ""} /><ReviewItem label="Transmission" value={carDetails.transmission} />
              <ReviewItem label="Fuel Type" value={carDetails.fuelType} /><ReviewItem label="Condition" value={carDetails.condition} />
            </ReviewGroup>
            <ReviewGroup title="Photos" onEdit={() => onEditStep(2)}><ReviewItem label="Uploaded" value={`${vehiclePhotos.length} photo${vehiclePhotos.length === 1 ? "" : "s"}`} /></ReviewGroup>
            <ReviewGroup title="Contact" onEdit={() => onEditStep(3)}><ReviewItem label="Full Name" value={contactDetails.fullName} /><ReviewItem label="Mobile Number" value={contactDetails.mobileNumber} /><ReviewItem label="City / Municipality" value={contactDetails.city} /></ReviewGroup>
            <div className="rounded-2xl border border-[var(--border)] p-4">
              <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-primary)]"><input ref={privacyConsentRef} type="checkbox" checked={privacyConsent} onChange={(event) => onPrivacyConsentChange(event.target.checked)} aria-invalid={Boolean(privacyConsentError)} aria-describedby={privacyConsentError ? "privacy-consent-error" : undefined} className="mt-0.5 size-5 shrink-0 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" /><span>I agree to the <span className="font-medium text-[var(--primary)] underline underline-offset-2">Privacy Policy</span> and consent to being contacted about my vehicle inquiry.</span></label>
              <FieldError id="privacy-consent-error" error={privacyConsentError} />
            </div>
          </section>
        )}

        {submitStatus === "error" && <p ref={submissionErrorRef} tabIndex={-1} role="alert" className="mt-5 text-sm text-red-700">{submissionError}</p>}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
          {currentStep === 1 ? <button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button> : <button type="button" onClick={onBack} disabled={submitStatus === "submitting"} className={secondaryButtonClass}>Back</button>}
          {currentStep < 4 ? <Button type="button" onClick={onNext} className={primaryButtonClass}>{currentStep === 3 ? "Review Details" : "Next"}</Button> : <Button type="submit" disabled={submitStatus === "submitting"} className={primaryButtonClass}>{submitStatus === "submitting" ? <><span aria-hidden="true" className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />Submitting…</> : "Get My Offer"}</Button>}
        </div>
      </form>
    </>
  )
}
