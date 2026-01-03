"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Upload, LinkIcon, FileText, Sparkles } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header"

export default function UploadProductPage() {
  const [productScore, setProductScore] = useState<number | null>(null)
  const [showScorePopup, setShowScorePopup] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)
  const [productDescription, setProductDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [agreed, setAgreed] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      const previewUrl = URL.createObjectURL(file)
      setLogoPreviewUrl(previewUrl)
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0])
    }
  }

  const handlePublish = () => {
    const score = 88
    setProductScore(score)
    setIsSubmitted(true)
  }

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(null)
    }
    setShowScorePopup(true)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowScorePopup(false)
    }, 1500)
    setHideTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    }
  }, [hideTimeout])

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
      }
    }
  }, [logoPreviewUrl])

  const handleAIGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setProductDescription(
        `【目标】一款智能云存储服务，解决用户文件管理混乱的问题；\n【解决方案】【目标用户产品卖点】 - 【帮客户解决的需求】\n【核心功能】\n- AI 智能整理：自动识别文件类型和内容\n- 跨平台同步：支持多设备无缝同步\n- 安全加密：军事级加密保护\n\n【用户】针对个人用户和小型团队；\n【场景】第一个场景：工作文件管理；第二个场景：个人照片整理\n\n【效果】1、提高工作效率50%；2、减少文件查找时间；3、保护隐私安全`,
      )
      setIsGenerating(false)
    }, 2000)
  }

  const scoreBreakdown = [
    {
      icon: "🎯",
      name: "痛苦度",
      description: "用户需求强烈且未被满足",
      score: 20,
    },
    {
      icon: "💰",
      name: "支付意愿",
      description: "用户明确表示愿意付费",
      score: 20,
    },
    {
      icon: "⚔️",
      name: "竞品弱度",
      description: "市场竞争弱，或有独特优势",
      score: 20,
    },
    {
      icon: "🔧",
      name: "实现难度",
      description: "产品开发技术难度适中",
      score: 20,
    },
    {
      icon: "⚡",
      name: "病毒系数",
      description: "品易于传播，用户自发推广",
      score: 8,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-16 flex-shrink-0 border-r bg-white">
        <div className="flex h-full flex-col items-center py-6">
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
            <button className="flex flex-col items-center gap-1 text-blue-600 transition-colors hover:text-blue-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs">Dashboard</span>
            </button>

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
                  d="M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <button className="text-slate-400 transition-colors hover:text-slate-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <Breadcrumb
                items={[
                  { label: "注册", href: "/register" },
                  { label: "选择角色", href: "/select-role" },
                  { label: "产品上传" },
                ]}
              />

              <h1 className="mb-6 text-3xl font-bold text-slate-900">产品上传</h1>

              <div className="space-y-6">
                {/* Product Logo Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">产品LOGO上传</label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white transition-colors hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                      <p className="text-sm text-slate-500">
                        {logoFile ? logoFile.name : "拖放LOGO 图片文件或点击上传"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Link */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">产品链接</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      placeholder="请输入您的产品或项目链接"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">产品描述</label>
                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating}
                      className="group relative rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:from-blue-100 hover:to-purple-100 disabled:opacity-50"
                      style={{
                        backgroundImage: "linear-gradient(to right, rgb(239 246 255), rgb(250 245 255))",
                        border: "2px solid transparent",
                        backgroundClip: "padding-box",
                        position: "relative",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{
                          padding: "2px",
                          margin: "-2px",
                          zIndex: -1,
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>{isGenerating ? "生成中..." : "AI生成描述"}</span>
                      </div>
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="【目标】第一句话说明该软件解决什么问题；
【解决方案】【目标用户产品卖点】 - 【帮客户解决的需求】
【核心功能】

【用户】针对....用户；
【场景】第一个场景；一第二个场景...

【效果】1、....效果；2、....效果；"
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Requirements Document Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">需求文档上传 (可选)</label>
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => documentInputRef.current?.click()}
                    className="flex h-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white transition-colors hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="text-center">
                      <FileText className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                      <p className="text-sm text-slate-500">
                        {documentFile ? documentFile.name : "拖放需求文档文件或点击上传"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    id="agree"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <label htmlFor="agree" className="text-sm text-slate-600">
                    我接受早期投资
                  </label>
                </div>

                {/* Publish Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handlePublish}
                    className="w-1/4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                  >
                    发布项目
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">实时预览</h2>
                <div className="mb-4 aspect-video rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-4">
                  <div className="flex h-full items-center justify-center">
                    {logoPreviewUrl ? (
                      <img
                        src={logoPreviewUrl || "/placeholder.svg"}
                        alt="Product Logo"
                        className="max-h-full max-w-full rounded-lg object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-500">您的团队/公司</p>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">产品项目名称/标题</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  这里是您的项目描述，它将展示在的推广者，请详细描述您的产品亮点。
                </p>
              </div>

              {/* Product Score Display */}
              {isSubmitted && productScore !== null && (
                <div
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <h3 className="mb-4 text-center text-sm font-semibold text-slate-700">产品评分</h3>
                  <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(productScore / 100) * 351.86} 351.86`}
                        className="text-blue-600 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">{productScore}</span>
                      <span className="text-xs text-slate-500">分</span>
                    </div>
                  </div>

                  {/* Score Popup */}
                  {showScorePopup && (
                    <div
                      className="absolute -left-80 top-0 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-opacity duration-300"
                      style={{ opacity: showScorePopup ? 1 : 0 }}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">打分评估模型</h4>
                      </div>

                      <p className="mb-4 text-xs leading-relaxed text-slate-600">
                        本评分基于 Lovable 内部真实打分表模型（已迭代 7
                        次），总分100分制，评估您的软件产品在5个维度：痛苦度（Pain Point）、支付意愿（Willingness to
                        Pay）、竞品弱度（Competitive Weakness）、实现难度（Ease of Implementation）和病毒系数（Virality
                        Factor）。每个维度满分20分，总分计算公式：∑维度分。阈值：92+立即开发；&lt;85建议放弃。
                      </p>

                      <div className="mb-4 space-y-2 rounded-lg bg-slate-50 p-3">
                        {scoreBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span>{item.icon}</span>
                              <span className="font-medium text-slate-700">{item.name}</span>
                              <span className="text-slate-500">{item.description}</span>
                            </div>
                            <span className="font-bold text-slate-900">{item.score}分</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg bg-blue-50 p-3">
                        <h5 className="mb-2 text-sm font-bold text-slate-900">
                          基于您的评分（{productScore}.0）的改进建议
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-700">
                          <li>• 痛苦度低：调研更多用户反馈，确保过去48h内至少20人表达明确痛点。</li>
                          <li>• 支付意愿弱：优化定价模型，目标用户应明确表示愿意月付$10+。</li>
                          <li>• 竞品弱度不足：分析1-2个弱竞品，突出您的独特卖点。</li>
                          <li>• 实现难度高：简化MVP，优先交付关键功能。</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
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
