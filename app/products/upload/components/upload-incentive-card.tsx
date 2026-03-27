"use client"

import { Zap } from "lucide-react"
import type { UploadFormResult } from "../hooks/use-upload-form"

/** 激励金计划侧栏卡片（步骤 2 从 page 抽离） */
export function UploadIncentiveCard({ form }: { form: UploadFormResult }) {
  const { productData, state, handlers } = form
  const { baseReward, bonusTargetViews, setBonusTargetViews, bonusTargetBonuses, setBonusTargetBonuses, validationErrors } = state
  const { handleBaseRewardChange, updateValidationError } = handlers

  return (
    <div className="bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-50 border border-amber-200/60 shadow-lg shadow-amber-100/50 overflow-hidden rounded-lg">
      <div className="relative px-5 pt-5 pb-3">
        <div className="text-xs font-medium text-amber-700/80">激励金计划</div>
        <div className="text-lg font-bold text-amber-900 mt-0.5">额外奖励</div>
      </div>
      <div className="px-4 pt-4 pb-2">
        <div className="text-[10px] text-amber-700/70 mb-1">基础佣金</div>
        <input
          type="number"
          value={baseReward}
          onChange={handleBaseRewardChange}
          onBlur={() => updateValidationError("baseReward", baseReward)}
          placeholder="请输入佣金"
          className={`border border-dotted border-slate-300 bg-transparent text-slate-800 font-semibold ${
            validationErrors.baseReward ? "border-red-500 bg-red-50" : ""
          }`}
        />
        {validationErrors.baseReward && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.baseReward}</p>
        )}
      </div>
      <div className="px-4 pb-4">
        <div className="text-[10px] text-amber-700/70 mb-2">播放量达标奖励</div>
        <div className="space-y-1.5">
          {productData.incentive.bonusTargets.map((_target, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/60 border border-amber-100"
            >
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-500" />
                <div className="flex items-center gap-0.5">
                  <input
                    type="number"
                    value={bonusTargetViews[index].value}
                    onChange={(e) => {
                      const newViews = [...bonusTargetViews]
                      newViews[index].value = e.target.value
                      setBonusTargetViews(newViews)
                    }}
                    className="w-10 text-[11px] text-amber-800 bg-transparent border-b focus:border-amber-500 focus:outline-none px-0.5 border-dashed border-amber-400"
                    min={0}
                    step={1}
                  />
                  <select
                    value={bonusTargetViews[index].unit}
                    onChange={(e) => {
                      const newViews = [...bonusTargetViews]
                      newViews[index].unit = e.target.value as "k" | "w"
                      setBonusTargetViews(newViews)
                    }}
                    className="py-0 text-[10px] text-amber-800 bg-transparent border-b focus:border-amber-500 focus:outline-none cursor-pointer appearance-none px-px w-2.5 border-amber-400 border-dashed"
                  >
                    <option value="w">w</option>
                    <option value="k">k</option>
                  </select>
                </div>
              </div>
              <input
                type="number"
                value={bonusTargetBonuses[index] ?? ""}
                onChange={(e) => {
                  const newBonuses = [...bonusTargetBonuses]
                  newBonuses[index] = e.target.value
                  setBonusTargetBonuses(newBonuses)
                }}
                placeholder="0"
                className="text-xs font-semibold text-amber-600 border border-dotted border-slate-300 bg-transparent w-12 px-1 py-0 focus:border-amber-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
    </div>
  )
}
