"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import { PhoneInput } from "@/components/ui/phone-input"

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone")
  const [countryCode, setCountryCode] = useState("+86")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleGetVerificationCode = () => {
    if (method === "phone") {
      console.log("Getting verification code for phone:", phoneNumber)
    } else {
      console.log("Getting verification code for email:", email)
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("密码不匹配")
      return
    }
    if (method === "phone") {
      console.log("Reset password for phone:", phoneNumber)
    } else {
      console.log("Reset password for email:", email)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader breadcrumbItems={[{ label: "忘记密码" }]} />

      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          {/* Logo/Brand Link */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-slate-800">GrowthEngine</span>
          </Link>

          {/* Forgot Password Card */}
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-200">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">忘记密码</h1>
              <p className="text-slate-600 text-lg">密码重置可以通过短信或邮箱完成。</p>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`py-4 px-6 rounded-xl text-lg font-medium transition-all ${
                  method === "phone" ? "bg-slate-100 text-slate-900" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                通过手机号重置
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`py-4 px-6 rounded-xl text-lg font-medium transition-all ${
                  method === "email" ? "bg-slate-100 text-slate-900" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                通过邮箱重置
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              {method === "phone" ? (
                /* Phone Number Field */
                <div>
                  <label className="block text-lg font-medium text-slate-900 mb-3">手机号</label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    defaultCountry="CN"
                    placeholder="Enter your phone number"
                  />
                </div>
              ) : (
                /* Email Field */
                <div>
                  <label className="block text-lg font-medium text-slate-900 mb-3">邮箱</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱地址"
                    className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    required
                  />
                </div>
              )}

              {/* Verification Code Field */}
              <div>
                <label className="block text-lg font-medium text-slate-900 mb-3">验证码</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="请输入验证码"
                    className="flex-1 px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGetVerificationCode}
                    className="px-8 py-4 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-all text-lg whitespace-nowrap"
                  >
                    获取验证码
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-lg font-medium text-slate-900 mb-3">新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码"
                  className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-lg font-medium text-slate-900 mb-3">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full max-w-xs mx-auto block py-4 px-8 bg-gradient-to-r from-purple-400 via-purple-500 to-pink-400 text-white text-lg font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                >
                  重置密码
                </button>
              </div>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                返回登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
