"use client"

import { RefObject } from "react"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

/** 单条资料（与 product-data.attachments.documents 一致） */
type DocumentItem = { name: string; size: string; icon: string }

const scrollBtnStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(3px)",
} as const

/**
 * 相关资料横向滚动列表
 * 设计意图：展示 + 滚动/下载交互由 props 传入
 */
export function ProductDocuments({
  documentsRef,
  documents,
  onScroll,
  onDownload,
}: {
  documentsRef: RefObject<HTMLDivElement | null>
  documents: DocumentItem[]
  onScroll: (direction: "left" | "right") => void
  onDownload: (docName: string) => void
}) {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2">
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
          相关资料
        </h3>
      </div>
      <div className="relative group">
        <button
          onClick={() => onScroll("left")}
          style={scrollBtnStyle}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
        </button>
        <div
          ref={documentsRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing px-6 sm:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {documents.map((doc, index) => (
            <div key={index} className="flex-shrink-0 flex flex-col items-center">
              <div
                onClick={() => onDownload(doc.name)}
                className="w-28 sm:w-36 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all group text-center cursor-pointer"
              >
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{doc.icon}</div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-700 group-hover:text-blue-700 truncate">
                  {doc.name}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">{doc.size}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onScroll("right")}
          style={{ ...scrollBtnStyle, background: "rgba(255, 255, 255, 0.15)" }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full hover:bg-white/20 shadow-sm hover:shadow hover:shadow-slate-200/40 flex items-center justify-center transition-all"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
        </button>
      </div>
    </div>
  )
}
