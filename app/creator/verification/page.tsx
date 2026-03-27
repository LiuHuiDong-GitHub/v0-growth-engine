"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/app-header"

export default function BloggerVerificationPage() {
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showFollowerInput, setShowFollowerInput] = useState(false)
  const [followerCount, setFollowerCount] = useState<string>("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleSubmit = () => {
    if (!uploadedImage) return
    setIsSubmitting(true)
    setTimeout(() => {
      window.location.href = "/creator/products"
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0] && files[0].type.startsWith("image/")) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return
    setIsMouseDown(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsMouseDown(false)
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleFollowerCountBlur = () => {
    if (followerCount) {
      setShowFollowerInput(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 pb-6 sm:pb-8">
        {/* Title Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">博主认证</h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2">请上传您的博主认证信息，我们将在1-2个工作日内完成审核。</p>
        </div>

        {/* Upload Section - Two Column Layout */}
        <div className="mb-8 sm:mb-12 grid gap-6 sm:gap-8 md:grid-cols-2">
          {/* Left - Upload Area */}
          <div>
            <label className="mb-2 sm:mb-3 block text-xs sm:text-sm font-semibold text-slate-900">上传认证截图</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex h-64 sm:h-80 cursor-pointer flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 border-dashed transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : uploadedImage
                    ? "border-green-500 bg-green-50"
                    : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              {uploadedImage ? (
                <div className="relative h-full w-full">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded"
                    className="h-full w-full rounded-xl sm:rounded-2xl object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                    <p className="text-white text-xs sm:text-sm">点击或拖拽替换图片</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-slate-900">点击上传或拖拽文件到此处</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">支持 PNG、JPG、JPEG 格式</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Preview with Logo */}
          <div className="relative">
            <label className="mb-2 sm:mb-3 block text-xs sm:text-sm font-semibold text-slate-900">认证预览</label>
            <div className="flex h-64 sm:h-80 flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-6 sm:p-8">
              {uploadedImage ? (
                <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-xl">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 sm:mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mx-auto">
                    <svg className="h-10 w-10 sm:h-12 sm:w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">上传图片后显示预览</p>
                </div>
              )}
            </div>

            {showFollowerInput ? (
              <div className="absolute -bottom-10 sm:-bottom-12 right-0">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={followerCount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "")
                      setFollowerCount(value)
                    }}
                    onBlur={() => {
                      if (followerCount) {
                        setShowFollowerInput(false)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && followerCount) {
                        setShowFollowerInput(false)
                      }
                    }}
                    placeholder="输入数字"
                    autoFocus
                    className="w-20 text-sm text-slate-900 bg-white border border-blue-300 rounded px-2 py-1 outline-none focus:border-blue-500 placeholder-slate-400"
                  />
                  <span className="text-sm text-slate-600 font-medium">k</span>
                </div>
              </div>
            ) : followerCount ? (
              <div
                onClick={() => {
                  setShowFollowerInput(true)
                }}
                className="absolute -bottom-12 right-0 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <span className="text-sm font-medium text-slate-700">{followerCount} k 粉丝数</span>
              </div>
            ) : (
              <div className="absolute -bottom-12 right-0">
                <div
                  onClick={() => setShowFollowerInput(true)}
                  className="flex items-center gap-1 cursor-pointer group hover:opacity-80 transition-opacity"
                >
                  <span className="text-base">👉</span>
                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors text-orange-400">
                    填写全网粉丝数
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!uploadedImage || isSubmitting}
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 sm:px-12 py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg cursor-pointer"
          >
            {isSubmitting ? "提交中..." : "提交认证"}
          </button>
        </div>

        {/* Info Text */}
        <p className="mb-10 sm:mb-16 text-center text-xs sm:text-sm text-slate-500 px-4">
          提交后，立即完成审核
        </p>

        {/* Latest Projects Section */}
        <div className="rounded-xl sm:rounded-2xl px-4 sm:px-8 md:px-12 py-8 sm:py-12">
          <h2 className="mb-2 sm:mb-3 text-center text-xl sm:text-2xl font-bold text-slate-900">{"最新待推广项目"}</h2>
          <p className="mb-6 sm:mb-10 text-center text-sm sm:text-base text-slate-600 px-2">浏览最新项目，寻找适合您的合作机会。</p>

          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-[0.9rem] overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              {
                name: "咖啡品牌推广",
                platform: "Youtube",
                tags: ["流行中"],
                description:
                  "为新兴咖啡品牌创作引人入胜的内容，提升品牌知名度和产品销售额。寻找热爱咖啡、善于用故事吸引观众的图",
                price: "$ 500-1000元",
                duration: "期望发布时间",
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
              {
                name: "时尚服饰推荐",
                platform: "Instagram",
                tags: ["流行中"],
                description: "展示最新时尚潮流服饰，分享穿搭技巧和搭配建议，帮助粉丝提升时尚品味和穿搭能力",
                price: "$ 700-1300元",
                duration: "抖音",
                fans: "30K+",
                image: "/product-.jpg?height=200&width=300&query=fashion",
              },
              {
                name: "旅行体验分享",
                platform: "Youtube",
                tags: ["流行中"],
                description: "记录真实旅行经历，分享旅行攻略和当地美食，为观众提供实用的旅游指南和灵感",
                price: "$ 900-1800元",
                duration: "B站",
                fans: "60K+",
                image: "/product-.jpg?height=200&width=300&query=travel",
              },
              {
                name: "健身运动教学",
                platform: "TikTok",
                tags: ["流行中"],
                description: "分享专业健身知识和训练方法，帮助粉丝科学健身，塑造理想身材，传递健康生活理念",
                price: "$ 550-1100元",
                duration: "快手",
                fans: "25K+",
                image: "/product-.jpg?height=200&width=300&query=fitness",
              },
              {
                name: "美妆护肤测评",
                platform: "小红书",
                tags: ["流行中"],
                description: "测评各类美妆护肤产品，分享使用心得和化妆技巧，帮助粉丝选择适合自己的产品",
                price: "$ 650-1250元",
                duration: "微博",
                fans: "40K+",
                image: "/product-.jpg?height=200&width=300&query=beauty",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] w-[240px] sm:w-[280px]"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-40 sm:h-48 w-full object-cover"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-red-700">🔥</span>
                    {product.name}
                  </h3>
                  <p className="mb-3 sm:mb-4 line-clamp-3 text-xs sm:text-sm text-slate-600">{product.description}</p>
                  <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-700">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-[10px] sm:text-xs">{product.price}</span>
                    </span>
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-[10px] sm:text-xs">期望发布时间</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => router.push(`/products/1`)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 text-center border-t-0 py-4 sm:py-3.5">
        <p className="text-xs sm:text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
      </footer>
    </div>
  )
}
