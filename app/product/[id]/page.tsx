"use client"

import React from "react"

import Link from "next/link"
import { Upload, ChevronDown, Users, TrendingUp, DollarSign, Target, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isAddingToPromotions, setIsAddingToPromotions] = useState(false)
  const [addedToPromotions, setAddedToPromotions] = useState(false)
  const router = useRouter()

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const handleAddToPromotions = () => {
    setIsAddingToPromotions(true)

    // Simulate adding to promotions
    setTimeout(() => {
      setIsAddingToPromotions(false)
      setAddedToPromotions(true)

      // Show success message and redirect after delay
      setTimeout(() => {
        router.push("/my-promotions")
      }, 1500)
    }, 800)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-16 flex-col items-center gap-8 border-r border-slate-200 bg-white py-6">
        <div className="mb-8">
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

        <nav className="flex flex-col gap-6">
          <Link
            href="/select-product"
            className="flex flex-col items-center gap-1 text-blue-600 transition-colors hover:text-blue-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Dashboard</span>
          </Link>

          <button className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-slate-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span className="text-xs">Projects</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-slate-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span className="text-xs">Browse</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-slate-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs">Promoter</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-slate-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">My Promotions</span>
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button className="text-slate-400 transition-colors hover:text-slate-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-16 flex flex-1 flex-col">
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Breadcrumb Navigation */}
              <Breadcrumb
                items={[
                  { label: "首页", href: "/" },
                  { label: "待推广项目", href: "/select-product" },
                  { label: "项目详情" },
                ]}
              />

              {/* Hero Banner */}
              <div className="relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mb-4 flex items-center justify-center gap-2">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                        推荐
                      </span>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                        科技
                      </span>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                        小红书
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold">精品咖啡推广项目</h1>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "粉丝量", value: "1.2M+" },
                  { icon: TrendingUp, label: "时长", value: "¥5000 - ¥10000" },
                  { icon: Target, label: "曝光潜力", value: "城市白领, 咖啡爱好者" },
                  { icon: DollarSign, label: "招募时长", value: "2周" },
                ].map((stat, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      {React.createElement(stat.icon, { className: "h-6 w-6 text-slate-600" })}
                    </div>
                    <div className="text-xs text-slate-600">{stat.label}</div>
                    <div className="font-semibold text-slate-900">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Project Description */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">项目描述</h2>
                <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                  <p>
                    我们正在寻找美食博主来推广我们的精品咖啡店，对主流高品质咖啡的内容，共同推广一款精品咖啡系列。这款咖啡来自世界顶级产区，采用独特的烘焙工艺，旨在为消费者带来世界一流的咖啡体验，采用独特的烘焙工艺，旨在为消费者带来世界一流的咖啡体验。
                  </p>
                  <p>
                    通过您的创意和影响力，向您的粉丝展示没被观看的特殊价值，包含其背后的口味、文化的内涵和价值传递。我们期望借助的专业审美与表达，将我们的专业种类融入中的优质感受。
                  </p>
                </div>
              </div>

              {/* Creator Requirements */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">创作者要求</h2>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>粉丝2万以上或铁粉忠诚度较高的美食创作者主；</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>内容风格的向上，对咖啡文化有独到见解；</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>具备高质量内容的视频拍摄能力；</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>推荐3天发布平台在微博等领域。</span>
                  </li>
                </ul>
              </div>

              {/* Content Guide */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">内容指南（创意简报）</h2>
                <div className="space-y-3 text-sm text-slate-700">
                  <p className="font-medium">我们鼓励创意而有趣的创作方式，您可以以下方式之一一步跟随创作：</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>咖啡泵破解</strong>：分享您如何发现我们的咖啡，描述其独特描述；
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>日常观观模式式</strong>：操作您如何将我们的咖啡融入日常，例如清晨的例行，午茶时光；
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <strong>创意咖啡食谱</strong>：选择用我们的咖啡制作创意做法或做配相关食品。
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    请尊稳内容真实感，能够引发众鸣。视频长度在1-3分钟，图文不不少于500字。
                  </p>
                </div>
              </div>

              {/* Demo Videos */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">示例视频</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group relative aspect-video overflow-hidden rounded-lg bg-slate-100">
                      <img
                        src={`/coffee-demo-${i}.jpg?height=180&width=320&query=coffee-demo-${i}`}
                        alt={`Demo ${i}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                          <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Upload */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">上传演示材料或查看传播</h2>
                <div className="flex min-h-[150px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-blue-400 hover:bg-blue-50">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                    <p className="mb-1 text-sm font-medium text-slate-700">点击上传 或拖放文件</p>
                    <p className="text-xs text-slate-500">PDF, DOCX, JPG, PNG (最大8MB)</p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  上传
                </button>
              </div>

              {/* Related Projects */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">相关项目</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { name: "云盘大师", tags: ["AI智能整理", "跨平台同步"] },
                    { name: "智能温控器", tags: ["节能系统", "语音输出"] },
                    { name: "投资助手", tags: ["实时市场数据", "风险评估"] },
                  ].map((project, index) => (
                    <Link
                      key={index}
                      href={`/product/${index + 1}`}
                      className="group rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.name}`}
                            alt={project.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Application */}
            <div className="space-y-6">
              {/* Investment Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">投放日程</h3>

                <button
                  onClick={() => toggleSection("phase1")}
                  className="mb-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">第一周</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-600 transition-transform ${openSection === "phase1" ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {openSection === "phase1" && (
                  <div className="mb-3 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">第一周的详细计划和目标...</div>
                )}

                <button
                  onClick={() => toggleSection("phase2")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">第二周</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-600 transition-transform ${openSection === "phase2" ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {openSection === "phase2" && (
                  <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">第二周的详细计划和目标...</div>
                )}
              </div>

              {/* Pricing Tiers */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">预算明细</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <span className="text-sm text-slate-700">基础广播</span>
                    <span className="font-semibold text-slate-900">¥5000</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <span className="text-sm text-slate-700">授权使用 (CPC/CPS)</span>
                    <span className="font-semibold text-slate-900">¥0 - ¥5000</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <span className="font-medium text-slate-900">总计</span>
                    <span className="text-lg font-bold text-blue-600">¥5000 - ¥10000</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">联系/品牌信息</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">品牌名称:</span>
                    <p className="text-slate-600">精品咖啡工坊</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">联系邮箱:</span>
                    <p className="text-blue-600">brand@example.com</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">品牌官网:</span>
                    <p className="text-blue-600">www.coffeeshop.com</p>
                  </div>
                </div>
              </div>

              {/* Application */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">申请表单</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">上传号截图</label>
                    <button className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100">
                      支持文/媒体/图片+卡号
                    </button>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">黑色自我介绍</label>
                    <textarea
                      rows={3}
                      placeholder="介绍您的创作风格，以候及这迷合作创案..."
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110">
                    提交申请
                  </button>
                  <p className="text-center text-xs text-red-500">警告:歌曲请确保认可出或申请</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center pb-8">
            <button
              onClick={handleAddToPromotions}
              disabled={isAddingToPromotions || addedToPromotions}
              className={`rounded-xl px-16 py-4 text-lg font-semibold shadow-lg transition-all ${
                addedToPromotions
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:brightness-110"
              } ${isAddingToPromotions ? "cursor-wait opacity-70" : ""} ${addedToPromotions ? "cursor-default" : ""}`}
            >
              {isAddingToPromotions ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  添加中...
                </span>
              ) : addedToPromotions ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  已添加到我的推广
                </span>
              ) : (
                "我推广此项目"
              )}
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-white/50 py-6 text-center">
          <p className="text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
