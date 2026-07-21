import { NextResponse, type NextRequest } from "next/server"

const unauthorizedResponse = () =>
  new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Buy & Sell Cars Philippines Admin"',
    },
  })

const constantTimeEquals = (first: string, second: string) => {
  const maxLength = Math.max(first.length, second.length)
  let difference = first.length ^ second.length

  for (let index = 0; index < maxLength; index += 1) {
    difference |= (first.charCodeAt(index) || 0) ^ (second.charCodeAt(index) || 0)
  }

  return difference === 0
}

const readBasicCredentials = (authorization: string | null) => {
  const match = authorization?.match(/^Basic\s+(.+)$/i)

  if (!match) return null

  try {
    const decoded = atob(match[1])
    const separatorIndex = decoded.indexOf(":")

    if (separatorIndex < 0) return null

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    }
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return unauthorizedResponse()
  }

  const credentials = readBasicCredentials(request.headers.get("authorization"))

  if (
    !credentials ||
    !constantTimeEquals(credentials.username, expectedUsername) ||
    !constantTimeEquals(credentials.password, expectedPassword)
  ) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
