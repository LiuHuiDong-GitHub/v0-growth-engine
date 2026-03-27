"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RegisterPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/auth/register")
  }, [router])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-500">
      正在跳转到注册页...
    </div>
  )
}
