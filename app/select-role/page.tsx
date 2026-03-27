"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SelectRolePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/auth/role")
  }, [router])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-500">
      正在跳转到角色选择页...
    </div>
  )
}
