import { query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

function formatNumber(num: number) {
  return num.toLocaleString("en-US")
}

export async function GET() {
  try {
    const auth = await requireRoles(["creator", "admin"])
    if (auth.response) return auth.response

    const rows = await query<
      {
        id: number
        title: string | null
        duration: string | null
        thumbnail_url: string | null
        video_link: string | null
        progress: number
        plays: number
        likes: number
        shares: number
        comments: number
        favorites: number
        percentages_json: string | null
      }[]
    >(
      `
      SELECT pv.id, pv.title, pv.duration, pv.thumbnail_url, pv.video_link, pv.progress,
             pv.plays, pv.likes, pv.shares, pv.comments, pv.favorites, pv.percentages_json
      FROM promotion_videos pv
      JOIN promotions p ON p.id = pv.promotion_id
      WHERE p.creator_id = :creatorId
      ORDER BY pv.id DESC
      LIMIT 20
    `,
      { creatorId: auth.user!.userId },
    )

    return ok(
      rows.map((row) => ({
        id: String(row.id),
        title: row.title || "视频项目",
        duration: row.duration || "0:00",
        thumbnail: row.thumbnail_url || "/placeholder.jpg",
        videoLink: row.video_link || "",
        progress: row.progress || 0,
        metrics: {
          plays: formatNumber(row.plays || 0),
          likes: formatNumber(row.likes || 0),
          shares: formatNumber(row.shares || 0),
          comments: formatNumber(row.comments || 0),
          favorites: formatNumber(row.favorites || 0),
          percentages: row.percentages_json
            ? JSON.parse(row.percentages_json)
            : [0, 0, 0, 0, 0],
        },
      })),
    )
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
