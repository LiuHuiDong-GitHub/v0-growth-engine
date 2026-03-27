import { NextRequest } from "next/server"
import { fail, ok, serverError } from "@/lib/server/http"
import path from "node:path"
import fs from "node:fs/promises"
import crypto from "node:crypto"

const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

function safeExt(filename: string) {
  const ext = path.extname(filename || "").toLowerCase()
  if (!ext || ext.length > 10) return ""
  return ext.replace(/[^.\w]/g, "")
}

function isAllowedMime(mime: string) {
  if (!mime) return false
  return (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime === "application/pdf" ||
    mime === "application/zip" ||
    mime === "application/octet-stream"
  )
}

async function ensureDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || ""

    // 1) multipart/form-data: file
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      const file = form.get("file")
      if (!(file instanceof File)) return fail("缺少 file 字段", "VALIDATION_ERROR", 400)
      if (file.size > MAX_BYTES) return fail("文件过大（最大10MB）", "VALIDATION_ERROR", 400)
      if (!isAllowedMime(file.type)) return fail("不支持的文件类型", "VALIDATION_ERROR", 400)

      const bytes = Buffer.from(await file.arrayBuffer())
      const ext = safeExt(file.name)
      const name = `${crypto.randomUUID()}${ext}`

      await ensureDir()
      await fs.writeFile(path.join(UPLOAD_DIR, name), bytes)

      return ok({
        fileUrl: `/uploads/${name}`,
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }

    // 2) JSON: dataUrl
    const body = await req.json().catch(() => null)
    const dataUrl = String(body?.dataUrl ?? "")
    const filename = String(body?.filename ?? "upload.png")
    if (!dataUrl.startsWith("data:")) return fail("缺少 dataUrl", "VALIDATION_ERROR", 400)

    const comma = dataUrl.indexOf(",")
    if (comma < 0) return fail("无效 dataUrl", "VALIDATION_ERROR", 400)
    const meta = dataUrl.slice(0, comma)
    const base64 = dataUrl.slice(comma + 1)
    const buf = Buffer.from(base64, "base64")
    if (buf.length > MAX_BYTES) return fail("文件过大（最大10MB）", "VALIDATION_ERROR", 400)

    const mime = meta.slice(5).split(";")[0]
    if (!isAllowedMime(mime)) return fail("不支持的文件类型", "VALIDATION_ERROR", 400)

    const extFromMeta =
      meta.includes("image/png") ? ".png" :
      meta.includes("image/jpeg") ? ".jpg" :
      meta.includes("image/webp") ? ".webp" :
      meta.includes("application/pdf") ? ".pdf" :
      ""
    const ext = extFromMeta || safeExt(filename) || ".bin"
    const name = `${crypto.randomUUID()}${ext}`

    await ensureDir()
    await fs.writeFile(path.join(UPLOAD_DIR, name), buf)

    return ok({
      fileUrl: `/uploads/${name}`,
      name: filename,
      size: buf.length,
      type: mime,
    })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}

