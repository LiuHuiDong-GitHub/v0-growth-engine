import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.response) return auth.response

    const body = await req.json()
    const currentPassword = String(body?.currentPassword ?? "")
    const newPassword = String(body?.newPassword ?? "")
    const confirmPassword = String(body?.confirmPassword ?? "")
    if (!currentPassword || !newPassword || !confirmPassword) return fail("参数不完整", "VALIDATION_ERROR", 400)
    if (newPassword.length < 6) return fail("密码至少 6 位", "VALIDATION_ERROR", 400)
    if (newPassword !== confirmPassword) return fail("两次密码不一致", "VALIDATION_ERROR", 400)

    const rows = await query<{ password_hash: string }[]>(
      "SELECT password_hash FROM users WHERE id = :id LIMIT 1",
      { id: auth.user!.userId },
    )
    if (!rows.length) return fail("用户不存在", "NOT_FOUND", 404)

    const okPwd = await bcrypt.compare(currentPassword, rows[0].password_hash)
    if (!okPwd) return fail("当前密码不正确", "VALIDATION_ERROR", 400)

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await execute("UPDATE users SET password_hash = :hash WHERE id = :id", {
      hash: passwordHash,
      id: auth.user!.userId,
    })

    return ok({ message: "ok" })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

