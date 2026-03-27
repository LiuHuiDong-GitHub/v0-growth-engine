import { query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

function toArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map(String)
      return value.split(",").map((v) => v.trim()).filter(Boolean)
    } catch {
      return value.split(",").map((v) => v.trim()).filter(Boolean)
    }
  }
  return []
}

import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRoles(["creator", "admin"])
    if (auth.response) return auth.response

    const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit") || 20), 1), 50)
    const offset = Math.max(Number(req.nextUrl.searchParams.get("offset") || 0), 0)

    const rows = await query<
      {
        id: number
        name: string
        avatar_url: string | null
        description: string | null
        tags_json: string | null
      }[]
    >(
      `
      SELECT id, name, avatar_url, description, tags_json
      FROM products
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    )

    return ok(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        avatar: row.avatar_url || "/placeholder-logo.png",
        description: row.description || "",
        tags: toArray(row.tags_json),
      })),
    )
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
