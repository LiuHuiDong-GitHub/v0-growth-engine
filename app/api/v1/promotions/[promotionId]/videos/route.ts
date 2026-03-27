import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ promotionId: string }> },
) {
  try {
    const auth = await requireRoles(["creator", "admin"])
    if (auth.response) return auth.response

    const { promotionId } = await params
    const id = Number(promotionId)
    if (Number.isNaN(id)) return fail("无效任务ID", "VALIDATION_ERROR", 400)

    const body = await req.json()
    const videoItems = Array.isArray(body?.videoItems) ? body.videoItems : []
    if (!videoItems.length) return fail("videoItems 不能为空", "VALIDATION_ERROR", 400)

    const owners = await query<{ creator_id: number | null }[]>(
      "SELECT creator_id FROM promotions WHERE id = :id LIMIT 1",
      { id },
    )
    if (!owners.length) return fail("任务不存在", "NOT_FOUND", 404)
    if (auth.user?.role === "creator" && owners[0].creator_id !== auth.user.userId) {
      return fail("无权限提交该任务视频", "FORBIDDEN", 403)
    }

    for (const item of videoItems) {
      await execute(
        `
        INSERT INTO promotion_videos (
          promotion_id, title, platform, thumbnail_url, video_link, duration, progress,
          plays, likes, shares, comments, favorites, engagement_rate, conversion_rate, percentages_json
        ) VALUES (
          :promotionId, :title, 'YouTube', :thumbnail, :videoLink, '2:00', 15,
          0, 0, 0, 0, 0, '0%', '0%', CAST(:percentages AS JSON)
        )
      `,
        {
          promotionId: id,
          title: "新提交视频",
          thumbnail: item?.coverImageUrl || "/placeholder.jpg",
          videoLink: String(item?.videoLink ?? ""),
          percentages: JSON.stringify([0, 0, 0, 0, 0]),
        },
      )
    }

    await execute("UPDATE promotions SET status = 'submitted' WHERE id = :id", { id })

    return ok({ message: "提交成功" })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
