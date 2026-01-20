"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronLeft,
  Users,
  Mail,
  Phone,
  Globe,
  Clock,
  ImageIcon,
  FileText,
  Zap,
  Download,
  Play,
  X,
  Plus,
  ChevronDown,
  ImagePlus,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header"
import { PhoneInput } from "@/components/ui/phone-input"

// Mock product data
const productData = {
  id: "1",
  name: "NoteMaster Pro",
  description:
    "NoteMaster Pro 是一款革命性的智能笔记应用，结合AI技术帮助用户更高效地整理、搜索和回顾笔记内容。支持多平台同步，语音转文字,智能标签分类等功能。",
  fullDescription: `【职场人士的绝命痛点】：每天面对海量信息，难以有效整理和回顾，让NoteMaster Pro瞬间解决，再 whenever要天天加班要疯掉！

NoteMaster Pro 是一款AI智能分类的效率工具，专为职场人士设计，一劳永逸解决信息整理难题。

- 年龄/性别/地域：18-45岁，男女不限，国内外均可
- 生活场景：办公室、学习、家庭
- 核心痛点：信息过载，难以有效整理和回顾

1. AI智能分类：自动识别笔记内容并归类，让您的笔记井井有条
2. 跨平台同步：支持iOS、Android、Web、桌面端，随时随地访问您的笔记
3. 语音转文字：高精度语音识别，支持多种语言，会议记录更轻松
4. 协作功能：团队共享笔记空间，实时协作编辑
5. 智能搜索：基于语义的全文搜索，快速找到您需要的内容

市面普通产品：只能手动分类、不支持多平台同步、语音转文字功能单一、无法团队协作、搜索功能有限；
我们的产品：AI智能分类、跨平台同步、高精度语音转文字、团队协作、智能搜索，一步到位解决所有痛点.

场景1：
博主在办公室接收到一个紧急会议通知，使用NoteMaster Pro的语音转文字功能快速记录会议内容，并在会议结束后自动分类整理。

场景2：
博主在学习过程中，使用NoteMaster Pro的智能搜索功能快速找到之前学习的笔记，提高学习效率。

场景3：
博主在家庭中，使用NoteMaster Pro的跨平台同步功能在手机、平板和电脑之间无缝切换，管理家庭事务。

- 内测用户反馈：NoteMaster Pro极大地提高了我们的工作效率，节省了大量时间。
- 当前数据（月收入/注册量等）：NoteMaster Pro的月收入达到XX万元，注册用户达到XX万。
- 真实用户评价摘录：NoteMaster Pro是一款非常实用的笔记工具，让我们更好地管理信息。

- 试水套餐：XX元（内容要求 + 时效）
- 标准套餐：XX元（内容要求）
- 佣金比例：XX%
- 历史平均ROI：XX%

**博主拍摄建议**：
- 开箱部分：展示NoteMaster Pro的外观和主要功能。
- 真实场景演示：在办公室、学习和家庭场景中演示NoteMaster Pro的功能。
- 结尾引导：鼓励博主申请合作，提供完整素材包和专属优惠码。

**粉丝使用体验**：
- 第一步：下载并安装NoteMaster Pro。
- 第二步：注册账号并设置个人偏好。
- 第三步：使用语音转文字功能记录会议内容。
- 小贴士：定期备份笔记，确保数据安全。

`,
  link: "https://notemaster.pro",
  contact: {
    name: "",
    email: "",
    phone: "",
    website: "",
  },
  category: {
    type: "效率工具",
    keywords: ["笔记工具", "生产力APP"],
  },
  attachments: {
    demoVideo: "/demo-video.mp4",
    screenshots: [
      "/app-screenshot-1.jpg",
      "/app-screenshot-2.jpg",
      "/app-screenshot-3.jpg",
      "/app-screenshot-4.jpg",
      "/app-screenshot-5.jpg",
      "/app-screenshot-6.jpg",
      "/app-screenshot-7.jpg",
    ],
    documents: [
      { name: "产品介绍.pdf", size: "2.4 MB", icon: "📄" },
      { name: "品牌指南.pdf", size: "5.1 MB", icon: "🎨" },
      { name: "素材包.zip", size: "45 MB", icon: "📦" },
      { name: "使用教程.pdf", size: "1.2 MB", icon: "📖" },
      { name: "API文档.pdf", size: "3.8 MB", icon: "⚙️" },
      { name: "案例研究.pdf", size: "4.7 MB", icon: "📊" },
      { name: "媒体包.zip", size: "52.3 MB", icon: "🎬" },
      { name: "常见问题.pdf", size: "0.8 MB", icon: "❓" },
    ],
  },
  progress: "匹配中",
  timeline: {
    developerDeadline: "2025-02-15",
    bloggerDeadline: null,
  },
  pricing: {
    type: "订阅制",
    price: "$9.99/月",
    originalPrice: "$14.99/月",
  },
  incentive: {
    enabled: true,
    baseReward: 500,
    bonusTargets: [
      { views: 10000, bonus: 200 },
      { views: 50000, bonus: 500 },
    ],
  },
  stats: {
    applicants: 12,
    expectedReach: "50万+",
    targetAudience: "职场人士、学生、知识工作者",
  },
}

const progressSteps = [
  { id: "matching", label: "匹配中" },
  { id: "creating", label: "创作中" },
  { id: "created", label: "已创作" },
  { id: "published", label: "已发布" },
]

export default function UploadProductsPage() {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isAddingToPromotions, setIsAddingToPromotions] = useState(false)
  const [addedToPromotions, setAddedToPromotions] = useState(false)
  const [isBorderBlinking, setIsBorderBlinking] = useState(false)
  const [isTextShaking, setIsTextShaking] = useState(false) // Added for text shaking effect
  const [productLogoUrl, setProductLogoUrl] = useState<string | null>(null)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productLink, setProductLink] = useState("")
  const [linkInputWidth, setLinkInputWidth] = useState(280) // Initial width doubled (140 * 2)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [customTagInput, setCustomTagInput] = useState("")
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false)
  const [documentDescription, setDocumentDescription] = useState(productData.fullDescription)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; url: string }>>([])
  const [uploadedMedia, setUploadedMedia] = useState<Array<{ type: "image" | "video"; url: string; name: string }>>([])
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  // Calendar states
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

  const [validationErrors, setValidationErrors] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    baseReward: "",
    productLink: "",
  })

  const [agreed, setAgreed] = useState(false) // Added for agreement checkbox

  // Preset tag options
  const presetTags = [
    // 工具类
    "效率工具",
    "笔记工具",
    "生产力APP",
    "AI工具",
    "办公软件",
    "协作工具",
    "项目管理",
    "日程管理",
    "文档工具",
    "思维导图",

    // 创作与设计
    "设计工具",
    "视频编辑",
    "图片编辑",
    "音频工具",
    "写作工具",
    "创意工具",
    "3D建模",
    "UI设计",
    "插画工具",

    // 开发技术
    "开发工具",
    "代码编辑器",
    "API工具",
    "数据库工具",
    "云服务",
    "DevOps",
    "低代码平台",
    "测试工具",

    // 营销与商业
    "营销工具",
    "SEO工具",
    "社交媒体",
    "电商工具",
    "客服工具",
    "CRM系统",
    "数据分析",
    "广告投放",
    "邮件营销",

    // 教育与学习
    "教育培训",
    "学习工具",
    "在线课程",
    "语言学习",
    "知识管理",
    "阅读工具",
    "技能培训",

    // 生活与娱乐
    "健康健身",
    "运动追踪",
    "饮食管理",
    "睡眠监测",
    "冥想放松",
    "游戏娱乐",
    "音乐应用",
    "视频流媒体",
    "阅读娱乐",

    // 金融与理财
    "金融理财",
    "记账工具",
    "投资理财",
    "加密货币",
    "支付工具",
    "预算管理",

    // 生活服务
    "生活服务",
    "旅行出行",
    "美食外卖",
    "购物比价",
    "家居智能",
    "宠物服务",
    "社交通讯",

    // 行业垂直
    "医疗健康",
    "法律服务",
    "房产工具",
    "招聘HR",
    "物流配送",
    "农业科技",

    // 硬件与设备
    "智能硬件",
    "可穿戴设备",
    "智能家居",
    "数码配件",
    "VR/AR设备",

    // 平台类型
    "SaaS服务",
    "移动应用",
    "浏览器插件",
    "桌面软件",
    "小程序",
    "开源项目",
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentsRef = useRef<HTMLDivElement>(null)
  const descriptionContainerRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const linkMeasureRef = useRef<HTMLDivElement>(null)
  const tagDropdownRef = useRef<HTMLDivElement>(null) // Ref for tag dropdown
  const documentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const documentFileInputRef = useRef<HTMLInputElement>(null)
  const mediaFileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [productScore, setProductScore] = useState<number | null>(null)
  const [showScorePopup, setShowScorePopup] = useState(false)

  const scoreBreakdown = [
    {
      icon: "🎯",
      name: "痛苦度",
      description: "用户需求强烈且未被满足",
      score: 20,
    },
    {
      icon: "💰",
      name: "支付意愿",
      description: "用户明确表示愿意付费",
      score: 20,
    },
    {
      icon: "⚔️",
      name: "竞品弱度",
      description: "市场竞争弱，或有独特优势",
      score: 20,
    },
    {
      icon: "🔧",
      name: "实现难度",
      description: "产品开发技术难度适中",
      score: 20,
    },
    {
      icon: "⚡",
      name: "病毒系数",
      description: "品易于传播，用户自发推广",
      score: 8,
    },
  ]

  const handleMouseEnter = () => {
    setShowScorePopup(true)
  }

  const handleMouseLeave = () => {
    setShowScorePopup(false)
  }

  // Use a separate state for logo file to track if it's uploaded
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Calculate score based on form completion
  useEffect(() => {
    // Condition 1: Logo uploaded AND product link entered AND description entered
    const condition1 = logoFile && productLink.trim() !== "" && documentDescription.trim() !== ""
    // Condition 2: Has uploaded media files
    const condition2 = uploadedMedia.length > 0

    if (condition1 || condition2) {
      // Calculate score automatically
      const score = 88
      setProductScore(score)
    } else {
      setProductScore(88)
    }
  }, [logoFile, productLink, documentDescription, uploadedMedia])

  const shouldShowScore = productScore !== null
  // </CHANGE>

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
      // Added showTagDropdown
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDescriptionExpanded, showCalendar, showTagDropdown]) // Added showTagDropdown

  // Calculate link input width based on content
  useEffect(() => {
    if (linkMeasureRef.current) {
      setLinkInputWidth(linkMeasureRef.current.offsetWidth + 20) // Add padding
    }
  }, [productLink])

  const getTextFontSize = () => {
    const baseRewardStr = baseReward.toString()
    // Medal inner circle diameter is ~68px (radius 34), with padding consider ~56px usable width
    // Base font size 22 fits ~3 characters comfortably
    if (baseRewardStr.length <= 3) return 22
    if (baseRewardStr.length === 4) return 18
    if (baseRewardStr.length === 5) return 14
    if (baseRewardStr.length === 6) return 12
    return 10 // Minimum font size for very long numbers
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProductLogoUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setLogoFile(file) // <-- Set the logoFile state
    }
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

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
      setTimeout(() => {
        // </CHANGE> redirect to /my-product instead of /my-promotions
        router.push("/my-product")
      }, 1500)
    }, 800)
  }

  const getProgressIndex = () => {
    return progressSteps.findIndex((s) => s.label === productData.progress)
  }

  const scrollDocuments = (direction: "left" | "right") => {
    if (documentsRef.current) {
      const scrollAmount = 200
      documentsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollScreenshots = (direction: "left" | "right") => {
    if (screenshotsRef.current) {
      const scrollAmount = 200
      screenshotsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleDownloadDocument = (docName: string) => {
    // Create a mock file URL and trigger download
    const mockUrl = `https://example.com/downloads/${encodeURIComponent(docName)}`
    const link = document.createElement("a")
    link.href = mockUrl
    link.download = docName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => {
        const url = URL.createObjectURL(file)
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        return {
          name: file.name,
          size: `${sizeInMB} MB`,
          url: url,
        }
      })
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
    // Reset input value to allow re-upload of same file
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleUploadClick = () => {
    documentFileInputRef.current?.click()
  }

  const handleDownloadUploadedFile = (file: { name: string; url: string }) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteFile = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent download action when clicking delete button
    const newFiles = uploadedFiles.filter((_, index) => index !== indexToDelete)
    setUploadedFiles(newFiles)
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newMedia = Array.from(files)
        .map((file) => {
          const url = URL.createObjectURL(file)
          const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null

          if (!type) {
            alert(`文件 "${file.name}" 不是图片或视频格式，已跳过`)
            return null
          }

          return {
            type,
            url,
            name: file.name,
          }
        })
        .filter((item) => item !== null) as Array<{ type: "image" | "video"; url: string; name: string }>

      setUploadedMedia([...uploadedMedia, ...newMedia])
      // Auto-select first uploaded media
      if (uploadedMedia.length === 0 && newMedia.length > 0) {
        setActiveMediaIndex(0)
      }
    }
    // Reset input
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleMediaUploadClick = () => {
    mediaFileInputRef.current?.click()
  }

  const handleSelectMedia = (index: number) => {
    setActiveMediaIndex(index)
  }

  const handleDeleteMedia = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newMedia = uploadedMedia.filter((_, index) => index !== indexToDelete)
    setUploadedMedia(newMedia)

    // Reset active media index if needed
    if (activeMediaIndex === indexToDelete) {
      setActiveMediaIndex(newMedia.length > 0 ? 0 : null)
    } else if (activeMediaIndex !== null && activeMediaIndex > indexToDelete) {
      setActiveMediaIndex(activeMediaIndex - 1)
    }
  }

  const generateCalendarDays = (date: Date = new Date()) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return { days, year, month }
  }

  const handleSelectDate = (day: number) => {
    const { year, month } = generateCalendarDays(calendarMonth)
    const date = new Date(year, month, day)
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(formattedDate)
    setShowCalendar(false)
  }

  const isPastDate = (day: number) => {
    const { year, month } = generateCalendarDays(calendarMonth)
    const selectedDate = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate < today
  }

  const getTodayDay = () => {
    const today = new Date()
    return today.getDate()
  }

  const isCurrentMonth = () => {
    const today = new Date()
    return calendarMonth.getMonth() === today.getMonth() && calendarMonth.getFullYear() === today.getFullYear()
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductDescription(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProductLink(value)

    // Measure the text width using a hidden div
    if (linkMeasureRef.current) {
      linkMeasureRef.current.textContent = value || "默认宽度"
      const measuredWidth = linkMeasureRef.current.offsetWidth
      // Add padding and minimum width (doubled default)
      const newWidth = Math.max(measuredWidth + 16, 280)
      setLinkInputWidth(newWidth)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setShowTagDropdown(false)
  }

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags([...selectedTags, customTagInput.trim()])
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

  const handleAIGenerateDescription = () => {
    setIsGeneratingDescription(true)
    setTimeout(() => {
      setDocumentDescription(
        `【职场人士的绝命痛点】：每天面对海量信息，难以有效整理和回顾，让NoteMaster Pro瞬间解决，再也不要天天加班要疯掉！

NoteMaster Pro 是一款AI智能分类的效率工具，专为职场人士设计，一劳永逸解决信息整理难题。

- 年龄/性别/地域：18-45岁，男女不限，国内外均可
- 生活场景：办公室、学习、家庭
- 核心痛点：信息过载，难以有效整理和回顾

1. AI智能分类：自动识别笔记内容并归类，让您的笔记井井有条
2. 跨平台同步：支持iOS、Android、Web、桌面端，随时随地访问您的笔记
3. 语音转文字：高精度语音识别，支持多种语言，会议记录更轻松
4. 协作功能：团队共享笔记空间，实时协作编辑
5. 智能搜索：基于语义的全文搜索，快速找到您需要的内容

市面普通产品：只能手动分类、不支持多平台同步、语音转文字功能单一、无法团队协作、搜索功能有限；
我们的产品：AI智能分类、跨平台同步、高精度语音转文字、团队协作、智能搜索，一步到位解决所有痛点.`,
      )
      setIsGeneratingDescription(false)
    }, 2000)
  }

  const validateContactName = (value: string) => {
    if (!value.trim()) {
      return "联系人名称不能为空"
    }
    if (value.trim().length < 2) {
      return "联系人名称至少需要2个字符"
    }
    return ""
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "邮箱不能为空"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      return "请输入有效的邮箱地址"
    }
    return ""
  }

  const validatePhone = (value: string) => {
    // Removed validation for phone input as PhoneInput component handles it.
    // If specific localizations or additional checks are needed, they can be added here.
    // For now, we'll just check if it's not empty and has a reasonable length.
    if (!value.trim()) {
      return "电话号码不能为空"
    }
    // Basic check for reasonable length, PhoneInput will provide more precise validation.
    if (value.trim().length < 7) {
      return "请输入有效的电话号码"
    }
    return ""
  }

  const validateBaseReward = (value: string) => {
    if (!value.trim()) {
      return "基础佣金不能为空"
    }
    const num = Number.parseFloat(value)
    if (isNaN(num) || num < 0) {
      return "请输入有效的数字"
    }
    return ""
  }

  const validateProductLink = (value: string) => {
    if (!value.trim()) {
      return "" // Link is optional
    }

    const trimmedValue = value.trim()

    // Check if it's a valid URL with protocol
    try {
      new URL(trimmedValue)
      return ""
    } catch {
      // If standard URL parsing fails, check for www.*.* format
      const wwwRegex = /^www\..+\..+$/i
      if (wwwRegex.test(trimmedValue)) {
        return ""
      }
      return "请输入有效的URL（如 https://example.com 或 www.example.com）"
    }
  }

  const updateValidationError = (field: keyof typeof validationErrors, value: string) => {
    let error = ""
    if (field === "contactName") {
      error = validateContactName(value)
    } else if (field === "contactEmail") {
      error = validateEmail(value)
    } else if (field === "contactPhone") {
      error = validatePhone(value) // Use the new validation function
    } else if (field === "baseReward") {
      error = validateBaseReward(value)
    } else if (field === "productLink") {
      error = validateProductLink(value)
    }
    setValidationErrors((prev) => ({ ...prev, [field]: error }))
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
    updateValidationError("contactPhone", value) // Pass the value directly to updateValidationError
  }

  const handleBaseRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBaseReward(value)
    updateValidationError("baseReward", value)
  }

  const handleLinkChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProductLink(value)
    updateValidationError("productLink", value)

    // Keep existing link width logic
    if (linkMeasureRef.current) {
      linkMeasureRef.current.textContent = value || "默认宽度"
      const measuredWidth = linkMeasureRef.current.offsetWidth
      const newWidth = Math.max(measuredWidth + 16, 280)
      setLinkInputWidth(newWidth)
    }
  }

  const scrollFiles = (direction: "left" | "right") => {
    if (documentsRef.current) {
      const scrollAmount = 200
      documentsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen flex-col items-center gap-8 border-r border-slate-200/80 bg-white/80 backdrop-blur-sm z-40 w-7 py-9">
        <Link href="/" className="mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
        </Link>

        <nav className="flex flex-col gap-6">
          <Link
            href="/select-product"
            className="flex flex-col items-center gap-1 text-blue-600 transition-colors hover:text-blue-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">首页</span>
          </Link>
          <Link
            href="/my-promotions"
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-slate-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">我的推广</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="md:ml-16 flex flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <div className="mx-auto max-w-7xl w-full">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "首页", href: "/" },
                { label: "待推广项目", href: "/select-product" },
                { label: productName === "" ? productData.name : productName },
              ]}
            />

            {/* Main Layout: Hero Card + Right Sidebar Cards */}
            <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Hero Section - Main Card */}
              <div className="flex-1 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="relative">
                  {/* Top Section: Logo, Info, Price Medal */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
                    {/* Product Logo */}
                    <div className="flex-shrink-0 relative mx-auto sm:mx-0">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div
                        onClick={handleLogoClick}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center shadow-xl shadow-gray-200/30 ring-2 sm:ring-4 ring-white cursor-pointer hover:opacity-90 transition-opacity overflow-hidden group"
                      >
                        {productLogoUrl ? (
                          <img
                            src={productLogoUrl || "/placeholder.svg"}
                            alt="Product Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                              上传logo图
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                            <input
                              type="text"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                              placeholder="请输入产品名称.."
                              className="text-lg sm:text-2xl font-bold bg-transparent outline-none focus:ring-0 p-0 min-w-0 border border-dotted border-slate-300 text-slate-600 text-center sm:text-left w-full sm:w-auto"
                            />
                            {/* Progress Badge */}
                          </div>

                          {/* Product Description */}
                          <textarea
                            ref={textareaRef}
                            value={productDescription}
                            onChange={handleDescriptionChange}
                            placeholder="请填写产品简介..."
                            className="w-full text-xs sm:text-sm leading-relaxed bg-transparent outline-none focus:ring-0 p-0 resize-none border border-dotted border-slate-300 text-slate-700 text-center sm:text-left"
                            rows={2}
                          />

                          {/* Product Link */}
                          <div className="inline-flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 text-blue-600 text-xs sm:text-sm font-medium transition-colors w-full justify-center sm:justify-start">
                            <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            {/* Use dynamic width for link input */}
                            <input
                              ref={linkInputRef}
                              type="text"
                              value={productLink}
                              onChange={handleLinkChangeWithValidation}
                              onBlur={() => updateValidationError("productLink", productLink)}
                              placeholder="https://..."
                              className={`bg-transparent outline-none placeholder-slate-400 placeholder:font-normal placeholder:text-[10px] sm:placeholder:text-xs focus:ring-0 p-0 transition-colors border border-dotted max-w-full ${
                                validationErrors.productLink ? "border-red-500 bg-red-50" : "border-slate-300"
                              } `}
                              style={{ width: `min(${linkInputWidth}px, 100%)` }}
                            />
                            {/* Invisible element to measure text width */}
                            <div
                              ref={linkMeasureRef}
                              className="absolute invisible whitespace-nowrap font-medium text-sm"
                            >
                              {productLink ||
                                "If the product has a related link, please enter the product's link. If not, no need to enter."}
                            </div>
                          </div>
                          {validationErrors.productLink && (
                            <p className="text-red-500 text-[10px] sm:text-xs mt-1 text-center sm:text-left">{validationErrors.productLink}</p>
                          )}

                          {/* Keywords & Timeline Row */}
                          <div className="flex items-center justify-center sm:justify-between mt-2 sm:mt-3">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2" ref={tagDropdownRef}>
                              {/* Selected Tags */}
                              {selectedTags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-slate-600 bg-slate-100 group hover:bg-slate-200 transition-colors"
                                >
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-0.5 text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}

                              {/* Add Tag Button */}
                              <div className="relative">
                                <button
                                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                                  className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium hover:bg-blue-100 transition-colors border border-dashed border-blue-300 bg-gray-50 text-slate-500"
                                >
                                  <Plus className="h-3 w-3" />
                                  添加标签
                                  <ChevronDown
                                    className={`h-3 w-3 transition-transform ${showTagDropdown ? "rotate-180" : ""}`}
                                  />
                                </button>

                                {/* Tag Dropdown */}
                                {showTagDropdown && (
                                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-2">
                                    {/* Preset Tags */}
                                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                      选择标签
                                    </div>
                                    <div className="max-h-40 overflow-y-auto px-2">
                                      <div className="flex flex-wrap gap-1.5 p-1">
                                        {presetTags
                                          .filter((tag) => !selectedTags.includes(tag))
                                          .map((tag, index) => (
                                            <button
                                              key={index}
                                              onClick={() => handleAddTag(tag)}
                                              className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                            >
                                              {tag}
                                            </button>
                                          ))}
                                      </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-slate-100 my-2" />

                                    {/* Custom Tag Input */}
                                    <div className="px-3">
                                      {isAddingCustomTag ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={customTagInput}
                                            onChange={(e) => setCustomTagInput(e.target.value)}
                                            onKeyDown={handleCustomTagKeyDown}
                                            placeholder="输入自定义标签..."
                                            className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                          />
                                          <button
                                            onClick={handleAddCustomTag}
                                            disabled={!customTagInput.trim()}
                                            className="px-2 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                          >
                                            添加
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setIsAddingCustomTag(true)}
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

                        {/* Price Medal with Button */}
                        <div className="flex-shrink-0 relative mx-auto sm:mx-0 mt-4 sm:mt-0">
                          <button
                            onClick={handleAddToPromotions}
                            disabled={isAddingToPromotions || addedToPromotions}
                            className={`absolute -top-5 left-1/2 rounded-lg font-semibold text-white shadow-md transition-all w-14 sm:w-16 z-20 h-[24px] sm:h-[26px] text-[10px] sm:text-sm py-0.5 ${
                              addedToPromotions
                                ? "bg-green-500 shadow-green-500/25"
                                : isAddingToPromotions
                                  ? "bg-blue-400 cursor-wait"
                                  : isTextShaking // Use isTextShaking for the shake animation
                                    ? "bg-red-500 shadow-red-500/25 animate-shake-text"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                            }`}
                            style={{ transform: "translate(calc(-50% + 21px), 20px)" }}
                          >
                            {addedToPromotions ? (
                              <span className="flex items-center justify-center gap-1">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>已发布</span>
                              </span>
                            ) : isAddingToPromotions ? (
                              "..."
                            ) : (
                              "发布"
                            )}
                          </button>
                          <div className="w-20 h-28 sm:w-24 sm:h-32 relative">
                            {/* Unified Medal and Ribbon SVG */}
                            <svg
                              viewBox="0 0 100 140"
                              className="w-[55px] sm:w-[67px] h-auto drop-shadow-lg absolute top-0 left-1/2"
                              style={{
                                transform: "translateX(calc(-50% + 20px)) translateY(36px)",
                              }}
                            >
                              <defs>
                                {/* Bright gold gradient matching image */}
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

                              {/* Serrated outer edge - starburst pattern */}
                              <polygon
                                points="50,0 54,12 62,2 63,15 74,8 72,21 84,17 79,29 92,28 84,38 96,42 86,50 96,58 84,62 92,72 79,71 84,83 72,79 74,92 63,85 62,98 54,88 50,100 46,88 38,98 37,85 26,92 28,79 16,83 21,71 8,72 17,62 4,58 14,50 4,42 16,38 8,28 21,29 16,17 28,21 26,8 37,15 38,2 46,12"
                                fill="url(#medalGold)"
                                stroke="#CC9900"
                                strokeWidth="0.5"
                              />

                              {/* Inner gold circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="34"
                                fill="url(#medalInner)"
                                stroke="#CC9900"
                                strokeWidth="1.5"
                              />

                              {/* Inner ring */}
                              <circle cx="50" cy="50" r="28" fill="none" stroke="#DAA520" strokeWidth="1" />

                              {/* Laurel wreath left */}

                              {/* Laurel wreath right */}

                              {/* Red Ribbons - 3D fold effect */}
                              <g transform="translate(33, 92)">
                                {/* Left ribbon */}
                                <polygon points="0,0 12,0 8,28 0,20" fill="#CC2222" />
                                <polygon points="12,0 16,0 16,4 8,28 8,28" fill="#EE4444" />
                                {/* Right ribbon */}
                                <polygon points="20,0 32,0 32,20 24,28" fill="#CC2222" />
                                <polygon points="16,0 20,0 24,28 16,4" fill="#EE4444" />
                              </g>

                              <text
                                x="50"
                                y="50"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={getTextFontSize()}
                                fontWeight="bold"
                                fill="#FFFFFF"
                                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                              >
                                {baseReward}
                              </text>
                            </svg>
                          </div>

                          <div className="hidden sm:flex absolute top-[120px] sm:top-[138px] -left-[50px] sm:-left-[76px] flex-col items-start gap-2 w-40 sm:w-48">
                            {/* Expected publish time */}

                            {/* Confirmed publish time with calendar picker */}
                            <div className="relative mt-3 ml-[20px]">
                              <div className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span>期望发布时间</span>
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
                                      style={
                                        isTextShaking
                                          ? {
                                              animation: "shake-text 0.4s ease-in-out 3",
                                            }
                                          : undefined
                                      }
                                    >
                                      请选择
                                    </span>
                                  )}
                                </button>
                              </div>

                              {/* Calendar Picker Dropdown */}
                              {showCalendar && (
                                <div
                                  ref={calendarRef}
                                  className="fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-64"
                                  style={{
                                    top: `${dateButtonRef.current?.getBoundingClientRect().bottom || 0 + 8}px`,
                                    left: `${dateButtonRef.current?.getBoundingClientRect().left || 0}px`,
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-4 px-1">
                                    <button
                                      onClick={() =>
                                        setCalendarMonth(
                                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1),
                                        )
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
                                        setCalendarMonth(
                                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1),
                                        )
                                      }
                                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                                      aria-label="Next month"
                                    >
                                      <ChevronRight className="h-4 w-4 text-slate-600" />
                                    </button>
                                  </div>

                                  {/* Weekday Headers */}
                                  <div className="grid grid-cols-7 gap-1 mb-2">
                                    {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                                      <div
                                        key={day}
                                        className="text-center text-[10px] text-slate-400 font-medium py-1"
                                      >
                                        {day}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Calendar Days */}
                                  <div className="grid grid-cols-7 gap-1 mb-3">
                                    {generateCalendarDays(calendarMonth).days.map((day, index) => {
                                      const isDisabled = day !== null && isPastDate(day)
                                      const isToday = day !== null && isCurrentMonth() && day === getTodayDay()
                                      const isSelected =
                                        day !== null &&
                                        selectedDate ===
                                          `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

                                      return (
                                        <div key={index} className="aspect-square">
                                          {day !== null ? (
                                            <button
                                              onClick={() => !isDisabled && handleSelectDate(day)}
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
                                      onClick={() => {
                                        setCalendarMonth(new Date())
                                        const today = new Date()
                                        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                                        setSelectedDate(formattedDate)
                                        setShowCalendar(false)
                                      }}
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
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Timeline Section - shown only on small screens */}
                  <div className="flex sm:hidden mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex flex-col gap-2 w-full">
                      {/* Confirmed publish time with calendar picker */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>期望发布时间</span>
                        <button
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
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mt-6 sm:mt-8" ref={descriptionContainerRef}>
                    <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                      {/* Document Header */}
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-slate-200 bg-white justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setIsDescriptionExpanded(false)}
                              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md group relative"
                              title="Collapse"
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                <div className="w-2 h-0.5 bg-white" />
                              </div>
                            </button>
                            <button
                              onClick={() => setIsDescriptionExpanded(true)}
                              className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md group relative"
                              title="Expand"
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                <div className="text-white text-xs font-bold">⤡</div>
                              </div>
                            </button>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5 sm:gap-2">
                            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            产品描述文档
                          </span>
                        </div>

                        <button
                          onClick={handleAIGenerateDescription}
                          disabled={isGeneratingDescription}
                          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 mr-1 sm:mr-2"
                        >
                          <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>{isGeneratingDescription ? "生成中..." : "AI生成描述"}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </div>
                      <div
                        onClick={() => {
                          if (!isDescriptionExpanded) {
                            setIsDescriptionExpanded(true)
                          }
                        }}
                        className="relative rounded-none bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        <textarea
                          ref={documentTextareaRef}
                          value={documentDescription}
                          onChange={(e) => setDocumentDescription(e.target.value)}
                          placeholder="请输入产品描述文档内容..."
                          className={`w-full px-4 sm:px-6 py-4 sm:py-5 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line transition-all duration-500 overflow-y-auto min-h-[20rem] sm:min-h-[36.25rem] opacity-100 border-0 focus:border focus:border-slate-400 focus:outline-none ${
                            isDescriptionExpanded ? "max-h-none" : "max-h-[20rem] sm:max-h-[30rem]"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Display Section */}
                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      产品展示上传
                    </h3>
                    <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden relative shadow-lg border border-slate-200">
                      {/* Hidden file input for images and videos only */}
                      <input
                        ref={mediaFileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleMediaUpload}
                        className="hidden"
                      />

                      {uploadedMedia.length === 0 || activeMediaIndex === null ? (
                        // Upload prompt when no media
                        <div
                          onClick={handleMediaUploadClick}
                          className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center cursor-pointer hover:from-blue-50 hover:to-indigo-50 transition-all group shadow-none"
                        >
                          <div className="text-center">
                            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ImagePlus className="h-7 w-7 sm:h-10 sm:w-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="text-xs sm:text-sm text-slate-500">上传图片/视频</div>
                          </div>
                        </div>
                      ) : // Display selected media
                      uploadedMedia[activeMediaIndex].type === "video" ? (
                        <video
                          src={uploadedMedia[activeMediaIndex].url}
                          controls
                          className="w-full h-full object-cover bg-black"
                        />
                      ) : (
                        <img
                          src={uploadedMedia[activeMediaIndex].url || "/placeholder.svg"}
                          alt="Product Media"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="relative group border border-slate-200 rounded-lg bg-white p-2 sm:p-2.5 mt-2 shadow-sm">
                      {/* Left navigation button */}
                      <button
                        onClick={() => scrollScreenshots("left")}
                        style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </button>

                      {/* Scrollable thumbnails container */}
                      <div
                        ref={screenshotsRef}
                        className={`flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide px-6 sm:px-10 ${
                          uploadedMedia.length === 0 ? "justify-center" : "justify-start"
                        }`}
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {/* Always show upload button */}
                        <button
                          onClick={handleMediaUploadClick}
                          className="flex-shrink-0 w-24 h-24 sm:w-36 sm:h-36 rounded-md sm:rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center group"
                        >
                          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="h-6 w-6 sm:h-10 sm:w-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </button>

                        {/* Show uploaded media thumbnails to the right of upload button */}
                        {uploadedMedia.map((media, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectMedia(index)}
                            className={`group flex-shrink-0 w-24 h-24 sm:w-36 sm:h-36 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all relative ${
                              activeMediaIndex === index
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
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
                              <img
                                src={media.url || "/placeholder.svg"}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              onClick={(e) => handleDeleteMedia(index, e)}
                              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="删除媒体"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </button>
                        ))}
                      </div>

                      {/* Right navigation button */}
                      <button
                        onClick={() => scrollScreenshots("right")}
                        style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(3px)" }}
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="mt-6 sm:mt-8">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                        <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                        相关资料上传
                      </h3>
                    </div>
                    <div className="relative">
                      {/* Hidden file input accepting all formats */}
                      <input
                        ref={documentFileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Left Navigation Button */}
                        {uploadedFiles.length > 0 && (
                          <button
                            onClick={() => scrollFiles("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-slate-200/30 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                          >
                            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                          </button>
                        )}

                        <div
                          className="flex items-start gap-2 sm:gap-4 flex-nowrap"
                          ref={documentsRef}
                          style={{ overflowX: "auto", scrollBehavior: "smooth", width: "100%" }}
                        >
                          {/* Upload Button */}
                          <div className="flex-shrink-0 flex justify-center items-center">
                            <button
                              onClick={handleUploadClick}
                              className="w-28 sm:w-36 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all group text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                            >
                              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                              <div className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                                上传文件
                              </div>
                              <div className="text-[10px] sm:text-xs text-slate-400">支持任意格式</div>
                            </button>
                          </div>

                          {/* Uploaded Files List */}
                          {uploadedFiles.length > 0 && (
                            <div className="flex gap-2 sm:gap-3 flex-nowrap">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleDownloadUploadedFile(file)}
                                  className="w-28 sm:w-36 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all group text-center cursor-pointer relative flex-shrink-0"
                                >
                                  <FileText className="h-5 w-5 sm:h-7 sm:w-7 mx-auto mb-1.5 sm:mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                  <div className="text-[9px] sm:text-[10px] font-medium text-slate-700 group-hover:text-blue-700 break-words leading-tight">
                                    {file.name}
                                  </div>
                                  <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">{file.size}</div>

                                  <button
                                    onClick={(e) => handleDeleteFile(index, e)}
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

                        {/* Right Navigation Button */}
                        {uploadedFiles.length > 0 && (
                          <button
                            onClick={() => scrollFiles("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-slate-200/30 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
                          >
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Cards */}
              <div className="w-full lg:w-56 flex-shrink-0 space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-4 lg:space-y-4">
                {/* Incentive Card */}
                <div className="bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-50 border border-amber-200/60 shadow-lg shadow-amber-100/50 overflow-hidden rounded-lg">
                  {/* Card Header with Trophy */}
                  <div className="relative px-5 pt-5 pb-3">
                    <div className="text-xs font-medium text-amber-700/80">激励金计划</div>
                    <div className="text-lg font-bold text-amber-900 mt-0.5">额外奖励</div>
                  </div>

                  {/* Base Reward Card */}
                  <div className="px-4 pt-4 pb-2">
                    <div className="text-[10px] text-amber-700/70 mb-1">基础佣金</div>
                    <input
                      type="number"
                      value={baseReward}
                      onChange={handleBaseRewardChange}
                      onBlur={() => updateValidationError("baseReward", baseReward)}
                      placeholder="请输入佣金"
                      className={`border border-dotted border-slate-300 bg-transparent text-slate-800 font-semibold ${
                        validationErrors.baseReward ? "border-red-500 bg-red-50" : ""
                      }`}
                    />
                    {validationErrors.baseReward && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.baseReward}</p>
                    )}
                  </div>

                  {/* Bonus Targets */}
                  <div className="px-4 pb-4">
                    <div className="text-[10px] text-amber-700/70 mb-2">播放量达标奖励</div>
                    <div className="space-y-1.5">
                      {productData.incentive.bonusTargets.map((target, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/60 border border-amber-100"
                        >
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 text-amber-500" />
                            <div className="flex items-center gap-0.5">
                              <input
                                type="number"
                                value={bonusTargetViews[index].value}
                                onChange={(e) => {
                                  const newViews = [...bonusTargetViews]
                                  newViews[index].value = e.target.value
                                  setBonusTargetViews(newViews)
                                }}
                                className="w-10 text-[11px] text-amber-800 bg-transparent border-b focus:border-amber-500 focus:outline-none px-0.5 border-dashed border-amber-400"
                                min="0"
                                step="1"
                              />
                              <select
                                value={bonusTargetViews[index].unit}
                                onChange={(e) => {
                                  const newViews = [...bonusTargetViews]
                                  newViews[index].unit = e.target.value as "k" | "w"
                                  setBonusTargetViews(newViews)
                                }}
                                className="py-0 text-[10px] text-amber-800 bg-transparent border-b focus:border-amber-500 focus:outline-none cursor-pointer appearance-none px-px w-2.5 border-amber-400 border-dashed"
                              >
                                <option value="w">w</option>
                                <option value="k">k</option>
                              </select>
                            </div>
                          </div>
                          <input
                            type="number"
                            value={bonusTargetBonuses[index] || ""}
                            onChange={(e) => {
                              const newBonuses = [...bonusTargetBonuses]
                              newBonuses[index] = e.target.value
                              setBonusTargetBonuses(newBonuses)
                            }}
                            placeholder="0"
                            className="text-xs font-semibold text-amber-600 border border-dotted border-slate-300 bg-transparent w-12 px-1 py-0 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decorative bottom */}
                  <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
                </div>

                {/* Contact Card */}
                <div className="overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200/60 relative rounded-xl">
                  {/* Postcard decorative stamps */}
                  <div className="absolute top-3 right-3 w-10 h-10 rotate-12">
                    <div className="w-full h-full border-2 border-red-400 bg-red-50 rounded-sm flex items-center justify-center">
                      <Mail className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border border-red-400 bg-red-100 transform rotate-45" />
                  </div>

                  {/* Postcard lines decoration */}
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent opacity-30" />

                  {/* Content */}
                  <div className="relative p-4 space-y-2.5">
                    <div className="text-xs font-semibold text-blue-900 tracking-wide uppercase mb-3">联系方式</div>

                    {/* Contact Name */}
                    <div className="flex items-start gap-2">
                      <Users className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">联系人</div>
                        <input
                          type="text"
                          value={contactName}
                          onChange={handleContactNameChange}
                          onBlur={() => updateValidationError("contactName", contactName)}
                          placeholder="请输入联系人名称"
                          className={`border border-dotted border-slate-300 bg-transparent text-slate-800 placeholder:text-xs ${
                            validationErrors.contactName ? "border-red-500 bg-red-50" : ""
                          }`}
                        />
                        {validationErrors.contactName && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors.contactName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-2">
                      <Mail className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="break-all min-w-0 flex-1">
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">邮箱</div>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={handleContactEmailChange}
                          onBlur={() => updateValidationError("contactEmail", contactEmail)}
                          placeholder="请输入邮箱"
                          className={`border border-dotted border-slate-300 bg-transparent text-slate-800 placeholder:text-xs ${
                            validationErrors.contactEmail ? "border-red-500 bg-red-50" : ""
                          }`}
                        />
                        {validationErrors.contactEmail && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors.contactEmail}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-2">
                      <Phone className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">电话</div>
                        {/* Replace the old phone input in the contact card section with the new PhoneInput component */}
                        <PhoneInput
                          value={contactPhone}
                          onChange={handleContactPhoneChange}
                          onBlur={() => updateValidationError("contactPhone", contactPhone)}
                          error={validationErrors.contactPhone}
                          placeholder="Enter phone number"
                          defaultCountry="CN"
                        />
                      </div>
                    </div>

                    {/* Website */}
                  </div>

                  {/* Decorative bottom */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400" />
                </div>

                {shouldShowScore && (
                  <div className="relative mt-6">
                    {/* Backdrop blur overlay */}
                    {showScorePopup && (
                      <div className="fixed inset-0 z-40 bg-white/40 backdrop-blur-sm transition-all duration-300" />
                    )}

                    <div
                      className="relative z-50 border border-slate-200 bg-white p-6 shadow-sm transition-all rounded-xl"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">产品评分</h3>
                          <p className="text-xs text-slate-600">基于 Lovable 打分表</p>
                        </div>
                      </div>

                      {/* Circular score display */}
                      <div className="flex items-center justify-center">
                        <div className="relative h-32 w-32">
                          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
                            {/* Background circle */}
                            <circle cx="60" cy="60" r="54" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                            {/* Progress circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r="54"
                              stroke="url(#gradient-score)"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 54}`}
                              strokeDashoffset={`${2 * Math.PI * 54 * (1 - (productScore || 0) / 100)}`}
                              className="transition-all duration-1000"
                            />
                            {/* Gradient definition */}
                            <defs>
                              <linearGradient id="gradient-score" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                          </svg>
                          {/* Score text in center */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">{productScore}</span>
                            <span className="text-[7px] text-slate-500">/ 100</span>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-slate-200 pt-3">
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                id="agree-investment"
                                className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-slate-300 transition-all checked:border-0 checked:bg-gradient-to-br checked:from-purple-500 checked:to-pink-600 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 leading-7 border-2"
                              />
                              <svg
                                className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-[63%] text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <label
                              htmlFor="agree-investment"
                              className="cursor-pointer font-medium text-slate-500 leading-3 text-xs"
                            >
                              我接受早期投资
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Score Popup - moved closer to the card */}
                      {showScorePopup && (
                        <div
                          className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:absolute sm:inset-auto sm:-left-[390px] sm:top-0 sm:translate-y-0 z-50 w-auto sm:w-[374px] rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl transition-opacity duration-300 max-h-[80vh] overflow-y-auto"
                          style={{ opacity: showScorePopup ? 1 : 0 }}
                        >
                          {/* Triangle pointer with white background matching popup - hidden on mobile */}
                          <div className="hidden sm:block absolute -right-[11px] top-8 h-0 w-0 border-l-[12px] border-r-0 border-t-[12px] border-b-[12px] border-l-white border-t-transparent border-b-transparent z-10" />
                          <div className="hidden sm:block absolute -right-[12px] top-8 h-0 w-0 border-l-[12px] border-r-0 border-t-[12px] border-b-[12px] border-l-slate-200 border-t-transparent border-b-transparent" />

                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                                />
                              </svg>
                            </div>
                            <h4 className="text-base font-bold text-slate-900">打分评估模型</h4>
                          </div>

                          <p className="mb-4 text-[11px] leading-relaxed text-slate-600">
                            本评分基于 Lovable 内部真实打分表模型（已迭代 7
                            次），总分100分制，评估您的软件产品在5个维度：痛苦度（Pain Point）、支付意愿（Willingness to
                            Pay）、竞品弱度（Competitive Weakness）、实现难度（Ease of
                            Implementation）和病毒系数（Virality
                            Factor）。每个维度满分20分，总分计算公式：∑维度分。阈值：92+立即开发；&lt;85建议放弃。
                          </p>

                          <div className="mb-4 space-y-2 rounded-lg bg-slate-50 p-3">
                            {scoreBreakdown.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span>{item.icon}</span>
                                  <span className="font-medium text-slate-700">{item.name}</span>
                                  <span className="text-slate-500">{item.description}</span>
                                </div>
                                <span className="font-bold text-slate-900">{item.score}分</span>
                              </div>
                            ))}
                          </div>

                          {/* Based on your score improvements */}
                          <div className="rounded-lg bg-blue-50 p-3">
                            <h5 className="mb-2 text-xs font-bold text-slate-900">
                              基于您的评分（{productScore}.0）的改进建议
                            </h5>
                            <ul className="space-y-1 text-[11px] text-slate-700">
                              <li>• 痛苦度低：调研更多用户反馈，确保过去48h内至少20人表达明确痛点。</li>
                              <li>• 支付意愿弱：优化定价模型，目标用户应明确表示愿意月付$10+。</li>
                              <li>• 竞品弱度不足：分析1-2个弱竞品，突出您的独特卖点。</li>
                              <li>• 实现难度高：简化MVP，优先交付关键功能。</li>
                            </ul>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-slate-200 my-4" />

                          {/* Agreement Checkbox */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                id="agree-score"
                                className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-slate-300 transition-all checked:border-0 checked:bg-gradient-to-br checked:from-purple-500 checked:to-pink-600 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 leading-7 border-2"
                              />
                              <svg
                                className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-[63%] text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <label
                              htmlFor="agree-score"
                              className="cursor-pointer text-sm font-medium text-slate-500 leading-3"
                            >
                              我接受早期投资
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Animation for border blink */}
      <style>{`
        @keyframes borderBlink {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.9);
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
          }
        }
        /* Add keyframes for text shake animation */
        @keyframes shake-text {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05) translate(-2px, 0);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.05) translate(2px, 0);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-shake-text {
          animation: shake-text 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
        /* Hide number input spinners */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  )
}
