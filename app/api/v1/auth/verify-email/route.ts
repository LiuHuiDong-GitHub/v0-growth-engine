import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { fail, ok, serverError } from "@/lib/server/http"
import { setAuthCookie, signToken } from "@/lib/server/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body?.email ?? "").trim().toLowerCase()
    const code = String(body?.code ?? "").trim()
    if (!email || !code) return fail("邮箱和验证码不能为空", "VALIDATION_ERROR", 400)

    if (code !== "123456") {
      return fail("验证码错误（本地联调请使用 123456）", "VALIDATION_ERROR", 400)
    }

    const users = await query<{
      id: number
      email: string
      role: "creator" | "merchant" | "admin"
      name: string
    }[]>("SELECT id, email, role, name FROM users WHERE email = :email LIMIT 1", { email })
    if (!users.length) return fail("用户不存在", "NOT_FOUND", 404)
    const user = users[0]

    await execute(
      `
        UPDATE verification_codes
        SET used_at = NOW()
        WHERE email = :email AND code = :code AND used_at IS NULL
      `,
      { email, code },
    )

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    await setAuthCookie(token)

    return ok({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
