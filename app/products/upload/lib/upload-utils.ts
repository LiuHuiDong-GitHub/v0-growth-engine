import type { RefObject } from "react"

/**
 * 产品上传页纯工具函数（步骤 2 从 page 抽离，步骤 3 去重滚动逻辑）
 */

/** 横向滚动容器：供 documents/screenshots 共用，逻辑不变 */
export function scrollHorizontal(
  ref: RefObject<HTMLDivElement | null>,
  direction: "left" | "right",
  amount = 200,
): void {
  ref.current?.scrollBy({
    left: direction === "left" ? -amount : amount,
    behavior: "smooth",
  })
}

/** 勋章内圈数字字号：按字符数适配，避免溢出 */
export function getTextFontSize(baseRewardStr: string): number {
  const len = baseRewardStr.length
  if (len <= 3) return 22
  if (len === 4) return 18
  if (len === 5) return 14
  if (len === 6) return 12
  return 10
}
