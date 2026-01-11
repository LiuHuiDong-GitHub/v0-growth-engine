interface VideoCardProps {
  imageSrc: string
  alt: string
  title: string
  duration: string
  progress: number
}

export function VideoCard({ imageSrc, alt, title, duration, progress }: VideoCardProps) {
  return (
    <div className="flex items-center gap-6 rounded-lg bg-white p-0">
      {/* Left: Video Thumbnail */}
      <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-3xl bg-slate-200">
        <img src={imageSrc || "/placeholder.svg"} alt={alt} className="h-full w-full object-cover" />
      </div>

      {/* Middle: Video Info */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-base text-slate-400">时长: {duration}</p>
      </div>

      {/* Right: Progress Circle */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-20 w-20">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-900">{progress}%</span>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500">
          <div>已选取标题/</div>
          <div>时长标准度</div>
        </div>
      </div>
    </div>
  )
}
