/**
 * 产品上传页日历工具（步骤 2 从 page 抽离，逻辑不变）
 * 纯函数，供 hook 或组件调用。
 */

export function generateCalendarDays(date: Date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  return { days, year, month }
}

export function isPastDate(calendarMonth: Date, day: number): boolean {
  const { year, month } = generateCalendarDays(calendarMonth)
  const cellDate = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return cellDate < today
}

export function getTodayDay(): number {
  return new Date().getDate()
}

export function isCurrentMonth(calendarMonth: Date): boolean {
  const today = new Date()
  return calendarMonth.getMonth() === today.getMonth() && calendarMonth.getFullYear() === today.getFullYear()
}
