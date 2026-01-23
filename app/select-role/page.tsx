"use client"

import Link from "next/link"
import { useState } from "react"
import AppHeader from "@/components/app-header"

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
      <AppHeader breadcrumbItems={[{ label: "注册", href: "/register" }, { label: "选择角色" }]} />

      <main className="container mx-auto px-4 py-8 sm:py-16 pt-20 sm:pt-24">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <div className="mb-8 sm:mb-16 text-center">
            <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">选择您的角色</h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2">请选择您的身份，以便我们为您显示相应的页面</p>
          </div>

          {/* Role Cards */}
          <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
            {/* Creator/Blogger Card */}
            <button
              onClick={() => handleRoleSelect("creator")}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-8 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className="rounded-xl sm:rounded-2xl bg-blue-100 p-4 sm:p-6 transition-colors group-hover:bg-blue-200">
                  <svg className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl font-bold text-slate-900">我是博主/创作者</h2>
              <p className="text-sm sm:text-base text-slate-600">想赚钱接推广</p>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </button>

            {/* Investor/Developer Card */}
            <button
              onClick={() => handleRoleSelect("investor")}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-8 text-center transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className="rounded-xl sm:rounded-2xl bg-indigo-100 p-4 sm:p-6 transition-colors group-hover:bg-indigo-200">
                  <svg className="h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl font-bold text-slate-900">我是投流者/开发者</h2>
              <p className="text-sm sm:text-base text-slate-600">想找博主推广产品</p>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 sm:mt-12 flex items-center justify-between px-2">
            <Link href="/login" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors hover:underline">
              &lt;&lt; 返回
            </Link>
            
          </div>
        </div>
      </main>
    </div>
  )
}
