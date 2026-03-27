const base = process.env.BASE_URL || "http://127.0.0.1:3001"

async function post(path, body, cookie, headers = {}) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}), ...headers },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  return { res, json }
}

async function get(path, cookie) {
  const res = await fetch(base + path, {
    method: "GET",
    headers: { ...(cookie ? { cookie } : {}) },
    cache: "no-store",
  })
  const json = await res.json().catch(() => ({}))
  return { res, json }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

function getCookieFromSetCookie(headers) {
  const setCookie = headers.get("set-cookie") || ""
  const m = setCookie.match(/ge_token=[^;]+/)
  return m ? m[0] : ""
}

async function login(email) {
  await post("/api/v1/auth/send-login-code", { email })
  const v = await post("/api/v1/auth/verify-email", { email, code: "123456" })
  assert(v.res.ok && v.json.success, `login failed: ${email}`)
  const cookie = getCookieFromSetCookie(v.res.headers)
  assert(cookie, "missing auth cookie ge_token")
  return cookie
}

async function uploadDataUrl(dataUrl, filename, cookie) {
  const res = await fetch(base + "/api/v1/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify({ dataUrl, filename }),
  })
  const json = await res.json().catch(() => ({}))
  return { res, json }
}

function tinyPngDataUrl() {
  // 1x1 transparent png
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAOe8W0sAAAAASUVORK5CYII="
}

async function main() {
  const merchantCookie = await login("merchant@test.com")

  const up = await uploadDataUrl(tinyPngDataUrl(), "logo.png", merchantCookie)
  assert(up.res.status === 200 && up.json.success, "upload logo should be ok")
  const logoUrl = up.json.data.fileUrl
  assert(typeof logoUrl === "string" && logoUrl.startsWith("/uploads/"), "upload should return /uploads url")

  const name = `E2E产品-${Date.now()}`
  const create = await post(
    "/api/v1/products",
    {
      name,
      description: "e2e short desc",
      fullDescription: "e2e long desc",
      link: "https://example.com",
      logo: logoUrl,
      tags: ["E2E", "增长"],
      contactName: "E2E联系人",
      contactEmail: "e2e@example.com",
      contactPhone: "13800000000",
      baseReward: 100,
      bonusTargets: [{ views: 10000, bonus: 200 }],
      expectedPublishDate: "2026-04-01",
      agreed: true,
      documents: [],
      media: [{ type: "image", url: logoUrl, name: "screenshot.png" }],
    },
    merchantCookie,
  )
  assert(create.res.status === 200 && create.json.success, "create product should be ok")
  const productId = create.json.data.productId
  assert(productId, "create product should return productId")

  const list = await get("/api/v1/products?limit=50&offset=0", merchantCookie)
  assert(list.res.status === 200 && list.json.success, "merchant products list should be ok")
  assert(Array.isArray(list.json.data), "merchant products list data should be array")
  const found = list.json.data.find((p) => String(p.id) === String(productId) || p.name === name)
  assert(found, "new product should appear in merchant list")

  const detail = await get(`/api/v1/products/${productId}`, merchantCookie)
  assert(detail.res.status === 200 && detail.json.success, "product detail should be ok")

  // eslint-disable-next-line no-console
  console.log("E2E_MERCHANT_PUBLISH_OK")
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("E2E_MERCHANT_PUBLISH_FAILED:", e.message)
  process.exit(1)
})

