import Link from "next/link"
import { notFound } from "next/navigation"
import PurchasedCarEditor from "@/src/components/admin/PurchasedCarEditor"
import { getPurchasedCar } from "@/src/server/sellCar/purchasedCars"
export const dynamic = "force-dynamic"
export default async function PurchasedCarDetails({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const car = await getPurchasedCar(id); if (!car) notFound(); return <section><Link href="/admin/purchased-cars">← Back to Purchased Cars</Link><h1 className="mt-4 text-2xl font-bold">{car.referenceId}</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">{car.customer} · {car.vehicle}</p><PurchasedCarEditor car={car} /></section> }
