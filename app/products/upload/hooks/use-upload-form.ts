"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productData, aiGeneratedDescriptionText } from "../lib/upload-mock-data"
import {
  validateContactName,
  validateEmail,
  validatePhone,
  validateBaseReward,
  validateProductLink,
} from "../lib/upload-form-validation"
import {
  generateCalendarDays,
  isPastDate as isPastDateUtil,
  getTodayDay as getTodayDayUtil,
  isCurrentMonth as isCurrentMonthUtil,
} from "../lib/upload-calendar-utils"
import { getTextFontSize as getTextFontSizeUtil, scrollHorizontal } from "../lib/upload-utils"
import { apiPost } from "@/lib/api-client"

const initialValidationErrors = {
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  baseReward: "",
  productLink: "",
}

/**
 * 产品上传页：状态、ref、副作用与事件处理（步骤 2 从 page 抽离，逻辑不变）
 * 仅做职责拆分，不改变行为。
 */
export function useUploadForm() {
  const router = useRouter()

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isAddingToPromotions, setIsAddingToPromotions] = useState(false)
  const [addedToPromotions, setAddedToPromotions] = useState(false)
  const [isBorderBlinking, setIsBorderBlinking] = useState(false)
  const [isTextShaking, setIsTextShaking] = useState(false)
  const [productLogoUrl, setProductLogoUrl] = useState<string | null>(null)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productLink, setProductLink] = useState("")
  const [linkInputWidth, setLinkInputWidth] = useState(280)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [customTagInput, setCustomTagInput] = useState("")
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false)
  const [documentDescription, setDocumentDescription] = useState(productData.fullDescription)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; url: string }>>([])
  const [uploadedMedia, setUploadedMedia] = useState<Array<{ type: "image" | "video"; url: string; name: string }>>([])
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [baseReward, setBaseReward] = useState("")
  const [contactName, setContactName] = useState(productData.contact.name)
  const [contactEmail, setContactEmail] = useState(productData.contact.email)
  const [contactPhone, setContactPhone] = useState(productData.contact.phone)
  const [bonusTargetViews, setBonusTargetViews] = useState<Array<{ value: string; unit: "k" | "w" }>>(
    productData.incentive.bonusTargets.map((target) => ({
      value: (target.views / 10000).toFixed(0),
      unit: "w" as const,
    })),
  )
  const [bonusTargetBonuses, setBonusTargetBonuses] = useState<string[]>(
    productData.incentive.bonusTargets.map((target) => target.bonus.toString()),
  )
  const [validationErrors, setValidationErrors] = useState(initialValidationErrors)
  const [agreed, setAgreed] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [productScore, setProductScore] = useState<number | null>(null)
  const [showScorePopup, setShowScorePopup] = useState(false)
  const [isHidingPopup, setIsHidingPopup] = useState(false)
  const [cardPosition, setCardPosition] = useState<"left" | "right">("left")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentsRef = useRef<HTMLDivElement>(null)
  const descriptionContainerRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const linkMeasureRef = useRef<HTMLDivElement>(null)
  const tagDropdownRef = useRef<HTMLDivElement>(null)
  const documentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const documentFileInputRef = useRef<HTMLInputElement>(null)
  const mediaFileInputRef = useRef<HTMLInputElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scoreCardRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const shouldShowScore = productScore !== null

  useEffect(() => {
    const condition1 = logoFile && productLink.trim() !== "" && documentDescription.trim() !== ""
    const condition2 = uploadedMedia.length > 0
    if (condition1 || condition2) {
      setProductScore(88)
    } else {
      setProductScore(88)
    }
  }, [logoFile, productLink, documentDescription, uploadedMedia])

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDescriptionExpanded &&
        descriptionContainerRef.current &&
        !descriptionContainerRef.current.contains(event.target as Node)
      ) {
        setIsDescriptionExpanded(false)
      }
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
      if (showTagDropdown && tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false)
        setIsAddingCustomTag(false)
        setCustomTagInput("")
      }
    }
    if (isDescriptionExpanded || showCalendar || showTagDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDescriptionExpanded, showCalendar, showTagDropdown])

  useEffect(() => {
    if (linkMeasureRef.current) {
      setLinkInputWidth(linkMeasureRef.current.offsetWidth + 20)
    }
  }, [productLink])

  function updateValidationError(
    field: keyof typeof initialValidationErrors,
    value: string,
  ) {
    let error = ""
    if (field === "contactName") error = validateContactName(value)
    else if (field === "contactEmail") error = validateEmail(value)
    else if (field === "contactPhone") error = validatePhone(value)
    else if (field === "baseReward") error = validateBaseReward(value)
    else if (field === "productLink") error = validateProductLink(value)
    setValidationErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsHidingPopup(false)
    setShowScorePopup(true)
  }

  const handleMouseLeave = () => {
    if (scoreCardRef.current) {
      const rect = scoreCardRef.current.getBoundingClientRect()
      const centerX = window.innerWidth / 2
      setCardPosition(rect.left + rect.width / 2 < centerX ? "left" : "right")
    }
    setIsHidingPopup(true)
    hideTimeoutRef.current = setTimeout(() => {
      setShowScorePopup(false)
      setIsHidingPopup(false)
    }, 500)
  }

  const handlePopupMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsHidingPopup(false)
  }

  const handlePopupMouseLeave = () => {
    setIsHidingPopup(true)
    hideTimeoutRef.current = setTimeout(() => {
      setShowScorePopup(false)
      setIsHidingPopup(false)
    }, 500)
  }

  const getTextFontSize = () => getTextFontSizeUtil(baseReward.toString())

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setProductLogoUrl(e.target?.result as string)
      reader.readAsDataURL(file)
      setLogoFile(file)
    }
  }

  const handleLogoClick = () => fileInputRef.current?.click()

  const handleAddToPromotions = async () => {
    if (!selectedDate) {
      setIsBorderBlinking(true)
      setIsTextShaking(true)
      setTimeout(() => setIsBorderBlinking(false), 1500)
      setTimeout(() => setIsTextShaking(false), 1200)
      return
    }
    setIsAddingToPromotions(true)
    try {
      await apiPost("/api/v1/products", {
        name: productName || "未命名产品",
        description: productDescription,
        fullDescription: documentDescription,
        link: productLink,
        logo: productLogoUrl || "/placeholder-logo.png",
        tags: selectedTags,
        contactName,
        contactEmail,
        contactPhone,
        baseReward: Number(baseReward || 0),
        bonusTargets: bonusTargetViews.map((target, index) => ({
          views: Number(target.value || 0) * (target.unit === "w" ? 10000 : 1000),
          bonus: Number(bonusTargetBonuses[index] || 0),
        })),
        expectedPublishDate: selectedDate,
        agreed,
        documents: uploadedFiles,
        media: uploadedMedia,
      })
      setIsAddingToPromotions(false)
      setAddedToPromotions(true)
      setTimeout(() => router.push("/products"), 1500)
    } catch {
      setIsAddingToPromotions(false)
    }
  }

  const scrollDocuments = (direction: "left" | "right") => scrollHorizontal(documentsRef, direction)
  const scrollScreenshots = (direction: "left" | "right") => scrollHorizontal(screenshotsRef, direction)
  const scrollFiles = (direction: "left" | "right") => scrollHorizontal(documentsRef, direction)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: URL.createObjectURL(file),
      }))
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
    if (event.target) event.target.value = ""
  }

  const handleUploadClick = () => documentFileInputRef.current?.click()

  const handleDownloadUploadedFile = (file: { name: string; url: string }) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteFile = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setUploadedFiles((prev) => prev.filter((_, index) => index !== indexToDelete))
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newMedia = Array.from(files)
        .map((file) => {
          const url = URL.createObjectURL(file)
          const type = file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
              ? "video"
              : null
          if (!type) {
            alert(`文件 "${file.name}" 不是图片或视频格式，已跳过`)
            return null
          }
          return { type, url, name: file.name }
        })
        .filter((item): item is { type: "image" | "video"; url: string; name: string } => item !== null)
      setUploadedMedia((prev) => [...prev, ...newMedia])
      if (uploadedMedia.length === 0 && newMedia.length > 0) setActiveMediaIndex(0)
    }
    if (event.target) event.target.value = ""
  }

  const handleMediaUploadClick = () => mediaFileInputRef.current?.click()
  const handleSelectMedia = (index: number) => setActiveMediaIndex(index)

  const handleDeleteMedia = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newMedia = uploadedMedia.filter((_, index) => index !== indexToDelete)
    setUploadedMedia(newMedia)
    if (activeMediaIndex === indexToDelete) {
      setActiveMediaIndex(newMedia.length > 0 ? 0 : null)
    } else if (activeMediaIndex !== null && activeMediaIndex > indexToDelete) {
      setActiveMediaIndex(activeMediaIndex - 1)
    }
  }

  const handleSelectDate = (day: number) => {
    const { year, month } = generateCalendarDays(calendarMonth)
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(formattedDate)
    setShowCalendar(false)
  }

  const isPastDate = (day: number) => isPastDateUtil(calendarMonth, day)
  const getTodayDay = () => getTodayDayUtil()
  const isCurrentMonth = () => isCurrentMonthUtil(calendarMonth)

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductDescription(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleLinkChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProductLink(value)
    updateValidationError("productLink", value)
    if (linkMeasureRef.current) {
      linkMeasureRef.current.textContent = value || "默认宽度"
      const measuredWidth = linkMeasureRef.current.offsetWidth
      setLinkInputWidth(Math.max(measuredWidth + 16, 280))
    }
  }

  const handleRemoveTag = (tagToRemove: string) =>
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove))

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) setSelectedTags((prev) => [...prev, tag])
    setShowTagDropdown(false)
  }

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags((prev) => [...prev, customTagInput.trim()])
      setCustomTagInput("")
      setIsAddingCustomTag(false)
      setShowTagDropdown(false)
    }
  }

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomTag()
    } else if (e.key === "Escape") {
      setIsAddingCustomTag(false)
      setCustomTagInput("")
    }
  }

  const handleAIGenerateDescription = async () => {
    setIsGeneratingDescription(true)
    try {
      const result = await apiPost<{ text: string }>("/api/v1/ai/generate-description", {
        prompt: `产品名：${productName}\n产品描述：${productDescription}\n请生成发布文案`,
      })
      setDocumentDescription(result.text || aiGeneratedDescriptionText)
    } catch {
      setDocumentDescription(aiGeneratedDescriptionText)
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactName(value)
    updateValidationError("contactName", value)
  }

  const handleContactEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactEmail(value)
    updateValidationError("contactEmail", value)
  }

  const handleContactPhoneChange = (value: string) => {
    setContactPhone(value)
    updateValidationError("contactPhone", value)
  }

  const handleBaseRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBaseReward(value)
    updateValidationError("baseReward", value)
  }

  const setCalendarMonthTodayAndSelect = () => {
    setCalendarMonth(new Date())
    const today = new Date()
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    setSelectedDate(formattedDate)
    setShowCalendar(false)
  }

  const clearSelectedDate = () => {
    setSelectedDate(null)
    setShowCalendar(false)
  }

  return {
    productData,
    refs: {
      fileInputRef,
      documentsRef,
      descriptionContainerRef,
      screenshotsRef,
      calendarRef,
      dateButtonRef,
      textareaRef,
      linkInputRef,
      linkMeasureRef,
      tagDropdownRef,
      documentTextareaRef,
      documentFileInputRef,
      mediaFileInputRef,
      scoreCardRef,
      popupRef,
    },
    state: {
      isDescriptionExpanded,
      setIsDescriptionExpanded,
      isAddingToPromotions,
      addedToPromotions,
      isTextShaking,
      productLogoUrl,
      productName,
      setProductName,
      productDescription,
      productLink,
      linkInputWidth,
      selectedTags,
      showTagDropdown,
      setShowTagDropdown,
      customTagInput,
      setCustomTagInput,
      isAddingCustomTag,
      setIsAddingCustomTag,
      documentDescription,
      setDocumentDescription,
      uploadedFiles,
      uploadedMedia,
      activeMediaIndex,
      isGeneratingDescription,
      showCalendar,
      setShowCalendar,
      selectedDate,
      calendarMonth,
      setCalendarMonth,
      baseReward,
      contactName,
      contactEmail,
      contactPhone,
      bonusTargetViews,
      setBonusTargetViews,
      bonusTargetBonuses,
      setBonusTargetBonuses,
      validationErrors,
      agreed,
      setAgreed,
      productScore,
      showScorePopup,
      isHidingPopup,
      cardPosition,
      shouldShowScore,
    },
    handlers: {
      updateValidationError,
      handleMouseEnter,
      handleMouseLeave,
      handlePopupMouseEnter,
      handlePopupMouseLeave,
      getTextFontSize,
      handleImageUpload,
      handleLogoClick,
      handleAddToPromotions,
      scrollDocuments,
      scrollScreenshots,
      scrollFiles,
      handleFileUpload,
      handleUploadClick,
      handleDownloadUploadedFile,
      handleDeleteFile,
      handleMediaUpload,
      handleMediaUploadClick,
      handleSelectMedia,
      handleDeleteMedia,
      handleSelectDate,
      isPastDate,
      getTodayDay,
      isCurrentMonth,
      handleDescriptionChange,
      handleLinkChangeWithValidation,
      handleRemoveTag,
      handleAddTag,
      handleAddCustomTag,
      handleCustomTagKeyDown,
      handleAIGenerateDescription,
      handleContactNameChange,
      handleContactEmailChange,
      handleContactPhoneChange,
      handleBaseRewardChange,
      setCalendarMonthTodayAndSelect,
      clearSelectedDate,
    },
  }
}

/** 供 UploadPageContent 等组件使用的表单返回值类型 */
export type UploadFormResult = ReturnType<typeof useUploadForm>
