import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface Metric {
  label: string
  value: string
  color: string
}

interface TestimonialCardProps {
  image: string
  avatar: string
  company: string
  title: string
  description: string
  metrics: Metric[]
  quote: string
  author: string
}

export function TestimonialCard({
  image,
  avatar,
  company,
  title,
  description,
  metrics,
  quote,
  author,
}: TestimonialCardProps) {
  return (
    <Card className="w-[350px] flex-shrink-0 overflow-hidden border-2 border-gray-100 shadow-lg transition-all hover:shadow-xl">
      {/* Top Image with Avatar */}
      <div className="relative h-48">
        <img src={image || "/placeholder.svg"} alt={company} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4">
          <img
            src={avatar || "/placeholder.svg"}
            alt="Avatar"
            className="h-12 w-12 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-1 text-lg font-bold text-gray-900">
          {company}：{title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{description}</p>

        <div className="mb-4 grid grid-cols-3 gap-3">
          {metrics.map((metric, metricIdx) => (
            <div key={metricIdx} className="flex flex-col items-center text-center">
              <TrendingUp className={`mb-1 h-4 w-4 ${metric.color}`} />
              <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-xs text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="border-l-4 border-blue-500 py-2 pl-3">
          <p className="mb-2 line-clamp-2 text-xs italic text-gray-700">"{quote}"</p>
          <div className="flex items-center gap-2">
            <img src={avatar || "/placeholder.svg"} alt={author} className="h-6 w-6 rounded-full" />
            <span className="text-xs text-gray-600">{author}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
