import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

const getSupabasePublicConfiguration = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error("Missing Supabase public authentication configuration.")
  }

  return { url, anonKey }
}

const getSupabaseServiceConfiguration = () => {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration.")
  }

  return { url, serviceRoleKey }
}

export async function middleware(request: NextRequest) {
  const isAdminApiRequest = request.nextUrl.pathname.startsWith("/api/admin/")
  let response = NextResponse.next({ request })

  try {
    const { url, anonKey } = getSupabasePublicConfiguration()
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (request.nextUrl.pathname === "/admin/login") {
      if (user) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      return response
    }

    if (!user) {
      return isAdminApiRequest
        ? NextResponse.json({ success: false }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const { url: serviceUrl, serviceRoleKey } = getSupabaseServiceConfiguration()
    const serviceClient = createClient(serviceUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
    const { data: adminUser, error: adminUserError } = await serviceClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle()

    if (adminUserError || !adminUser) {
      return isAdminApiRequest
        ? NextResponse.json({ success: false }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return response
  } catch {
    return isAdminApiRequest
      ? NextResponse.json({ success: false }, { status: 401 })
      : new NextResponse("Admin authentication unavailable.", { status: 503 })
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
