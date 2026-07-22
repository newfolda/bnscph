import { NextResponse } from "next/server"
import { inventoryStatuses, savePurchasedCar } from "@/src/server/sellCar/purchasedCars"
import { requireAdminUser } from "@/src/server/auth/requireAdminUser"
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdminUser() } catch { return NextResponse.json({ success: false }, { status: 401 }) }
  const { id } = await params
  if (!uuid.test(id)) return NextResponse.json({ success: false }, { status: 400 })
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ success: false }, { status: 400 }) }
  const price = body.purchasePrice === "" || body.purchasePrice === null ? null : Number(body.purchasePrice)
  const status = body.inventoryStatus
  if (!Number.isFinite(price ?? 0) || (price !== null && price < 0) || !inventoryStatuses.includes(status as never) || typeof body.purchaseDate !== "string" || typeof body.assignedStaff !== "string" || typeof body.notes !== "string") return NextResponse.json({ success: false }, { status: 400 })
  try { await savePurchasedCar(id, { purchasePrice: price, purchaseDate: body.purchaseDate || null, assignedStaff: body.assignedStaff.trim() || null, inventoryStatus: status as typeof inventoryStatuses[number], notes: body.notes.trim() || null }); return NextResponse.json({ success: true }) } catch { return NextResponse.json({ success: false }, { status: 500 }) }
}
