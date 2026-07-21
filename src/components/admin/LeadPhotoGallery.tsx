"use client"

import { useState } from "react"
import Image from "next/image"
import type { SellCarLeadPhoto } from "@/src/server/sellCar/getLeadPhotos"

type LeadPhotoGalleryProps = {
  photos: SellCarLeadPhoto[]
}

export default function LeadPhotoGallery({ photos }: LeadPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<SellCarLeadPhoto | null>(null)

  return (
    <article className="mt-5 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
      <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Vehicle Photos</h2>

      {photos.length === 0 ? (
        <p className="mt-5 text-sm text-[var(--text-secondary)]">No vehicle photos uploaded.</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[#f7f6f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Image
                src={photo.signedUrl}
                alt={`Vehicle photo ${index + 1}`}
                width={600}
                height={600}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-200 motion-safe:group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            </button>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vehicle photo preview"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              Close
            </button>
            <Image
              src={selectedPhoto.signedUrl}
              alt="Full-size vehicle photo"
              width={1600}
              height={1200}
              unoptimized
              className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </article>
  )
}
