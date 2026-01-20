"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Mail, Phone, Lock, LogOut, CheckCircle2, XCircle, ChevronRight } from "lucide-react"

type SettingsSection = "account" | "notifications" | "verification" | "logout"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [updateNotifications, setUpdateNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "设置", href: "/settings" },
  ]

  const sidebarItems = [
    { id: "account" as const, label: "账户管理", icon: User },
    { id: "notifications" as const, label: "通知设置", icon: Bell },
    { id: "verification" as const, label: "数据验证", icon: Shield },
    { id: "logout" as const, label: "退出登录", icon: LogOut },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <AppHeader breadcrumbItems={breadcrumbItems} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">设置</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-blue-100">管理您的账户和偏好设置</p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Sidebar Navigation - Horizontal on mobile, vertical on desktop */}
          <aside className="lg:col-span-3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible rounded-xl sm:rounded-2xl bg-white/5 p-3 sm:p-4 backdrop-blur-xl border border-white/10 shadow-2xl">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg lg:scale-105"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "text-blue-300" : ""}`} />
                    <span className="font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap">{item.label}</span>
                    {isActive && <ChevronRight className="hidden lg:block ml-auto h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8">
              {/* Account Management Section */}
              {activeSection === "account" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">账户管理</h2>
                    <p className="text-blue-200 text-xs sm:text-sm">管理您的个人信息和安全设置</p>
                  </div>

                  {/* Profile Card */}
                  <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-white/20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl sm:text-2xl">
                          张
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-white">张三</h3>
                        <p className="text-blue-200 mt-1 text-sm sm:text-base">zhangsan@example.com</p>
                        <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                          >
                            编辑资料
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                          >
                            更换头像
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">安全设置</h3>

                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="rounded-lg bg-blue-500/20 p-1.5 sm:p-2">
                            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm sm:text-base">修改密码</p>
                            <p className="text-xs sm:text-sm text-blue-200">更新您的登录密码</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs sm:text-sm">
                          更改
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="rounded-lg bg-green-500/20 p-1.5 sm:p-2">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm sm:text-base">双因素认证</p>
                            <p className="text-xs sm:text-sm text-blue-200">增强账户安全性</p>
                          </div>
                        </div>
                        <Switch checked={false} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">通知设置</h2>
                    <p className="text-blue-200 text-xs sm:text-sm">管理您接收通知的方式</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white text-sm sm:text-base">邮件通知</p>
                          <p className="text-xs sm:text-sm text-blue-200 mt-1">接收重要更新和消息通知</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white text-sm sm:text-base">推送通知</p>
                          <p className="text-xs sm:text-sm text-blue-200 mt-1">在您的设备上接收即时通知</p>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white text-sm sm:text-base">系统更新</p>
                          <p className="text-xs sm:text-sm text-blue-200 mt-1">获取新功能和改进的通知</p>
                        </div>
                        <Switch checked={updateNotifications} onCheckedChange={setUpdateNotifications} />
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white text-sm sm:text-base">营销邮件</p>
                          <p className="text-xs sm:text-sm text-blue-200 mt-1">接收促销和特别优惠信息</p>
                        </div>
                        <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Section */}
              {activeSection === "verification" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">数据验证</h2>
                    <p className="text-blue-200 text-xs sm:text-sm">验证您的联系方式以提高安全性</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-0 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="rounded-lg bg-blue-500/20 p-1.5 sm:p-2">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm sm:text-base">邮箱验证</p>
                            <p className="text-xs sm:text-sm text-blue-200 mt-0.5 sm:mt-1">zhangsan@example.com</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs self-start sm:self-auto">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          已验证
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-xl bg-white/10 p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="rounded-lg bg-orange-500/20 p-1.5 sm:p-2">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-orange-300" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm sm:text-base">手机验证</p>
                            <p className="text-xs sm:text-sm text-blue-200 mt-0.5 sm:mt-1">+86 138****8888</p>
                          </div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs self-start sm:self-auto">
                          <XCircle className="mr-1 h-3 w-3" />
                          未验证
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                      >
                        立即验证
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Section */}
              {activeSection === "logout" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">退出登录</h2>
                    <p className="text-blue-200 text-xs sm:text-sm">安全退出您的账户</p>
                  </div>

                  <div className="rounded-lg sm:rounded-xl bg-red-500/10 p-5 sm:p-8 border border-red-500/30 text-center">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-3 sm:mb-4">
                      <LogOut className="h-6 w-6 sm:h-8 sm:w-8 text-red-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">确定要退出吗？</h3>
                    <p className="text-blue-200 mb-4 sm:mb-6 text-xs sm:text-sm">您将需要重新登录才能访问您的账户</p>
                    <div className="flex gap-2 sm:gap-3 justify-center flex-col sm:flex-row">
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                      >
                        取消
                      </Button>
                      <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-lg text-xs sm:text-sm">
                        退出登录
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
