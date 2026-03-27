"use client"

import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"
import AppHeader from "@/components/app-header" // Import AppHeader component
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api-client"

export default function SelectProductPage() {
  const [products, setProducts] = useState<
    Array<{ id: number | string; name: string; avatar: string; tags: string[]; description: string }>
  >([])
  const [error, setError] = useState("")

  useEffect(() => {
    apiGet<Array<{ id: number | string; name: string; avatar: string; tags: string[]; description: string }>>(
      "/api/v1/products/for-creator",
    )
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <h1 className="mb-4 sm:mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">待推广项目</h1>
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="grid gap-3 sm:gap-[0.9rem] md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
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
