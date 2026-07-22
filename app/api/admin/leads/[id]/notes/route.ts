import { NextResponse } from "next/server"
import { requireAdminUser } from "@/src/server/auth/requireAdminUser"
import { addLeadNote } from "@/src/server/sellCar/addLeadNote"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminUser()
  } catch {
    return NextResponse.json({ success: false }, { status: 401 })
  }

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
    !("note" in body) ||
    typeof body.note !== "string"
  ) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const note = body.note.trim()

  if (note.length < 2 || note.length > 2000) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  try {
    const createdNote = await addLeadNote({ leadId: id, note })

    return NextResponse.json({ success: true, note: createdNote })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
