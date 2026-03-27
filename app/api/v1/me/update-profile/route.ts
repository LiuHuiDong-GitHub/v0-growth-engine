import { NextRequest } from "next/server"
import { execute } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const body = await req.json()
    const name = String(body?.name ?? "").trim()
    if (!name) return fail("姓名不能为空", "VALIDATION_ERROR", 400)
    if (name.length > 120) return fail("姓名过长", "VALIDATION_ERROR", 400)

    await execute("UPDATE users SET name = :name WHERE id = :id", {
      name,
      id: auth.user!.userId,
    })
    return ok({ name })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

