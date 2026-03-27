"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  useEffect(() => {
    const target = email ? `/auth/verify-email?email=${encodeURIComponent(email)}` : "/auth/login"
    router.replace(target)
  }, [router, email])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-500">
      正在跳转到验证码页...
    </div>
  )
}
