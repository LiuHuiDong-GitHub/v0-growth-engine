"use client"

import AppHeader from "@/components/app-header"
import { useProductDetail } from "./hooks/use-product-detail"
import { ProductDetailContent } from "./product-detail-content"
import { ProductDetailStyles } from "./product-detail-styles"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api-client"
import { useParams } from "next/navigation"

/**
 * 产品详情页容器：仅负责布局、数据注入与样式挂载
 * 设计意图：页面 ≤200 行，职责为组合 hook + 主内容组件
 */
export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const id = typeof params?.id === "string" ? params.id : ""
  const detail = useProductDetail(id)
  const [product, setProduct] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) {
      setError("无效产品ID")
      setProduct(null)
      return
    }
    apiGet(`/api/v1/products/${id}`)
      .then((data) => setProduct(data as Record<string, unknown>))
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
  }, [id])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
          <div className="mx-auto max-w-7xl w-full">
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            {product ? <ProductDetailContent product={product as never} detail={detail} /> : <p className="text-sm text-slate-500">加载中...</p>}
          </div>
        </main>
      </div>

      <ProductDetailStyles />
    </div>
  )
}
