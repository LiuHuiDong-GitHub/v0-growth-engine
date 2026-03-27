"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { apiPost } from "@/lib/api-client"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "example@email.com"
  
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(42)
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    // Countdown timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleVerify(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char))

    const newCode = [...code]
    digits.forEach((digit, i) => {
      if (i < 6) newCode[i] = digit
    })
    setCode(newCode)

    // Focus the next empty input or last input
    const nextIndex = Math.min(digits.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleVerify = async (verificationCode: string) => {
    setVerifying(true)
    setError("")
    try {
      const data = await apiPost<{
        user: { role: "creator" | "merchant" | "admin" }
      }>("/api/v1/auth/verify-email", { email, code: verificationCode })
      if (data.user.role === "creator") router.push("/creator/products")
      else if (data.user.role === "merchant") router.push("/products")
      else router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证码校验失败")
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer === 0) {
      await apiPost("/api/v1/auth/send-login-code", { email })
      setResendTimer(42)
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const handleChangeEmail = () => {
    router.push("/auth/login")
  }

  const handleClose = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Verification Card */}
      <Suspense fallback={null}>
        <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative">
          {/* Logo */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">N</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">NUESA</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Content */}
          <div className="pt-8 sm:pt-10 pb-4">
            {/* Title */}
            <div className="text-center mb-6 sm:mb-8 px-2">
              <p className="text-slate-600 text-sm sm:text-base break-words">
                We've sent a verification code to{" "}
                <span className="font-semibold text-slate-900 break-all">{email}</span>
              </p>
            </div>

            {/* Verification Code Inputs */}
            <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-12 sm:w-12 sm:h-14 md:w-16 md:h-16 text-center text-lg sm:text-xl md:text-2xl font-semibold border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              ))}
            </div>

            {/* Resend Timer */}
            <div className="text-center mb-6">
              {resendTimer > 0 ? (
                <p className="text-slate-400 text-sm">Resend in {resendTimer}s</p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Resend code
                </button>
              )}
            </div>
            {(error || verifying) && (
              <p className={`text-center text-xs mb-3 ${error ? "text-red-500" : "text-slate-500"}`}>
                {error || "正在验证..."}
              </p>
            )}

            {/* Change Email Link */}
            <div className="text-center">
              <button
                onClick={handleChangeEmail}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Change email address
              </button>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
