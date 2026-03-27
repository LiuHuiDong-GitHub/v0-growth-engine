import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
import { fail, ok, serverError } from "@/lib/server/http"

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRoles(["creator", "admin"])
    if (auth.response) return auth.response

    const body = await req.json()
    const productId = Number(body?.productId)
    const selectedDate = String(body?.selectedDate ?? "")
    if (Number.isNaN(productId) || !selectedDate) {
      return fail("productId 和 selectedDate 为必填", "VALIDATION_ERROR", 400)
    }

    const products = await query<{ id: number; name: string }[]>(
      "SELECT id, name FROM products WHERE id = :id LIMIT 1",
      { id: productId },
    )
    if (!products.length) return fail("产品不存在", "NOT_FOUND", 404)
    const product = products[0]

    const [result] = await execute(
      `
      INSERT INTO promotions (
        product_id, creator_id, expected_publish_date, title, platform, status, description
      ) VALUES (
        :productId, :creatorId, :selectedDate, :title, 'YouTube', 'pending', '创作者已申请推广'
      )
    `,
      {
        productId,
        creatorId: auth.user!.userId,
        selectedDate,
        title: `${product.name} - 创作者推广`,
      },
    )

    return ok({ promotionId: String((result as { insertId: number }).insertId) })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
