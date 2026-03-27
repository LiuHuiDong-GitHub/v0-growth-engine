"use client"

import AppHeader from "@/components/app-header"
import { useUploadForm } from "./hooks/use-upload-form"
import { UploadPageContent } from "./components/upload-page-content"
import { UploadPageStyles } from "./components/upload-page-styles"

/**
 * 产品上传页：仅负责组合布局与子组件（步骤 2 拆分）
 * 数据与逻辑在 useUploadForm，UI 在 UploadPageContent，样式在 UploadPageStyles。
 */
export default function UploadProductsPage() {
  const form = useUploadForm()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <UploadPageContent form={form} />
        </main>
      </div>
      <UploadPageStyles />
    </div>
  )
}
