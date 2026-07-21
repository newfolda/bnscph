import { NextResponse } from "next/server"
import { scheduleInspection } from "@/src/server/sellCar/scheduleInspection"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/

export async function POST(
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

  const input = body as Record<string, unknown>

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !Object.keys(input).every((key) => ["scheduledAt", "location", "notes"].includes(key)) ||
    !("scheduledAt" in input) ||
    !("location" in input) ||
    typeof input.scheduledAt !== "string" ||
    typeof input.location !== "string" ||
    (input.notes !== undefined && typeof input.notes !== "string")
  ) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const scheduledAt = input.scheduledAt.trim()
  const location = input.location.trim()
  const notes = typeof input.notes === "string" ? input.notes.trim() : ""
  const scheduledTime = Date.parse(scheduledAt)

  if (
    !isoDateTimePattern.test(scheduledAt) ||
    !Number.isFinite(scheduledTime) ||
    scheduledTime <= Date.now() ||
    !location ||
    location.length > 200 ||
    notes.length > 1000
  ) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  try {
    const inspection = await scheduleInspection({
      leadId: id,
      scheduledAt,
      location,
      notes: notes || null,
    })

    return NextResponse.json({ success: true, inspection })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
