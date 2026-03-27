"use client"

import { Zap } from "lucide-react"

/** 激励金计划数据结构（与 product-data 一致） */
type IncentiveData = {
  baseReward: number
  bonusTargets: Array<{ views: number; bonus: number }>
}

/**
 * 激励金计划卡片（右侧边栏）
 * 设计意图：纯展示，数据由父级传入
 */
export function ProductIncentiveCard({ incentive }: { incentive: IncentiveData }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-50 border border-amber-200/60 shadow-lg shadow-amber-100/50 overflow-hidden rounded-lg h-fit">
      <div className="relative px-5 pt-5 pb-3">
        <div className="text-xs font-medium text-amber-700/80">激励金计划</div>
        <div className="text-lg font-bold text-amber-900 mt-0.5">额外奖励</div>
      </div>
      <div className="mx-4 px-3 py-2.5 rounded-xl bg-white/80 border border-amber-200/50 mb-3">
        <div className="text-[10px] text-amber-600/80 uppercase tracking-wide">基础推广费</div>
        <div className="text-xl font-bold text-amber-900">¥{incentive.baseReward}</div>
      </div>
      <div className="px-4 pb-4">
        <div className="text-[10px] text-amber-700/70 mb-2">播放量达标奖励</div>
        <div className="space-y-1.5">
          {incentive.bonusTargets.map((target, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/60 border border-amber-100"
            >
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-500" />
                <span className="text-[11px] text-amber-800">{(target.views / 10000).toFixed(0)}万</span>
              </div>
              <span className="text-xs font-semibold text-amber-600">+¥{target.bonus}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
    </div>
  )
}
