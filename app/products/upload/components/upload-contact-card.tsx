"use client"

import { Users, Mail, Phone } from "lucide-react"
import { PhoneInput } from "@/components/ui/phone-input"
import type { UploadFormResult } from "../hooks/use-upload-form"

/** 联系方式侧栏卡片（步骤 2 从 page 抽离） */
export function UploadContactCard({ form }: { form: UploadFormResult }) {
  const { state, handlers } = form
  const { contactName, contactEmail, contactPhone, validationErrors } = state
  const {
    handleContactNameChange,
    handleContactEmailChange,
    handleContactPhoneChange,
    updateValidationError,
  } = handlers

  return (
    <div className="overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200/60 relative rounded-xl">
      <div className="absolute top-3 right-3 w-10 h-10 rotate-12">
        <div className="w-full h-full border-2 border-red-400 bg-red-50 rounded-sm flex items-center justify-center">
          <Mail className="h-4 w-4 text-red-500" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border border-red-400 bg-red-100 transform rotate-45" />
      </div>
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent opacity-30" />
      <div className="relative p-4 space-y-2.5">
        <div className="text-xs font-semibold text-blue-900 tracking-wide uppercase mb-3">联系方式</div>
        <div className="flex items-start gap-2">
          <Users className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">联系人</div>
            <input
              type="text"
              value={contactName}
              onChange={handleContactNameChange}
              onBlur={() => updateValidationError("contactName", contactName)}
              placeholder="请输入联系人名称"
              className={`border border-dotted border-slate-300 bg-transparent text-slate-800 placeholder:text-xs ${
                validationErrors.contactName ? "border-red-500 bg-red-50" : ""
              }`}
            />
            {validationErrors.contactName && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.contactName}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Mail className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="break-all min-w-0 flex-1">
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">邮箱</div>
            <input
              type="email"
              value={contactEmail}
              onChange={handleContactEmailChange}
              onBlur={() => updateValidationError("contactEmail", contactEmail)}
              placeholder="请输入邮箱"
              className={`border border-dotted border-slate-300 bg-transparent text-slate-800 placeholder:text-xs ${
                validationErrors.contactEmail ? "border-red-500 bg-red-50" : ""
              }`}
            />
            {validationErrors.contactEmail && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.contactEmail}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">电话</div>
            <PhoneInput
              value={contactPhone}
              onChange={handleContactPhoneChange}
              onBlur={() => updateValidationError("contactPhone", contactPhone)}
              error={validationErrors.contactPhone}
              placeholder="Enter phone number"
              defaultCountry="CN"
            />
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400" />
    </div>
  )
}
