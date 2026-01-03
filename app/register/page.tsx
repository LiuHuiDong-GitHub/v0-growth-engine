"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Lock, MessageSquare, Chrome, Apple } from "lucide-react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"

export default function RegisterPage() {
  const router = useRouter()
  const [countryCode, setCountryCode] = useState("+86")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Register:", { countryCode, phone, password, agreed })

    // Redirect to role selection page
    router.push("/select-role")
  }

  const handleGetCode = () => {
    // Handle getting verification code
    console.log("Getting verification code for:", countryCode + phone)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Breadcrumb items={[{ label: "注册" }]} />

        {/* Logo/Brand Link */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-bold text-slate-800">GrowthEngine</span>
        </Link>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">创建账户</h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">手机号</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="+86">+86</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+81">+81</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Verification Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">短信验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="请输入短信验证码"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={handleGetCode}
                  className="px-4 py-3 text-blue-600 font-medium hover:text-blue-700 whitespace-nowrap"
                >
                  获取验证码
                </button>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次确认密码"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                我已阅读并同意{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  服务条款
                </Link>{" "}
                与{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  隐私政策
                </Link>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              创建账户
            </button>

            {/* Divider */}
            <div className="text-center text-sm text-slate-500 my-4">或使用以下方式注册</div>

            {/* Social Register Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <MessageSquare className="w-5 h-5" />
                使用微信注册
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <Chrome className="w-5 h-5" />
                使用 Google 注册
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <Apple className="w-5 h-5" />
                使用 Apple 注册
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-slate-600 mt-6">
              已有账户？{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                登录
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
