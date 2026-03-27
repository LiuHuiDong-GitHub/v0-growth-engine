import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { fail, ok, serverError } from "@/lib/server/http"

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
    if (!email) return fail("邮箱不能为空", "VALIDATION_ERROR", 400)
    if (!isValidEmail(email)) return fail("邮箱格式不正确", "VALIDATION_ERROR", 400)

    const users = await query<{ id: number }[]>("SELECT id FROM users WHERE email = :email LIMIT 1", { email })
    if (!users.length) return fail("用户不存在", "NOT_FOUND", 404)

    await execute(
      `
        INSERT INTO verification_codes (email, code, purpose, expires_at)
        VALUES (:email, '123456', 'password_reset', DATE_ADD(NOW(), INTERVAL 10 MINUTE))
      `,
      { email },
    )

    return ok({ message: "验证码已发送（本地联调固定为 123456）", dev_code: "123456" })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

