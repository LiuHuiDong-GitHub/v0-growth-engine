import { dumpSlowQueryStats, resetSlowQueryStats } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

export async function GET(req: Request) {
  try {
    const auth = await requireRoles(["admin"])
    if (auth.response) return auth.response

    const url = new URL(req.url)
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 200)
    return ok(dumpSlowQueryStats({ limit }))
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

export async function POST() {
  try {
    const auth = await requireRoles(["admin"])
    if (auth.response) return auth.response

    resetSlowQueryStats()
    return ok({ message: "ok" })
  } catch (e) {
    console.error(e)
    return serverError()
  }
}
