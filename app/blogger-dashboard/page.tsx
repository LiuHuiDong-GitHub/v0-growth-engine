"use client"

import { useState } from "react"
import AppHeader from "@/components/app-header"
import Breadcrumb from "@/components/breadcrumb"
import {
  Search,
  Lightbulb,
  Home,
  Upload,
  TrendingUp,
  User,
  Settings,
  Share2,
  Heart,
  MessageCircle,
  Star,
  PlayCircle,
} from "lucide-react"

export default function BloggerDashboard() {
  const [selectedQuality, setSelectedQuality] = useState("中")

  const stats = [
    { icon: Share2, label: "分享量", value: "2,500", color: "text-blue-600", ringColor: "#3b82f6", percentage: 70 },
    { icon: Heart, label: "收藏量", value: "1,800", color: "text-green-600", ringColor: "#10b981", percentage: 85 },
    {
      icon: MessageCircle,
      label: "评论量",
      value: "1,200",
      color: "text-purple-600",
      ringColor: "#a855f7",
      percentage: 60,
    },
    { icon: Star, label: "点赞量", value: "5,000", color: "text-orange-600", ringColor: "#f97316", percentage: 90 },
    {
      icon: PlayCircle,
      label: "播放量",
      value: "15,000",
      color: "text-pink-600",
      ringColor: "#ec4899",
      percentage: 95,
    },
  ]

  const videoCollaborations = [
    {
      title: "智能家居助手评测",
      platform: "YouTube",
      views: "1.2M",
      engagementRate: "5.3%",
      conversionRate: "0.8%",
      image: "/smart-home-review.jpg",
      status: "查看视频",
    },
    {
      title: "高效生产力工具",
      platform: "Bilibili",
      views: "850K",
      engagementRate: "4.8%",
      conversionRate: "1.1%",
      image: "/productivity-tools.jpg",
      status: "查看视频",
    },
    {
      title: "时尚穿搭灵感",
      platform: "TikTok",
      views: "2.1M",
      engagementRate: "6.1%",
      conversionRate: "0.5%",
      image: "/fashion-inspiration.jpg",
      status: "查看视频",
    },
    {
      title: "美味食谱分享",
      platform: "Xiaohongshu",
      views: "600K",
      engagementRate: "3.9%",
      conversionRate: "0.7%",
      image: "/cooking-recipe.jpg",
      status: "查看视频",
    },
    {
      title: "最新手机深度评测",
      platform: "YouTube",
      views: "1.5M",
      engagementRate: "5.5%",
      conversionRate: "0.9%",
      image: "/phone-review.jpg",
      status: "查看视频",
    },
    {
      title: "投资理财技巧",
      platform: "Bilibili",
      views: "780K",
      engagementRate: "4.2%",
      conversionRate: "1.2%",
      image: "/investment-tips.jpg",
      status: "查看视频",
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-slate-200 bg-white pt-20">
        <nav className="flex flex-col items-center gap-6 py-6">
          <button className="group flex flex-col items-center gap-1 text-blue-600">
            <Lightbulb className="h-6 w-6" />
            <span className="text-xs font-medium">仪表盘</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <Upload className="h-6 w-6" />
            <span className="text-xs">项目</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <Search className="h-6 w-6" />
            <span className="text-xs">浏览</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">推广者</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <User className="h-6 w-6" />
            <span className="text-xs">我的推广</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <Settings className="h-6 w-6" />
            <span className="text-xs">设置</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600">
            <Settings className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </button>
        </nav>
      </aside>

      <div className="ml-16 flex-1">
        <AppHeader />

        <main className="px-12 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "博主验证", href: "/blogger-verification" },
              { label: "我的仪表盘" },
            ]}
          />

          <h1 className="mb-8 mt-6 text-3xl font-bold text-slate-900">我的仪表盘</h1>

          {/* Exposure Goals Section */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">曝光目标</h2>
              <p className="mb-6 text-sm text-slate-600">您的产品正曝光在世界各地多数。</p>

              {/* Stats Grid */}
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="flex-1 text-sm font-medium text-slate-700">{stat.label}:</span>
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Visualization */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg width="400" height="400" viewBox="0 0 400 400" className="rotate-[-90deg]">
                  {/* Background rings */}
                  {stats.map((stat, index) => {
                    const radius = 180 - index * 30
                    const circumference = 2 * Math.PI * radius
                    const strokeDashoffset = circumference * (1 - stat.percentage / 100)

                    return (
                      <g key={index}>
                        {/* Background circle */}
                        <circle cx="200" cy="200" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="20" />
                        {/* Progress circle */}
                        <circle
                          cx="200"
                          cy="200"
                          r={radius}
                          fill="none"
                          stroke={stat.ringColor}
                          strokeWidth="20"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600">总曝光概览</div>
                    <div className="mt-2 text-4xl font-bold text-slate-900">25,500</div>
                  </div>
                </div>

                {/* Legend indicators with dashed lines */}
                <div className="absolute left-[-60px] top-[80px] flex items-center gap-2">
                  <div className="h-px w-8 border-t-2 border-dashed border-slate-300"></div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stats[4].ringColor }}></div>
                    <span className="font-medium text-slate-700">{stats[4].label}</span>
                  </div>
                </div>

                <div className="absolute right-[-80px] top-[100px] flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stats[3].ringColor }}></div>
                    <span className="font-medium text-slate-700">{stats[3].label}</span>
                  </div>
                  <div className="h-px w-8 border-t-2 border-dashed border-slate-300"></div>
                </div>

                <div className="absolute bottom-[80px] right-[-90px] flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stats[0].ringColor }}></div>
                    <span className="font-medium text-slate-700">{stats[0].label}</span>
                  </div>
                  <div className="h-px w-8 border-t-2 border-dashed border-slate-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Level Selector */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex gap-4">
              <button className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-blue-500 bg-blue-50 transition-all">
                <span className="text-2xl font-bold text-blue-600">中</span>
                <span className="mt-1 text-xs text-slate-600">表现程度</span>
              </button>
            </div>
          </div>

          {/* Collaborated Videos Section */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">已合作视频案例</h2>

            <div className="mb-8 rounded-xl bg-slate-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">视频合作成果一览</h3>
              <p className="text-sm text-slate-600">探测数据、点击率数据优化推广数据的推广。</p>
            </div>

            {/* Video Grid */}
            <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
              {videoCollaborations.map((video, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-48 bg-slate-200">
                    <img
                      src={video.image || "/placeholder.svg"}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-lg bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                      {video.title}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-sm font-medium text-slate-700">{video.platform}</span>
                      <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                        {video.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-900">{video.views}</div>
                        <div className="text-xs text-slate-600">播放次数</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">{video.engagementRate}</div>
                        <div className="text-xs text-slate-600">点击率</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">{video.conversionRate}</div>
                        <div className="text-xs text-slate-600">转化率</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 border-t border-slate-200 py-8 text-center">
            <p className="text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
