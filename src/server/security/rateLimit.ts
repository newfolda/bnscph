import "server-only"
import { createHash } from "node:crypto"
import { getSupabaseServerClient } from "../supabase/client"

const hashIdentifier = (value: string) => createHash("sha256").update(value).digest("hex")

export async function enforceRateLimit({ endpoint, identifier, limit, windowSeconds }: { endpoint: string; identifier: string; limit: number; windowSeconds: number }) {
  const key = hashIdentifier(`${endpoint}:${identifier}`)
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.rpc("consume_api_rate_limit", {
    p_endpoint: endpoint,
    p_key_hash: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  })

  if (error || data !== true) throw new Error("Rate limit unavailable or exceeded.")
}

export const getClientAddress = (headers: Headers) =>
  headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
