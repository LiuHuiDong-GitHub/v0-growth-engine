import { query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ promotionId: string }> },
) {
  try {
    const auth = await requireRoles(["creator", "admin"])
    if (auth.response) return auth.response

    const { promotionId } = await params
    const id = Number(promotionId)
    if (Number.isNaN(id)) return fail("无效任务ID", "VALIDATION_ERROR", 400)

    const rows = await query<
      {
        pid: number
        product_name: string
        logo: string | null
        tags: string | null
      }[]
    >(
      `
      SELECT p.id AS pid, pr.name AS product_name, pr.avatar_url AS logo, pr.tags_json AS tags
      FROM promotions p
      JOIN products pr ON pr.id = p.product_id
      WHERE p.id = :id
      LIMIT 1
    `,
      { id },
    )
    if (!rows.length) return fail("任务不存在", "NOT_FOUND", 404)

    const row = rows[0]
    return ok({
      id: String(row.pid),
      name: row.product_name,
      logoUrl: row.logo || "/placeholder-logo.png",
      tags: toArray(row.tags),
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
