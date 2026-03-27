/**
 * 产品上传页 Mock 数据与常量（步骤 2 从 page 抽离，逻辑不变）
 * 后续对接 API 时可替换为请求结果。
 */

export const productData = {
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

export const progressSteps = [
  { id: "matching", label: "匹配中" },
  { id: "creating", label: "创作中" },
  { id: "created", label: "已创作" },
  { id: "published", label: "已发布" },
]

/** 预设标签选项（上传页标签下拉用） */
export const presetTags = [
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
  "设计工具",
  "视频编辑",
  "图片编辑",
  "音频工具",
  "写作工具",
  "创意工具",
  "3D建模",
  "UI设计",
  "插画工具",
  "开发工具",
  "代码编辑器",
  "API工具",
  "数据库工具",
  "云服务",
  "DevOps",
  "低代码平台",
  "测试工具",
  "营销工具",
  "SEO工具",
  "社交媒体",
  "电商工具",
  "客服工具",
  "CRM系统",
  "数据分析",
  "广告投放",
  "邮件营销",
  "教育培训",
  "学习工具",
  "在线课程",
  "语言学习",
  "知识管理",
  "阅读工具",
  "技能培训",
  "健康健身",
  "运动追踪",
  "饮食管理",
  "睡眠监测",
  "冥想放松",
  "游戏娱乐",
  "音乐应用",
  "视频流媒体",
  "阅读娱乐",
  "金融理财",
  "记账工具",
  "投资理财",
  "加密货币",
  "支付工具",
  "预算管理",
  "生活服务",
  "旅行出行",
  "美食外卖",
  "购物比价",
  "家居智能",
  "宠物服务",
  "社交通讯",
  "医疗健康",
  "法律服务",
  "房产工具",
  "招聘HR",
  "物流配送",
  "农业科技",
  "智能硬件",
  "可穿戴设备",
  "智能家居",
  "数码配件",
  "VR/AR设备",
  "SaaS服务",
  "移动应用",
  "浏览器插件",
  "桌面软件",
  "小程序",
  "开源项目",
]

/** 产品评分弹窗内的维度说明（Lovable 打分表） */
export const scoreBreakdown = [
  { icon: "🎯", name: "痛苦度", description: "用户需求强烈且未被满足", score: 20 },
  { icon: "💰", name: "支付意愿", description: "用户明确表示愿意付费", score: 20 },
  { icon: "⚔️", name: "竞品弱度", description: "市场竞争弱，或有独特优势", score: 20 },
  { icon: "🔧", name: "实现难度", description: "产品开发技术难度适中", score: 20 },
  { icon: "⚡", name: "病毒系数", description: "品易于传播，用户自发推广", score: 8 },
]

/** AI 生成描述时填充的默认文案（与 fullDescription 开头一致） */
export const aiGeneratedDescriptionText = `【职场人士的绝命痛点】：每天面对海量信息，难以有效整理和回顾，让NoteMaster Pro瞬间解决，再也不要天天加班要疯掉！

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
我们的产品：AI智能分类、跨平台同步、高精度语音转文字、团队协作、智能搜索，一步到位解决所有痛点.`
