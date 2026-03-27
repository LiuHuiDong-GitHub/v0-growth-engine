import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  bgColor: string
}

export function ServiceCard({ icon, title, subtitle, description, bgColor }: ServiceCardProps) {
  return (
    <Card className="border-slate-600 bg-slate-700/50 p-6 transition-all hover:bg-slate-700">
      <div className="mb-4 flex items-start gap-4">
        <div className={`rounded-lg p-3 ${bgColor}`}>{icon}</div>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-300">{subtitle}</p>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-5 w-5 opacity-50">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">{description}</p>
      <Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10">
        查看详情
      </Button>
    </Card>
  )
}
