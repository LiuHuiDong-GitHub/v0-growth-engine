"use client"

import { RefObject } from "react"
import { ChevronLeft, ChevronRight, ImageIcon, Play } from "lucide-react"

const thumbScrollBtnStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(3px)",
} as const

/**
 * 产品展示区：主图/视频 + 缩略图横向列表
 * 设计意图：展示与切换由 props 控制
 */
export function ProductMediaSection({
  screenshotsRef,
  activeMediaType,
  setActiveMediaType,
  activeScreenshot,
  setActiveScreenshot,
  screenshots,
  onScrollThumbnails,
}: {
  screenshotsRef: RefObject<HTMLDivElement | null>
  activeMediaType: "video" | "image"
  setActiveMediaType: (t: "video" | "image") => void
  activeScreenshot: number
  setActiveScreenshot: (i: number) => void
  screenshots: string[]
  onScrollThumbnails: (direction: "left" | "right") => void
}) {
  return (
    <div className="mt-6 sm:mt-8 shadow-none">
      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
        产品展示
      </h3>
      <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden relative shadow-lg border border-slate-200">
        {activeMediaType === "video" ? (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center group cursor-pointer">
            <img
              src="/product-demo-video-thumbnail.jpg"
              alt="Demo Video"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center shadow-none">
              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-blue-600 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={screenshots[activeScreenshot] || "/placeholder.svg"}
            alt="Product Screenshot"
            className="w-full h-full object-cover shadow-none"
          />
        )}
      </div>
      <div className="relative group border border-slate-200 rounded-lg bg-white p-2 sm:p-3 mt-2 sm:mt-1 shadow-none">
        <button
          onClick={() => onScrollThumbnails("left")}
          style={thumbScrollBtnStyle}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
        </button>
        <div
          ref={screenshotsRef}
          className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide px-6 sm:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => setActiveMediaType("video")}
            className={`flex-shrink-0 w-16 h-11 sm:w-24 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all relative ${
              activeMediaType === "video"
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
            }`}
          >
            <img src="/product-demo-video-thumbnail.jpg" alt="Video" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="h-4 w-4 text-white" fill="currentColor" />
            </div>
          </button>
          {screenshots.map((screenshot, index) => (
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
              <img src={screenshot || "/placeholder.svg"} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <button
          onClick={() => onScrollThumbnails("right")}
          style={thumbScrollBtnStyle}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
        </button>
      </div>
    </div>
  )
}
