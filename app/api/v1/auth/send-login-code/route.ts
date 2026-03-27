import { NextRequest } from "next/server"
import { query, execute } from "@/lib/server/db"
import { fail, ok, serverError } from "@/lib/server/http"

const requestBuckets = new Map<string, number>()
const WINDOW_MS = 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body?.email ?? "").trim().toLowerCase()
    if (!email) return fail("邮箱不能为空", "VALIDATION_ERROR", 400)
    const now = Date.now()
    const lastAt = requestBuckets.get(email) ?? 0
    if (now - lastAt < WINDOW_MS) {
      return fail("请求过于频繁，请1分钟后重试", "RATE_LIMIT", 429)
    }
    requestBuckets.set(email, now)

    const users = await query("SELECT id FROM users WHERE email = :email LIMIT 1", {
      email,
    })
    if (!users.length) {
      return fail(
        "测试账号不存在，请使用 creator@test.com / merchant@test.com / admin@test.com",
        "NOT_FOUND",
        404,
      )
    }

    await execute(
      `
        INSERT INTO verification_codes (email, code, purpose, expires_at)
        VALUES (:email, '123456', 'login', DATE_ADD(NOW(), INTERVAL 10 MINUTE))
      `,
      { email },
    )

    return ok({
      message: "验证码已发送（本地联调固定为 123456）",
      dev_code: "123456",
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
