"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AppHeader from "@/components/app-header"
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { landingTestimonials } from "@/lib/landing-data"

/**
 * 首页/Home 共用内容（步骤 3 去重）
 * 与 app/page、app/home 共用，仅做展示与状态，不含字体配置。
 */
export default function LandingPageContent() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showCarouselNav, setShowCarouselNav] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const testimonialsWithIcon = useMemo(
    () =>
      landingTestimonials.map((t) => ({
        ...t,
        metrics: t.metrics.map((m) => ({ ...m, icon: TrendingUp })),
      })),
    [],
  )

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/login")
    } else {
      router.push("/products/upload")
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <AppHeader />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:pr-8 lg:pl-8 md:py-20 md:pb-[60px] pt-20 sm:pt-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight text-balance px-2">
              你的产品准备好被看见了吗?
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto px-4 sm:mb-[46px]">
              GrowthEngine — 独立创作者的首选引擎，让你的产品被需要的人群看到。
            </p>
            <Button 
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8 py-6 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
              上传产品
            </Button>

            
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[60px]">
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8 lg:p-10 leading-7 sm:px-7 sm:py-7 mx-auto w-3/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-gray-900 font-sans sm:text-2xl">
                网站介绍&amp;展示案例
              </h2>
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                热门
              </span>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* 推广墙 */}
              <Card className="p-8 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
                
                <div className="space-y-6">
                  <div className="flex items-center bg-white gap-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer p-2 hover:border-2 hover:border-blue-200">
                    {/* Left: Video Thumbnail */}
                    <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
                        alt="产品发布宣传视频"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Middle: Video Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">产品发布宣传视频</h3>
                      <p className="mt-2 text-base text-slate-400">时长: 2:35</p>
                    </div>

                    {/* Right: Progress Circle */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-20 w-20">
                        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                          {/* Background circle */}
                          <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                          {/* Progress circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            strokeDashoffset={`${2 * Math.PI * 34 * (1 - 75 / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-900">75%</span>
                        </div>
                      </div>
                      <div className="text-center text-xs text-slate-500">
                        <div>{""}</div>
                        <div>已曝光/目标曝光</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center bg-white gap-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer p-2 hover:border-2 hover:border-blue-200 border-0 px-1 py-1">
                    {/* Left: Video Thumbnail */}
                    <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop"
                        alt="用户案例分享"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Middle: Video Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">用户案例分享</h3>
                      <p className="mt-2 text-base text-slate-400">时长: 1:40</p>
                    </div>

                    {/* Right: Progress Circle */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-20 w-20">
                        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                          {/* Background circle */}
                          <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                          {/* Progress circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            strokeDashoffset={`${2 * Math.PI * 34 * (1 - 75 / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-900">75%</span>
                        </div>
                      </div>
                      <div className="text-center text-xs text-slate-500">
                        <div>{""}</div>
                        <div>已曝光/目标曝光</div>
                      </div>
                    </div>
                  </div>

                  {/* ADDED CARD BELOW STARTS HERE */}
                  <div className="flex items-center bg-white gap-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer p-2">
                    {/* Left: Video Thumbnail */}
                    <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
                        alt="工作流自动化演示"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Middle: Video Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">工作流自动化演示</h3>
                      <p className="mt-2 text-base text-slate-400">时长: 3:12</p>
                    </div>

                    {/* Right: Progress Circle */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-20 w-20">
                        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                          {/* Background circle */}
                          <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                          {/* Progress circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            strokeDashoffset={`${2 * Math.PI * 34 * (1 - 75 / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-900">75%</span>
                        </div>
                      </div>
                      <div className="text-center text-xs text-slate-500">
                        <div>{""}</div>
                        <div>已曝光/目标曝光</div>
                      </div>
                    </div>
                  </div>
                  {/* ADDED CARD BELOW ENDS HERE */}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mt-0 mb-[30px]">
            <Button
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white text-lg px-9 py-6 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              推广产品
            </Button>
          </div>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-0 pt-3.5">
              博主浏览与接单页
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 sm:p-12 rounded-2xl sm:pt-2.5">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/80 border-blue-100 p-6 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">AI 写评测文</h3>
                    <p className="text-gray-600 text-sm">基于你的产品特性自动生成专业评测</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="w-5 h-5">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  AI 基于你的产品工具，快速生成独立视图的短文，借助自动化工具，快速完成文章发布，提升你的产品曝光次数，降低成本。
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  查看详情
                </Button>
              </Card>

              <Card className="bg-white/80 border-purple-100 p-6 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">自媒体平台工具</h3>
                    <p className="text-gray-600 text-sm">一站式管理所有自媒体渠道</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="w-5 h-5">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  为了促使案例相关的程序，确保业务在有效关联的基础下正中安好的第工程性地，目示是有效关联的核心关键。
                </p>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                >
                  查看详情
                </Button>
              </Card>

              <Card className="bg-white/80 border-pink-100 p-6 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ec4899"
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
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">云部署协作平台</h3>
                    <p className="text-gray-600 text-sm">帮助开发者快速部署到云端</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="w-5 h-5">
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  提供高效开发工具和教程，帮助你快速完成产品部署。从开发到产品发布，为你的产品助力，地位你的产品力。
                </p>
                <Button
                  variant="outline"
                  className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
                >
                  查看详情
                </Button>
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
            onMouseLeave={() => {
              setShowCarouselNav(false)
              handleMouseLeave()
            }}
          >
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex gap-[18px] overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {testimonialsWithIcon.map((testimonial) => (
                <Link
                  key={testimonial.id}
                  href={`/products/${testimonial.id}`}
                  className="block flex-shrink-0 w-[350px]"
                >
                  <Card className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-blue-300 h-full">
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
                    <div className="p-6 px-6 shadow-none">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {testimonial.company}：{testimonial.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {testimonial.description}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {testimonial.metrics.map((metric, metricIdx) => {
                          const Icon = metric.icon
                          return (
                            <div key={metricIdx} className="flex flex-col items-center text-center">
                              <Icon className={`h-4 w-4 ${metric.color} mb-1`} />
                              <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                              <div className="text-xs text-gray-500">{metric.label}</div>
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
                </Link>
              ))}
            </div>

            {showCarouselNav && (
              <>
                <button
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollBy({ left: -370, behavior: "smooth" })
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-700 transition-all hover:bg-white hover:scale-110 z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollBy({ left: 370, behavior: "smooth" })
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-700 transition-all hover:bg-white hover:scale-110 z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="border-t border-blue-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 lg:px-7 sm:pl-7 sm:pr-7 pt-5 pb-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-4 leading-6">
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
                <p className="text-sm text-gray-600 leading-relaxed leading-6">
                  An AI-powered growth engine that continuously connects indie products with the right audience.
                </p>
              </div>

              <div className="leading-5">
                <h4 className="font-semibold text-gray-900 mb-4 leading-6">Product</h4>
                <ul className="space-y-2">
                  <li>
                    
                  </li>
                  <li className="leading-6">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      How It Works
                    </a>
                  </li>
                  <li className="leading-6">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4 leading-6">Legal</h4>
                <ul className="space-y-2">
                  <li className="leading-6">
                    <Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="leading-6">
                    <Link href="/legal/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4 leading-6">Support</h4>
                <ul className="space-y-2">
                  <li className="leading-6">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Support
                    </a>
                  </li>
                  <li className="leading-6">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 pt-2.5">
              <p className="text-sm text-gray-500">© 2025 GrowthEngine. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.85 1.235 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

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
    </>
  )
}
