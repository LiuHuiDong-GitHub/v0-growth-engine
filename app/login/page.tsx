"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/auth/login")
  }, [router])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-500">
      正在跳转到登录页...
    </div>
  )
}
