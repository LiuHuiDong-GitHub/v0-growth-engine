"use client"

import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, Settings, MessageSquare, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export default function Page() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from auth context in production
  const [showCarouselNav, setShowCarouselNav] = useState(false)

  const notifications = [
    { id: 1, title: "新项目申请", message: "云盘大师项目申请已提交", time: "5分钟前" },
    { id: 2, title: "审核通过", message: "您的博主资质已通过审核", time: "1小时前" },
    { id: 3, title: "系统通知", message: "平台将于今晚22:00进行维护", time: "3小时前" },
  ]

  const testimonials = [
    {
      id: 1,
      image: "/images/business-woman.jpg",
      avatar: "/images/profile.png",
      company: "电子产品公司",
      title: "销售额飙升300%",
      description:
        "通过GrowthEngine的智能推荐系统，我们精准定位了潜在客户，并优化了广告投放策略。我们的产品销售额在短短三个月内实现了飙人的3",
      metrics: [
        { label: "销售增长", value: "300%", icon: TrendingUp, color: "text-emerald-600" },
        { label: "新客户", value: "5K+", icon: TrendingUp, color: "text-emerald-600" },
      ],
      quote: "GrowthEngine是推动我们业务增长的关键，效果显著。",
      author: "张经理",
    },
    {
      id: 2,
      image: "/images/colorful-laptop.jpg",
      avatar: "/images/profile.png",
      company: "SaaS平台",
      title: "用户活跃度提升120%",
      description:
        "GrowthEngine帮助我们重新设计了用户引导流程，并实施了个性化内容推送。这使得我们的平台用户活跃度提高了120%，用户留存率也得",
      metrics: [
        { label: "活跃度", value: "120%", icon: TrendingUp, color: "text-blue-600" },
        { label: "满意度", value: "95%", icon: TrendingUp, color: "text-blue-600" },
      ],
      quote: "我们非常满意GrowthEngine带来的改变，它真正理解了用户的需求。",
      author: "李产品经理",
    },
    {
      id: 3,
      image: "/images/education-woman.jpg",
      avatar: "/images/profile.png",
      company: "教育机构",
      title: "报名转化率翻倍",
      description:
        "利用GrowthEngine的数据分析工具，我们精确识别了转化瓶颈，并进行了A/B测试。最终，我们的课程报名转化率实现了翻倍，招生效",
      metrics: [
        { label: "转化率", value: "2X", icon: TrendingUp, color: "text-purple-600" },
        { label: "节省成本", value: "80%", icon: TrendingUp, color: "text-purple-600" },
      ],
      quote: "GrowthEngine的策略设计非常专业，是教育行业增长的得力助手。",
      author: "王校长",
    },
  ]

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push("/upload-product")
    }
  }

  return (
    <div className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-plus-jakarta)]`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl text-gray-900">
                  GrowthEngine
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#showcase" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Showcase
                </a>
                <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                    Sign Up
                  </Button>
                </Link>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-slate-400 transition-colors hover:text-slate-600 p-2"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      3
                    </span>
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-white shadow-lg z-50">
                      <div className="border-b px-4 py-3">
                        <h3 className="font-semibold text-slate-900">通知</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="border-b px-4 py-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <Bell className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-slate-900">{notif.title}</h4>
                                <p className="text-xs text-slate-600">{notif.message}</p>
                                <p className="mt-1 text-xs text-slate-400">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t px-4 py-2 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-700">查看所有通知</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 ring-2 ring-transparent transition-all hover:ring-blue-200"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-white shadow-lg z-50">
                      <button
                        onClick={() => {
                          setShowSettingsModal(true)
                          setShowUserMenu(false)
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <Link
                        href="/message-board"
                        onClick={() => setShowUserMenu(false)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>留言</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight text-balance">
              你的产品准备好被看见了吗?
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              GrowthEngine — 独立创作者的首选引擎，帮助产品高效曝光出圈。
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8 py-6 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
              开始赚钱
            </Button>

            <p className="mt-8 text-sm text-gray-500 leading-relaxed max-w-3xl mx-auto">
              独立开发者的代理产品，已协助数百名创作者用AI和自动化工具，突破了流量瓶颈和产品冷启动困境。
              无需大量人力投入和昂贵的广告费用，即可精准触达目标用户群体。
            </p>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8 lg:p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-gray-900">
                仪表盘 (Dashboard)
              </h2>
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                热门
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Card - 到问答网提问 */}
              <Card className="p-6 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">到问答网提问</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/profile.png"
                        alt="User"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">产品需求简单描述</p>
                        <p className="text-xs text-gray-500">排除 2 条</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-5 h-5 text-blue-600"
                      >
                        <path d="M1 4v6h6M23 20v-6h-6"></path>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/profile.png"
                        alt="User"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">用户画像简要</p>
                        <p className="text-xs text-gray-500">排除 3 条</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-5 h-5 text-purple-600"
                      >
                        <path d="M1 4v6h6M23 20v-6h-6"></path>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Right Card - Reddit 机会区 */}
              <Card className="p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Reddit 机会区</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4 text-green-600"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Totals Leads</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">124</span>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        查看详细信息 →
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4 text-orange-600"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Leads Viewed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">89</span>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        查看详细信息 →
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              真实用户故事：他们如何用 GrowthEngine 实现增长
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              聆听来自世界各地的用户心声，发现GrowthEngine如何助力他们业务腾飞。
            </p>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setShowCarouselNav(true)}
            onMouseLeave={() => setShowCarouselNav(false)}
          >
            <div className="grid md:grid-cols-3 gap-[18px]">
              {testimonials.map((testimonial, idx) => (
                <Card
                  key={testimonial.id}
                  className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Top Image with Avatar */}
                  <div className="relative h-48">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.company}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt="Avatar"
                        className="h-12 w-12 rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {testimonial.company}：{testimonial.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{testimonial.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {testimonial.metrics.map((metric, metricIdx) => {
                        const Icon = metric.icon
                        return (
                          <div key={metricIdx} className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${metric.color}`} />
                            <div>
                              <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
                              <div className="text-xs text-gray-500">{metric.label}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Quote */}
                    <div className="border-l-4 border-blue-500 pl-3 py-2">
                      <p className="text-xs text-gray-700 italic mb-2 line-clamp-2">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-2">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-xs text-gray-600">{testimonial.author}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Hover Navigation Buttons */}
            {showCarouselNav && (
              <>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-700 transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-700 transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white text-lg px-12 py-6 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              立即上传我的产品
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              博主浏览与接单页
            </h2>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-700/50 border-slate-600 p-6 hover:bg-slate-700 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">AI 写评测文</h3>
                    <p className="text-slate-300 text-sm">基于你的产品特性自动生成专业评测</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5 opacity-50">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  AI
                  基于你的产品工具，快速生成独立视图的短文，借助自动化工具，快速完成文章发布，提升你的产品曝光次数，降低成本。
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  查看详情
                </Button>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600 p-6 hover:bg-slate-700 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">自媒体平台工具</h3>
                    <p className="text-slate-300 text-sm">一站式管理所有自媒体渠道</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5 opacity-50">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  为了促使案例相关的程序，确保业务在有效关联的基础下正中安好的第工程性地，目示是有效关联的核心关键。
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  查看详情
                </Button>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600 p-6 hover:bg-slate-700 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-pink-500/20 rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">云部署协作平台</h3>
                    <p className="text-slate-300 text-sm">帮助开发者快速部署到云端</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5 opacity-50">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  提供高效开发工具和教程，帮助你快速完成产品部署。从开发到产品发布，为你的产品助力，地位你的产品力。
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  查看详情
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Reddit Leads Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-12">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Reddit线索预览区
            </h2>
            <p className="text-lg text-gray-600">A海日至截至，来促进您的产品广告。</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "求助：如何作为新的并申请用具单独计算基础资源配置",
                desc: "我想知道如何在Reddit社区中有效推广我的产品。我看到很多成功案例，但不知道从何开始。有没有经验丰富的朋友可以分享一些技巧？",
                votes: 343,
                comments: 28,
              },
              {
                title: "分析：Top10 独立软件开发者背后的增长策略",
                desc: "深度分析了10位独立开发者的增长路径，发现他们都有7个以上持续的增长策略其中Reddit是最重要的渠道之一",
                votes: 678,
                comments: 134,
              },
              {
                title: "讨论：独立开发者如何在竞争中求生存?需要必备的工具是...",
                desc: "作为一个独立开发者，在当前竞争激烈的市场中，我们需要掌握哪些必备工具和技能才能脱颖而出？",
                votes: 512,
                comments: 67,
              },
              {
                title: "分享：我如何一个 গৌরব内一获取到5000个精准用户",
                desc: "一个月前推出了一个简单的效率工具，通过Reddit和其他社区的精准投放，成功获取了5000个用户，这里是我的完整步骤...",
                votes: 892,
                comments: 156,
              },
              {
                title: "产品发布：一款全新的团队协作管理工具 - 极简但强大",
                desc: "大家好！我花了6个月开发了一款团队协作工具，它的设计理念是极简但功能强大，现在免费开放给前1000个用户使用",
                votes: 240,
                comments: 45,
              },
              {
                title: "这是：好手段开有效性理念辅助集合AI备来着创建",
                desc: "最近一直在思考如何把AI真正融入到产品设计流程中，而不是只是当作一个噱头。分享一些我的实践经验和踩过的坑",
                votes: 456,
                comments: 89,
              },
            ].map((lead, i) => (
              <Card
                key={i}
                className="p-6 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg group"
              >
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                  {lead.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{lead.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M18 15l-6-6-6 6"></path>
                      </svg>
                      {lead.votes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      {lead.comments}
                    </span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    查看详情 →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="border-t border-blue-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                  <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg text-gray-900">
                    GrowthEngine
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  GrowthEngine helps indie creators amplify their products online, reaching the right audience with
                  AI-powered tools.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">© 2025 GrowthEngine. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowSettingsModal(false)}
        >
          <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-[600px]">
              {/* Sidebar */}
              <aside className="w-64 border-r bg-slate-50 p-6 rounded-l-2xl">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-600 bg-blue-50">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>仪表盘</span>
                  </button>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    <span>项目</span>
                  </button>

                  <Link
                    href="/select-product"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>浏览</span>
                  </Link>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>推广者</span>
                  </button>

                  <Link
                    href="/my-promotions"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>我的推广</span>
                  </Link>

                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
                    <Settings className="h-5 w-5" />
                    <span>设置</span>
                  </button>

                  <Link
                    href="/message-board"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>留言</span>
                  </Link>
                </nav>
              </aside>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900">设置</h2>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Account Management */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">账号管理</h3>
                        <p className="text-sm text-slate-600">更新您的个人资料和密码</p>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Bell className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold text-slate-900">通知</h3>
                            <p className="text-sm text-slate-600">控制应用通知设置</p>
                          </div>
                          <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`relative h-7 w-12 rounded-full transition-colors ${
                              notificationsEnabled ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                                notificationsEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Verification */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">数据验证</h3>
                        <p className="text-sm text-slate-600">管理您的连接和数据隐私</p>
                      </div>
                    </div>
                  </div>

                  {/* Theme Switch */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-semibold text-slate-900">主题切换</h3>
                            <p className="text-sm text-slate-600">切换应用浅色或深色模式</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setTheme("light")}
                              className={`rounded-lg px-3 py-1.5 text-sm ${
                                theme === "light" ? "bg-slate-200 text-slate-900" : "text-slate-600"
                              }`}
                            >
                              浅色
                            </button>
                            <button
                              onClick={() => setTheme("dark")}
                              className={`rounded-lg px-3 py-1.5 text-sm ${
                                theme === "dark" ? "bg-slate-200 text-slate-900" : "text-slate-600"
                              }`}
                            >
                              深色
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="rounded-xl border border-red-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">退出</h3>
                        <p className="text-sm text-slate-600">从当前设备登出您的账号</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </div>
  )
}
