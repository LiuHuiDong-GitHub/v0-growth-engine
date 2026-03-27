import { query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { ok, serverError } from "@/lib/server/http"

export async function GET() {
  try {
    const auth = await requireRoles(["admin"])
    if (auth.response) return auth.response

    const [users] = await query<{ count: number }[]>("SELECT COUNT(*) AS count FROM users")
    const [products] = await query<{ count: number }[]>("SELECT COUNT(*) AS count FROM products")
    const [promotions] = await query<{ count: number }[]>("SELECT COUNT(*) AS count FROM promotions")
    const [videos] = await query<{ count: number }[]>("SELECT COUNT(*) AS count FROM promotion_videos")

    const latestUsers = await query<{ id: number; name: string; email: string; role: string; created_at: Date }[]>(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC LIMIT 20",
    )

    return ok({
      stats: {
        users: users[0]?.count ?? 0,
        products: products[0]?.count ?? 0,
        promotions: promotions[0]?.count ?? 0,
        videos: videos[0]?.count ?? 0,
      },
      users: latestUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.created_at,
      })),
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
