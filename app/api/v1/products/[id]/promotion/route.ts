import { query } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const { id } = await params
    const pid = Number(id)
    if (Number.isNaN(pid)) return fail("无效产品ID", "VALIDATION_ERROR", 400)

    const url = new URL(req.url)
    const queryStatus = url.searchParams.get("status")
    const promotionRows = await query<
      {
        id: number
        title: string
        status: "pending" | "submitted" | "published"
        performance_level: string | null
        name: string
        creator_id: number | null
        owner_id: number
      }[]
    >(
      `
      SELECT p.id, p.title, p.status, p.performance_level, p.creator_id, pr.name, pr.user_id AS owner_id
      FROM promotions p
      JOIN products pr ON pr.id = p.product_id
      WHERE p.product_id = :productId
      ORDER BY p.id DESC
      LIMIT 1
    `,
      { productId: pid },
    )
    if (!promotionRows.length) return fail("未找到推广任务", "NOT_FOUND", 404)
    const promotion = promotionRows[0]
    if (auth.user?.role === "merchant" && promotion.owner_id !== auth.user.userId) {
      return fail("无权限访问该产品推广数据", "FORBIDDEN", 403)
    }
    if (auth.user?.role === "creator" && promotion.creator_id !== auth.user.userId) {
      return fail("无权限访问该产品推广数据", "FORBIDDEN", 403)
    }
    const videos = await query<
      {
        id: number
        title: string | null
        platform: string | null
        thumbnail_url: string | null
        plays: number
        engagement_rate: string | null
        conversion_rate: string | null
      }[]
    >(
      `
        SELECT id, title, platform, thumbnail_url, plays, engagement_rate, conversion_rate
        FROM promotion_videos
        WHERE promotion_id = :promotionId
        ORDER BY id DESC
      `,
      { promotionId: promotion.id },
    )

    const status = (queryStatus as "pending" | "submitted" | "published" | null) || promotion.status

    return ok({
      id: String(promotion.id),
      productName: promotion.name,
      title: promotion.title,
      status,
      progress: status === "submitted" ? 0.5 : status === "published" ? 1 : 0.75,
      performanceLevel: promotion.performance_level || "中",
      videos: videos.map((v) => ({
        id: String(v.id),
        title: v.title || "未命名视频",
        platform: v.platform || "YouTube",
        thumbnail: v.thumbnail_url || "/placeholder.jpg",
        stats: {
          views: v.plays > 1000000 ? `${(v.plays / 1000000).toFixed(1)}M` : `${Math.round(v.plays / 1000)}K`,
          engagementRate: v.engagement_rate || "0%",
          conversionRate: v.conversion_rate || "0%",
        },
      })),
      redditData: [],
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
