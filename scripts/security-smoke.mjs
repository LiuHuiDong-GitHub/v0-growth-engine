const base = process.env.BASE_URL || "http://127.0.0.1:3001"

async function post(path, body, cookie) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
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

async function main() {
  const creatorCookie = await login("creator@test.com")
  const merchantCookie = await login("merchant@test.com")
  const adminCookie = await login("admin@test.com")

  const cAdmin = await get("/api/v1/admin/overview", creatorCookie)
  assert(cAdmin.res.status === 403, "creator must be forbidden for /admin/overview")

  const mCreatorVideos = await get("/api/v1/creator/video-projects", merchantCookie)
  assert(mCreatorVideos.res.status === 403, "merchant must be forbidden for /creator/video-projects")

  const cProducts = await get("/api/v1/products/for-creator?limit=1&offset=0", creatorCookie)
  assert(cProducts.res.status === 200 && cProducts.json.success, "creator product list should be ok")
  assert(Array.isArray(cProducts.json.data) && cProducts.json.data.length > 0, "creator product list should not be empty")
  const productId = cProducts.json.data[0].id

  const apply = await post("/api/v1/promotions/apply", { productId, selectedDate: "2026-03-28" }, creatorCookie)
  assert(apply.res.status === 200 && apply.json.success, "creator apply promotion should be idempotent success")
  const promotionId = apply.json.data?.promotionId
  assert(promotionId, "apply promotion should return promotionId")

  const mBrief = await get(`/api/v1/promotions/${promotionId}/brief`, merchantCookie)
  assert(mBrief.res.status === 403, "merchant must be forbidden for creator brief endpoint")

  const mSubmitVideo = await post(
    `/api/v1/promotions/${promotionId}/videos`,
    { videoItems: [{ videoLink: "https://www.youtube.com/watch?v=security-smoke" }] },
    merchantCookie,
  )
  assert(mSubmitVideo.res.status === 403, "merchant must be forbidden for creator video submit")

  const cPromotions = await get("/api/v1/promotions?tab=pending&limit=5&offset=0", creatorCookie)
  assert(cPromotions.res.status === 200 && cPromotions.json.success, "creator promotions list should be accessible")

  const aPromotions = await get("/api/v1/promotions?tab=pending&limit=5&offset=0", adminCookie)
  assert(aPromotions.res.status === 200 && aPromotions.json.success, "admin promotions list should be accessible")

  // eslint-disable-next-line no-console
  console.log("SECURITY_SMOKE_OK")
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("SECURITY_SMOKE_FAILED:", e.message)
  process.exit(1)
})

