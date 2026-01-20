"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { getBreadcrumbs } from "@/lib/breadcrumb-config"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps = {}) {
  const pathname = usePathname()
  // Use provided items or generate from pathname
  const breadcrumbs = items || getBreadcrumbs(pathname)

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-0.5 text-xs sm:text-sm mb-4 sm:mb-6 px-0 sm:px-4 md:px-6 pt-2 sm:pt-3 md:pt-4 overflow-x-auto scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Home Link */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-600 transition-colors text-slate-600 hover:underline"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">首页</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 flex-shrink-0" />
      </div>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-0.5 min-w-fit">
            {item.href && !isLast ? (
              <>
                <Link
                  href={item.href}
                  className="text-slate-600 hover:text-blue-600 transition-colors hover:underline whitespace-nowrap truncate max-w-[80px] sm:max-w-none"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 flex-shrink-0" />
              </>
            ) : (
              <span className={cn("whitespace-nowrap truncate max-w-[100px] sm:max-w-none", isLast ? "text-slate-900 font-semibold" : "text-slate-600")}>
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
