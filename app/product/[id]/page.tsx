"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronLeft,
  Users,
  CheckCircle2,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Clock,
  ImageIcon,
  FileText,
  Calendar,
  Zap,
  Download,
  Play,
} from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header"

// Mock product data
const productData = {
  id: "1",
  name: "NoteMaster Pro",
  description:
    "NoteMaster Pro 是一款革命性的智能笔记应用，结合AI技术帮助用户更高效地整理、搜索和回顾笔记内容。支持多平台同步，语音转文字，智能标签分类等功能。",
  fullDescription: `【职场人士的绝命痛点】：每天面对海量信息，难以有效整理和回顾，让NoteMaster Pro瞬间解决，再也不用天天加班要疯掉！

NoteMaster Pro 是一款AI智能分类的效率工具，专为职场人士设计，一劳永逸解决信息整理难题。

- 年龄/性别/地域：18-45岁，男女不限，国内外均可
- 生活场景：办公室、学习、家庭
- 核心痛点：信息过载，难以有效整理和回顾

1. AI智能分类：自动识别笔记内容并归类，让您的笔记井井有条
2. 跨平台同步：支持iOS、Android、Web、桌面端，随时随地访问您的笔记
3. 语音转文字：高精度语音识别，支持多种语言，会议记录更轻松
4. 协作功能：团队共享笔记空间，实时协作编辑
5. 智能搜索：基于语义的全文搜索，快速找到您需要的内容

市面普通产品：只能手动分类、不支持多平台同步、语音转文字功能单一、无法团队协作、搜索功能有限；
我们的产品：AI智能分类、跨平台同步、高精度语音转文字、团队协作、智能搜索，一步到位解决所有痛点。

场景1：
博主在办公室接收到一个紧急会议通知，使用NoteMaster Pro的语音转文字功能快速记录会议内容，并在会议结束后自动分类整理。

场景2：
博主在学习过程中，使用NoteMaster Pro的智能搜索功能快速找到之前学习的笔记，提高学习效率。

场景3：
博主在家庭中，使用NoteMaster Pro的跨平台同步功能在手机、平板和电脑之间无缝切换，管理家庭事务。

- 内测用户反馈：NoteMaster Pro极大地提高了我们的工作效率，节省了大量时间。
- 当前数据（月收入/注册量等）：NoteMaster Pro的月收入达到XX万元，注册用户达到XX万。
- 真实用户评价摘录：NoteMaster Pro是一款非常实用的笔记工具，让我们更好地管理信息。

- 试水套餐：XX元（内容要求 + 时效）
- 标准套餐：XX元（内容要求）
- 佣金比例：XX%
- 历史平均ROI：XX%

**博主拍摄建议**：
- 开箱部分：展示NoteMaster Pro的外观和主要功能。
- 真实场景演示：在办公室、学习和家庭场景中演示NoteMaster Pro的功能。
- 结尾引导：鼓励博主申请合作，提供完整素材包和专属优惠码。

**粉丝使用体验**：
- 第一步：下载并安装NoteMaster Pro。
- 第二步：注册账号并设置个人偏好。
- 第三步：使用语音转文字功能记录会议内容。
- 小贴士：定期备份笔记，确保数据安全。

`,
  link: "https://notemaster.pro",
  contact: {
    name: "张明",
    email: "marketing@notemaster.pro",
    phone: "+86 138-0000-0000",
    website: "https://notemaster.pro",
  },
  category: {
    type: "效率工具",
    keywords: ["笔记工具", "生产力APP"],
  },
  attachments: {
    demoVideo: "/demo-video.mp4",
    screenshots: [
      "/app-screenshot-1.jpg",
      "/app-screenshot-2.jpg",
      "/app-screenshot-3.jpg",
      "/app-screenshot-4.jpg",
      "/app-screenshot-5.jpg",
      "/app-screenshot-6.jpg",
      "/app-screenshot-7.jpg",
    ],
    documents: [
      { name: "产品介绍.pdf", size: "2.4 MB", icon: "📄" },
      { name: "品牌指南.pdf", size: "5.1 MB", icon: "🎨" },
      { name: "素材包.zip", size: "45 MB", icon: "📦" },
      { name: "使用教程.pdf", size: "1.2 MB", icon: "📖" },
      { name: "API文档.pdf", size: "3.8 MB", icon: "⚙️" },
      { name: "案例研究.pdf", size: "4.7 MB", icon: "📊" },
      { name: "媒体包.zip", size: "52.3 MB", icon: "🎬" },
      { name: "常见问题.pdf", size: "0.8 MB", icon: "❓" },
    ],
  },
  progress: "匹配中",
  timeline: {
    developerDeadline: "2025-02-15",
    bloggerDeadline: null,
  },
  pricing: {
    type: "订阅制",
    price: "$9.99/月",
    originalPrice: "$14.99/月",
  },
  incentive: {
    enabled: true,
    baseReward: 500,
    bonusTargets: [
      { views: 10000, bonus: 200 },
      { views: 50000, bonus: 500 },
    ],
  },
  stats: {
    applicants: 12,
    expectedReach: "50万+",
    targetAudience: "职场人士、学生、知识工作者",
  },
}

const progressSteps = [
  { id: "matching", label: "匹配中" },
  { id: "creating", label: "创作中" },
  { id: "created", label: "已创作" },
  { id: "published", label: "已发布" },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isAddingToPromotions, setIsAddingToPromotions] = useState(false)
  const [addedToPromotions, setAddedToPromotions] = useState(false)
  const [activeMediaType, setActiveMediaType] = useState<"video" | "image">("video")
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [isBorderBlinking, setIsBorderBlinking] = useState(false)
  const [isTextShaking, setIsTextShaking] = useState(false)
  const documentsRef = useRef<HTMLDivElement>(null)
  const descriptionContainerRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDescriptionExpanded &&
        descriptionContainerRef.current &&
        !descriptionContainerRef.current.contains(event.target as Node)
      ) {
        setIsDescriptionExpanded(false)
      }
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    if (isDescriptionExpanded || showCalendar) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDescriptionExpanded, showCalendar])

  const handleAddToPromotions = () => {
    if (!selectedDate) {
      setIsBorderBlinking(true)
      setIsTextShaking(true)
      setTimeout(() => setIsBorderBlinking(false), 1500)
      setTimeout(() => setIsTextShaking(false), 1200)
      return
    }

    setIsAddingToPromotions(true)
    setTimeout(() => {
      setIsAddingToPromotions(false)
      setAddedToPromotions(true)
      setTimeout(() => {
        router.push("/my-promotions")
      }, 1500)
    }, 800)
  }

  const getProgressIndex = () => {
    return progressSteps.findIndex((s) => s.label === productData.progress)
  }

  const scrollDocuments = (direction: "left" | "right") => {
    if (documentsRef.current) {
      const scrollAmount = 200
      documentsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollScreenshots = (direction: "left" | "right") => {
    if (screenshotsRef.current) {
      const scrollAmount = 200
      screenshotsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleDownloadDocument = (docName: string) => {
    // Create a mock file URL and trigger download
    const mockUrl = `https://example.com/downloads/${encodeURIComponent(docName)}`
    const link = document.createElement("a")
    link.href = mockUrl
    link.download = docName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateCalendarDays = (date: Date = new Date()) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return { days, year, month }
  }

  const handleSelectDate = (day: number) => {
    const { year, month } = generateCalendarDays(calendarMonth)
    const date = new Date(year, month, day)
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(formattedDate)
    setShowCalendar(false)
  }

  const isPastDate = (day: number) => {
    const { year, month } = generateCalendarDays(calendarMonth)
    const selectedDate = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate < today
  }

  const getTodayDay = () => {
    const today = new Date()
    return today.getDate()
  }

  const isCurrentMonth = () => {
    const today = new Date()
    return calendarMonth.getMonth() === today.getMonth() && calendarMonth.getFullYear() === today.getFullYear()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
          <div className="mx-auto max-w-7xl w-full">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "首页", href: "/" },
                { label: "待推广项目", href: "/select-product" },
                { label: productData.name },
              ]}
            />

            {/* Main Layout: Hero Card + Right Sidebar Cards */}
            <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Hero Section - Main Card */}
              <div className="flex-1 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="relative">
                  {/* Top Section: Logo, Info, Price Medal */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
                    {/* Product Logo */}
                    <div className="flex-shrink-0 relative mx-auto sm:mx-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30 ring-2 sm:ring-4 ring-white">
                        <span className="text-2xl sm:text-3xl font-bold text-white">NM</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left">{productData.name}</h1>
                            {/* Progress Badge */}
                          </div>
                          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2 text-center sm:text-left">
                            {productData.description}
                          </p>

                          {/* Product Link */}
                          <a
                            href={productData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors w-full justify-center sm:justify-start"
                          >
                            <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">{productData.link}</span>
                            <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          </a>

                          {/* Keywords & Timeline Row */}
                          <div className="flex items-center justify-center sm:justify-between mt-3">
                            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
                              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-slate-600 bg-slate-100">
                                {productData.category.type}
                              </span>
                              {productData.category.keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] sm:text-xs font-medium"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Price Medal with Button */}
                        <div className="flex-shrink-0 relative mx-auto sm:mx-0 mt-4 sm:mt-0">
                          <button
                            onClick={handleAddToPromotions}
                            disabled={isAddingToPromotions || addedToPromotions}
                            className={`absolute -top-5 left-1/2 rounded-lg font-semibold text-white text-[10px] sm:text-xs shadow-md transition-all w-14 sm:w-16 h-auto py-1 z-20 ${
                              addedToPromotions
                                ? "bg-green-500 shadow-green-500/25"
                                : isAddingToPromotions
                                  ? "bg-blue-400 cursor-wait"
                                  : isTextShaking // Apply shaking animation
                                    ? "bg-red-500 shadow-red-500/25 animate-shake-text"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                            }`}
                            style={{ transform: "translate(calc(-50% + 21px), 20px)" }}
                          >
                            {addedToPromotions ? (
                              <span className="flex items-center justify-center gap-1">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>已选稿</span>
                              </span>
                            ) : isAddingToPromotions ? (
                              "..."
                            ) : (
                              "我要投稿"
                            )}
                          </button>
                          <div className="w-20 h-28 sm:w-24 sm:h-32 relative">
                            {/* Unified Medal and Ribbon SVG */}
                            <svg
                              viewBox="0 0 100 140"
                              className="w-[55px] sm:w-[67px] h-auto drop-shadow-lg absolute top-0 left-1/2"
                              style={{
                                transform: "translateX(calc(-50% + 20px)) translateY(36px)",
                              }}
                            >
                              <defs>
                                {/* Bright gold gradient matching image */}
                                <linearGradient id="medalGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FFE566" />
                                  <stop offset="25%" stopColor="#FFCC00" />
                                  <stop offset="50%" stopColor="#FFB800" />
                                  <stop offset="75%" stopColor="#FFCC00" />
                                  <stop offset="100%" stopColor="#FFE566" />
                                </linearGradient>
                                <linearGradient id="medalInner" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FFF4A3" />
                                  <stop offset="50%" stopColor="#FFD93D" />
                                  <stop offset="100%" stopColor="#FFB800" />
                                </linearGradient>
                              </defs>

                              {/* Serrated outer edge - starburst pattern */}
                              <polygon
                                points="50,0 54,12 62,2 63,15 74,8 72,21 84,17 79,29 92,28 84,38 96,42 86,50 96,58 84,62 92,72 79,71 84,83 72,79 74,92 63,85 62,98 54,88 50,100 46,88 38,98 37,85 26,92 28,79 16,83 21,71 8,72 17,62 4,58 14,50 4,42 16,38 8,28 21,29 16,17 28,21 26,8 37,15 38,2 46,12"
                                fill="url(#medalGold)"
                                stroke="#CC9900"
                                strokeWidth="0.5"
                              />

                              {/* Inner gold circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="34"
                                fill="url(#medalInner)"
                                stroke="#CC9900"
                                strokeWidth="1.5"
                              />

                              {/* Inner ring */}
                              <circle cx="50" cy="50" r="28" fill="none" stroke="#DAA520" strokeWidth="1" />

                              {/* Laurel wreath left */}

                              {/* Laurel wreath right */}

                              {/* Red Ribbons - 3D fold effect */}
                              <g transform="translate(33, 92)">
                                {/* Left ribbon */}
                                <polygon points="0,0 12,0 8,28 0,20" fill="#CC2222" />
                                <polygon points="12,0 16,0 16,4 8,28 8,28" fill="#EE4444" />
                                {/* Right ribbon */}
                                <polygon points="20,0 32,0 32,20 24,28" fill="#CC2222" />
                                <polygon points="16,0 20,0 24,28 16,4" fill="#EE4444" />
                              </g>

                              <text
                                x="50"
                                y="50"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="22"
                                fontWeight="bold"
                                fill="#FFFFFF"
                                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                              >
                                $69
                              </text>
                            </svg>
                          </div>

                          <div className="hidden sm:flex absolute top-[120px] sm:top-[148px] -left-[50px] sm:-left-[76px] flex-col items-start gap-2 w-40 sm:w-48">
                            {/* Expected publish time */}
                            <div className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500">
                              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                              <span>期望发布时间</span>
                              <span className="font-semibold text-slate-700">
                                {productData.timeline.developerDeadline}
                              </span>
                            </div>

                            {/* Confirmed publish time with calendar picker */}
                            <div className="relative">
                              <div className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span>确定发布时间</span>
                                <button
                                  ref={dateButtonRef}
                                  onClick={() => setShowCalendar(!showCalendar)}
                                  className="font-semibold cursor-pointer hover:text-blue-600 transition-colors text-slate-800"
                                >
                                  {selectedDate ? (
                                    <span>{selectedDate}</span>
                                  ) : (
                                    <span
                                      className={`text-red-400 inline-block ${isTextShaking ? "animate-shake-text" : ""}`}
                                      style={
                                        isTextShaking
                                          ? {
                                              animation: "shake-scale 0.4s ease-in-out 3",
                                            }
                                          : undefined
                                      }
                                      title="建议选择在3日之后的时间，给博主留下足够的视频创作时间"
                                    >
                                      请选择
                                    </span>
                                  )}
                                </button>
                              </div>

                              {/* Calendar Picker Dropdown */}
                              {showCalendar && (
                                <div
                                  ref={calendarRef}
                                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64"
                                >
                                  <div className="flex items-center justify-between mb-4 px-1">
                                    <button
                                      onClick={() =>
                                        setCalendarMonth(
                                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1),
                                        )
                                      }
                                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                                      aria-label="Previous month"
                                    >
                                      <ChevronLeft className="h-4 w-4 text-slate-600" />
                                    </button>
                                    <span className="text-sm font-semibold text-slate-700 flex-1 text-center">
                                      {calendarMonth.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setCalendarMonth(
                                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1),
                                        )
                                      }
                                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                                      aria-label="Next month"
                                    >
                                      <ChevronRight className="h-4 w-4 text-slate-600" />
                                    </button>
                                  </div>

                                  {/* Weekday Headers */}
                                  <div className="grid grid-cols-7 gap-1 mb-2">
                                    {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                                      <div
                                        key={day}
                                        className="text-center text-[10px] text-slate-400 font-medium py-1"
                                      >
                                        {day}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Calendar Days */}
                                  <div className="grid grid-cols-7 gap-1 mb-3">
                                    {generateCalendarDays(calendarMonth).days.map((day, index) => {
                                      const isDisabled = day !== null && isPastDate(day)
                                      const isToday = day !== null && isCurrentMonth() && day === getTodayDay()
                                      const isSelected =
                                        day !== null &&
                                        selectedDate ===
                                          `${generateCalendarDays(calendarMonth).year}-${String(generateCalendarDays(calendarMonth).month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

                                      return (
                                        <div key={index} className="aspect-square">
                                          {day !== null ? (
                                            <button
                                              onClick={() => !isDisabled && handleSelectDate(day)}
                                              disabled={isDisabled}
                                              className={`w-full h-full rounded-lg text-xs font-medium transition-all ${
                                                isDisabled
                                                  ? "text-slate-300 cursor-not-allowed bg-slate-50"
                                                  : isSelected
                                                    ? "bg-blue-600 text-white font-semibold"
                                                    : isToday
                                                      ? "bg-blue-100 text-blue-600 font-semibold border border-blue-300"
                                                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                              }`}
                                            >
                                              {day}
                                            </button>
                                          ) : null}
                                        </div>
                                      )
                                    })}
                                  </div>

                                  <div className="flex gap-2 pt-2 border-t border-slate-200">
                                    <button
                                      onClick={() => {
                                        setCalendarMonth(new Date())
                                        const today = new Date()
                                        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                                        setSelectedDate(formattedDate)
                                        setShowCalendar(false)
                                      }}
                                      className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                    >
                                      今天
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedDate(null)
                                        setShowCalendar(false)
                                      }}
                                      className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                    >
                                      清空
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Timeline Section - shown only on small screens */}
                  <div className="flex sm:hidden mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex flex-col gap-2 w-full">
                      {/* Expected publish time */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>期望发布时间</span>
                        <span className="font-semibold text-slate-700 ml-auto">
                          {productData.timeline.developerDeadline}
                        </span>
                      </div>

                      {/* Confirmed publish time with calendar picker */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>确定发布时间</span>
                        <button
                          ref={dateButtonRef}
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="font-semibold cursor-pointer hover:text-blue-600 transition-colors text-slate-800 ml-auto"
                        >
                          {selectedDate ? (
                            <span>{selectedDate}</span>
                          ) : (
                            <span
                              className={`text-red-400 inline-block ${isTextShaking ? "animate-shake-text" : ""}`}
                              title="建议选择在3日之后的时间，给博主留下足够的视频创作时间"
                            >
                              请选择
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mt-6 sm:mt-8" ref={descriptionContainerRef}>
                    <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                      {/* Document Header */}
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-slate-200 bg-white">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setIsDescriptionExpanded(false)}
                            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md group relative"
                            title="Collapse"
                          >
                            <div className="flex items-center justify-center w-full h-full">
                              <div className="w-2 h-0.5 bg-white" />
                            </div>
                          </button>
                          <button
                            onClick={() => setIsDescriptionExpanded(true)}
                            className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md group relative"
                            title="Expand"
                          >
                            <div className="flex items-center justify-center w-full h-full">
                              <div className="text-white text-xs font-bold">⤡</div>
                            </div>
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5 sm:gap-2">
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          产品描述文档
                        </span>
                      </div>
                      <div
                        className="relative cursor-pointer"
                        onClick={() => {
                          if (!isDescriptionExpanded) {
                            setIsDescriptionExpanded(true)
                          }
                        }}
                      >
                        <div
                          className={`px-4 sm:px-6 py-4 sm:py-5 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line transition-all duration-500 ${
                            isDescriptionExpanded ? "max-h-none" : "overflow-hidden"
                          }`}
                          style={!isDescriptionExpanded ? { maxHeight: "27rem", lineHeight: "1.5rem" } : {}}
                        >
                          {productData.fullDescription}
                        </div>
                        {!isDescriptionExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                            {/* Layer 1: Lightest opacity at top (90% transparent) */}
                            <div className="h-8 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-[1px]" />
                            {/* Layer 2: Gradually increasing opacity */}
                            <div className="h-6 bg-gradient-to-t from-white/25 to-white/10 backdrop-blur-[3px]" />
                            {/* Layer 3: More opacity increase */}
                            <div className="h-6 bg-gradient-to-t from-white/50 to-white/25 backdrop-blur-[5px]" />
                            {/* Layer 4: Heaviest opacity at bottom (30% transparent) */}
                            <div className="h-6 bg-gradient-to-t from-white/70 to-white/50 backdrop-blur-[8px]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Display Section */}
                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      产品展示
                    </h3>
                    {/* Main Display */}
                    <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden relative shadow-lg border border-slate-200">
                      {activeMediaType === "video" ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center group cursor-pointer">
                          <img
                            src="/product-demo-video-thumbnail.jpg"
                            alt="Demo Video"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="h-6 w-6 text-blue-600 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={productData.attachments.screenshots[activeScreenshot] || "/placeholder.svg"}
                          alt="Product Screenshot"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Thumbnails - Video + Screenshots */}
                    <div className="relative group border border-slate-200 rounded-lg bg-white p-2 sm:p-3 mt-2 sm:mt-0">
                      {/* Left navigation button for screenshots */}
                      <button
                        onClick={() => scrollScreenshots("left")}
                        style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </button>

                      {/* Scrollable thumbnails container */}
                      <div
                        ref={screenshotsRef}
                        className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide px-6 sm:px-10"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {/* Video Thumbnail */}
                        <button
                          onClick={() => setActiveMediaType("video")}
                          className={`flex-shrink-0 w-16 h-11 sm:w-24 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all relative ${
                            activeMediaType === "video"
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src="/product-demo-video-thumbnail.jpg"
                            alt="Video"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-4 w-4 text-white" fill="currentColor" />
                          </div>
                        </button>

                        {/* Screenshot Thumbnails */}
                        {productData.attachments.screenshots.map((screenshot, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setActiveMediaType("image")
                              setActiveScreenshot(index)
                            }}
                            className={`flex-shrink-0 w-16 h-11 sm:w-24 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                              activeMediaType === "image" && activeScreenshot === index
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={screenshot || "/placeholder.svg"}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      {/* Right navigation button for screenshots */}
                      <button
                        onClick={() => scrollScreenshots("right")}
                        style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="mt-6 sm:mt-8">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                        相关资料
                      </h3>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => scrollDocuments("left")}
                        style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </button>
                      <div
                        ref={documentsRef}
                        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing px-6 sm:px-10"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {productData.attachments.documents.map((doc, index) => (
                          <div key={index} className="flex-shrink-0 flex flex-col items-center">
                            <div
                              onClick={() => handleDownloadDocument(doc.name)}
                              className="w-28 sm:w-36 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all group text-center cursor-pointer"
                            >
                              <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{doc.icon}</div>
                              <div className="text-[10px] sm:text-xs font-medium text-slate-700 group-hover:text-blue-700 truncate">
                                {doc.name}
                              </div>
                              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">{doc.size}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => scrollDocuments("right")}
                        style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(3px)" }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Cards */}
              <div className="w-full lg:w-56 flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 items-start content-start">
                {/* Incentive Card */}
                <div className="bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-50 border border-amber-200/60 shadow-lg shadow-amber-100/50 overflow-hidden rounded-lg h-fit">
                  {/* Card Header with Trophy */}
                  <div className="relative px-5 pt-5 pb-3">
                    <div className="text-xs font-medium text-amber-700/80">激励金计划</div>
                    <div className="text-lg font-bold text-amber-900 mt-0.5">额外奖励</div>
                  </div>

                  {/* Base Reward */}
                  <div className="mx-4 px-3 py-2.5 rounded-xl bg-white/80 border border-amber-200/50 mb-3">
                    <div className="text-[10px] text-amber-600/80 uppercase tracking-wide">基础推广费</div>
                    <div className="text-xl font-bold text-amber-900">¥{productData.incentive.baseReward}</div>
                  </div>

                  {/* Bonus Targets */}
                  <div className="px-4 pb-4">
                    <div className="text-[10px] text-amber-700/70 mb-2">播放量达标奖励</div>
                    <div className="space-y-1.5">
                      {productData.incentive.bonusTargets.map((target, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/60 border border-amber-100"
                        >
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 text-amber-500" />
                            <span className="text-[11px] text-amber-800">{(target.views / 10000).toFixed(0)}万</span>
                          </div>
                          <span className="text-xs font-semibold text-amber-600">+¥{target.bonus}</span>
                        </div>
                      ))}
                    </div>

                    {/* Max Reward */}
                  </div>

                  {/* Decorative bottom */}
                  <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
                </div>

                {/* Contact Card */}
                <div className="overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200/60 relative rounded-xl h-fit">
                  {/* Postcard decorative stamps */}
                  <div className="absolute top-3 right-3 w-10 h-10 rotate-12">
                    <div className="w-full h-full border-2 border-red-400 bg-red-50 rounded-sm flex items-center justify-center">
                      <Mail className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border border-red-400 bg-red-100 transform rotate-45" />
                  </div>

                  {/* Postcard lines decoration */}
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent opacity-30" />

                  {/* Content */}
                  <div className="relative p-4 space-y-2.5">
                    <div className="text-xs font-semibold text-blue-900 tracking-wide uppercase mb-3">联系方式</div>

                    {/* Contact Name */}
                    <div className="flex items-start gap-2">
                      <Users className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">联系人</div>
                        <div className="text-sm font-semibold text-slate-800">{productData.contact.name}</div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-2">
                      <Mail className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="break-all min-w-0">
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">邮箱</div>
                        <div className="text-[11px] text-slate-700 leading-tight truncate">
                          {productData.contact.email}
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-2">
                      <Phone className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">电话</div>
                        <div className="text-xs text-slate-700">{productData.contact.phone}</div>
                      </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-start gap-2 pt-1 border-t border-blue-100">
                      <Globe className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="break-all min-w-0">
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">网站</div>
                        <a
                          href={productData.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:text-blue-700 underline underline-offset-2 truncate block"
                        >
                          {productData.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Decorative bottom */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Animation for border blink */}
      <style>{`
        @keyframes borderBlink {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.9);
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
          }
        }
        /* Add keyframes for text shake animation */
        @keyframes shake-text {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05) translate(-2px, 0);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.05) translate(2px, 0);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-shake-text {
          animation: shake-text 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  )
}
