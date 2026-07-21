import { NextResponse } from "next/server"
import { isSellCarLeadStatus } from "@/src/server/sellCar/getRecentLeads"
import { updateLeadStatus } from "@/src/server/sellCar/updateLeadStatus"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!uuidPattern.test(id)) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    !("status" in body) ||
    !isSellCarLeadStatus(body.status)
  ) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  try {
    await updateLeadStatus(id, body.status)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
