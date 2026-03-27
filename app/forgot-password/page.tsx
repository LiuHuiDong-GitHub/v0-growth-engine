"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/auth/forgot-password")
  }, [router])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-500">
      正在跳转到忘记密码页...
    </div>
  )
}
