"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Bell,
  Settings,
  MessageSquare,
  Shield,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Mail,
  Lock,
  Globe,
  CreditCard,
  Palette,
} from "lucide-react"

interface AppHeaderProps {
  breadcrumbItems?: Array<{ label: string; href?: string }>
}

export function AppHeader({ breadcrumbItems }: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [language, setLanguage] = useState("zh-CN")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const notifications = [
    { id: 1, title: "新项目申请", message: "云盘大师项目申请已提交", time: "5分钟前" },
    { id: 2, title: "审核通过", message: "您的博主资质已通过审核", time: "1小时前" },
    { id: 3, title: "系统通知", message: "平台将于今晚22:00进行维护", time: "3小时前" },
  ]

  return (
    <>
      <header className="border-b border-blue-100 bg-white/42 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-8 py-[1.8]">
          <div className="flex items-center gap-4">
            {isScrolled && breadcrumbItems && breadcrumbItems.length > 0 ? (
              <nav className="flex items-center gap-2 text-sm">
                {breadcrumbItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <span className="text-slate-400">/</span>}
                    {item.href ? (
                      <Link href={item.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-slate-900 font-medium">{item.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            ) : (
              <>
                <Search className="h-5 w-5 text-slate-400" />
                <span className="text-lg font-semibold text-slate-900">Dashboard</span>
              </>
            )}
          </div>

          <Link href="/" className="text-xl font-bold text-blue-600">
            GrowthEngine
          </Link>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-white shadow-lg z-50 border-0">
                  <div className="px-4 py-3 border-b-0">
                    <h3 className="font-semibold text-slate-900">通知</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="hover:bg-slate-50 transition-colors border border-slate-200 py-1.5 px-2">
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
                  <div className="px-4 text-center border border-slate-300 py-1">
                    <button className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">查看所有通知</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 ring-2 ring-transparent transition-all hover:ring-blue-200 cursor-pointer"
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
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <Link
                    href="/message-board"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
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

      <div className="h-[57px]" />

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSettingsModal(false)}
        >
          <div className="mx-4 w-full max-w-5xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">设置</h2>
                  <p className="text-blue-100">管理您的账户设置和偏好</p>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-8">
              <div className="space-y-6">
                {/* Account Section */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">账户</h3>
                  <div className="space-y-3">
                    {/* Profile Card */}
                    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-0.5">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                                alt="Avatar"
                                className="h-full w-full rounded-full"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">个人资料</h4>
                            <p className="text-sm text-slate-600">更新头像、姓名和个人信息</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                            <Mail className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">邮箱地址</h4>
                            <p className="text-sm text-slate-600">user@example.com</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>

                    {/* Password Card */}
                    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                            <Lock className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">密码与安全</h4>
                            <p className="text-sm text-slate-600">更改密码和启用两步验证</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">偏好设置</h3>
                  <div className="space-y-3">
                    {/* Notifications Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                          <Bell className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-3">通知设置</h4>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2">
                              <div>
                                <p className="text-sm font-medium text-slate-900">推送通知</p>
                                <p className="text-xs text-slate-600">接收应用内推送消息</p>
                              </div>
                              <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                                  notificationsEnabled ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                    notificationsEnabled ? "translate-x-5" : "translate-x-0.5"
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                              <div>
                                <p className="text-sm font-medium text-slate-900">邮件通知</p>
                                <p className="text-xs text-slate-600">接收重要邮件更新</p>
                              </div>
                              <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                                  emailNotifications ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                    emailNotifications ? "translate-x-5" : "translate-x-0.5"
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                              <div>
                                <p className="text-sm font-medium text-slate-900">营销推送</p>
                                <p className="text-xs text-slate-600">接收促销和优惠信息</p>
                              </div>
                              <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                                  pushNotifications ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                    pushNotifications ? "translate-x-5" : "translate-x-0.5"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Theme Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                          <Palette className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-3">主题外观</h4>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setTheme("light")}
                              className={`flex-1 rounded-lg border-2 p-4 text-center transition-all cursor-pointer ${
                                theme === "light"
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <Sun
                                className={`mx-auto h-6 w-6 mb-2 ${theme === "light" ? "text-blue-600" : "text-slate-600"}`}
                              />
                              <p
                                className={`text-sm font-medium ${theme === "light" ? "text-blue-900" : "text-slate-900"}`}
                              >
                                浅色模式
                              </p>
                            </button>
                            <button
                              onClick={() => setTheme("dark")}
                              className={`flex-1 rounded-lg border-2 p-4 text-center transition-all cursor-pointer ${
                                theme === "dark"
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <Moon
                                className={`mx-auto h-6 w-6 mb-2 ${theme === "dark" ? "text-blue-600" : "text-slate-600"}`}
                              />
                              <p
                                className={`text-sm font-medium ${theme === "dark" ? "text-blue-900" : "text-slate-900"}`}
                              >
                                深色模式
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Language Card */}
                    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                            <Globe className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">语言设置</h4>
                            <p className="text-sm text-slate-600">简体中文</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security Section */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">隐私与安全</h3>
                  <div className="space-y-3">
                    {/* Privacy Card */}
                    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                            <Shield className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">隐私控制</h4>
                            <p className="text-sm text-slate-600">管理数据共享和隐私设置</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>

                    {/* Billing Card */}
                    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                            <CreditCard className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">账单与支付</h4>
                            <p className="text-sm text-slate-600">管理支付方式和订阅</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">危险区域</h3>
                  <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                          <LogOut className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">退出登录</h4>
                          <p className="text-sm text-red-600">从当前设备登出您的账户</p>
                        </div>
                      </div>
                      <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors cursor-pointer">
                        退出
                      </button>
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

export default AppHeader
