"use client"

import { RefObject } from "react"
import {
  Globe,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react"
import { formatDate } from "@/lib/product-calendar-utils"
import { isPastDate as isPastDateUtil } from "@/lib/product-calendar-utils"
import { ProductDescription } from "./product-description"
import { ProductMediaSection } from "./product-media-section"
import { ProductDocuments } from "./product-documents"
import { ProductCalendarPicker } from "./product-calendar-picker"

/** 与 useProductDetail 返回值结构一致，便于类型与传参 */
export type ProductDetailState = {
  isDescriptionExpanded: boolean
  setIsDescriptionExpanded: (v: boolean) => void
  isAddingToPromotions: boolean
  addedToPromotions: boolean
  activeMediaType: "video" | "image"
  setActiveMediaType: (v: "video" | "image") => void
  activeScreenshot: number
  setActiveScreenshot: (v: number) => void
  showCalendar: boolean
  setShowCalendar: (v: boolean) => void
  selectedDate: string | null
  setSelectedDate: (v: string | null) => void
  calendarMonth: Date
  setCalendarMonth: (d: Date) => void
  isTextShaking: boolean
  documentsRef: RefObject<HTMLDivElement | null>
  descriptionContainerRef: RefObject<HTMLDivElement | null>
  screenshotsRef: RefObject<HTMLDivElement | null>
  calendarRef: RefObject<HTMLDivElement | null>
  dateButtonRef: RefObject<HTMLButtonElement | null>
  handleAddToPromotions: () => void
  scrollDocuments: (d: "left" | "right") => void
  scrollScreenshots: (d: "left" | "right") => void
  handleDownloadDocument: (name: string) => void
  handleSelectDate: (day: number) => void
  calendar: { days: (number | null)[]; year: number; month: number }
}

/** 与 productData 结构一致（仅用到的字段） */
type ProductInfo = {
  name: string
  description: string
  link: string
  category: { type: string; keywords: string[] }
  timeline: { developerDeadline: string }
  fullDescription: string
  attachments: {
    screenshots: string[]
    documents: Array<{ name: string; size: string; icon: string }>
  }
}

/**
 * 主卡片：头部信息 + 时间线（含日历）+ 描述 + 媒体 + 资料
 * 设计意图：将整块左侧内容封装，便于 page 只做布局与数据注入
 */
export function ProductHeroCard({
  product,
  detail,
}: {
  product: ProductInfo
  detail: ProductDetailState
}) {
  const {
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    isAddingToPromotions,
    addedToPromotions,
    activeMediaType,
    setActiveMediaType,
    activeScreenshot,
    setActiveScreenshot,
    showCalendar,
    setShowCalendar,
    selectedDate,
    setSelectedDate,
    calendarMonth,
    setCalendarMonth,
    isTextShaking,
    descriptionContainerRef,
    screenshotsRef,
    documentsRef,
    calendarRef,
    dateButtonRef,
    handleAddToPromotions,
    scrollDocuments,
    scrollScreenshots,
    handleDownloadDocument,
    handleSelectDate,
    calendar,
  } = detail

  const onSelectToday = () => {
    const today = new Date()
    setCalendarMonth(today)
    setSelectedDate(formatDate(today.getFullYear(), today.getMonth(), today.getDate()))
    setShowCalendar(false)
  }

  return (
    <div className="flex-1 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-visible">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="relative">
        {/* 顶部：Logo、信息、价格勋章与时间线 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
          <div className="flex-shrink-0 relative mx-auto sm:mx-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30 ring-2 sm:ring-4 ring-white">
              <span className="text-2xl sm:text-3xl font-bold text-white">NM</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left">
                    {product.name}
                  </h1>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2 text-center sm:text-left">
                  {product.description}
                </p>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors w-full justify-center sm:justify-start"
                >
                  <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  <span className="truncate">{product.link}</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                </a>
                <div className="flex items-center justify-center sm:justify-between mt-3">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-slate-600 bg-slate-100">
                      {product.category.type}
                    </span>
                    {product.category.keywords.map((keyword, index) => (
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

              {/* 价格勋章 + 我要投稿 + 时间线（桌面） */}
              <div className="flex-shrink-0 relative mx-auto sm:mx-0 mt-4 sm:mt-0">
                <button
                  onClick={handleAddToPromotions}
                  disabled={isAddingToPromotions || addedToPromotions}
                  className={`absolute -top-5 left-1/2 rounded-lg font-semibold text-white text-[10px] sm:text-xs shadow-md transition-all w-14 sm:w-16 h-auto py-1 z-20 ${
                    addedToPromotions
                      ? "bg-green-500 shadow-green-500/25"
                      : isAddingToPromotions
                        ? "bg-blue-400 cursor-wait"
                        : isTextShaking
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
                  <svg
                    viewBox="0 0 100 140"
                    className="w-[55px] sm:w-[67px] h-auto drop-shadow-lg absolute top-0 left-1/2"
                    style={{ transform: "translateX(calc(-50% + 20px)) translateY(36px)" }}
                  >
                    <defs>
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
                    <polygon
                      points="50,0 54,12 62,2 63,15 74,8 72,21 84,17 79,29 92,28 84,38 96,42 86,50 96,58 84,62 92,72 79,71 84,83 72,79 74,92 63,85 62,98 54,88 50,100 46,88 38,98 37,85 26,92 28,79 16,83 21,71 8,72 17,62 4,58 14,50 4,42 16,38 8,28 21,29 16,17 28,21 26,8 37,15 38,2 46,12"
                      fill="url(#medalGold)"
                      stroke="#CC9900"
                      strokeWidth="0.5"
                    />
                    <circle cx="50" cy="50" r="34" fill="url(#medalInner)" stroke="#CC9900" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="#DAA520" strokeWidth="1" />
                    <g transform="translate(33, 92)">
                      <polygon points="0,0 12,0 8,28 0,20" fill="#CC2222" />
                      <polygon points="12,0 16,0 16,4 8,28 8,28" fill="#EE4444" />
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

                {/* 桌面：期望/确定发布时间 + 日历 */}
                <div className="hidden sm:flex absolute top-[120px] sm:top-[148px] -left-[50px] sm:-left-[76px] flex-col items-start gap-2 w-40 sm:w-48">
                  <div className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span>期望发布时间</span>
                    <span className="font-semibold text-slate-700">{product.timeline.developerDeadline}</span>
                  </div>
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
                            style={isTextShaking ? { animation: "shake-scale 0.4s ease-in-out 3" } : undefined}
                            title="建议选择在3日之后的时间，给博主留下足够的视频创作时间"
                          >
                            请选择
                          </span>
                        )}
                      </button>
                    </div>
                    <ProductCalendarPicker
                      calendarRef={calendarRef}
                      isOpen={showCalendar}
                      calendarMonth={calendarMonth}
                      setCalendarMonth={setCalendarMonth}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      setShowCalendar={setShowCalendar}
                      calendar={calendar}
                      isPastDate={isPastDateUtil}
                      onSelectDate={handleSelectDate}
                      onSelectToday={onSelectToday}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端：时间线 */}
        <div className="flex sm:hidden mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>期望发布时间</span>
              <span className="font-semibold text-slate-700 ml-auto">{product.timeline.developerDeadline}</span>
            </div>
            <div className="relative">
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
              <ProductCalendarPicker
                calendarRef={calendarRef}
                isOpen={showCalendar}
                calendarMonth={calendarMonth}
                setCalendarMonth={setCalendarMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setShowCalendar={setShowCalendar}
                calendar={calendar}
                isPastDate={isPastDateUtil}
                onSelectDate={handleSelectDate}
                onSelectToday={onSelectToday}
              />
            </div>
          </div>
        </div>

        <ProductDescription
          containerRef={descriptionContainerRef}
          isExpanded={isDescriptionExpanded}
          onExpand={() => setIsDescriptionExpanded(true)}
          onCollapse={() => setIsDescriptionExpanded(false)}
          content={product.fullDescription}
        />

        <ProductMediaSection
          screenshotsRef={screenshotsRef}
          activeMediaType={activeMediaType}
          setActiveMediaType={setActiveMediaType}
          activeScreenshot={activeScreenshot}
          setActiveScreenshot={setActiveScreenshot}
          screenshots={product.attachments.screenshots}
          onScrollThumbnails={scrollScreenshots}
        />

        <ProductDocuments
          documentsRef={documentsRef}
          documents={product.attachments.documents}
          onScroll={scrollDocuments}
          onDownload={handleDownloadDocument}
        />
      </div>
    </div>
  )
}
