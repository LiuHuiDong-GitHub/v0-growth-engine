import { NextRequest } from "next/server"
import { execute } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"
import { setAuthCookie, signToken } from "@/lib/server/auth"

const allowed = new Set(["creator", "merchant"] as const)
type AllowedRole = "creator" | "merchant"

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const body = await req.json()
    const role = String(body?.role ?? "").trim()
    if (!allowed.has(role as AllowedRole)) return fail("无效角色", "VALIDATION_ERROR", 400)
    if (auth.user!.role === "admin") return fail("管理员不可修改角色", "FORBIDDEN", 403)

    await execute("UPDATE users SET role = :role WHERE id = :id", {
      role,
      id: auth.user!.userId,
    })

    const token = signToken({
      userId: auth.user!.userId,
      email: auth.user!.email,
      role: role as AllowedRole,
    })
    await setAuthCookie(token)

    return ok({ role })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

