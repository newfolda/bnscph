import "server-only"
import { createSupabaseServerClient } from "@/src/lib/supabase/server"
import { getSupabaseServerClient } from "@/src/server/supabase/client"

export type AdminUser = {
  userId: string
  email: string
  role: "admin" | "staff"
}

export class AdminAuthenticationError extends Error {
  constructor() {
    super("Unauthorized admin request.")
  }
}

export async function requireAdminUser(): Promise<AdminUser> {
  const sessionClient = await createSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser()

  if (userError || !user?.email) {
    throw new AdminAuthenticationError()
  }

  const serviceClient = getSupabaseServerClient()
  const { data: adminUser, error: adminUserError } = await serviceClient
    .from("admin_users")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle()

  if (
    adminUserError ||
    !adminUser ||
    adminUser.is_active !== true ||
    (adminUser.role !== "admin" && adminUser.role !== "staff")
  ) {
    throw new AdminAuthenticationError()
  }

  return {
    userId: user.id,
    email: user.email,
    role: adminUser.role,
  }
}
