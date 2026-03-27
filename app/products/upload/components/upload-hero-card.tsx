"use client"

import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
  ImageIcon,
  FileText,
  Download,
  Play,
  X,
  Plus,
  ChevronDown,
  ImagePlus,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { presetTags } from "../lib/upload-mock-data"
import { generateCalendarDays } from "../lib/upload-calendar-utils"
import type { UploadFormResult } from "../hooks/use-upload-form"

/**
 * 产品上传页主卡：Logo、产品信息、标签、日历、描述、展示、资料、协议（步骤 2 拆分）
 * 仅做展示与事件转发，不包含业务逻辑。
 */
export function UploadHeroCard({ form }: { form: UploadFormResult }) {
  const { productData, refs, state, handlers } = form
  const r = refs
  const s = state
  const h = handlers

  return (
    <div className="flex-1 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="relative">
        {/* Top: Logo + Info + Medal */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
          <div className="flex-shrink-0 relative mx-auto sm:mx-0">
            <input
              ref={r.fileInputRef}
              type="file"
              accept="image/*"
              onChange={h.handleImageUpload}
              className="hidden"
            />
            <div
              onClick={h.handleLogoClick}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center shadow-xl shadow-gray-200/30 ring-2 sm:ring-4 ring-white cursor-pointer hover:opacity-90 transition-opacity overflow-hidden group"
            >
              {s.productLogoUrl ? (
                <img src={s.productLogoUrl || "/placeholder.svg"} alt="Product Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-700 transition-colors">上传logo图</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                  <input
                    type="text"
                    value={s.productName}
                    onChange={(e) => s.setProductName(e.target.value)}
                    placeholder="请输入产品名称.."
                    className="text-lg sm:text-2xl font-bold bg-transparent outline-none focus:ring-0 p-0 min-w-0 border border-dotted border-slate-300 text-slate-600 text-center sm:text-left w-full sm:w-auto"
                  />
                </div>
                <textarea
                  ref={r.textareaRef}
                  value={s.productDescription}
                  onChange={h.handleDescriptionChange}
                  placeholder="请填写产品简介..."
                  className="w-full text-xs sm:text-sm leading-relaxed bg-transparent outline-none focus:ring-0 p-0 resize-none border border-dotted border-slate-300 text-slate-700 text-center sm:text-left"
                  rows={2}
                />
                <div className="inline-flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 text-blue-600 text-xs sm:text-sm font-medium transition-colors w-full justify-center sm:justify-start">
                  <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  <input
                    ref={r.linkInputRef}
                    type="text"
                    value={s.productLink}
                    onChange={h.handleLinkChangeWithValidation}
                    onBlur={() => h.updateValidationError("productLink", s.productLink)}
                    placeholder="https://..."
                    className={`bg-transparent outline-none placeholder-slate-400 placeholder:font-normal placeholder:text-[10px] sm:placeholder:text-xs focus:ring-0 p-0 transition-colors border border-dotted max-w-full ${
                      s.validationErrors.productLink ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                    style={{ width: `min(${s.linkInputWidth}px, 100%)` }}
                  />
                  <div ref={r.linkMeasureRef} className="absolute invisible whitespace-nowrap font-medium text-sm">
                    {s.productLink || "If the product has a related link, please enter the product's link. If not, no need to enter."}
                  </div>
                </div>
                {s.validationErrors.productLink && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1 text-center sm:text-left">{s.validationErrors.productLink}</p>
                )}
                {/* Tags */}
                <div className="flex items-center justify-center sm:justify-between mt-2 sm:mt-3">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2" ref={r.tagDropdownRef}>
                    {s.selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-slate-600 bg-slate-100 group hover:bg-slate-200 transition-colors"
                      >
                        {tag}
                        <button onClick={() => h.handleRemoveTag(tag)} className="ml-0.5 text-slate-400 hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <div className="relative">
                      <button
                        onClick={() => s.setShowTagDropdown(!s.showTagDropdown)}
                        className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium hover:bg-blue-100 transition-colors border border-dashed border-blue-300 bg-gray-50 text-slate-500"
                      >
                        <Plus className="h-3 w-3" />
                        添加标签
                        <ChevronDown className={`h-3 w-3 transition-transform ${s.showTagDropdown ? "rotate-180" : ""}`} />
                      </button>
                      {s.showTagDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-2">
                          <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">选择标签</div>
                          <div className="max-h-40 overflow-y-auto px-2">
                            <div className="flex flex-wrap gap-1.5 p-1">
                              {presetTags
                                .filter((tag) => !s.selectedTags.includes(tag))
                                .map((tag, index) => (
                                  <button
                                    key={index}
                                    onClick={() => h.handleAddTag(tag)}
                                    className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                  >
                                    {tag}
                                  </button>
                                ))}
                            </div>
                          </div>
                          <div className="border-t border-slate-100 my-2" />
                          <div className="px-3">
                            {s.isAddingCustomTag ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={s.customTagInput}
                                  onChange={(e) => s.setCustomTagInput(e.target.value)}
                                  onKeyDown={h.handleCustomTagKeyDown}
                                  placeholder="输入自定义标签..."
                                  className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  autoFocus
                                />
                                <button
                                  onClick={h.handleAddCustomTag}
                                  disabled={!s.customTagInput.trim()}
                                  className="px-2 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  添加
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => s.setIsAddingCustomTag(true)}
                                className="w-full text-left px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1.5"
                              >
                                <Plus className="h-3 w-3" />
                                自定义标签
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Medal + Calendar */}
              <div className="flex-shrink-0 relative mx-auto sm:mx-0 mt-4 sm:mt-0">
                <button
                  onClick={h.handleAddToPromotions}
                  disabled={s.isAddingToPromotions || s.addedToPromotions}
                  className={`absolute -top-5 left-1/2 rounded-lg font-semibold text-white shadow-md transition-all w-14 sm:w-16 z-20 h-[24px] sm:h-[26px] text-[10px] sm:text-sm py-0.5 ${
                    s.addedToPromotions
                      ? "bg-green-500 shadow-green-500/25"
                      : s.isAddingToPromotions
                        ? "bg-blue-400 cursor-wait"
                        : s.isTextShaking
                          ? "bg-red-500 shadow-red-500/25 animate-shake-text"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                  }`}
                  style={{ transform: "translate(calc(-50% + 21px), 20px)" }}
                >
                  {s.addedToPromotions ? (
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>已发布</span>
                    </span>
                  ) : s.isAddingToPromotions ? (
                    "..."
                  ) : (
                    "发布"
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
                      fontSize={h.getTextFontSize()}
                      fontWeight="bold"
                      fill="#FFFFFF"
                      style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                    >
                      {s.baseReward}
                    </text>
                  </svg>
                </div>
                <div className="hidden sm:flex absolute top-[120px] sm:top-[138px] -left-[50px] sm:-left-[76px] flex-col items-start gap-2 w-40 sm:w-48">
                  <div className="relative mt-3 ml-[20px]">
                    <div className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                      <span>期望发布时间</span>
                      <button
                        ref={r.dateButtonRef}
                        onClick={() => s.setShowCalendar(!s.showCalendar)}
                        className="font-semibold cursor-pointer hover:text-blue-600 transition-colors text-slate-800"
                      >
                        {s.selectedDate ? (
                          <span>{s.selectedDate}</span>
                        ) : (
                          <span
                            className={`text-red-400 inline-block ${s.isTextShaking ? "animate-shake-text" : ""}`}
                            style={s.isTextShaking ? { animation: "shake-text 0.4s ease-in-out 3" } : undefined}
                          >
                            请选择
                          </span>
                        )}
                      </button>
                    </div>
                    {s.showCalendar && (
                      <div
                        ref={r.calendarRef}
                        className="absolute top-full left-1/2 -translate-x-[70%] mt-2 z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64"
                      >
                        <div className="flex items-center justify-between mb-4 px-1">
                          <button
                            onClick={() =>
                              s.setCalendarMonth(new Date(s.calendarMonth.getFullYear(), s.calendarMonth.getMonth() - 1))
                            }
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            aria-label="Previous month"
                          >
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                          </button>
                          <span className="text-sm font-semibold text-slate-700 flex-1 text-center">
                            {s.calendarMonth.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
                          </span>
                          <button
                            onClick={() =>
                              s.setCalendarMonth(new Date(s.calendarMonth.getFullYear(), s.calendarMonth.getMonth() + 1))
                            }
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            aria-label="Next month"
                          >
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                            <div key={day} className="text-center text-[10px] text-slate-400 font-medium py-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-3">
                          {generateCalendarDays(s.calendarMonth).days.map((day, index) => {
                            const isDisabled = day !== null && h.isPastDate(day)
                            const isToday = day !== null && h.isCurrentMonth() && day === h.getTodayDay()
                            const isSelected =
                              day !== null &&
                              s.selectedDate ===
                                `${s.calendarMonth.getFullYear()}-${String(s.calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                            return (
                              <div key={index} className="aspect-square">
                                {day !== null ? (
                                  <button
                                    onClick={() => !isDisabled && h.handleSelectDate(day)}
                                    disabled={isDisabled}
                                    className={`w-full h-full rounded-lg text-xs font-medium transition-all ${
                                      isDisabled
                                        ? "text-slate-300 cursor-not-allowed bg-slate-50"
                                        : isSelected
                                          ? "bg-blue-600 text-white font-semibold"
                                          : isToday
                                            ? "bg-blue-100 text-blue-600 font-semibold border border-blue-300"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={h.setCalendarMonthTodayAndSelect}
                            className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            今天
                          </button>
                          <button
                            onClick={h.clearSelectedDate}
                            className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            清空
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile calendar row */}
        <div className="flex sm:hidden mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>期望发布时间</span>
              <button
                onClick={() => s.setShowCalendar(!s.showCalendar)}
                className="font-semibold cursor-pointer hover:text-blue-600 transition-colors text-slate-800 ml-auto"
              >
                {s.selectedDate ? (
                  <span>{s.selectedDate}</span>
                ) : (
                  <span
                    className={`text-red-400 inline-block ${s.isTextShaking ? "animate-shake-text" : ""}`}
                    title="建议选择在3日之后的时间，给博主留下足够的视频创作时间"
                  >
                    请选择
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="mt-6 sm:mt-8" ref={r.descriptionContainerRef}>
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-slate-200 bg-white justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => s.setIsDescriptionExpanded(false)}
                    className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                    title="Collapse"
                  >
                    <div className="w-2 h-0.5 bg-white" />
                  </button>
                  <button
                    onClick={() => s.setIsDescriptionExpanded(true)}
                    className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                    title="Expand"
                  >
                    <div className="text-white text-xs font-bold">⤡</div>
                  </button>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5 sm:gap-2">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  产品描述文档
                </span>
              </div>
              <button
                onClick={h.handleAIGenerateDescription}
                disabled={s.isGeneratingDescription}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 mr-1 sm:mr-2"
              >
                <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{s.isGeneratingDescription ? "生成中..." : "AI生成描述"}</span>
                </div>
              </button>
            </div>
            <div
              onClick={() => !s.isDescriptionExpanded && s.setIsDescriptionExpanded(true)}
              className="relative rounded-none bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
            >
              <textarea
                ref={r.documentTextareaRef}
                value={s.documentDescription}
                onChange={(e) => s.setDocumentDescription(e.target.value)}
                placeholder="请输入产品描述文档内容..."
                className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line transition-all duration-500 overflow-y-auto min-h-[20rem] sm:min-h-[36.25rem] opacity-100 border-0 focus:border focus:border-slate-400 focus:outline-none ${
                  s.isDescriptionExpanded ? "max-h-none" : "max-h-[20rem] sm:max-h-[30rem]"
                }`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
        {/* Product display */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
            产品展示上传
          </h3>
          <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden relative shadow-lg border border-slate-200">
            <input
              ref={r.mediaFileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={h.handleMediaUpload}
              className="hidden"
            />
            {s.uploadedMedia.length === 0 || s.activeMediaIndex === null ? (
              <div
                onClick={h.handleMediaUploadClick}
                className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center cursor-pointer hover:from-blue-50 hover:to-indigo-50 transition-all group shadow-none"
              >
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImagePlus className="h-7 w-7 sm:h-10 sm:w-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">上传图片/视频</div>
                </div>
              </div>
            ) : s.uploadedMedia[s.activeMediaIndex].type === "video" ? (
              <video src={s.uploadedMedia[s.activeMediaIndex].url} controls className="w-full h-full object-cover bg-black" />
            ) : (
              <img
                src={s.uploadedMedia[s.activeMediaIndex].url || "/placeholder.svg"}
                alt="Product Media"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="relative group border border-slate-200 rounded-lg bg-white p-2 sm:p-2.5 mt-2 shadow-sm">
            <button
              onClick={() => h.scrollScreenshots("left")}
              style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
            </button>
            <div
              ref={r.screenshotsRef}
              className={`flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide px-6 sm:px-10 ${s.uploadedMedia.length === 0 ? "justify-center" : "justify-start"}`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={h.handleMediaUploadClick}
                className="flex-shrink-0 w-24 h-24 sm:w-36 sm:h-36 rounded-md sm:rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center group"
              >
                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 sm:h-10 sm:w-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
              {s.uploadedMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => h.handleSelectMedia(index)}
                  className={`group flex-shrink-0 w-24 h-24 sm:w-36 sm:h-36 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all relative ${
                    s.activeMediaIndex === index ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  {media.type === "video" ? (
                    <>
                      <video src={media.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="h-4 w-4 text-white" fill="currentColor" />
                      </div>
                    </>
                  ) : (
                    <img src={media.url || "/placeholder.svg"} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={(e) => h.handleDeleteMedia(index, e)}
                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="删除媒体"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
            <button
              onClick={() => h.scrollScreenshots("right")}
              style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
            </button>
          </div>
        </div>
        {/* Documents */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              相关资料上传
            </h3>
          </div>
          <div className="relative">
            <input
              ref={r.documentFileInputRef}
              type="file"
              multiple
              onChange={h.handleFileUpload}
              className="hidden"
            />
            <div className="flex items-center gap-1.5 sm:gap-2">
              {s.uploadedFiles.length > 0 && (
                <button
                  onClick={() => h.scrollFiles("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-slate-200/30 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                </button>
              )}
              <div
                className="flex items-start gap-2 sm:gap-4 flex-nowrap"
                ref={r.documentsRef}
                style={{ overflowX: "auto", scrollBehavior: "smooth", width: "100%" }}
              >
                <div className="flex-shrink-0 flex justify-center items-center">
                  <button
                    onClick={h.handleUploadClick}
                    className="w-28 sm:w-36 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all group text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <div className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">上传文件</div>
                    <div className="text-[10px] sm:text-xs text-slate-400">支持任意格式</div>
                  </button>
                </div>
                {s.uploadedFiles.length > 0 && (
                  <div className="flex gap-2 sm:gap-3 flex-nowrap">
                    {s.uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => h.handleDownloadUploadedFile(file)}
                        className="w-28 sm:w-36 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all group text-center cursor-pointer relative flex-shrink-0"
                      >
                        <FileText className="h-5 w-5 sm:h-7 sm:w-7 mx-auto mb-1.5 sm:mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <div className="text-[9px] sm:text-[10px] font-medium text-slate-700 group-hover:text-blue-700 break-words leading-tight">{file.name}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">{file.size}</div>
                        <button
                          onClick={(e) => h.handleDeleteFile(index, e)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="删除文件"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {s.uploadedFiles.length > 0 && (
                <button
                  onClick={() => h.scrollFiles("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-slate-200/30 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="my-3 sm:my-4 border-t border-slate-200" />
        <div className="mt-3 sm:mt-4 flex justify-center px-4 sm:px-0">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={s.agreed}
                onChange={(e) => s.setAgreed(e.target.checked)}
                id="agree-score-clone"
                className="peer h-5 sm:h-6 w-5 sm:w-6 cursor-pointer appearance-none rounded-full border-slate-300 transition-all checked:border-0 checked:bg-gradient-to-br checked:from-purple-500 checked:to-pink-600 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 leading-7 border-2"
              />
              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 h-3 sm:h-4 w-3 sm:w-4 -translate-x-1/2 -translate-y-[63%] text-white opacity-0 transition-opacity peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="agree-score-clone" className="cursor-pointer text-xs sm:text-sm font-medium text-slate-500 leading-tight text-center">
              我接受早期投资
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
