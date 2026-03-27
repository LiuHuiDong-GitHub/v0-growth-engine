"use client"

import { ProductHeroCard } from "./components/product-hero-card"
import { ProductIncentiveCard } from "./components/product-incentive-card"
import { ProductContactCard } from "./components/product-contact-card"
import type { ProductDetailState } from "./components/product-hero-card"

/** 与 productData 结构一致（仅用到的字段） */
type ProductData = {
  name: string
  description: string
  link: string
  category: { type: string; keywords: string[] }
  timeline: { developerDeadline: string }
  fullDescription: string
  attachments: {
    screenshots: string[]
    documents: Array<{ name: string; size: string; icon: string }>
  }
  incentive: { baseReward: number; bonusTargets: Array<{ views: number; bonus: number }> }
  contact: { name: string; email: string; phone: string; website: string }
}

/**
 * 产品详情主内容：主卡片 + 右侧激励/联系卡片
 * 设计意图：页面只负责布局与注入 product + detail，内容区由此组件组合
 */
export function ProductDetailContent({
  product,
  detail,
}: {
  product: ProductData
  detail: ProductDetailState
}) {
  return (
    <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
      <ProductHeroCard product={product} detail={detail} />
      <div className="w-full lg:w-56 flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 items-start content-start">
        <ProductIncentiveCard incentive={product.incentive} />
        <ProductContactCard contact={product.contact} />
      </div>
    </div>
  )
}
