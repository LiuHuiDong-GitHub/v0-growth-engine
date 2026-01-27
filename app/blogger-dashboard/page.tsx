"use client"

import { useState, useMemo } from "react"
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
  Play,
  ExternalLink,
} from "lucide-react"

export default function BloggerDashboard() {
  const [selectedQuality, setSelectedQuality] = useState("中")
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null)

  const videoProjects = [
    {
      id: 1,
      title: "产品发布宣传视频",
      duration: "2:35",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      progress: 75,
      // Pre-loaded metrics for this video
      metrics: {
        plays: "8,500",
        likes: "1,200",
        shares: "1,800",
        comments: "650",
        favorites: "2,800",
        percentages: [92, 80, 65, 55, 88],
      },
    },
    {
      id: 2,
      title: "用户案例分享",
      duration: "1:40",
      thumbnail: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
      videoLink: "https://www.bilibili.com/video/BV1xx411c7XW",
      progress: 60,
      metrics: {
        plays: "6,500",
        likes: "600",
        shares: "700",
        comments: "550",
        favorites: "2,200",
        percentages: [85, 70, 60, 50, 82],
      },
    },
  ]

  const totalMetrics = useMemo(() => {
    const totals = {
      plays: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      favorites: 0,
      percentages: [0, 0, 0, 0, 0],
    }

    videoProjects.forEach((video) => {
      totals.plays += Number.parseInt(video.metrics.plays.replace(/,/g, ""))
      totals.likes += Number.parseInt(video.metrics.likes.replace(/,/g, ""))
      totals.shares += Number.parseInt(video.metrics.shares.replace(/,/g, ""))
      totals.comments += Number.parseInt(video.metrics.comments.replace(/,/g, ""))
      totals.favorites += Number.parseInt(video.metrics.favorites.replace(/,/g, ""))
      video.metrics.percentages.forEach((p, i) => {
        totals.percentages[i] += p
      })
    })

    // Average the percentages
    totals.percentages = totals.percentages.map((p) => Math.round(p / videoProjects.length))

    return {
      plays: totals.plays.toLocaleString(),
      likes: totals.likes.toLocaleString(),
      shares: totals.shares.toLocaleString(),
      comments: totals.comments.toLocaleString(),
      favorites: totals.favorites.toLocaleString(),
      percentages: totals.percentages,
    }
  }, [])

  const currentMetrics = useMemo(() => {
    if (hoveredVideo !== null) {
      return videoProjects[hoveredVideo].metrics
    }
    return totalMetrics
  }, [hoveredVideo, totalMetrics])

  const stats = useMemo(
    () => [
      {
        icon: PlayCircle,
        label: "播放量",
        value: currentMetrics.plays,
        color: "text-purple-600",
        ringColor: "#a855f7",
        percentage: currentMetrics.percentages[0],
      },
      {
        icon: Heart,
        label: "点赞量",
        value: currentMetrics.likes,
        color: "text-red-600",
        ringColor: "#fca5a5",
        percentage: currentMetrics.percentages[1],
      },
      {
        icon: Share2,
        label: "分享量",
        value: currentMetrics.shares,
        color: "text-pink-600",
        ringColor: "#f9a8d4",
        percentage: currentMetrics.percentages[2],
      },
      {
        icon: MessageCircle,
        label: "评论量",
        value: currentMetrics.comments,
        color: "text-orange-600",
        ringColor: "#f97316",
        percentage: currentMetrics.percentages[3],
      },
      {
        icon: Star,
        label: "收藏量",
        value: currentMetrics.favorites,
        color: "text-green-600",
        ringColor: "#10b981",
        percentage: currentMetrics.percentages[4],
      },
    ],
    [currentMetrics],
  )

  const handleVideoClick = (videoLink: string) => {
    window.open(videoLink, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <AppHeader />

        <main className="px-4 sm:px-6 md:px-12 py-6 sm:py-8">
          <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-slate-900">我的仪表盘</h1>

          {/* Exposure Goals Section */}
          <div className="mb-8 sm:mb-12 grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-slate-900 pl-0 sm:pl-5">曝光目标</h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-slate-600 pl-0 sm:pl-5">
                {hoveredVideo !== null
                  ? `正在查看: ${videoProjects[hoveredVideo].title}`
                  : "您的产品正曝光在世界各地多数。（显示所有视频总和）"}
              </p>

              {/* Stats Grid - Mobile friendly, aligned with connection lines */}
              <div className="w-full sm:w-auto sm:space-y-0 my-px">
                {stats.map((stat, index) => {
                  const isActive = hoveredStat === index
                  return (
                    <div
                      key={index}
                      className={`flex items-center cursor-pointer transition-all duration-300 rounded-lg px-3 py-2 gap-2 w-fit ${
                        isActive ? "bg-slate-50 shadow-sm" : "hover:bg-slate-50/50"
                      }`}
                      onMouseEnter={() => setHoveredStat(index)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      {/* Color indicator dot - matches connection line start */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isActive ? "scale-125" : ""}`}
                        style={{ backgroundColor: stat.ringColor }}
                      />
                      <stat.icon
                        className={`h-5 w-5 transition-all duration-300 ${isActive ? "scale-110" : ""}`}
                        style={{ color: stat.ringColor }}
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold transition-all duration-300 ${isActive ? "scale-105" : ""}`}
                          style={{ color: stat.ringColor }}
                        >
                          {stat.label}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {stat.value}
                          <span className="text-slate-400 ml-1">({stat.percentage}%)</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Data Visualization - Hidden on mobile, shown on larger screens */}
            <div className="relative hidden sm:flex items-center justify-center">
              {/* SVG Connection Lines - Positioned to connect labels to rings */}
              <svg
                className="absolute pointer-events-none"
                style={{ 
                  left: "-180px", 
                  top: "0",
                  width: "calc(100% + 180px)", 
                  height: "100%" 
                }}
                viewBox="0 0 600 400"
                preserveAspectRatio="xMidYMid meet"
              >
                {stats.map((stat, index) => {
                  // Label positions (left side) - aligned with actual label vertical positions
                  // Each label is spaced 40px apart, starting from top
                  const labelStartX = 120
                  const labelY = 60 + index * 56 // Match the spacing of stats items (space-y-4 = 16px + ~40px item height)

                  // Ring center position in SVG coordinates
                  const chartCenterX = 400
                  const chartCenterY = 200
                  const radius = 180 - index * 30

                  // Connect to the left side of each ring
                  const ringPointX = chartCenterX - radius
                  const ringPointY = chartCenterY

                  // Calculate bezier control points for smooth curves that don't cross
                  // Use different curve intensities based on index to prevent overlap
                  const curveIntensity = 0.4 + (index * 0.08)
                  const midX = (labelStartX + ringPointX) / 2
                  
                  // Control points: first goes horizontal from label, second curves to ring
                  const controlX1 = labelStartX + (ringPointX - labelStartX) * curveIntensity
                  const controlY1 = labelY
                  const controlX2 = midX + 20
                  const controlY2 = ringPointY + (labelY - ringPointY) * 0.3

                  const isActive = hoveredStat === index

                  return (
                    <g key={index} className="transition-all duration-300">
                      {/* Connection line with bezier curve */}
                      <path
                        d={`M ${labelStartX} ${labelY} 
                            C ${controlX1} ${controlY1}, 
                              ${controlX2} ${controlY2}, 
                              ${ringPointX} ${ringPointY}`}
                        fill="none"
                        stroke={stat.ringColor}
                        strokeWidth={isActive ? "2.5" : "1.5"}
                        opacity={hoveredStat !== null && !isActive ? 0.15 : isActive ? 0.9 : 0.5}
                        className="transition-all duration-300"
                      />
                      {/* Start dot at label */}
                      <circle
                        cx={labelStartX}
                        cy={labelY}
                        r={isActive ? "5" : "3"}
                        fill={stat.ringColor}
                        opacity={hoveredStat !== null && !isActive ? 0.15 : isActive ? 1 : 0.7}
                        className="transition-all duration-300"
                      />
                      {/* End dot at ring connection point */}
                      <circle
                        cx={ringPointX}
                        cy={ringPointY}
                        r={isActive ? "6" : "4"}
                        fill={stat.ringColor}
                        opacity={hoveredStat !== null && !isActive ? 0.15 : isActive ? 1 : 0.8}
                        className="transition-all duration-300"
                      />
                      {/* Value tooltip on hover - positioned near ring connection */}
                      {isActive && (
                        <g>
                          <rect
                            x={ringPointX - 45}
                            y={ringPointY - 35}
                            width="90"
                            height="24"
                            rx="4"
                            fill="white"
                            stroke={stat.ringColor}
                            strokeWidth="1"
                            opacity="0.95"
                          />
                          <text
                            x={ringPointX}
                            y={ringPointY - 19}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="600"
                            fill={stat.ringColor}
                          >
                            {stat.label}: {stat.value}
                          </text>
                        </g>
                      )}
                    </g>
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
                        {/* Background ring */}
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
                        {/* Progress ring - percentage driven by data */}
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

                {/* Center display - shows hovered stat info or total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="font-medium text-xs text-slate-500">
                      {hoveredStat !== null ? stats[hoveredStat].label : hoveredVideo !== null ? "视频播放" : "总曝光"}
                    </div>
                    <div className="mt-2 font-bold text-slate-900 text-xl">
                      {hoveredStat !== null ? stats[hoveredStat].value : stats[0].value}
                    </div>
                    {hoveredStat !== null && (
                      <div className="mt-1 text-xs" style={{ color: stats[hoveredStat].ringColor }}>
                        {stats[hoveredStat].percentage}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Level Selector */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="inline-flex gap-4">
              <button className="flex h-20 w-20 sm:h-24 sm:w-24 flex-col items-center justify-center rounded-full border-blue-500 bg-blue-50 transition-all cursor-pointer border-2">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">中</span>
                <span className="mt-1 text-[10px] sm:text-xs text-slate-600">表现程度</span>
              </button>
            </div>
          </div>

          {/* Collaborated Videos Section */}
          <div className="mb-16 sm:mb-24">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">视频</h2>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {videoProjects.map((video, index) => (
                <div
                  key={video.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center bg-white p-3 sm:p-6 gap-3 sm:gap-6 rounded-lg transition-all duration-300 cursor-pointer mx-0 px-2 sm:px-2 py-2 border ${
                    hoveredVideo === index
                      ? "border-blue-400 shadow-lg -translate-y-1 bg-blue-50/30"
                      : "border-slate-200 hover:shadow-lg hover:-translate-y-1"
                  }`}
                  onMouseEnter={() => setHoveredVideo(index)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  onClick={() => handleVideoClick(video.videoLink)}
                >
                  <div className="relative h-40 w-full sm:h-32 sm:w-48 flex-shrink-0 overflow-hidden rounded-xl sm:rounded-3xl bg-slate-200 group">
                    <img
                      src={video.thumbnail || "/placeholder.svg?height=128&width=192"}
                      alt={video.title}
                      className="h-full w-full object-cover rounded-xs"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {/* External link indicator */}
                    <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{video.title}</h3>
                    <p className="mt-1 sm:mt-2 text-slate-400 text-xs sm:text-sm">时长: {video.duration}</p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1 text-xs text-blue-500">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-[200px] sm:max-w-[150px]">{video.videoLink}</span>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center gap-2 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                      <svg className="h-16 w-16 sm:h-20 sm:w-20 -rotate-90" viewBox="0 0 80 80">
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
                        <span className="text-sm sm:text-lg font-bold text-slate-900">{video.progress}%</span>
                      </div>
                    </div>
                    <div className="text-center text-[10px] sm:text-xs text-slate-500">
                      <div>{""}</div>
                      <div>目标量/曝光量</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-16"></div>

          {/* Footer */}
          <footer className="bg-white/50 text-center border-t-0 py-4 sm:py-3.5">
            <p className="text-xs sm:text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
