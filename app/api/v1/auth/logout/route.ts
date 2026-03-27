import { clearAuthCookie } from "@/lib/server/auth"
import { ok, serverError } from "@/lib/server/http"

export async function POST() {
  try {
    await clearAuthCookie()
    return ok({ message: "已退出登录" })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
