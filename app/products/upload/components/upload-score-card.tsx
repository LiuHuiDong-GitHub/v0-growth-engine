"use client"

import { scoreBreakdown } from "../lib/upload-mock-data"
import type { UploadFormResult } from "../hooks/use-upload-form"

/** 产品评分侧栏卡片与弹窗（步骤 2 从 page 抽离） */
export function UploadScoreCard({ form }: { form: UploadFormResult }) {
  const { refs, state, handlers } = form
  const {
    productScore,
    showScorePopup,
    isHidingPopup,
    cardPosition,
    shouldShowScore,
  } = state
  const {
    handleMouseEnter,
    handleMouseLeave,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
    getTextFontSize,
  } = handlers

  if (!shouldShowScore) return null

  return (
    <div className="relative mt-6">
      {showScorePopup && (
        <div className="fixed inset-0 z-40 bg-white/40 backdrop-blur-sm transition-all duration-300" />
      )}
      <div
        ref={refs.scoreCardRef}
        className="relative z-50 border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all rounded-xl pb-0.5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <svg className="h-5 sm:h-6 w-5 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">产品评分</h3>
            <p className="text-[10px] sm:text-xs text-slate-600">基于 Lovable 打分表</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-24 sm:h-32 w-24 sm:w-32">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#gradient-score)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - (productScore ?? 0) / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient-score" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm sm:text-lg font-bold text-blue-600">{productScore}</span>
              <span className="text-[6px] sm:text-[7px] text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="border-t pt-3 border-b border-slate-100 mb-2 mt-2 pb-3" />
        </div>
        {showScorePopup && (
          <div
            ref={refs.popupRef}
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
            className={`fixed bottom-4 left-4 right-4 sm:absolute sm:bottom-auto sm:top-0 sm:translate-y-0 z-50 w-auto sm:w-[374px] rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto ${
              cardPosition === "left" ? "sm:left-full sm:ml-4 sm:right-auto" : "sm:right-full sm:mr-4 sm:left-auto"
            } ${isHidingPopup ? "hidden" : ""}`}
          >
            <div
              className={`hidden sm:block absolute top-8 h-0 w-0 border-t-[12px] border-b-[12px] border-transparent z-10 ${
                cardPosition === "left" ? "-left-[11px] border-r-[12px] border-r-white" : "-right-[11px] border-l-[12px] border-l-white"
              }`}
            />
            <div
              className={`hidden sm:block absolute top-8 h-0 w-0 border-t-[12px] border-b-[12px] border-transparent ${
                cardPosition === "left" ? "-left-[12px] border-r-[12px] border-r-slate-200" : "-right-[12px] border-l-[12px] border-l-slate-200"
              }`}
            />
            <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-5 sm:h-6 w-5 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" />
                </svg>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">打分评估模型</h4>
            </div>
            <p className="mb-3 sm:mb-4 text-[10px] sm:text-[11px] leading-relaxed text-slate-600">
              本评分基于 Lovable 内部真实打分表模型（已迭代 7
              次），总分100分制，评估您的软件产品在5个维度：痛苦度（Pain Point）、支付意愿（Willingness to
              Pay）、竞品弱度（Competitive Weakness）、实现难度（Ease of
              Implementation）和病毒系数（Virality
              Factor）。每个维度满分20分，总分计算公式：∑维度分。阈值：92+立即开发；&lt;85建议放弃。
            </p>
            <div className="mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 rounded-lg bg-slate-50 p-2 sm:p-3">
              {scoreBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-[9px] sm:text-[11px] gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="font-medium text-slate-700 truncate">{item.name}</span>
                    <span className="text-slate-500 text-[8px] sm:text-[10px] truncate">{item.description}</span>
                  </div>
                  <span className="font-bold text-slate-900 flex-shrink-0">{item.score}分</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
              <h5 className="mb-1.5 sm:mb-2 text-[9px] sm:text-xs font-bold text-slate-900">
                基于您的评分（{productScore}.0）的改进建议
              </h5>
              <ul className="space-y-0.5 sm:space-y-1 text-[9px] sm:text-[11px] text-slate-700">
                <li>• 痛苦度低：调研更多用户反馈，确保过去48h内至少20人表达明确痛点。</li>
                <li>• 支付意愿弱：优化定价模型，目标用户应明确表示愿意月付$10+。</li>
                <li>• 竞品弱度不足：分析1-2个弱竞品，突出您的独特卖点。</li>
                <li>• 实现难度高：简化MVP，优先交付关键功能。</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
