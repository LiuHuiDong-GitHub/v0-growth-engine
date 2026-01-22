"use client"

import { useState } from "react"
import AppHeader from "@/components/app-header"
import {
  Search,
  MessageSquare,
  Shield,
  CreditCard,
  Users,
  Zap,
  HelpCircle,
  ChevronRight,
  Mail,
  FileText,
} from "lucide-react"

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const quickLinks = [
    {
      icon: Zap,
      title: "快速开始",
      description: "了解如何快速上手 GrowthEngine",
      href: "#getting-started",
    },
    {
      icon: Users,
      title: "博主认证",
      description: "申请成为认证博主",
      href: "#blogger-verification",
    },
    {
      icon: MessageSquare,
      title: "使用留言板",
      description: "学习如何发布和管理留言",
      href: "#message-board",
    },
    {
      icon: CreditCard,
      title: "订阅与账单",
      description: "管理您的订阅和付款",
      href: "#billing",
    },
    {
      icon: Shield,
      title: "账户安全",
      description: "保护您的账户信息",
      href: "#security",
    },
    {
      icon: FileText,
      title: "使用条款",
      description: "了解服务条款和隐私政策",
      href: "#terms",
    },
  ]

  const faqCategories = [
    {
      id: "getting-started",
      title: "快速开始",
      questions: [
        {
          q: "GrowthEngine 是什么？",
          a: "GrowthEngine 是一个连接项目方和博主的增长营销平台，帮助项目获得博主推广和用户增长。",
        },
        {
          q: "如何注册账户？",
          a: "点击首页登录按钮，选择注册选项，填写邮箱、密码即可完成注册。",
        },
        {
          q: "我需要支付费用才能使用吗？",
          a: "GrowthEngine 提供免费和付费两种服务。基础功能免费，高级功能需要订阅。",
        },
        {
          q: "如何重置密码？",
          a: "在登录页面点击'忘记密码'，按照邮件链接重置您的密码。",
        },
      ],
    },
    {
      id: "blogger-verification",
      title: "博主认证",
      questions: [
        {
          q: "如何申请成为认证博主？",
          a: "进入博主认证页面，填写您的基本信息、社媒账号和粉丝数据，等待审核通过。",
        },
        {
          q: "审核需要多长时间？",
          a: "通常审核需要 1-3 个工作日，我们会通过邮件通知您审核结果。",
        },
        {
          q: "认证被拒绝怎么办？",
          a: "您可以查看拒绝原因，修改信息后重新申请。如有疑问可联系我们的客服。",
        },
      ],
    },
    {
      id: "message-board",
      title: "留言板使用",
      questions: [
        {
          q: "如何在留言板发布留言？",
          a: "进入留言板，点击新建留言，填写内容、上传图片，点击发送即可。",
        },
        {
          q: "可以编辑或删除已发布的留言吗？",
          a: "是的，在您的留言上点击编辑或删除按钮，但删除后无法恢复。",
        },
        {
          q: "留言会被公开显示吗？",
          a: "所有留言默认为私密，仅限您和项目方可见。",
        },
      ],
    },
    {
      id: "billing",
      title: "订阅与账单",
      questions: [
        {
          q: "支持哪些付款方式？",
          a: "我们支持信用卡、借记卡和数字钱包支付。",
        },
        {
          q: "如何查看我的账单？",
          a: "进入设置 > 账单订阅，可以查看所有账单和续期记录。",
        },
        {
          q: "如何取消订阅？",
          a: "在账单订阅页面点击取消订阅，立即生效，不会产生额外费用。",
        },
        {
          q: "有退款政策吗？",
          a: "我们提供 7 天无理由退款。在订阅后 7 天内可申请全额退款。",
        },
      ],
    },
    {
      id: "security",
      title: "账户安全",
      questions: [
        {
          q: "如何更改密码？",
          a: "进入设置 > 账户 > 修改密码，按照提示完成密码更新。",
        },
        {
          q: "如何启用两步验证？",
          a: "在账户设置中找到两步验证选项，按照步骤配置您的验证方式。",
        },
        {
          q: "账户被盗了怎么办？",
          a: "立即更改密码并联系我们的客服团队，我们会帮助您恢复账户。",
        },
      ],
    },
    {
      id: "terms",
      title: "服务条款",
      questions: [
        {
          q: "我可以在其他平台分享 GrowthEngine 的内容吗？",
          a: "您可以分享您自己的内容，但不能转载他人发布的内容。",
        },
        {
          q: "GrowthEngine 如何使用我的数据？",
          a: "我们严格遵守隐私政策，只会在您同意的情况下使用您的数据。",
        },
      ],
    },
  ]

  const supportChannels = [
    {
      icon: Mail,
      title: "邮件支持",
      description: "support@growthengine.com",
      subtitle: "24小时内回复",
    },
    {
      icon: MessageSquare,
      title: "在线客服",
      description: "周一至周五 9:00-18:00",
      subtitle: "实时响应",
    },
    {
      icon: FileText,
      title: "提交工单",
      description: "详细描述您的问题",
      subtitle: "跟踪进度",
    },
  ]

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader breadcrumbItems={[{ label: "帮助中心" }]} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            GrowthEngine 帮助中心
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            找到您需要的答案，快速解决问题
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索问题、功能、教程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-slate-900 placeholder-slate-400 shadow-xl focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">快速导航</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon
              return (
                <a
                  key={index}
                  href={link.href}
                  className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-slate-600">{link.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">常见问题</h2>
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setActiveCategory(activeCategory === category.id ? null : category.id)
                  }
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
                  <ChevronRight
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      activeCategory === category.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {activeCategory === category.id && (
                  <div className="border-t border-slate-200 divide-y divide-slate-200">
                    {category.questions.map((item, qIndex) => (
                      <div key={qIndex} className="p-6">
                        <p className="font-medium text-slate-900 mb-2">{item.q}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">联系我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon
              return (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{channel.title}</h3>
                  <p className="text-sm text-slate-600 mb-1">{channel.description}</p>
                  <p className="text-xs text-slate-500">{channel.subtitle}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">还有其他问题？</p>
          <a
            href="mailto:support@growthengine.com"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            联系我们
          </a>
        </div>
      </div>
    </div>
  )
}
