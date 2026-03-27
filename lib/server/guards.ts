import { getAuthUser } from "./auth"
import { fail } from "./http"

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    return { user: null, response: fail("请先登录", "UNAUTHORIZED", 401) }
  }
  return { user, response: null }
}

export async function requireRoles(roles: Array<"creator" | "merchant" | "admin">) {
  const auth = await requireAuth()
  if (!auth.user) return auth
  if (!roles.includes(auth.user.role)) {
    return { user: null, response: fail("无权限访问", "FORBIDDEN", 403) }
  }
  return auth
}
