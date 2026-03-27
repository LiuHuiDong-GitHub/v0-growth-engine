"use client"

import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import { apiGet } from "@/lib/api-client"

type AdminOverview = {
  stats: { users: number; products: number; promotions: number; videos: number }
  users: Array<{ id: number; name: string; email: string; role: string; createdAt: string }>
}

export default function AdminPage() {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    apiGet<AdminOverview>("/api/v1/admin/overview")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <AppHeader />
      <main className="px-4 sm:px-6 md:px-8 py-6">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">管理员控制台</h1>
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        {!data && !error && <p className="text-sm text-slate-500">加载中...</p>}
        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard title="用户数" value={data.stats.users} />
              <StatCard title="产品数" value={data.stats.products} />
              <StatCard title="推广任务" value={data.stats.promotions} />
              <StatCard title="视频数" value={data.stats.videos} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-base font-semibold mb-3">最新用户</h2>
              <div className="space-y-2">
                {data.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-slate-500">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
