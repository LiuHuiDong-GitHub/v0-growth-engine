"use client"

import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import { apiGet, apiPost } from "@/lib/api-client"

type Notif = { id: number; title: string; message: string; time: string; unread: boolean }

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await apiGet<Notif[]>("/api/v1/notifications?limit=50&offset=0")
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markAllRead = async () => {
    setError("")
    try {
      await apiPost("/api/v1/notifications/mark-all-read", {})
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="container mx-auto px-4 pt-20 pb-10 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">通知</h1>
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            全部已读
          </button>
        </div>

        {loading ? (
          <div className="text-slate-500">加载中...</div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {items.length === 0 ? (
              <div className="p-6 text-slate-500">暂无通知</div>
            ) : (
              items.map((n) => (
                <div key={n.id} className={`p-4 border-b border-slate-100 ${n.unread ? "bg-blue-50/40" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-slate-900 truncate">{n.title}</div>
                        {n.unread && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                      </div>
                      <div className="text-sm text-slate-600 truncate">{n.message}</div>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">{n.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </main>
    </div>
  )
}

