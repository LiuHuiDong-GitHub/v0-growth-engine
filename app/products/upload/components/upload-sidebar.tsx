"use client"

import type { UploadFormResult } from "../hooks/use-upload-form"
import { UploadIncentiveCard } from "./upload-incentive-card"
import { UploadContactCard } from "./upload-contact-card"
import { UploadScoreCard } from "./upload-score-card"

/** 产品上传页右侧侧栏：激励卡 + 联系卡 + 评分卡（步骤 2 拆分） */
export function UploadSidebar({ form }: { form: UploadFormResult }) {
  return (
    <div className="w-full lg:w-56 flex-shrink-0 space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-4 lg:space-y-4">
      <UploadIncentiveCard form={form} />
      <UploadContactCard form={form} />
      <UploadScoreCard form={form} />
    </div>
  )
}
