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
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)

  const stats = [
    {
      icon: PlayCircle,
      label: "播放量",
      value: "15,000",
      color: "text-purple-600", // swapped from pink to purple
      ringColor: "#a855f7", // swapped from #f9a8d4 to #a855f7
      percentage: 95,
    },
    { icon: Heart, label: "点赞量", value: "1,800", color: "text-red-600", ringColor: "#fca5a5", percentage: 85 },
    {
      icon: Share2,
      label: "分享量",
      value: "2,500",
      color: "text-pink-600", // swapped from purple to pink
      ringColor: "#f9a8d4", // swapped from #a855f7 to #f9a8d4
      percentage: 70,
    },
    {
      icon: MessageCircle,
      label: "评论量",
      value: "1,200",
      color: "text-orange-600",
      ringColor: "#f97316",
      percentage: 60,
    },
    { icon: Star, label: "收藏量", value: "5,000", color: "text-green-600", ringColor: "#10b981", percentage: 90 },
  ]

  const videoCollaborations = [
    {
      title: "产品发布宣传视频",
      duration: "2:35",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
      progress: 75,
    },
    {
      title: "用户案例分享",
      duration: "1:40",
      thumbnail: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
      progress: 75,
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-slate-200 bg-white pt-20">
        <nav className="flex flex-col items-center gap-6 py-6">
          <button className="group flex flex-col items-center gap-1 text-blue-600 cursor-pointer">
            <Lightbulb className="h-6 w-6" />
            <span className="text-xs font-medium">仪表盘</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <Home className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <Upload className="h-6 w-6" />
            <span className="text-xs">项目</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <Search className="h-6 w-6" />
            <span className="text-xs">浏览</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">推广者</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <User className="h-6 w-6" />
            <span className="text-xs">我的推广</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <Settings className="h-6 w-6" />
            <span className="text-xs">设置</span>
          </button>
          <button className="group flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 cursor-pointer">
            <Settings className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </button>
        </nav>
      </aside>

      <div className="ml-16 flex-1">
        <AppHeader
          breadcrumbItems={[
            { label: "首页", href: "/" },
            { label: "博主验证", href: "/blogger-verification" },
            { label: "我的仪表盘" },
          ]}
        />

        <main className="px-12 py-8">
          {/* Breadcrumb - shown by default, will be moved to header on scroll */}
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
              <h2 className="mb-4 text-xl font-bold text-slate-900 pl-5">曝光目标</h2>
              <p className="mb-6 text-sm text-slate-600 pl-5">您的产品正曝光在世界各地多数。</p>

              {/* Stats Grid */}
              <div className="space-y-4 ml-[30%] w-[26.25%]">
                {stats.map((stat, index) => (
                  <div key={index} className="relative">
                    <div
                      className="inline-flex items-center gap-1.5 cursor-pointer transition-all duration-300 py-1.5"
                      onMouseEnter={() => setHoveredStat(index)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <stat.icon
                        className={`h-5 w-5 transition-all duration-300 ${hoveredStat === index ? "scale-110" : ""}`}
                        style={{ color: stat.ringColor }}
                      />
                      <span
                        className={`text-sm font-semibold transition-all duration-300 ${
                          hoveredStat === index ? "scale-105" : ""
                        }`}
                        style={{ color: stat.ringColor }}
                      >
                        {stat.label} : {stat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Visualization */}
            <div className="relative flex items-center justify-center">
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ left: "-120px", width: "calc(100% + 120px)", height: "100%" }}
              >
                {stats.map((stat, index) => {
                  const startX = 120
                  const startY = 140 + index * 40
                  const endX = 280
                  const centerY = 200
                  const radius = 180 - index * 30
                  const endY = centerY - radius

                  const needsTurn = Math.abs(startY - endY) > 5

                  return (
                    <path
                      key={index}
                      d={
                        needsTurn
                          ? `M ${startX} ${startY} L ${endX - 20} ${startY} L ${endX} ${endY}`
                          : `M ${startX} ${startY} L ${endX} ${endY}`
                      }
                      fill="none"
                      stroke={stat.ringColor}
                      strokeWidth="1.5"
                      opacity={hoveredStat !== null && hoveredStat !== index ? 0.2 : 0.5}
                      className="transition-all duration-300"
                    />
                  )
                })}
              </svg>

              <div className="relative">
                <svg width="400" height="400" viewBox="0 0 400 400" className="rotate-[-90deg]">
                  {stats.map((stat, index) => {
                    const radius = 180 - index * 30
                    const circumference = 2 * Math.PI * radius
                    const strokeDashoffset = circumference * (1 - stat.percentage / 100)
                    const isHovered = hoveredStat === index

                    return (
                      <g
                        key={index}
                        onMouseEnter={() => setHoveredStat(index)}
                        onMouseLeave={() => setHoveredStat(null)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx="200"
                          cy="200"
                          r={radius}
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="20"
                          opacity={hoveredStat !== null && !isHovered ? 0.3 : 1}
                          className="transition-all duration-300"
                        />
                        <circle
                          cx="200"
                          cy="200"
                          r={radius}
                          fill="none"
                          stroke={stat.ringColor}
                          strokeWidth={isHovered ? "24" : "20"}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          opacity={hoveredStat !== null && !isHovered ? 0.3 : 1}
                          className="transition-all duration-300"
                        />
                      </g>
                    )
                  })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="font-medium text-xs text-slate-500">总曝光</div>
                    <div className="mt-2 font-bold text-slate-900 text-xl">{stats[0].value}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Level Selector */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex gap-4">
              <button className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-blue-500 bg-blue-50 transition-all cursor-pointer border-2">
                <span className="text-2xl font-bold text-blue-600">中</span>
                <span className="mt-1 text-xs text-slate-600">表现程度</span>
              </button>
            </div>
          </div>

          {/* Collaborated Videos Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">已合作视频案例</h2>

            <div className="rounded-xl bg-slate-50 p-6 py-5 px-5 mb-6">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">视频合作成果一览</h3>
              <p className="text-sm text-slate-600">探测数据、点击率数据优化推广数据的推广。</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {videoCollaborations.map((video, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white p-6 gap-6 opacity-100 rounded-lg shadow-none transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer mx-0 px-2 py-2 border border-slate-200"
                >
                  <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-3xl bg-slate-200">
                    <img
                      src={video.thumbnail || "/placeholder.svg?height=128&width=192"}
                      alt={video.title}
                      className="h-full w-full object-cover rounded-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base">{video.title}</h3>
                    <p className="mt-2 text-slate-400 text-sm">时长: {video.duration}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-20 w-20">
                      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          strokeDashoffset={`${2 * Math.PI * 34 * (1 - video.progress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-900">{video.progress}%</span>
                      </div>
                    </div>
                    <div className="text-center text-xs text-slate-500">
                      <div>{""}</div>
                      <div>目标量/曝光量</div>
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
