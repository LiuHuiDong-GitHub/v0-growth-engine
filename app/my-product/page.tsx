"use client"

import Link from "next/link"
import AppHeader from "@/components/app-header"
import Breadcrumb from "@/components/breadcrumb"

export default function MyProductPage() {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    matching: { bg: "bg-blue-100", text: "text-blue-700", label: "创作者匹配中" },
    confirmed: { bg: "bg-amber-100", text: "text-amber-700", label: "已确认创作者" },
    published: { bg: "bg-green-100", text: "text-green-700", label: "内容已发布" },
    observing: { bg: "bg-purple-100", text: "text-purple-700", label: "数据观察期" },
    ended: { bg: "bg-slate-100", text: "text-slate-700", label: "项目结束" },
  }

  const products = [
    {
      id: 1,
      name: "云盘大师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cloud",
      tags: ["AI 智能整理", "跨平台同步", "安全加密"],
      description:
        "云盘大师是一款智能云存储服务，利用先进的 AI 技术自动分类和整理您的文件，确保数据安全并提供跨设备无缝同步体验。适合个人用户和小型团队进行高效协作。...",
      status: "matching",
    },
    {
      id: 2,
      name: "智能温控器",
      avatar: "https://api.dicebear.com/7.x/icons/svg?seed=temperature",
      tags: ["节能模式", "远程控制", "语音助手"],
      description:
        "智能温控器让您的家居环境更舒适、更节能。通过手机 APP 远程控制温度，支持多种智能语音助手，并提供节能分析报告，助您节省电费。...",
      status: "confirmed",
    },
    {
      id: 3,
      name: "投资助手",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=investment",
      tags: ["实时市场数据", "风险评估", "个性化推荐"],
      description:
        "投资助手是一款专为新手和资深投资者设计的工具，提供实时股票、基金、加密货币市场数据，内置智能风险评估模型，根据您的投资偏好给出个性化建议，助您做出明智决策。...",
      status: "published",
    },
    {
      id: 4,
      name: "AI 写作工具",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=writer",
      tags: ["高效创作", "语法检查", "多语言支持"],
      description:
        "AI 写作工具是您提高写作效率的得力助手。它不仅能帮助您快速生成高质量内容，还能进行实时语法检查、风格优化，并支持多种语言创作，适用于文案、报告、博客等多种场景。...",
      status: "observing",
    },
    {
      id: 5,
      name: "视频编辑专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=video",
      tags: ["一键编辑", "特效库", "导出优化"],
      description:
        "视频编辑专家是一款功能强大的视频编辑工具，提供直观的操作界面和丰富的特效库。支持一键编辑、自动字幕生成、多格式导出，让您轻松创建专业级视频内容。...",
      status: "ended",
    },
    {
      id: 6,
      name: "流量统计系统",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=analytics",
      tags: ["实时统计", "数据分析", "导出报告"],
      description:
        "流量统计系统为您提供全面的数据分析能力，实时监测网站/应用的流量变化趋势，生成详细的访问报告，帮助您更好地了解用户行为，优化营销策略。...",
      status: "ended",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Breadcrumb
            items={[
              { label: "注册", href: "/register" },
              { label: "选择角色", href: "/select-role" },
              { label: "博主验证", href: "/blogger-verification" },
              { label: "待推广项目" },
            ]}
          />

          <h1 className="mb-4 sm:mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">我的项目</h1>

          <div className="grid gap-3 sm:gap-[0.9rem] md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product-details/${product.id}`}
                className="group relative rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
              >
                <div className="mb-3 sm:mb-4 flex items-start gap-3 sm:gap-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                    <img
                      src={product.avatar || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 sm:mb-2 text-base sm:text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-slate-100 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-slate-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">{product.description}</p>

                {/* Status Badge */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium ${
                      statusConfig[product.status]?.bg || "bg-slate-100"
                    } ${statusConfig[product.status]?.text || "text-slate-700"}`}
                  >
                    {statusConfig[product.status]?.label || product.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/50 text-center border-t-0 py-4 sm:py-3.5">
          <p className="text-xs sm:text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
