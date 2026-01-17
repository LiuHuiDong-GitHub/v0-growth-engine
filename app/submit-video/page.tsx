"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Video, Upload, Play, Link } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header"

// Mock product data
const productData = {
  id: "1",
  name: "NoteMaster Pro",
  logoUrl: "/generic-app-logo.png",
  tags: ["效率工具", "笔记工具", "AI工具"],
}

interface VideoItem {
  id: string
  imageUrl: string | null
  videoLink: string
  linkError: string
  linkSubmitted: boolean
}

export default function SubmitVideoPage() {
  const router = useRouter()
  const [videoItems, setVideoItems] = useState<VideoItem[]>([
    { id: "1", imageUrl: null, videoLink: "", linkError: "", linkSubmitted: false },
    { id: "2", imageUrl: null, videoLink: "", linkError: "", linkSubmitted: false },
    { id: "3", imageUrl: null, videoLink: "", linkError: "", linkSubmitted: false },
  ])
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!focusedItemId) return

      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              setVideoItems((prevItems) =>
                prevItems.map((item) =>
                  item.id === focusedItemId ? { ...item, imageUrl: event.target?.result as string } : item,
                ),
              )
            }
            reader.readAsDataURL(file)
            e.preventDefault()
            break
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [focusedItemId])

  const validateVideoLink = (value: string): string => {
    if (!value.trim()) return ""

    const wwwPattern = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/
    if (wwwPattern.test(value)) {
      return ""
    }

    try {
      new URL(value)
      return ""
    } catch {
      return "请输入有效的链接格式 (如: https://example.com 或 www.example.com)"
    }
  }

  const handleImageUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setVideoItems((items) =>
          items.map((item) => (item.id === itemId ? { ...item, imageUrl: e.target?.result as string } : item)),
        )
      }
      reader.readAsDataURL(file)
    }
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleImageClick = (itemId: string) => {
    const item = videoItems.find((i) => i.id === itemId)
    if (item?.imageUrl && item?.videoLink && !item.linkError) {
      let url = item.videoLink
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
      }
      window.open(url, "_blank")
    } else if (!item?.imageUrl) {
      fileInputRefs.current[itemId]?.click()
    }
  }

  const handleLinkChange = (itemId: string, value: string) => {
    const error = validateVideoLink(value)
    setVideoItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, videoLink: value, linkError: error, linkSubmitted: false } : item,
      ),
    )
  }

  const handleLinkBlur = (itemId: string) => {
    setVideoItems((items) =>
      items.map((item) => {
        if (item.id === itemId && item.videoLink && !item.linkError) {
          return { ...item, linkSubmitted: true }
        }
        return item
      }),
    )
  }

  const handleLinkKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleLinkBlur(itemId)
      ;(e.target as HTMLInputElement).blur()
    }
  }

  const handleLinkTextClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setVideoItems((items) => items.map((item) => (item.id === itemId ? { ...item, linkSubmitted: false } : item)))
  }

  const handleDeleteItem = (itemId: string) => {
    if (videoItems.length <= 1) return
    setVideoItems((items) => items.filter((item) => item.id !== itemId))
  }

  const handleAddItem = () => {
    const newId = Date.now().toString()
    setVideoItems([...videoItems, { id: newId, imageUrl: null, videoLink: "", linkError: "", linkSubmitted: false }])
  }

  const canOpenLink = (item: VideoItem) => {
    return item.imageUrl && item.videoLink && !item.linkError
  }

  const formatLinkDisplay = (link: string) => {
    try {
      let url = link
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
      }
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace("www.", "")
      return domain.length > 20 ? domain.substring(0, 20) + "..." : domain
    } catch {
      return link.length > 20 ? link.substring(0, 20) + "..." : link
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <AppHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Main Card */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Section */}
            <div className="px-8 pt-8 pb-6">
              {/* Product Name */}
              <h1 className="text-center text-xl font-bold text-slate-900 mb-4">{productData.name}</h1>

              {/* Circular Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={productData.logoUrl || "/placeholder.svg"}
                    alt={productData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Tags */}
              <div className="flex flex-wrap justify-center gap-2">
                {productData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200" />

            {/* Video Items Grid */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {videoItems.map((item) => (
                  <div key={item.id} className="relative group">
                    {videoItems.length > 1 && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    <div
                      onClick={() => handleImageClick(item.id)}
                      onMouseEnter={() => setFocusedItemId(item.id)}
                      onMouseLeave={() => setFocusedItemId(null)}
                      className={`relative w-full aspect-video rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer ${
                        item.imageUrl
                          ? "border-transparent"
                          : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                      } ${canOpenLink(item) ? "hover:ring-2 hover:ring-blue-400 hover:ring-offset-2" : ""}`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => {
                          fileInputRefs.current[item.id] = el
                        }}
                        onChange={(e) => handleImageUpload(item.id, e)}
                      />

                      {item.imageUrl ? (
                        <>
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          {canOpenLink(item) && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
                                <Play className="w-8 h-8 text-white/80 drop-shadow-lg" fill="currentColor" />
                              </div>
                            </div>
                          )}
                          {item.videoLink && !item.linkError && item.linkSubmitted && (
                            <div
                              onClick={(e) => handleLinkTextClick(item.id, e)}
                              className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md flex items-center gap-1 cursor-pointer hover:bg-black/70 transition-all animate-in slide-in-from-bottom-2 fade-in duration-300"
                            >
                              <Link className="w-3 h-3 text-white/80" />
                              <span className="text-[10px] text-white/90 font-medium truncate max-w-[100px]">
                                {formatLinkDisplay(item.videoLink)}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                            <Upload className="w-5 h-5 text-slate-400" />
                          </div>
                          <span className="text-xs text-slate-500">上传封面图</span>
                          {focusedItemId === item.id && (
                            <span className="text-[10px] text-blue-500 animate-pulse">按 Ctrl+V 粘贴截图</span>
                          )}
                        </div>
                      )}
                    </div>

                    {(!item.linkSubmitted || !item.videoLink) && (
                      <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <input
                            type="text"
                            value={item.videoLink}
                            onChange={(e) => handleLinkChange(item.id, e.target.value)}
                            onBlur={() => handleLinkBlur(item.id)}
                            onKeyDown={(e) => handleLinkKeyDown(e, item.id)}
                            placeholder="请输入视频链接..."
                            className={`flex-1 text-sm bg-transparent border-b transition-colors outline-none py-1 placeholder:text-slate-400 placeholder:font-normal placeholder:text-xs ${
                              item.linkError
                                ? "border-red-300 text-red-600 focus:border-red-500"
                                : item.videoLink
                                  ? "border-blue-300 text-blue-600 focus:border-blue-500"
                                  : "border-slate-200 text-slate-600 focus:border-blue-400"
                            }`}
                          />
                        </div>
                        {item.linkError && <p className="mt-1 text-xs text-red-500">{item.linkError}</p>}
                      </div>
                    )}
                  </div>
                ))}

                <div
                  onClick={handleAddItem}
                  className="relative w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-7 h-7 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-500 font-medium">添加视频</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-8 pb-8 flex justify-center">
              <button
                onClick={() => router.push("/blogger-dashboard")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all py-2.5 h-auto w-[30%]"
              >
                提交视频
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
