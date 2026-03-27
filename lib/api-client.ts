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

export async function apiUploadFile(file: File): Promise<{
  fileUrl: string
  name: string
  size: number
  type: string
}> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch("/api/v1/uploads", {
    method: "POST",
    credentials: "include",
    body: form,
  })
  const data = await res.json()
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "上传失败")
  }
  return data.data
}

export async function apiUploadDataUrl(
  dataUrl: string,
  filename: string,
): Promise<{ fileUrl: string }> {
  const res = await fetch("/api/v1/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ dataUrl, filename }),
  })
  const data = await res.json()
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "上传失败")
  }
  return data.data
}
