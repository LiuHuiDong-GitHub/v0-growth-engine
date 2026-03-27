/**
 * 产品详情页日历相关纯函数
 * 设计意图：与 UI 解耦，便于单测与复用，避免在组件内写日历逻辑
 */

const SCROLL_AMOUNT = 200

/** 某月日历格：days 为 null（占位）或日期数字；year/month 为当前展示年月 */
export function generateCalendarDays(date: Date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return { days, year, month }
}

/** 格式化为 YYYY-MM-DD，用于选中日期展示与比较 */
export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** 某天是否早于今天（不可选） */
export function isPastDate(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

/** 今天在本月的日期数字 */
export function getTodayDay(): number {
  return new Date().getDate()
}

/** 当前展示的月份是否为当月 */
export function isCurrentMonth(calendarMonth: Date): boolean {
  const today = new Date()
  return (
    calendarMonth.getMonth() === today.getMonth() &&
    calendarMonth.getFullYear() === today.getFullYear()
  )
}

/** 通用横向滚动：供资料区、截图区复用 */
export function scrollRef(
  ref: { current: HTMLDivElement | null },
  direction: "left" | "right"
): void {
  if (!ref.current) return
  ref.current.scrollBy({
    left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
    behavior: "smooth",
  })
}
