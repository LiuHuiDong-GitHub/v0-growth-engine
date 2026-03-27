import fs from "node:fs/promises"
import path from "node:path"
import autocannon from "autocannon"

const base = process.env.BASE_URL || "http://localhost:3001"
const slowMs = Number(process.env.SLOW_QUERY_MS || 120)

async function post(urlPath, body, cookie) {
  const res = await fetch(base + urlPath, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  return { res, json }
}

async function get(urlPath, cookie) {
  const res = await fetch(base + urlPath, {
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

function runAutocannon(opts) {
  return new Promise((resolve) => {
    const instance = autocannon(opts)
    autocannon.track(instance, { renderProgressBar: true })
    instance.on("done", resolve)
  })
}

function nowId() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

async function main() {
  const startedAt = new Date().toISOString()
  const creatorCookie = await login("creator@test.com")
  const merchantCookie = await login("merchant@test.com")
  const adminCookie = await login("admin@test.com")

  // reset slow query stats
  const reset = await post("/api/v1/admin/slow-queries", {}, adminCookie)
  assert(reset.res.status === 200, "reset slow-queries should be ok")

  // regression smoke (inline)
  const me = await get("/api/v1/me", creatorCookie)
  assert(me.res.status === 200 && me.json.success, "/me should be ok")

  const list = await get("/api/v1/products/for-creator?limit=5&offset=0", creatorCookie)
  assert(list.res.status === 200 && list.json.success, "creator products list should be ok")
  assert(Array.isArray(list.json.data) && list.json.data.length > 0, "creator products list empty")

  const productId = list.json.data[0].id
  const detail = await get(`/api/v1/products/${productId}`, creatorCookie)
  assert(detail.res.status === 200 && detail.json.success, "product detail should be ok")

  const apply = await post("/api/v1/promotions/apply", { productId, selectedDate: "2026-02-01" }, creatorCookie)
  assert((apply.res.status === 200 && apply.json.success) || apply.res.status === 409, "apply promotion should be ok or conflict")

  const myProducts = await get("/api/v1/products?limit=5&offset=0", merchantCookie)
  assert(myProducts.res.status === 200 && myProducts.json.success, "merchant products should be ok")

  const promos = await get("/api/v1/promotions?limit=5&offset=0", merchantCookie)
  assert(promos.res.status === 200 && promos.json.success, "merchant promotions should be ok")

  const admin = await get("/api/v1/admin/overview", adminCookie)
  assert(admin.res.status === 200 && admin.json.success, "admin overview should be ok")

  const forbid = await get("/api/v1/admin/overview", creatorCookie)
  assert(forbid.res.status === 403, "creator should be forbidden for admin overview")

  // perf: read
  const readTarget = `${base}/api/v1/products/for-creator`
  const readResult = await runAutocannon({
    url: readTarget,
    connections: 20,
    duration: 10,
    pipelining: 1,
    headers: { cookie: creatorCookie },
  })

  // perf: write
  const writeTarget = `${base}/api/v1/messages`
  const writeResult = await runAutocannon({
    url: writeTarget,
    method: "POST",
    connections: 10,
    duration: 10,
    headers: { "content-type": "application/json", cookie: creatorCookie },
    body: JSON.stringify({ text: "preflight write message", files: [] }),
  })

  const slow = await get(`/api/v1/admin/slow-queries?limit=50`, adminCookie)
  assert(slow.res.status === 200 && slow.json.success, "slow-queries should be ok")

  const readRps = readResult.requests?.average ?? 0
  const readP95 = readResult.latency?.p95 ?? readResult.latency?.p97_5 ?? null
  const writeRps = writeResult.requests?.average ?? 0
  const writeP95 = writeResult.latency?.p95 ?? writeResult.latency?.p97_5 ?? null

  // simple thresholds (local dev baseline)
  const thresholds = {
    read: { minRps: Number(process.env.PREFLIGHT_READ_MIN_RPS || 50), maxP95: Number(process.env.PREFLIGHT_READ_MAX_P95 || 650) },
    write: { minRps: Number(process.env.PREFLIGHT_WRITE_MIN_RPS || 20), maxP95: Number(process.env.PREFLIGHT_WRITE_MAX_P95 || 400) },
  }

  const readOk = readRps >= thresholds.read.minRps && (readP95 == null || readP95 <= thresholds.read.maxP95)
  const writeOk = writeRps >= thresholds.write.minRps && (writeP95 == null || writeP95 <= thresholds.write.maxP95)

  const reportId = nowId()
  const reportPath = path.join(process.cwd(), "docs", "reports", `preflight-${reportId}.md`)
  const md = `# GrowthEngine 本地上线前验收报告

- 生成时间：${new Date().toLocaleString("zh-CN")}
- BASE_URL：\`${base}\`
- SLOW_QUERY_MS：${slowMs}ms

## 一、回归冒烟（关键链路）

- 登录（creator/merchant/admin）：通过
- 核心接口：通过
- 权限越权校验（creator 访问 admin）：403（通过）

## 二、性能压测（autocannon）

> 注意：以下阈值为“本地开发机基线”，可通过环境变量调整。

### 2.1 读接口：GET /api/v1/products/for-creator

- RPS(avg)：${readRps}
- P95(ms)：${readP95 ?? "n/a"}
- 2xx：${readResult["2xx"] ?? "n/a"}
- non2xx：${readResult.non2xx ?? "n/a"}
- 判定：${readOk ? "PASS" : "FAIL"}
- 阈值：RPS >= ${thresholds.read.minRps} 且 P95 <= ${thresholds.read.maxP95}

### 2.2 写接口：POST /api/v1/messages

- RPS(avg)：${writeRps}
- P95(ms)：${writeP95 ?? "n/a"}
- 2xx：${writeResult["2xx"] ?? "n/a"}
- non2xx：${writeResult.non2xx ?? "n/a"}
- 判定：${writeOk ? "PASS" : "FAIL"}
- 阈值：RPS >= ${thresholds.write.minRps} 且 P95 <= ${thresholds.write.maxP95}

## 三、慢查询汇总（应用侧统计）

- 统计阈值：>= ${slow.json.data.thresholdMs}ms
- 统计开始：${slow.json.data.since}
- 指纹数量：${slow.json.data.totalFingerprints}

| maxMs | avgMs | count | lastMs | lastAt | sql |
| ---: | ---: | ---: | ---: | --- | --- |
${(slow.json.data.top || [])
  .map((x) => `| ${x.maxMs} | ${x.avgMs} | ${x.count} | ${x.lastMs} | ${x.lastAt} | \`${String(x.sql).replace(/`/g, "\\`")}\` |`)
  .join("\n")}

## 四、结论

- 回归：PASS
- 压测：${readOk && writeOk ? "PASS" : "FAIL"}
- 建议：如果慢查询表格中出现高频/高耗时 SQL，请优先为其 WHERE/JOIN 字段补索引，并在写压测下复测。
`

  await fs.writeFile(reportPath, md, "utf8")

  // eslint-disable-next-line no-console
  console.log("\nPREFLIGHT_OK")
  // eslint-disable-next-line no-console
  console.log("Report:", reportPath)
  // eslint-disable-next-line no-console
  console.log("Read PASS:", readOk, "Write PASS:", writeOk)
  // eslint-disable-next-line no-console
  console.log("Started:", startedAt)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("PREFLIGHT_FAILED:", e.message)
  process.exit(1)
})

