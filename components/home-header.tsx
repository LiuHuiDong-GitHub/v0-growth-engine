"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  Settings,
  MessageSquare,
  LogOut,
  HelpCircle,
} from "lucide-react"

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
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    router.push("/login")
  }

  return (
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
                  {notifications.filter((n) => n.unread).length}
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-xl z-50 border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">通知</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-700">全部已读</button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
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
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">查看所有通知</button>
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
                    <p className="font-medium text-slate-900">{profileName}</p>
                    <p className="text-sm text-slate-500 truncate">{profileEmail}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowSettingsModal(true)
                        setShowUserMenu(false)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>设置</span>
                    </button>
                    <Link
                      href="/message-board"
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
  )
}
