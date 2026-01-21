"use client"

import Link from "next/link"
import AppHeader from "@/components/app-header"
import Breadcrumb from "@/components/breadcrumb"
import { Home, Upload, Lightbulb, TrendingUp, User, SettingsIcon } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"

export default function BloggerVideoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string

  const status = searchParams.get("status")
  const isSubmitted = status === "submitted"

  const progress = isSubmitted ? 0.5 : 0.75
  const statusText = isSubmitted ? "视频创作中" : "继续中"
  const statusColor = isSubmitted ? "bg-yellow-500" : "bg-green-500"
  const progressPercent = Math.round(progress * 100)

  const performanceLevel = "中"

  const videos = [
    {
      id: "1",
      title: "产品发布 - 增长引擎",
      platform: "Youtube",
      thumbnail: "/laptop-analytics-dashboard.jpg",
      stats: {
        views: "1.2M",
        engagementRate: "5.3%",
        conversionRate: "2.1%",
      },
    },
    {
      id: "2",
      title: "成功案例分享",
      platform: "TikTok",
      thumbnail: "/woman-showing-phone.jpg",
      stats: {
        views: "800K",
        engagementRate: "7.1%",
        conversionRate: "1.8%",
      },
    },
    {
      id: "3",
      title: "如何使用GrowthEngine",
      platform: "Bilibili",
      thumbnail: "/hands-using-tablet.jpg",
      stats: {
        views: "500K",
        engagementRate: "4.8%",
        conversionRate: "1.5%",
      },
    },
    {
      id: "4",
      title: "推广策略优化",
      platform: "Kuaishou",
      thumbnail: "/person-typing-laptop.jpg",
      stats: {
        views: "300K",
        engagementRate: "6.5%",
        conversionRate: "2.5%",
      },
    },
  ]

  const redditData = [
    {
      date: "2024-07-28",
      title: "GrowthEngine帮助我转化率提高200%",
      views: 1240,
      conversions: 85,
      revenue: "¥850.00",
    },
    {
      date: "2024-07-27",
      title: "新的营销工具：GrowthEngine评测",
      views: 980,
      conversions: 62,
      revenue: "¥620.00",
    },
    {
      date: "2024-07-26",
      title: "如何在Reddit上找到潜在客户？",
      views: 1530,
      conversions: 110,
      revenue: "¥1100.00",
    },
    {
      date: "2024-07-25",
      title: "GrowthEngine：独立创作者的福音",
      views: 760,
      conversions: 50,
      revenue: "¥500.00",
    },
    {
      date: "2024-07-24",
      title: "小型企业如何借助Reddit增长",
      views: 1020,
      conversions: 75,
      revenue: "¥750.00",
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
            <span className="text-xs">Dashboard</span>
          </Link>

          <Link
            href="/upload-product"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">Projects</span>
          </Link>

          <Link
            href="/select-product"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <Lightbulb className="h-5 w-5" />
            <span className="text-xs">Browse</span>
          </Link>

          <Link
            href="/my-promotions"
            className="group flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Promoter</span>
          </Link>

          <Link href="/my-promotions" className="group flex flex-col items-center gap-1 text-blue-600">
            <User className="h-5 w-5" />
            <span className="text-xs">My Promotions</span>
          </Link>
        </nav>

        <div className="flex flex-col items-center gap-4">
          <button className="flex flex-col items-center gap-1 text-slate-600 transition-colors hover:text-blue-600">
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-16 flex-1 flex flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <Breadcrumb
            items={[{ label: "首页", href: "/" }, { label: "我的推广", href: "/my-promotions" }, { label: "视频表现" }]}
          />

          {/* Product Progress Card */}
          <div className="mb-6 sm:mb-8 mt-4 sm:mt-6 overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className={`h-10 sm:h-12 w-1 rounded-full ${statusColor}`}></div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">产品名称</h2>
              </div>
              <span className={`rounded-full ${statusColor} px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-white`}>
                {statusText}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Circular Progress */}
                <svg className="h-36 w-36 sm:h-48 sm:w-48 -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl sm:text-5xl font-bold text-blue-600">{progressPercent}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-full border-2 border-blue-500 bg-white">
                <span className="text-lg sm:text-xl font-bold text-slate-900">{performanceLevel}</span>
                <span className="mt-0.5 text-[10px] sm:text-xs text-slate-500">表现程度</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-slate-600">
              <span className={`font-medium ${isSubmitted ? "text-yellow-600" : "text-green-600"}`}>{statusText}</span>
              <span>已实现曝光量 / 目标曝光量</span>
            </div>
          </div>

          {/* Video Performance Section */}
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-slate-900">我的视频表现</h2>

          <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id} className="overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-36 sm:h-48 w-full object-cover"
                  />
                  <span className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded bg-green-500 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-white">
                    {video.platform}
                  </span>
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-sm sm:text-lg font-semibold text-white drop-shadow-lg">
                    {video.title}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4">
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm sm:text-lg font-semibold text-slate-900">{video.stats.views}</div>
                    <div className="text-[10px] sm:text-xs text-slate-500">播放</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center text-slate-400">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div className="text-sm sm:text-lg font-semibold text-slate-900">{video.stats.engagementRate}</div>
                    <div className="text-[10px] sm:text-xs text-slate-500">点击率</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center text-slate-400">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 10-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm sm:text-lg font-semibold text-slate-900">{video.stats.conversionRate}</div>
                    <div className="text-[10px] sm:text-xs text-slate-500">转化率</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="flex-shrink-0 border-t bg-white/50 py-3 sm:py-4 text-center">
          <p className="text-xs sm:text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
