"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSettings } from "@/context/settings-context"
import {
  Bell,
  Settings,
  MessageSquare,
  LogOut,
  HelpCircle,
  Mail,
  Lock,
  Globe,
  CreditCard,
  User,
  Key,
  Smartphone,
  Monitor,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  FileText,
} from "lucide-react"
import { apiGet, apiPost } from "@/lib/api-client"

interface HomeHeaderProps {
  profileName?: string
  profileEmail?: string
  notifications?: Array<{ id: number; title: string; message: string; time: string; unread: boolean }>
}

export function HomeHeader({ 
  profileName = "张明",
  profileEmail = "user@example.com",
  notifications = [
    { id: 1, title: "新项目申请", message: "云盘大师项目申请已提交", time: "5分钟前", unread: true },
    { id: 2, title: "审核通过", message: "您的博主资质已通过审核", time: "1小时前", unread: true },
    { id: 3, title: "系统通知", message: "平台将于今晚22:00进行维护", time: "3小时前", unread: false },
  ]
}: HomeHeaderProps) {
  const router = useRouter()
  const { showSettingsModal, setShowSettingsModal } = useSettings()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatar: string; role?: string } | null>(null)
  const [liveNotifications, setLiveNotifications] = useState(notifications)

  // Settings state
  const [activeSettingsTab, setActiveSettingsTab] = useState<"account" | "billing">("account")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileNameState, setProfileNameState] = useState(profileName)
  const [profileBio, setProfileBio] = useState("GrowthEngine平台用户")
  const [profileEmailState, setProfileEmailState] = useState(profileEmail)

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Two-factor auth state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

  // Session management
  const [sessions] = useState([
    { id: 1, device: "Chrome - Windows", location: "北京, 中国", lastActive: "当前会话", current: true },
    { id: 2, device: "Safari - iPhone", location: "上海, 中国", lastActive: "2小时前", current: false },
    { id: 3, device: "Firefox - MacOS", location: "深圳, 中国", lastActive: "1天前", current: false },
  ])

  // Save status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }
    let strength = 0
    if (newPassword.length >= 8) strength += 25
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength += 25
    if (/\d/.test(newPassword)) strength += 25
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength += 25
    setPasswordStrength(strength)
  }, [newPassword])

  const languages = [
    { code: "zh-CN", name: "简体中文", flag: "🇨🇳" },
    { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
    { code: "en-US", name: "English", flag: "🇺🇸" },
    { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
    { code: "ko-KR", name: "한국어", flag: "🇰🇷" },
  ]

  const handleSaveProfile = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
      setIsEditingProfile(false)
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) return
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
      setIsChangingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)
  }

  const handleExportData = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 2000)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "删除我的账户") {
      router.push("/auth/login")
    }
  }

  const handleTerminateSession = (sessionId: number) => {
    // Handle session termination
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "弱"
    if (passwordStrength <= 50) return "一般"
    if (passwordStrength <= 75) return "强"
    return "非常强"
  }

  const settingsTabs = [
    { id: "account" as const, label: "账户", icon: User },
    { id: "billing" as const, label: "账单订阅", icon: CreditCard },
  ]

  const handleLogout = () => {
    apiPost("/api/v1/auth/logout", {})
      .catch(() => undefined)
      .finally(() => router.push("/auth/login"))
  }

  useEffect(() => {
    apiGet<{ name: string; email: string; avatar: string; role: string }>("/api/v1/me")
      .then(setUser)
      .catch(() => undefined)
    apiGet<Array<{ id: number; title: string; message: string; time: string; unread: boolean }>>("/api/v1/notifications")
      .then(setLiveNotifications)
      .catch(() => undefined)
  }, [])

  const markAllRead = async () => {
    try {
      await apiPost("/api/v1/notifications/mark-all-read", {})
      const updated = await apiGet<Array<{ id: number; title: string; message: string; time: string; unread: boolean }>>(
        "/api/v1/notifications?limit=20&offset=0",
      )
      setLiveNotifications(updated)
    } catch {
      // ignore
    }
  }

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-blue-100 bg-white/42 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 sm:px-8 py-2 sm:py-0 sm:pl-4">
        {/* Logo on the left */}
        <Link href="/" className="flex-shrink-0">
          <img 
            src="/icon.svg" 
            alt="GrowthEngine Logo" 
            className="h-8 w-8 rounded-full object-cover sm:w-[46px] sm:h-[46px]"
          />
        </Link>
        
        {/* Centered GrowthEngine text */}
        <div className="flex-1"></div>
        <Link href="/" className="text-base sm:text-xl font-bold text-blue-600">
          GrowthEngine
        </Link>
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {liveNotifications.filter((n) => n.unread).length}
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl z-50 border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">通知</h3>
                      <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700">
                        全部已读
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {liveNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${notif.unread ? "bg-blue-50/30" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${notif.unread ? "bg-blue-100" : "bg-slate-100"}`}
                          >
                            <Bell className={`h-5 w-5 ${notif.unread ? "text-blue-600" : "text-slate-500"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-slate-900 truncate">{notif.title}</h4>
                              {notif.unread && <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-slate-600 truncate">{notif.message}</p>
                            <p className="mt-1 text-xs text-slate-400">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowNotifications(false)
                        router.push("/notifications")
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      查看所有通知
                    </button>
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
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <p className="font-medium text-slate-900">{user?.name || profileName}</p>
                    <p className="text-sm text-slate-500 truncate">{user?.email || profileEmail}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/settings")
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>设置</span>
                    </button>
                    <Link
                      href="/messages"
                      onClick={() => setShowUserMenu(false)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      <span>留言</span>
                    </Link>
                    <Link
                      href="/help"
                      onClick={() => setShowUserMenu(false)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                    >
                      <HelpCircle className="h-4 w-4 text-slate-500" />
                      <span>帮助中心</span>
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Settings Modal */}
    {showSettingsModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={() => setShowSettingsModal(false)}
      >
        <div
          className="w-full max-w-[90%] max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col"
          style={{maxWidth: 'min(90%, 768px)'}}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 flex-shrink-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNn0iIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">设置</h2>
                  <p className="text-blue-100 text-sm">管理您的账户和偏好</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {saveStatus === "saving" && (
                  <span className="text-white/80 text-sm flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    保存中...
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-white text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    已保存
                  </span>
                )}
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content with sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-48 border-r border-slate-200 bg-slate-50 p-3 flex-shrink-0">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      activeSettingsTab === tab.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Account Tab */}
              {activeSettingsTab === "account" && (
                <div className="space-y-1.5">
                  {/* Profile Section */}
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">个人资料</h3>
                      {!isEditingProfile ? (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          编辑
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
                          >
                            取消
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                          >
                            保存
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-6">
                        <div className="relative group">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-0.5">
                            <img
                              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                              alt="Avatar"
                              className="h-full w-full rounded-full bg-white"
                            />
                          </div>
                          {isEditingProfile && (
                            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <span className="text-white text-xs">更换</span>
                            </button>
                          )}
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">姓名</label>
                            {isEditingProfile ? (
                              <input
                                type="text"
                                value={profileNameState}
                                onChange={(e) => setProfileNameState(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <p className="text-slate-900">{profileNameState}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">个人简介</label>
                            {isEditingProfile ? (
                              <textarea
                                value={profileBio}
                                onChange={(e) => setProfileBio(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                            ) : (
                              <p className="text-slate-600 text-sm">{profileBio}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">邮箱地址</h4>
                        <p className="text-sm text-slate-600">{profileEmail}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        已验证
                      </span>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-100 flex items-center justify-between px-2.5 py-2.5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <Lock className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">密码</h4>
                          <p className="text-sm text-slate-500">上次更改于30天前</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        {isChangingPassword ? "取消" : "修改密码"}
                      </button>
                    </div>
                    {isChangingPassword && (
                      <div className="p-5 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">当前密码</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="输入当前密码"
                            />
                            <button
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">新密码</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="输入新密码"
                            />
                            <button
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-500">密码强度</span>
                                <span className="text-xs font-medium text-slate-700">{getPasswordStrengthText()}</span>
                              </div>
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                                  style={{ width: `${passwordStrength}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">确认新密码</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="再次输入新密码"
                          />
                          {confirmPassword && newPassword !== confirmPassword && (
                            <p className="mt-1 text-xs text-red-600">密码不匹配</p>
                          )}
                        </div>
                        <button
                          onClick={handleChangePassword}
                          disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          更新密码
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeSettingsTab === "billing" && (
                <div className="space-y-1.5">
                  {/* Upload Product */}
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 transition-all">
                    <button
                      onClick={() => {
                        router.push("/products/upload")
                        setShowSettingsModal(false)
                      }}
                      className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">上传产品</h4>
                          <p className="text-sm text-slate-500">分享您的产品到平台</p>
                        </div>
                      </div>
                      <div className="text-blue-600">→</div>
                    </button>
                  </div>

                  {/* My Promotions */}
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 transition-all">
                    <button
                      onClick={() => {
                        router.push("/promotions")
                        setShowSettingsModal(false)
                      }}
                      className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                          <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">推广产品</h4>
                          <p className="text-sm text-slate-500">管理您的产品推广</p>
                        </div>
                      </div>
                      <div className="text-purple-600">→</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
