import { NextRequest } from "next/server"
import { execute, query } from "@/lib/server/db"
import { requireRoles } from "@/lib/server/guards"
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

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRoles(["merchant", "admin"])
    if (auth.response) return auth.response

    const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit") || 20), 1), 50)
    const offset = Math.max(Number(req.nextUrl.searchParams.get("offset") || 0), 0)

    const rows = await query<
      {
        id: number
        name: string
        avatar_url: string | null
        description: string | null
        status: string
        tags_json: string | null
      }[]
    >(
      auth.user?.role === "admin"
        ? `
          SELECT id, name, avatar_url, description, status, tags_json
          FROM products
          ORDER BY id DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        : `
          SELECT id, name, avatar_url, description, status, tags_json
          FROM products
          WHERE user_id = :userId
          ORDER BY id DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
      auth.user?.role === "admin" ? undefined : { userId: auth.user!.userId },
    )

    return ok(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        avatar: row.avatar_url || "/placeholder-logo.png",
        description: row.description || "",
        status: row.status,
        tags: toArray(row.tags_json),
      })),
    )
  } catch (error) {
    console.error(error)
    return serverError()
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRoles(["merchant", "admin"])
    if (auth.response) return auth.response

    const body = await req.json()
    const name = String(body?.name ?? "").trim()
    const link = String(body?.link ?? "").trim()
    const fullDescription = String(body?.fullDescription ?? "").trim()
    if (!name || !link || !fullDescription) {
      return fail("name/link/fullDescription 为必填", "VALIDATION_ERROR", 400)
    }
    const agreed = Boolean(body?.agreed)
    if (!agreed) return fail("请先同意协议后再发布", "VALIDATION_ERROR", 400)
    if (!/^https?:\/\/|^www\./i.test(link)) {
      return fail("产品链接格式不正确", "VALIDATION_ERROR", 400)
    }

    const tags = Array.isArray(body?.tags) ? body.tags : []
    const bonusTargets = Array.isArray(body?.bonusTargets) ? body.bonusTargets : []
    const documents = Array.isArray(body?.documents) ? body.documents : []
    const media = Array.isArray(body?.media) ? body.media : []
    const screenshots = media
      .filter((m: { type?: string }) => m.type === "image")
      .map((m: { url: string }) => m.url)

    const [result] = await execute(
      `
        INSERT INTO products (
          user_id, name, description, full_description, link, avatar_url, tags_json,
          contact_name, contact_email, contact_phone, category_type, category_keywords_json,
          screenshots_json, pricing_type, price, original_price, incentive_enabled, base_reward,
          bonus_targets_json, status, expected_publish_date, progress
        )
        VALUES (
          :userId, :name, :description, :fullDescription, :link, :avatar, CAST(:tags AS JSON),
          :contactName, :contactEmail, :contactPhone, '效率工具', CAST(:categoryKeywords AS JSON),
          CAST(:screenshots AS JSON), '订阅制', '$9.9/月', '$19.9/月', 1, :baseReward,
          CAST(:bonusTargets AS JSON), 'matching', :expectedPublishDate, '匹配中'
        )
      `,
      {
        userId: auth.user!.userId,
        name,
        description: String(body?.description ?? "").trim(),
        fullDescription,
        link,
        avatar: String(body?.logo ?? "/placeholder-logo.png"),
        tags: JSON.stringify(tags),
        contactName: String(body?.contactName ?? ""),
        contactEmail: String(body?.contactEmail ?? ""),
        contactPhone: String(body?.contactPhone ?? ""),
        categoryKeywords: JSON.stringify(tags),
        screenshots: JSON.stringify(screenshots),
        baseReward: Number(body?.baseReward ?? 0),
        bonusTargets: JSON.stringify(bonusTargets),
        expectedPublishDate: body?.expectedPublishDate || null,
      },
    )

    const productId = (result as { insertId: number }).insertId

    for (const doc of documents) {
      await execute(
        `
          INSERT INTO product_documents (product_id, name, size, icon, file_path)
          VALUES (:productId, :name, :size, :icon, :filePath)
        `,
        {
          productId,
          name: String(doc?.name ?? "未命名文件"),
          size: String(doc?.size ?? "0 MB"),
          icon: "📄",
          filePath: String(doc?.url ?? ""),
        },
      )
    }

    return ok({ productId })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
