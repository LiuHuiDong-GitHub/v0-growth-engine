const base = process.env.BASE_URL || "http://localhost:3001"

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

  const me = await get("/api/v1/me", creatorCookie)
  assert(me.res.status === 200 && me.json.success, "/me should be ok")

  const list = await get("/api/v1/products/for-creator?limit=5&offset=0", creatorCookie)
  assert(list.res.status === 200 && list.json.success, "creator products list should be ok")
  assert(Array.isArray(list.json.data) && list.json.data.length > 0, "creator products list empty")

  const productId = list.json.data[0].id
  const detail = await get(`/api/v1/products/${productId}`, creatorCookie)
  assert(detail.res.status === 200 && detail.json.success, "product detail should be ok")

  const apply = await post("/api/v1/promotions/apply", { productId, selectedDate: "2026-02-01" }, creatorCookie)
  assert(
    (apply.res.status === 200 && apply.json.success) || apply.res.status === 409,
    "apply promotion should be ok or conflict",
  )

  const myProducts = await get("/api/v1/products?limit=5&offset=0", merchantCookie)
  assert(myProducts.res.status === 200 && myProducts.json.success, "merchant products should be ok")

  const promos = await get("/api/v1/promotions?limit=5&offset=0", merchantCookie)
  assert(promos.res.status === 200 && promos.json.success, "merchant promotions should be ok")
  if (Array.isArray(promos.json.data) && promos.json.data.length > 0) {
    const promotionId = promos.json.data[0].id
    const creatorForbidden = await get(`/api/v1/promotions/${promotionId}/brief`, creatorCookie)
    assert(
      creatorForbidden.res.status === 200 || creatorForbidden.res.status === 403,
      "creator brief should be own-access or forbidden",
    )
  }

  const creatorVideos = await get("/api/v1/creator/video-projects", creatorCookie)
  assert(creatorVideos.res.status === 200 && creatorVideos.json.success, "creator video-projects should be ok")

  const admin = await get("/api/v1/admin/overview", adminCookie)
  assert(admin.res.status === 200 && admin.json.success, "admin overview should be ok")

  const forbid = await get("/api/v1/admin/overview", creatorCookie)
  assert(forbid.res.status === 403, "creator should be forbidden for admin overview")

  // eslint-disable-next-line no-console
  console.log("REGRESSION_SMOKE_OK")
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("REGRESSION_SMOKE_FAILED:", e.message)
  process.exit(1)
})

