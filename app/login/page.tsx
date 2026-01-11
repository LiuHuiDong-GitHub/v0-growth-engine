"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Chrome, Apple } from "lucide-react"
import AppHeader from "@/components/app-header"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login:", { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader breadcrumbItems={[{ label: "登录" }]} />

      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-[239px]">
          {/* Logo/Brand Link */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-slate-800">GrowthEngine</span>
          </Link>

          {/* Login Card - Scaled down by 50% */}
          <div className="bg-white shadow-xl p-4 border border-slate-200 opacity-100 rounded-lg">
            <div className="text-center mb-4">
              <h1 className="font-bold text-slate-900 mb-1 text-base">欢迎回来！</h1>
              <p className="text-xs text-slate-600 leading-4">请输入您的邮箱和密码。</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-2.5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                    className="w-full pl-6 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">密码</label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-6 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  忘记密码?
                </Link>
              </div>

              {/* Login Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-[34.4%] text-xs bg-blue-600 text-white py-1 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                >
                  登录
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">或</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  <Chrome className="w-3 h-3" />
                  使用 Google 登录
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  <Apple className="w-3 h-3" />
                  使用 Apple 登录
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C7.82 2.188 6.846 2.61 6.254 3.302c-.6.696-.979 1.693-.979 2.685 0 .105.006.216.015.323.01.106.025.216.042.323.344-.019.688-.073 1.024-.193.678-.24 1.282-.692 1.737-1.283.456-.592.739-1.335.739-2.087zm3.502 13.336c-.552 0-1.038-.144-1.414-.432-.376-.288-.564-.72-.564-1.296 0-.552.216-1.08.648-1.584.432-.504 1.056-.96 1.872-1.368.816-.408 1.728-.768 2.736-1.08 1.008-.312 2.04-.6 3.096-.864.336-.072.648-.144.936-.216.288-.072.552-.168.792-.288.24-.12.456-.264.648-.432.192-.168.36-.36.504-.576.144-.216.264-.456.36-.72.096-.264.168-.552.216-.864.048-.36.072-.648.072-1.008 0-.552-.096-1.08-.288-1.584-.192-.504-.48-.96-.864-1.368-.384-.408-.84-.744-1.368-1.008-.528-.264-1.128-.396-1.8-.396-.552 0-1.08.096-1.584.288-.504.192-.96.48-1.368.864-.408.384-.744.84-1.008 1.368-.264.528-.396 1.128-.396 1.8 0 .072.006.144.015.216.01.072.025.144.042.216.336-.072.648-.192.936-.36.288-.168.552-.36.792-.576.24-.216.456-.456.648-.72.192-.264.36-.552.504-.864.144-.312.264-.648.36-1.008.096-.36.168-.72.216-1.08.048-.36.072-.72.072-1.08 0-.552-.096-1.08-.288-1.584-.192-.504-.48-.96-.864-1.368-.384-.408-.84-.744-1.368-1.008-.528-.264-1.128-.396-1.8-.396z" />
                  </svg>
                  微信授权登录
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-xs text-slate-600 mt-3">
                还没有账户？{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  注册
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
