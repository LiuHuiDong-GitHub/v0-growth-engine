import { query } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

function formatRelativeTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const rows = await query<
      {
        id: number
        title: string
        message: string
        unread: number
        created_at: Date
      }[]
    >(
      `
        SELECT id, title, message, unread, created_at
        FROM notifications
        WHERE user_id = :userId
        ORDER BY id DESC
        LIMIT 20
      `,
      { userId: auth.user!.userId },
    )

    return ok(
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        message: row.message,
        unread: Boolean(row.unread),
        time: formatRelativeTime(new Date(row.created_at)),
      })),
    )
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
