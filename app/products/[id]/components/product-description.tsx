"use client"

import { RefObject } from "react"
import { FileText } from "lucide-react"

/**
 * 可展开/折叠的产品描述文档
 * 设计意图：展示与交互由 props 控制，便于主卡片组合
 */
export function ProductDescription({
  containerRef,
  isExpanded,
  onExpand,
  onCollapse,
  content,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
  content: string
}) {
  return (
    <div className="mt-6 sm:mt-8" ref={containerRef}>
      <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-slate-200 bg-white">
          <div className="flex gap-1.5">
            <button
              onClick={onCollapse}
              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
              title="Collapse"
            >
              <div className="w-2 h-0.5 bg-white" />
            </button>
            <button
              onClick={onExpand}
              className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
              title="Expand"
            >
              <span className="text-white text-xs font-bold">⤡</span>
            </button>
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5 sm:gap-2">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            产品描述文档
          </span>
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => !isExpanded && onExpand()}
        >
          <div
            className={`px-4 sm:px-6 py-4 sm:py-5 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line transition-all duration-500 ${
              isExpanded ? "max-h-none" : "overflow-hidden"
            }`}
            style={!isExpanded ? { maxHeight: "27rem", lineHeight: "1.5rem" } : {}}
          >
            {content}
          </div>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
              <div className="h-8 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-[1px]" />
              <div className="h-6 bg-gradient-to-t from-white/25 to-white/10 backdrop-blur-[3px]" />
              <div className="h-6 bg-gradient-to-t from-white/50 to-white/25 backdrop-blur-[5px]" />
              <div className="h-6 bg-gradient-to-t from-white/70 to-white/50 backdrop-blur-[8px]" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
