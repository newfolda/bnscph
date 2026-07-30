import { NextResponse } from "next/server"
import { requireAdminUser } from "@/src/server/auth/requireAdminUser"
import { deleteEligibleLead } from "@/src/server/sellCar/retention"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdminUser() } catch { return NextResponse.json({ success: false }, { status: 401 }) }
  const { id } = await params
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false }, { status: 400 })
  try { return NextResponse.json({ success: await deleteEligibleLead(id) }, { headers: { "Cache-Control": "no-store" } }) } catch { return NextResponse.json({ success: false }, { status: 500 }) }
}
