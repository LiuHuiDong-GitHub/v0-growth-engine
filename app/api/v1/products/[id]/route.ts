import { query } from "@/lib/server/db"
import { fail, ok, serverError } from "@/lib/server/http"

function toArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map(String)
      return value.split(",").map((v) => v.trim()).filter(Boolean)
    } catch {
      return value.split(",").map((v) => v.trim()).filter(Boolean)
    }
  }
  return []
}

function toAnyArray(value: unknown) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const productId = Number(id)
    if (Number.isNaN(productId)) return fail("无效产品ID", "VALIDATION_ERROR", 400)

    const rows = await query<
      {
        id: number
        name: string
        description: string | null
        full_description: string | null
        link: string | null
        contact_name: string | null
        contact_email: string | null
        contact_phone: string | null
        contact_website: string | null
        category_type: string | null
        category_keywords_json: string | null
        demo_video_url: string | null
        screenshots_json: string | null
        progress: string | null
        developer_deadline: string | null
        blogger_deadline: string | null
        pricing_type: string | null
        price: string | null
        original_price: string | null
        incentive_enabled: number
        base_reward: number
        bonus_targets_json: string | null
        applicants: number
        expected_reach: string | null
        target_audience: string | null
      }[]
    >("SELECT * FROM products WHERE id = :id LIMIT 1", { id: productId })
    if (!rows.length) return fail("产品不存在", "NOT_FOUND", 404)
    const p = rows[0]
    const docs = await query<{ id: number; name: string; size: string | null; icon: string | null }[]>(
      `
        SELECT id, name, size, icon
        FROM product_documents
        WHERE product_id = :productId
        ORDER BY id DESC
      `,
      { productId },
    )

    return ok({
      id: String(p.id),
      name: p.name,
      description: p.description || "",
      fullDescription: p.full_description || "",
      link: p.link || "",
      contact: {
        name: p.contact_name || "",
        email: p.contact_email || "",
        phone: p.contact_phone || "",
        website: p.contact_website || "",
      },
      category: {
        type: p.category_type || "",
        keywords: toArray(p.category_keywords_json),
      },
      attachments: {
        demoVideo: p.demo_video_url || "",
        screenshots: toArray(p.screenshots_json),
        documents: docs.map((d) => ({
          id: d.id,
          name: d.name,
          size: d.size || "0 MB",
          icon: d.icon || "📄",
        })),
      },
      progress: p.progress || "匹配中",
      timeline: {
        developerDeadline: p.developer_deadline,
        bloggerDeadline: p.blogger_deadline,
      },
      pricing: {
        type: p.pricing_type || "订阅制",
        price: p.price || "",
        originalPrice: p.original_price || "",
      },
      incentive: {
        enabled: Boolean(p.incentive_enabled),
        baseReward: p.base_reward || 0,
        bonusTargets: toAnyArray(p.bonus_targets_json),
      },
      stats: {
        applicants: p.applicants || 0,
        expectedReach: p.expected_reach || "",
        targetAudience: p.target_audience || "",
      },
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
