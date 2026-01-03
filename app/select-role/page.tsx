"use client"

import Link from "next/link"
import { useState } from "react"
import Breadcrumb from "@/components/breadcrumb"

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    if (role === "creator") {
      window.location.href = "/blogger-verification"
    } else {
      window.location.href = "/upload-product"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">推广平台</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb items={[{ label: "注册", href: "/register" }, { label: "选择角色" }]} />

          {/* Title Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-900">选择您的角色</h1>
            <p className="text-lg text-slate-600">请选择您的身份，以便我们为您显示相应的页面</p>
          </div>

          {/* Role Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Creator/Blogger Card */}
            <button
              onClick={() => handleRoleSelect("creator")}
              className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-8 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-blue-100 p-6 transition-colors group-hover:bg-blue-200">
                  <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-slate-900">我是博主/创作者</h2>
              <p className="text-slate-600">想赚钱接推广</p>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </button>

            {/* Investor/Developer Card */}
            <button
              onClick={() => handleRoleSelect("investor")}
              className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-8 text-center transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-indigo-100 p-6 transition-colors group-hover:bg-indigo-200">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-slate-900">我是投流者/开发者</h2>
              <p className="text-slate-600">想找博主推广产品</p>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 flex items-center justify-between">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors hover:underline">
              返回
            </Link>
            <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors hover:underline">
              跳过
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
