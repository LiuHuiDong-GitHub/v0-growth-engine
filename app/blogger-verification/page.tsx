"use client"

import type React from "react"
import { useState } from "react"
import { Upload } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"

export default function BloggerVerificationPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!uploadedImage) return
    setIsSubmitting(true)
    setTimeout(() => {
      window.location.href = "/select-product"
    }, 1000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-[150vh] bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600">GrowthEngine</span>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              完成资料
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              上传粉号
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-8 py-16 pb-[30vh]">
        {/* Breadcrumb navigation */}
        <Breadcrumb
          items={[
            { label: "注册", href: "/register" },
            { label: "角色选择", href: "/select-role" },
            { label: "博主认证" },
          ]}
        />

        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">成为优质博主，第一步：上传自媒体账号截图</h1>
          <p className="text-slate-600">截图仅用于账号验证，不会公开展示或采用于其他用途。</p>
        </div>

        {/* Upload Section - Two Column Layout */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
          <div className="grid grid-cols-2 gap-12">
            {/* Left: Upload Area */}
            <div>
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white transition-all hover:border-blue-400 hover:bg-slate-50">
                  {uploadedImage ? (
                    <div className="relative h-full w-full p-4">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded"
                        className="mx-auto max-h-72 rounded-lg object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-4 h-16 w-16 text-slate-400" />
                      <p className="mb-2 text-lg font-medium text-slate-700">点击或拖拽文件上传</p>
                      <p className="text-sm text-slate-500">支持PNG, JPG, GIF文件，最大5MB</p>
                    </>
                  )}
                </div>
              </label>
              <p className="mt-4 text-xs text-slate-500">推荐尺寸：1080x1920像素，请确保截图清晰可见账号和粉丝数据。</p>
            </div>

            {/* Right: Phone Mockup Preview */}
            <div className="flex items-center justify-center">
              <img
                src="/images/image.png"
                alt="Preview example"
                className="h-auto w-full max-w-sm rounded-2xl object-contain"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!uploadedImage || isSubmitting}
            className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "提交中..." : "提交审核"}
          </button>
        </div>

        {/* Info Text */}
        <p className="mb-16 text-center text-sm text-slate-600">上传截图后，我们将会审核保质，请稍等待。</p>

        {/* Latest Projects Section */}
        <div className="rounded-2xl bg-slate-50 px-12 py-12">
          <h2 className="mb-3 text-center text-2xl font-bold text-slate-900">最新待推广项目（实时更新）</h2>
          <p className="mb-10 text-center text-slate-600">浏览最新项目，寻找适合您的合作机会。</p>

          {/* Product Cards */}
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "咖啡品牌推广",
                platform: "Youtube",
                tags: ["流行中"],
                description:
                  "为新兴咖啡品牌创作引人入胜的内容，提升品牌知名度和产品销售额。寻找热爱咖啡、善于用故事吸引观众的图",
                price: "$ 500-1000元",
                duration: "月期",
                fans: "10K+",
                image: "/images/coffee-demo.jpg",
              },
              {
                name: "科技产品评测",
                platform: "Youtube",
                tags: ["流行中"],
                description:
                  "评测最新智能穿戴设备，分享使用体验和实测视频，帮助用户产做出购买决策。需要对科技产品深入了解",
                price: "$ 800-1500元",
                duration: "小红书",
                fans: "50K+",
                image: "/product-.jpg?height=200&width=300&query=tech-review",
              },
              {
                name: "健康美食分享",
                platform: "TikTok",
                tags: ["流行中"],
                description:
                  "推广健康有机食材，制作创意食谱，引导健康生活方式。寻找热爱美食、懂营养保健的美食博主分享的健康生活理",
                price: "$ 600-1200元",
                duration: "健康视频号",
                fans: "20K+",
                image: "/product-.jpg?height=200&width=300&query=healthy-food",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">🔥</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{product.name}</h3>
                  <p className="mb-4 line-clamp-3 text-sm text-slate-600">{product.description}</p>
                  <div className="mb-4 flex items-center gap-4 text-sm text-slate-700">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {product.price}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {product.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {product.fans}
                    </span>
                  </div>
                  <button className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <p className="text-center text-sm text-slate-500">© 2025 GrowthEngine. All rights reserved.</p>
      </footer>
    </div>
  )
}
