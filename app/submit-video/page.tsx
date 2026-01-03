"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AppHeader from "@/components/app-header"
import Breadcrumb from "@/components/breadcrumb"
import { LinkIcon, Play, Check, X, Upload, Info } from "lucide-react"

export default function SubmitVideo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")
  const projectName = searchParams.get("projectName") || "示例产品名称"
  const projectCategory = searchParams.get("category") || "电子产品"

  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("提交成功！我们的审核团队将在24小时内处理并通过邮件通知您。")
    router.push(`/blogger-video/${projectId}?status=submitted`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb
          items={[
            { label: "首页", href: "/" },
            { label: "我的推广", href: "/my-promotions" },
            { label: "提交视频信息" },
          ]}
        />

        <div className="mb-10 mt-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            提交视频信息
          </h1>
          <p className="text-lg text-slate-600">此表单用于提交您的视频链接和视频封面图片</p>
        </div>

        <div className="space-y-6">
          <div className="transform rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">推广产品</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="overflow-hidden rounded-xl shadow-md ring-2 ring-blue-100">
                  <img src="/vintage-camera-still-life.png" alt="Product" className="h-24 w-24 object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{projectName}</h3>
                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {projectCategory}
                  </span>
                </div>
              </div>
              <button className="rounded-lg border-2 border-slate-200 bg-white px-5 py-2 font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                更改
              </button>
            </div>
          </div>

          <div className="transform rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">视频链接 (URL)</h2>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <LinkIcon className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="可以在浏览器直接查看的视频url链接，不可包含#url字符"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-800 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">请输入完整的视频URL地址</p>
          </div>

          <div className="transform rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">视频首屏截图</h2>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              <div className="group flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 transition-all hover:border-blue-400 hover:bg-blue-50">
                <Upload className="h-6 w-6 text-slate-400 transition-colors group-hover:text-blue-500" />
                <span className="text-base font-medium text-slate-600 transition-colors group-hover:text-blue-600">
                  点击上传封面图片
                </span>
              </div>
            </label>
            <p className="mt-2 text-sm text-slate-500">支持PNG, JPG, GIF文件，最大5MB</p>
          </div>

          <div className="transform rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">视频预览</h2>
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 py-20">
              {thumbnail ? (
                <div className="relative">
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt="Video thumbnail"
                    className="max-h-80 rounded-xl object-cover shadow-2xl ring-4 ring-white"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl transition-transform hover:scale-110">
                      <Play className="h-10 w-10 text-white" fill="white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-slate-300 p-6">
                    <Play className="h-12 w-12 text-slate-500" />
                  </div>
                  <p className="text-slate-500">视频预览将在此显示</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !videoUrl}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:hover:brightness-100"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  提交中...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  提交
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-10 py-4 font-semibold text-slate-700 shadow-md transition-all hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              取消
            </button>
          </div>

          <div className="flex items-start gap-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-5 shadow-sm">
            <Info className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />
            <p className="text-sm leading-relaxed text-blue-900">
              提交后我们的审核团队将在24小时内处理并通过邮件通知您。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
