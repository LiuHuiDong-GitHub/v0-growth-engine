import { execute } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

export async function POST() {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    await execute("UPDATE notifications SET unread = 0 WHERE user_id = :userId AND unread = 1", {
      userId: auth.user!.userId,
    })
    return ok({ message: "ok" })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

