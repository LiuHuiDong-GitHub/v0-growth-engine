"use client"

import type { UploadFormResult } from "../hooks/use-upload-form"
import { UploadHeroCard } from "./upload-hero-card"
import { UploadSidebar } from "./upload-sidebar"

/**
 * 产品上传页主内容：主卡 + 侧栏（步骤 2 拆分）
 * 仅做布局组合，不包含业务逻辑。
 */
export function UploadPageContent({ form }: { form: UploadFormResult }) {
  return (
    <div className="mx-auto max-w-7xl w-full">
      <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        <UploadHeroCard form={form} />
        <UploadSidebar form={form} />
      </div>
    </div>
  )
}
