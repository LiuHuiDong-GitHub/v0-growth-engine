"use client"

import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header" // Import AppHeader component

export default function SelectProductPage() {
  const products = [
    {
      id: 1,
      name: "云盘大师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cloud",
      tags: ["AI 智能整理", "跨平台同步", "安全加密"],
      description:
        "云盘大师是一款智能云存储服务，利用先进的 AI 技术自动分类和整理您的文件，确保数据安全并提供跨设备无缝同步体验。适合个人用户和小型团队进行高效协作。...",
    },
    {
      id: 2,
      name: "智能温控器",
      avatar: "https://api.dicebear.com/7.x/icons/svg?seed=temperature",
      tags: ["节能模式", "远程控制", "语音助手"],
      description:
        "智能温控器让您的家居环境更舒适、更节能。通过手机 APP 远程控制温度，支持多种智能语音助手，并提供节能分析报告，助您节省电费。...",
    },
    {
      id: 3,
      name: "投资助手",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=investment",
      tags: ["实时市场数据", "风险评估", "个性化推荐"],
      description:
        "投资助手是一款专为新手和资深投资者设计的工具，提供实时股票、基金、加密货币市场数据，内置智能风险评估模型，根据您的投资偏好给出个性化建议，助您做出明智决策。...",
    },
    {
      id: 4,
      name: "AI 写作工具",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=writer",
      tags: ["高效创作", "语法检查", "多语言支持"],
      description:
        "AI 写作工具是您提高写作效率的得力助手。它不仅能帮助您快速生成高质量内容，还能进行实时语法检查、风格优化，并支持多种语言创作，适用于文案、报告、博客等多种场景。...",
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
          <h1 className="mb-4 sm:mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">待推广项目</h1>

          <div className="grid gap-3 sm:gap-[0.9rem] md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
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
