import { useEffect, useRef, RefObject } from "react"

/**
 * 点击元素外部时触发关闭回调，用于描述展开、日历等浮层
 * 设计意图：替代页面内 useEffect + addEventListener，减少重复逻辑
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void
): void {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isActive) return

    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onCloseRef.current()
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [isActive])
}
