export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  })
  const data = await res.json()
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "请求失败")
  }
  return data.data as T
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "请求失败")
  }
  return data.data as T
}
