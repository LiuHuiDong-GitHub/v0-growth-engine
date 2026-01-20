"use client"

import { useState } from "react"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import Breadcrumb from "@/components/breadcrumb"
import {
  Home,
  Upload,
  Lightbulb,
  TrendingUp,
  User,
  SettingsIcon,
  Play,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react"

export default function MyPromotions() {
  const [activeTab, setActiveTab] = useState<"pending" | "published">("pending")

  const pendingProjects = [
    {
      id: "1",
      title: "智能家居系统评测",
      platform: "Youtube",
      status: "进行中",
      description: "推广活动详情简述，此活动旨在提高产品在目标平台的用户参与度。",
    },
    {
      id: "2",
      title: "健康健身应用宣传",
      platform: "TikTok",
      status: "进行中",
      description: "推广活动详情简述，此活动旨在提高产品在目标平台的用户参与度。",
    },
  ]

  const publishedProjects = [
    {
      id: "1",
      title: "智能家居系统评测",
      platform: "YouTube",
      status: "已发布",
      description: "推广活动详情简述，此活动旨在提高产品在目标平台的用户参与度。",
      stats: {
        views: 125000,
        likes: 8700,
        comments: 540,
        saves: 1200,
        shares: 780,
      },
    },
    {
      id: "2",
      title: "智能家居系统评测",
      platform: "YouTube",
      status: "已发布",
      description: "推广活动详情简述，此活动旨在提高产品在目标平台的用户参与度。",
      stats: {
        views: 125000,
        likes: 8700,
        comments: 540,
        saves: 1200,
        shares: 780,
      },
    },
  ]

  return (
    <div className="flex min-h-screen md:h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-16 flex-col items-center gap-8 border-r border-slate-200 bg-white py-6">
        <Link href="/" className="flex h-10 w-10 items-center justify-center">
          <Lightbulb className="h-6 w-6 text-blue-600" />
        </Link>

        <nav className="flex flex-1 flex-col items-center gap-6">
          <Link
            href="/select-product"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">仪表盘</span>
          </Link>

          <Link
            href="/upload-product"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">项目</span>
          </Link>

          <Link
            href="/select-product"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <Lightbulb className="h-5 w-5" />
            <span className="text-xs">浏览</span>
          </Link>

          <Link
            href="/my-promotions"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">推广者</span>
          </Link>

          <Link href="/my-promotions" className="group flex flex-col items-center gap-1 text-blue-600">
            <User className="h-5 w-5" />
            <span className="text-xs">我的推广</span>
          </Link>
        </nav>

        <div className="flex flex-col items-center gap-4">
          <button className="flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600">
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">设置</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600">
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-16 flex-1 flex flex-col overflow-hidden">
        <AppHeader breadcrumbItems={[{ label: "首页", href: "/" }, { label: "我的推广" }]} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "我的推广" }]} />

          <h1 className="mb-4 sm:mb-6 mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-slate-900">我的推广</h1>

          <div className="mb-4 sm:mb-6 flex justify-start overflow-x-auto">
            <div className="relative inline-flex rounded-full bg-slate-100 p-1 min-w-fit">
              {/* Sliding background indicator */}
              <div
                className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
                  activeTab === "published" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
                }`}
              />

              <button
                onClick={() => setActiveTab("pending")}
                className={`relative z-10 rounded-full px-12 sm:px-16 md:px-24 py-1.5 text-sm sm:text-base font-medium transition-colors duration-200 ${
                  activeTab === "pending" ? "text-slate-900" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                待发布
              </button>
              <button
                onClick={() => setActiveTab("published")}
                className={`relative z-10 rounded-full px-12 sm:px-16 md:px-24 py-1.5 text-sm sm:text-base font-medium transition-colors duration-200 ${
                  activeTab === "published" ? "text-slate-900" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                已发布
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "pending" ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingProjects.map((project) => (
                <div key={project.id} className="overflow-hidden rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
                  <div className="mb-2 sm:mb-3 flex items-start gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">{project.title}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-slate-600">{project.platform}</span>
                        <span className="rounded bg-blue-500 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">{project.description}</p>

                  <Link
                    href={`/submit-video?projectId=${project.id}&projectName=${encodeURIComponent(project.title)}&category=${encodeURIComponent(project.platform)}`}
                    className="block -mx-3 sm:-mx-4 -mb-3 sm:-mb-4"
                  >
                    <button className="w-full cursor-pointer rounded-t-none rounded-b-xl sm:rounded-b-2xl py-8 sm:py-12 text-lg sm:text-xl font-semibold text-slate-700 shadow-sm transition-all hover:bg-gradient-to-br hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:text-white hover:shadow-xl bg-[rgba(196,226,165,1)]">
                      去发布
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishedProjects.map((project) => (
                <Link
                  href="/blogger-dashboard"
                  key={project.id}
                  className="overflow-hidden rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                >
                  <div className="mb-2 sm:mb-3 flex items-start gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-indigo-100 flex-shrink-0">
                      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">{project.title}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-slate-600">{project.platform}</span>
                        <span className="rounded bg-blue-500 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">{project.description}</p>

                  <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{project.stats.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{project.stats.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{project.stats.comments}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{project.stats.saves.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{project.stats.shares}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        <footer className="flex-shrink-0 border-t bg-white/50 py-3 sm:py-4 text-center">
          <p className="text-xs sm:text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
