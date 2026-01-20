"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, X, Phone, Apple, MessageCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Navigate to email verification page
      console.log("Email login:", email)
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    }
  }

  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Login Card - Standard website login box size */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Email Login Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Email Login</h2>
          
          {/* Email Input with Arrow */}
          <form onSubmit={handleEmailSubmit}>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 pr-12 text-base border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3.5 text-base border border-slate-200 rounded-full hover:bg-slate-50 transition-colors font-medium text-slate-700 mb-6"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* OR Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400 font-medium">OR</span>
          </div>
        </div>

        {/* Other Login Methods */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {/* Apple */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <Apple className="w-6 h-6 text-slate-700 group-hover:text-slate-900" />
            <span className="text-[10px] text-slate-500 mt-1">Apple</span>
          </button>

          {/* WeChat */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
            </svg>
            <span className="text-[10px] text-slate-500 mt-1">WeChat</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-[10px] text-slate-500 mt-1">Facebook</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <MessageCircle className="w-6 h-6 text-green-600" />
            <span className="text-[10px] text-slate-500 mt-1">WhatsApp</span>
          </button>

          {/* Phone SMS */}
          <button
            type="button"
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <Phone className="w-6 h-6 text-slate-600 group-hover:text-slate-900" />
            <span className="text-[10px] text-slate-500 mt-1">SMS</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
