import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { fail, ok, serverError } from "@/lib/server/http"
import { setAuthCookie, signToken } from "@/lib/server/auth"
import bcrypt from "bcryptjs"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body?.email ?? "").trim().toLowerCase()
    const password = String(body?.password ?? "")
    if (!email || !password) return fail("邮箱和密码不能为空", "VALIDATION_ERROR", 400)
    if (!isValidEmail(email)) return fail("邮箱格式不正确", "VALIDATION_ERROR", 400)
    if (password.length < 6) return fail("密码至少 6 位", "VALIDATION_ERROR", 400)

    const existing = await query<{ id: number }[]>("SELECT id FROM users WHERE email = :email LIMIT 1", { email })
    if (existing.length) return fail("邮箱已注册，请直接登录", "CONFLICT", 409)

    const passwordHash = await bcrypt.hash(password, 10)
    const name = String(body?.name ?? "").trim() || "新用户"

    const [res] = await execute(
      `
        INSERT INTO users (name, email, password_hash, role, avatar_url)
        VALUES (:name, :email, :passwordHash, 'merchant', :avatarUrl)
      `,
      {
        name,
        email,
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user-${encodeURIComponent(email)}`,
      },
    )

    const userId = (res as { insertId: number }).insertId
    const token = signToken({ userId, email, role: "merchant" })
    await setAuthCookie(token)

    return ok({
      token,
      user: { id: userId, email, role: "merchant", name },
    })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

