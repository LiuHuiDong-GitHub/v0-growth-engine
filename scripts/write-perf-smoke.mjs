import autocannon from "autocannon"

const target = process.env.TARGET_URL || "http://localhost:3001/api/v1/messages"
const cookie = process.env.AUTH_COOKIE || ""

const payload = JSON.stringify({
  text: "write perf smoke message",
  files: [],
})

const instance = autocannon({
  url: target,
  method: "POST",
  connections: 10,
  duration: 10,
  headers: {
    "content-type": "application/json",
    cookie,
  },
  body: payload,
})

autocannon.track(instance, { renderProgressBar: true })

instance.on("done", (result) => {
  // eslint-disable-next-line no-console
  console.log("\n=== Write Performance Summary ===")
  // eslint-disable-next-line no-console
  console.log("Requests/sec:", result.requests.average)
  // eslint-disable-next-line no-console
  console.log("Errors:", result.errors, "Timeouts:", result.timeouts, "Non2xx:", result.non2xx)
})
