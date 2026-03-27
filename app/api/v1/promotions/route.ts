import { NextRequest } from "next/server"
import { query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRoles(["merchant", "admin"])
    if (auth.response) return auth.response

    const tab = req.nextUrl.searchParams.get("tab")
    const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit") || 40), 1), 100)
    const offset = Math.max(Number(req.nextUrl.searchParams.get("offset") || 0), 0)
    const filters: string[] = []
    const params: Record<string, unknown> = {}
    if (auth.user?.role !== "admin") {
      filters.push("pr.user_id = :userId")
      params.userId = auth.user!.userId
    }
    if (tab === "pending") filters.push("p.status IN ('pending','submitted')")
    if (tab === "published") filters.push("p.status = 'published'")
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

    const rows = await query<
      {
        id: number
        title: string
        platform: string | null
        status: string
        description: string | null
        views: number
        likes: number
        comments: number
        saves: number
        shares: number
      }[]
    >(
      `
      SELECT p.id, p.title, p.platform, p.status, p.description, p.views, p.likes, p.comments, p.saves, p.shares
      FROM promotions p
      JOIN products pr ON pr.id = p.product_id
      ${where}
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      params,
    )

    return ok(
      rows.map((row) => ({
        id: String(row.id),
        title: row.title,
        platform: row.platform || "YouTube",
        status: row.status === "published" ? "已发布" : "进行中",
        description: row.description || "",
        stats:
          row.status === "published"
            ? {
                views: row.views,
                likes: row.likes,
                comments: row.comments,
                saves: row.saves,
                shares: row.shares,
              }
            : undefined,
      })),
    )
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
