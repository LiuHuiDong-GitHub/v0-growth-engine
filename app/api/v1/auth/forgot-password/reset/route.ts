import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { fail, ok, serverError } from "@/lib/server/http"
import bcrypt from "bcryptjs"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const method = String(body?.method ?? "")
    if (method !== "email" && method !== "phone") {
      return fail("method 不合法", "VALIDATION_ERROR", 400)
    }
    if (method === "phone") {
      return fail("本地MVP暂不支持手机号重置，请使用邮箱", "NOT_IMPLEMENTED", 501)
    }

    const email = String(body?.email ?? "").trim().toLowerCase()
    const code = String(body?.verificationCode ?? "").trim()
    const newPassword = String(body?.newPassword ?? "")
    const confirmPassword = String(body?.confirmPassword ?? "")

    if (!email || !code || !newPassword || !confirmPassword) {
      return fail("参数不完整", "VALIDATION_ERROR", 400)
    }
    if (!isValidEmail(email)) return fail("邮箱格式不正确", "VALIDATION_ERROR", 400)
    if (newPassword.length < 6) return fail("密码至少 6 位", "VALIDATION_ERROR", 400)
    if (newPassword !== confirmPassword) return fail("两次密码不一致", "VALIDATION_ERROR", 400)
    if (code !== "123456") return fail("验证码错误（本地联调请使用 123456）", "VALIDATION_ERROR", 400)

    const users = await query<{ id: number }[]>("SELECT id FROM users WHERE email = :email LIMIT 1", { email })
    if (!users.length) return fail("用户不存在", "NOT_FOUND", 404)

    await execute(
      `
      UPDATE verification_codes
      SET used_at = NOW()
      WHERE email = :email
        AND purpose = 'password_reset'
        AND code = :code
        AND used_at IS NULL
        AND expires_at > NOW()
      `,
      { email, code },
    )

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await execute("UPDATE users SET password_hash = :hash WHERE email = :email", {
      hash: passwordHash,
      email,
    })

    return ok({ message: "密码已重置，请返回登录" })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

