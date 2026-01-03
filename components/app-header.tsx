"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, Settings, MessageSquare, User, Shield, LogOut, Moon } from "lucide-react"

export default function AppHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const notifications = [
    { id: 1, title: "新项目申请", message: "云盘大师项目申请已提交", time: "5分钟前" },
    { id: 2, title: "审核通过", message: "您的博主资质已通过审核", time: "1小时前" },
    { id: 3, title: "系统通知", message: "平台将于今晚22:00进行维护", time: "3小时前" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-slate-400" />
            <span className="text-lg font-semibold text-slate-900">Dashboard</span>
          </div>

          <Link href="/" className="text-xl font-bold text-blue-600">
            GrowthEngine
          </Link>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-400 transition-colors hover:text-slate-600"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-white shadow-lg z-50">
                  <div className="border-b px-4 py-3">
                    <h3 className="font-semibold text-slate-900">通知</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="border-b px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <Bell className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-900">{notif.title}</h4>
                            <p className="text-xs text-slate-600">{notif.message}</p>
                            <p className="mt-1 text-xs text-slate-400">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t px-4 py-2 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700">查看所有通知</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 ring-2 ring-transparent transition-all hover:ring-blue-200"
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-white shadow-lg z-50">
                  <button
                    onClick={() => {
                      setShowSettingsModal(true)
                      setShowUserMenu(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <Link
                    href="/message-board"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>留言</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-[73px]" />

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowSettingsModal(false)}
        >
          <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-[600px]">
              {/* Sidebar */}
              <aside className="w-64 border-r bg-slate-50 p-6 rounded-l-2xl">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-600 bg-blue-50">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>仪表盘</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    <span>项目</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>浏览</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>推广者</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <User className="h-5 w-5" />
                    <span>我的推广</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <Settings className="h-5 w-5" />
                    <span>设置</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <MessageSquare className="h-5 w-5" />
                    <span>留言</span>
                  </button>
                </nav>
              </aside>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900">设置</h2>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Account Management */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">账号管理</h3>
                        <p className="text-sm text-slate-600">更新您的个人资料和密码</p>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Bell className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold text-slate-900">通知</h3>
                            <p className="text-sm text-slate-600">控制应用通知设置</p>
                          </div>
                          <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`relative h-7 w-12 rounded-full transition-colors ${
                              notificationsEnabled ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                                notificationsEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Verification */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Shield className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">数据验证</h3>
                        <p className="text-sm text-slate-600">管理您的连接和数据隐私</p>
                      </div>
                    </div>
                  </div>

                  {/* Theme Switch */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Moon className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold text-slate-900">主题切换</h3>
                            <p className="text-sm text-slate-600">切换应用浅色或深色模式</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setTheme("light")}
                              className={`rounded-lg px-3 py-1.5 text-sm ${
                                theme === "light" ? "bg-slate-200 text-slate-900" : "text-slate-600"
                              }`}
                            >
                              浅色
                            </button>
                            <button
                              onClick={() => setTheme("dark")}
                              className={`rounded-lg px-3 py-1.5 text-sm ${
                                theme === "dark" ? "bg-slate-200 text-slate-900" : "text-slate-600"
                              }`}
                            >
                              深色
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="rounded-xl border border-red-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <LogOut className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">退出</h3>
                        <p className="text-sm text-slate-600">从当前设备登出您的账号</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </>
  )
}
