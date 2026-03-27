"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  generateCalendarDays,
  formatDate,
  scrollRef,
} from "@/lib/product-calendar-utils"
import { useClickOutside } from "./use-click-outside"

/**
 * 产品详情页状态与交互逻辑
 * 设计意图：容器与展示分离，页面只负责组合 hook 与组件
 */
export function useProductDetail() {
  const router = useRouter()

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isAddingToPromotions, setIsAddingToPromotions] = useState(false)
  const [addedToPromotions, setAddedToPromotions] = useState(false)
  const [activeMediaType, setActiveMediaType] = useState<"video" | "image">("video")
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [isBorderBlinking, setIsBorderBlinking] = useState(false)
  const [isTextShaking, setIsTextShaking] = useState(false)

  const documentsRef = useRef<HTMLDivElement>(null)
  const descriptionContainerRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLButtonElement>(null)

  useClickOutside(descriptionContainerRef, isDescriptionExpanded, () => setIsDescriptionExpanded(false))
  useClickOutside(calendarRef, showCalendar, () => setShowCalendar(false))

  const handleAddToPromotions = () => {
    if (!selectedDate) {
      setIsBorderBlinking(true)
      setIsTextShaking(true)
      setTimeout(() => setIsBorderBlinking(false), 1500)
      setTimeout(() => setIsTextShaking(false), 1200)
      return
    }
    setIsAddingToPromotions(true)
    setTimeout(() => {
      setIsAddingToPromotions(false)
      setAddedToPromotions(true)
      setTimeout(() => router.push("/promotions"), 1500)
    }, 800)
  }

  const scrollDocuments = (direction: "left" | "right") => scrollRef(documentsRef, direction)
  const scrollScreenshots = (direction: "left" | "right") => scrollRef(screenshotsRef, direction)

  const handleDownloadDocument = (docName: string) => {
    const mockUrl = `https://example.com/downloads/${encodeURIComponent(docName)}`
    const link = document.createElement("a")
    link.href = mockUrl
    link.download = docName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSelectDate = (day: number) => {
    const { year, month } = generateCalendarDays(calendarMonth)
    setSelectedDate(formatDate(year, month, day))
    setShowCalendar(false)
  }

  const calendar = generateCalendarDays(calendarMonth)

  return {
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
    documentsRef,
    descriptionContainerRef,
    screenshotsRef,
    calendarRef,
    dateButtonRef,
    handleAddToPromotions,
    scrollDocuments,
    scrollScreenshots,
    handleDownloadDocument,
    handleSelectDate,
    calendar,
  }
}
