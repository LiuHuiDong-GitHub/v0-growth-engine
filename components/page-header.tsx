"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Bell,
  Settings,
  MessageSquare,
  LogOut,
  HelpCircle,
} from "lucide-react"

// 路径名称映射
const pathNameMap: Record<string, string> = {
  "": "首页",
  "select-product": "待推广项目",
  "select-role": "选择角色",
  "upload-product": "上传产品",
  "my-product": "我的产品",
  "my-promotions": "我的推广",
  "blogger-dashboard": "视频仪表盘",
  "blogger-verification": "博主认证",
  "blogger-video": "博主视频",
  "product-details": "产品详情",
  "product": "产品",
  "submit-video": "提交视频",
  "message-board": "留言板",
  "help": "帮助中心",
  "login": "登录",
  "register": "注册",
  "forgot-password": "忘记密码",
  "verify-email": "验证邮箱",
}

// 特殊路径的自定义面包屑配置
const customBreadcrumbs: Record<string, Array<{ label: string; href?: string }>> = {
  "/blogger-dashboard": [
    { label: "首页", href: "/" },
    { label: "我的推广", href: "/my-promotions" },
    { label: "视频仪表盘" },
  ],
}

// 生成面包屑路径
function generateBreadcrumb(pathname: string): Array<{ label: string; href?: string }> {
  if (pathname === "/") return []
  
  // 检查是否有自定义面包屑配置
  if (customBreadcrumbs[pathname]) {
    return customBreadcrumbs[pathname]
  }
  
  // 检查动态路由的自定义配置 (如 /product-details/:id)
  const matchedKey = Object.keys(customBreadcrumbs).find(key => {
    const pattern = key.replace(/:\w+/g, '\\d+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })
  if (matchedKey) {
    return customBreadcrumbs[matchedKey]
  }
  
  // 特殊处理 /product-details/:id 路径
  if (pathname.startsWith("/product-details/")) {
    return [
      { label: "首页", href: "/" },
      { label: "我的产品", href: "/my-product" },
      { label: "产品详情" },
    ]
  }
  
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: Array<{ label: string; href?: string }> = [{ label: "首页", href: "/" }]
  
  let currentPath = ""
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`
    
    // 跳过动态路由参数 (如 [id])
    if (segment.startsWith("[") || /^\d+$/.test(segment)) {
      continue
    }
    
    const label = pathNameMap[segment] || segment
    const isLast = i === segments.length - 1
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    })
  }
  
  return breadcrumbs
}

interface PageHeaderProps {
  breadcrumbItems?: Array<{ label: string; href?: string }>
  profileName?: string
  profileEmail?: string
  notifications?: Array<{ id: number; title: string; message: string; time: string; unread: boolean }>
}

export function PageHeader({ 
  breadcrumbItems,
  profileName = "张明",
  profileEmail = "user@example.com",
  notifications = [
    { id: 1, title: "新项目申请", message: "云盘大师项目申请已提交", time: "5分钟前", unread: true },
    { id: 2, title: "审核通过", message: "您的博主资质已通过审核", time: "1小时前", unread: true },
    { id: 3, title: "系统通知", message: "平台将于今晚22:00进行维护", time: "3小时前", unread: false },
  ]
}: PageHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const autoBreadcrumbs = generateBreadcrumb(pathname)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <header className="border-b border-blue-100 bg-white/42 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 sm:px-8 py-2 sm:py-0 sm:pl-4">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="flex items-center text-sm">
            {autoBreadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <span className="mx-1.5 text-slate-400">/</span>}
                {item.href ? (
                  <Link href={item.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

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
    </header>
  )
}
