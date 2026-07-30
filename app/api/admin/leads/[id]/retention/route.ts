import { NextResponse } from "next/server"
import { requireAdminUser } from "@/src/server/auth/requireAdminUser"
import { updateLeadLegalHold } from "@/src/server/sellCar/retention"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdminUser() } catch { return NextResponse.json({ success: false }, { status: 401 }) }
  const { id } = await params
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false }, { status: 400 })
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length !== 1 || !("legalHold" in body) || typeof body.legalHold !== "boolean") return NextResponse.json({ success: false }, { status: 400 })
  try { await updateLeadLegalHold(id, body.legalHold); return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } }) } catch { return NextResponse.json({ success: false }, { status: 500 }) }
}
