import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

function formatTime(input: Date) {
  return input.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit") || 50), 1), 100)
    const offset = Math.max(Number(req.nextUrl.searchParams.get("offset") || 0), 0)

    const rows = await query<
      {
        id: number
        type: "user" | "admin"
        avatar_url: string | null
        sender_name: string | null
        text: string | null
        created_at: Date
      }[]
    >(
      `
      SELECT id, type, avatar_url, sender_name, text, created_at
      FROM messages
      ORDER BY id ASC
      LIMIT ${limit} OFFSET ${offset}
    `,
    )

    const ids = rows.map((r) => r.id)
    const attachments = ids.length
      ? await query<
          {
            message_id: number
            name: string
            size: number | null
            type: string | null
          }[]
        >(
          `
          SELECT message_id, name, size, type
          FROM message_attachments
          WHERE message_id IN (${ids.join(",")})
        `,
        )
      : []

    return ok(
      rows.map((row) => ({
        id: row.id,
        type: row.type,
        avatar: row.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        name: row.sender_name || undefined,
        text: row.text || undefined,
        time: formatTime(new Date(row.created_at)),
        files: attachments
          .filter((a) => a.message_id === row.id)
          .map((a) => ({
            name: a.name,
            size: a.size || 0,
            type: a.type || "application/octet-stream",
          })),
      })),
    )
  } catch (error) {
    console.error(error)
    return serverError()
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response
    const body = await req.json()
    const text = String(body?.text ?? "").trim()
    const files = Array.isArray(body?.files) ? body.files : []
    if (!text && !files.length) return fail("消息或附件至少一个", "VALIDATION_ERROR", 400)

    const [insert] = await execute(
      `
      INSERT INTO messages (user_id, type, avatar_url, sender_name, text)
      VALUES (:userId, 'user', :avatarUrl, NULL, :text)
    `,
      {
        userId: auth.user!.userId,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user-${auth.user!.userId}`,
        text: text || null,
      },
    )

    const messageId = (insert as { insertId: number }).insertId
    for (const f of files) {
      await execute(
        `
          INSERT INTO message_attachments (message_id, name, size, type, file_url)
          VALUES (:messageId, :name, :size, :type, :fileUrl)
        `,
        {
          messageId,
          name: String(f?.name ?? "附件"),
          size: Number(f?.size ?? 0),
          type: String(f?.type ?? "application/octet-stream"),
          fileUrl: String(f?.fileUrl ?? ""),
        },
      )
    }

    return ok({
      messageId,
      message: {
        id: messageId,
        type: "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user-${auth.user!.userId}`,
        text: text || undefined,
        time: formatTime(new Date()),
        files: files.map((f) => ({
          name: String(f?.name ?? "附件"),
          size: Number(f?.size ?? 0),
          type: String(f?.type ?? "application/octet-stream"),
        })),
      },
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
