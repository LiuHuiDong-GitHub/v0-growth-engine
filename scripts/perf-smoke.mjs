import autocannon from "autocannon"

const target = process.env.TARGET_URL || "http://localhost:3001/api/v1/products/for-creator"

const instance = autocannon({
  url: target,
  connections: 20,
  duration: 10,
  pipelining: 1,
  headers: {
    cookie: process.env.AUTH_COOKIE || "",
  },
})

autocannon.track(instance, { renderProgressBar: true })

instance.on("done", (result) => {
  // eslint-disable-next-line no-console
  console.log("\n=== Performance Summary ===")
  // eslint-disable-next-line no-console
  console.log("Requests/sec:", result.requests.average)
  // eslint-disable-next-line no-console
  console.log("Latency p95(ms):", result.latency?.p95 ?? result.latency?.p97_5 ?? "n/a")
  // eslint-disable-next-line no-console
  console.log("2xx:", result["2xx"])
  // eslint-disable-next-line no-console
  console.log("Non-2xx:", result.non2xx)
})
