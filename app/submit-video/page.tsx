"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AppHeader from "@/components/app-header"
import Breadcrumb from "@/components/breadcrumb"
import { LinkIcon, Play, Check, X, Upload, Info, ChevronDown } from "lucide-react"

export default function SubmitVideo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")
  const projectName = searchParams.get("projectName") || "示例产品名称"
  const projectCategory = searchParams.get("category") || "电子产品"

  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [videoLinks, setVideoLinks] = useState([{ platform: "", url: "", customName: "" }])
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null)
  const [platformSearch, setPlatformSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const platforms = [
    "YouTube",
    "Instagram",
    "TikTok",
    "Facebook",
    "WhatsApp",
    "Snapchat",
    "Pinterest",
    "Reddit",
    "LinkedIn",
    "X (Twitter)",
    "小红书",
    "Bilibili",
    "抖音",
    "快手",
    "自定义",
  ]

  const getAvailablePlatforms = (currentIndex: number) => {
    const selectedPlatforms = videoLinks
      .map((link, index) => (index !== currentIndex ? link.platform : null))
      .filter((p) => p !== null && p !== "自定义")
    return platforms.filter((p) => !selectedPlatforms.includes(p))
  }

  const filteredPlatforms = (currentIndex: number) =>
    getAvailablePlatforms(currentIndex).filter((p) => p.toLowerCase().includes(platformSearch.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownIndex(null)
        setPlatformSearch("")
      }
    }

    if (activeDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdownIndex])

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("提交成功！我们的审核团队将在24小时内处理并通过邮件通知您。")
    router.push(`/blogger-video/${projectId}?status=submitted`)
  }

  const handleCancel = () => {
    router.back()
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
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePlatformSelect = (platform: string, index: number) => {
    const newLinks = [...videoLinks]
    newLinks[index].platform = platform
    if (platform !== "自定义") {
      newLinks[index].customName = ""
    }
    setVideoLinks(newLinks)
    setPlatformSearch("")
    setActiveDropdownIndex(null)
  }

  const handleVideoUrlChange = (index: number, value: string) => {
    const newLinks = [...videoLinks]
    newLinks[index].url = value
    setVideoLinks(newLinks)
  }

  const handleCustomNameChange = (index: number, value: string) => {
    const newLinks = [...videoLinks]
    newLinks[index].customName = value
    setVideoLinks(newLinks)
  }

  const handleAddVideoLink = () => {
    setVideoLinks([...videoLinks, { platform: "", url: "", customName: "" }])
  }

  const handleRemoveVideoLink = (index: number) => {
    if (videoLinks.length > 1) {
      setVideoLinks(videoLinks.filter((_, i) => i !== index))
    }
  }

  const handleCustomPlatformInput = (index: number, value: string) => {
    const newLinks = [...videoLinks]
    newLinks[index].customName = value
    setVideoLinks(newLinks)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb
          items={[
            { label: "首页", href: "/" },
            { label: "我的推广", href: "/my-promotions" },
            { label: "提交视频信息" },
          ]}
        />

        <div className="mt-8 text-center mb-5">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent text-3xl">
            提交视频信息
          </h1>
          <p className="text-slate-600 leading-7 text-base">此表单用于提交您的视频链接和视频封面图片</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Section 1: 推广产品 */}
          <div className="border-b border-slate-200 pb-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">推广产品</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="overflow-hidden shadow-md ring-2 ring-blue-100 rounded-lg">
                  <img
                    src="/vintage-camera-still-life.png"
                    alt="Product"
                    className="object-cover w-28 h-28 rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{projectName}</h3>
                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {projectCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 视频链接 */}
          <div className="border-b border-slate-200 py-8">
            <h2 className="mb-4 font-bold text-slate-800 text-lg">视频链接 (URL)</h2>
            {videoLinks.map((link, index) => (
              <div key={index} className="mb-4">
                <div className="flex gap-[4px] items-start">
                  <div className="relative w-40" ref={activeDropdownIndex === index ? dropdownRef : null}>
                    {link.platform === "自定义" ? (
                      <input
                        type="text"
                        placeholder="输入平台名称"
                        value={link.customName}
                        onChange={(e) => handleCustomPlatformInput(index, e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 py-2 text-sm px-3"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => {
                          setActiveDropdownIndex(activeDropdownIndex === index ? null : index)
                          setPlatformSearch("")
                        }}
                        className="rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-sm text-left font-medium hover:border-blue-300 py-2 flex items-center justify-between px-2 w-full"
                      >
                        <span className={`truncate ${!link.platform ? "text-slate-400" : "text-slate-800"}`}>
                          {link.platform || "选择视频平台"}
                        </span>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      </button>
                    )}
                    {activeDropdownIndex === index && link.platform !== "自定义" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="搜索平台..."
                          value={platformSearch}
                          onChange={(e) => setPlatformSearch(e.target.value)}
                          className="w-full px-3 py-2 border-b border-slate-200 text-sm focus:outline-none sticky top-0 bg-white"
                          autoFocus
                        />
                        {filteredPlatforms(index).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => handlePlatformSelect(platform, index)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm text-slate-700 transition-colors"
                          >
                            {platform}
                          </button>
                        ))}
                        {filteredPlatforms(index).length === 0 && (
                          <div className="px-3 py-2 text-sm text-slate-400 text-center">没有可用的平台</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* URL Input */}
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <LinkIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                      placeholder="输入完整的视频URL地址"
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 py-2 text-sm pl-10 pr-3"
                    />
                  </div>

                  {/* Remove Button */}
                  {videoLinks.length > 1 && (
                    <button
                      onClick={() => handleRemoveVideoLink(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Video Link Button */}
            <button
              onClick={handleAddVideoLink}
              className="px-4 py-[0.22rem] text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mt-0.55"
            >
              + URL
            </button>
            <p className="mt-2 text-slate-400 text-xs px-4">请选择对应的自媒体平台，并输入完整的视频URL地址</p>
          </div>

          {/* Section 3: 视频首屏截图 */}
          <div className="border-b border-slate-200 py-8">
            <h2 className="mb-4 font-bold text-slate-800 text-lg">视频首屏截图</h2>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group flex items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all py-[88px] px-1 min-h-[352px] mx-auto w-[90%] ${
                  isDragging
                    ? "border-blue-500 bg-blue-100"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <Upload
                  className={`h-6 w-6 transition-colors ${isDragging ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"}`}
                />
                <span
                  className={`text-base font-medium transition-colors ${isDragging ? "text-blue-600" : "text-slate-600 group-hover:text-blue-600"}`}
                >
                  点击上传封面图片
                </span>
              </div>
            </label>
            <p className="mt-2 text-sm text-slate-500 text-center leading-4">支持PNG, JPG, GIF文件，最大5MB</p>
          </div>

          {/* Section 4: 视频预览 */}
          <div className="pt-8">
            <h2 className="mb-4 font-bold text-slate-800 text-lg">视频预览</h2>
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 min-h-[352px] w-[90%] mx-auto">
              {thumbnail ? (
                <div className="relative">
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt="Video thumbnail"
                    className="max-h-80 rounded-xl object-cover shadow-2xl ring-4 ring-white"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl transition-transform hover:scale-110">
                      <Play className="h-10 w-10 text-white" fill="white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-slate-300 p-6">
                    <Play className="h-12 w-12 text-slate-500" />
                  </div>
                  <p className="text-slate-500">视频预览将在此显示</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-6 mt-3.5 flex-row leading-3">
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || videoLinks.some((link) => !link.url || (link.platform === "自定义" && !link.customName))
            }
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:hover:brightness-100 leading-3 py-2 px-4 rounded-lg font-bold"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                提交中...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                提交
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2 border-2 border-slate-300 bg-white text-slate-700 shadow-md transition-all hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 leading-3 font-bold px-5 rounded-lg py-1.5"
          >
            <X className="h-5 w-5" />
            取消
          </button>
        </div>

        {/* Info Alert */}
        <div className="flex gap-4 rounded-xl bg-blue-50 p-5 items-center mt-8 justify-end py-0">
          <Info className="h-6 w-6 shrink-0 text-slate-400" />
          <p className="text-sm leading-relaxed text-slate-400">
            提交后我们的审核团队将在24小时内处理并通过邮件通知您。
          </p>
        </div>
      </main>
    </div>
  )
}
