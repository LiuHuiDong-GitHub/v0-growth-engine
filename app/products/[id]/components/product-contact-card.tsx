"use client"

import { Users, Mail, Phone, Globe } from "lucide-react"

/** 联系方式数据结构（与 product-data 一致） */
type ContactData = {
  name: string
  email: string
  phone: string
  website: string
}

/**
 * 联系方式卡片（右侧边栏）
 * 设计意图：纯展示，数据由父级传入
 */
export function ProductContactCard({ contact }: { contact: ContactData }) {
  return (
    <div className="overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200/60 relative rounded-xl h-fit">
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
          <div>
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">联系人</div>
            <div className="text-sm font-semibold text-slate-800">{contact.name}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Mail className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="break-all min-w-0">
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">邮箱</div>
            <div className="text-[11px] text-slate-700 leading-tight truncate">{contact.email}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">电话</div>
            <div className="text-xs text-slate-700">{contact.phone}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 pt-1 border-t border-blue-100">
          <Globe className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="break-all min-w-0">
            <div className="text-[10px] text-blue-600/70 uppercase tracking-wide">网站</div>
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-600 hover:text-blue-700 underline underline-offset-2 truncate block"
            >
              {contact.website}
            </a>
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400" />
    </div>
  )
}
