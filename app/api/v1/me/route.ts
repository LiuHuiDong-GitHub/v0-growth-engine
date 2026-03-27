import { query } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const rows = await query<{
      id: number
      name: string
      email: string
      role: "creator" | "merchant" | "admin"
      avatar_url: string | null
    }[]>(
      "SELECT id, name, email, role, avatar_url FROM users WHERE id = :id LIMIT 1",
      { id: auth.user!.userId },
    )
    if (!rows.length) return fail("用户不存在", "NOT_FOUND", 404)

    return ok({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
      avatar: rows[0].avatar_url,
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
