/**
 * 产品上传页表单校验（步骤 2 从 page 抽离，逻辑不变）
 * 纯函数，不依赖 setState；updateValidationError 留在 hook 内调用这些函数。
 */

export function validateContactName(value: string): string {
  if (!value.trim()) return "联系人名称不能为空"
  if (value.trim().length < 2) return "联系人名称至少需要2个字符"
  return ""
}

export function validateEmail(value: string): string {
  if (!value.trim()) return "邮箱不能为空"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value.trim())) return "请输入有效的邮箱地址"
  return ""
}

export function validatePhone(value: string): string {
  if (!value.trim()) return "电话号码不能为空"
  if (value.trim().length < 7) return "请输入有效的电话号码"
  return ""
}

export function validateBaseReward(value: string): string {
  if (!value.trim()) return "基础佣金不能为空"
  const num = Number.parseFloat(value)
  if (isNaN(num) || num < 0) return "请输入有效的数字"
  return ""
}

export function validateProductLink(value: string): string {
  if (!value.trim()) return ""
  const trimmedValue = value.trim()
  try {
    new URL(trimmedValue)
    return ""
  } catch {
    const wwwRegex = /^www\..+\..+$/i
    if (wwwRegex.test(trimmedValue)) return ""
    return "请输入有效的URL（如 https://example.com 或 www.example.com）"
  }
}
