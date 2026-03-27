"use client"

import { RefObject } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate, getTodayDay, isCurrentMonth } from "@/lib/product-calendar-utils"

/** 日历格数据（与 product-calendar-utils 一致） */
type CalendarData = { days: (number | null)[]; year: number; month: number }

/**
 * 确定发布时间日历弹层
 * 设计意图：纯展示 + 回调，日历工具函数由父级或 lib 提供
 */
export function ProductCalendarPicker({
  calendarRef,
  isOpen,
  calendarMonth,
  setCalendarMonth,
  selectedDate,
  setSelectedDate,
  setShowCalendar,
  calendar,
  isPastDate,
  onSelectDate,
  onSelectToday,
}: {
  calendarRef: RefObject<HTMLDivElement | null>
  isOpen: boolean
  calendarMonth: Date
  setCalendarMonth: (d: Date) => void
  selectedDate: string | null
  setSelectedDate: (s: string | null) => void
  setShowCalendar: (v: boolean) => void
  calendar: CalendarData
  isPastDate: (year: number, month: number, day: number) => boolean
  onSelectDate: (day: number) => void
  onSelectToday: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      ref={calendarRef}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={() =>
            setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
          }
          className="p-1 hover:bg-slate-100 rounded transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </button>
        <span className="text-sm font-semibold text-slate-700 flex-1 text-center">
          {calendarMonth.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
        </span>
        <button
          onClick={() =>
            setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
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
        {calendar.days.map((day, index) => {
          const isDisabled = day !== null && isPastDate(calendar.year, calendar.month, day)
          const isToday = day !== null && isCurrentMonth(calendarMonth) && day === getTodayDay()
          const isSelected =
            day !== null && selectedDate === formatDate(calendar.year, calendar.month, day)

          return (
            <div key={index} className="aspect-square">
              {day !== null ? (
                <button
                  onClick={() => !isDisabled && onSelectDate(day)}
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
          onClick={onSelectToday}
          className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          今天
        </button>
        <button
          onClick={() => {
            setSelectedDate(null)
            setShowCalendar(false)
          }}
          className="flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          清空
        </button>
      </div>
    </div>
  )
}
