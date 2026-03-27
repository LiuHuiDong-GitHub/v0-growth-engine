"use client"

import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import { apiGet, apiPost } from "@/lib/api-client"

export default function SettingsPage() {
  const [me, setMe] = useState<{ name: string; email: string; role: string } | null>(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    apiGet<{ name: string; email: string; role: string }>("/api/v1/me")
      .then((u) => {
        setMe(u)
        setName(u.name || "")
      })
      .catch((e) => setError(e instanceof Error ? e.message : "加载失败"))
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    setError("")
    setInfo("")
    try {
      const r = await apiPost<{ name: string }>("/api/v1/me/update-profile", { name })
      setMe((prev) => (prev ? { ...prev, name: r.name } : prev))
      setInfo("已保存")
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    setSaving(true)
    setError("")
    setInfo("")
    try {
      await apiPost("/api/v1/me/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setInfo("密码已更新")
    } catch (e) {
      setError(e instanceof Error ? e.message : "修改失败")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="container mx-auto px-4 pt-20 pb-10 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">设置</h1>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
          <h2 className="font-semibold text-slate-900 mb-3">账户</h2>
          <div className="grid gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">邮箱</label>
              <div className="text-slate-900">{me?.email || "-"}</div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">角色</label>
              <div className="text-slate-900">{me?.role || "-"}</div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">姓名</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
              />
            </div>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              保存资料
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900 mb-3">修改密码</h2>
          <div className="grid gap-3">
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="当前密码"
            />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="新密码（至少6位）"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="确认新密码"
            />
            <button
              onClick={changePassword}
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-950 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              更新密码
            </button>
          </div>
        </div>

        {(error || info) && (
          <p className={`mt-4 text-sm ${error ? "text-red-600" : "text-slate-600"}`}>{error || info}</p>
        )}
      </main>
    </div>
  )
}

