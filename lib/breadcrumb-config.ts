export interface BreadcrumbConfig {
  label: string
  href?: string
}

// 面包屑映射（符合 docs/URI_NAMING_GUIDELINES.md）
export const breadcrumbMap: Record<string, BreadcrumbConfig[]> = {
  // 认证（统一 /auth/*）
  "/auth/role": [{ label: "GrowthEngine" }, { label: "选择角色" }],
  "/auth/register": [{ label: "GrowthEngine" }, { label: "注册" }],
  "/auth/login": [{ label: "GrowthEngine" }, { label: "登录" }],
  "/auth/forgot-password": [{ label: "GrowthEngine" }, { label: "重置密码" }],
  "/auth/verify-email": [{ label: "GrowthEngine" }, { label: "验证邮箱" }],

  // 创作者中心
  "/creator/dashboard": [{ label: "GrowthEngine" }, { label: "创作者中心" }],
  "/creator/verification": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/creator/dashboard" },
    { label: "身份认证" },
  ],
  "/creator/products": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/creator/dashboard" },
    { label: "选择产品" },
  ],
  "/products/[id]": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/creator/dashboard" },
    { label: "选择产品", href: "/creator/products" },
    { label: "产品详情" },
  ],
  "/creator/videos/new": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/creator/dashboard" },
    { label: "提交视频" },
  ],
  "/videos/[id]": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/creator/dashboard" },
    { label: "视频详情" },
  ],

  // 商家中心
  "/products": [{ label: "GrowthEngine" }, { label: "商家中心" }],
  "/products/upload": [
    { label: "GrowthEngine" },
    { label: "商家中心", href: "/products" },
    { label: "发布产品" },
  ],
  "/promotions": [
    { label: "GrowthEngine" },
    { label: "商家中心", href: "/products" },
    { label: "推广任务" },
  ],
  "/promotions/[id]": [
    { label: "GrowthEngine" },
    { label: "商家中心", href: "/products" },
    { label: "推广任务", href: "/promotions" },
    { label: "任务详情" },
  ],

  // 其他
  "/messages": [{ label: "GrowthEngine" }, { label: "消息中心" }],
}

export function getBreadcrumbs(pathname: string): BreadcrumbConfig[] {
  if (breadcrumbMap[pathname]) {
    return breadcrumbMap[pathname]
  }

  for (const [pattern, config] of Object.entries(breadcrumbMap)) {
    if (pattern.includes("[id]")) {
      const regexPattern = pattern.replace(/\[id\]/g, "[^/]+").replace(/\//g, "\\/")
      const regex = new RegExp(`^${regexPattern}$`)
      if (regex.test(pathname)) {
        return config
      }
    }
  }

  return [{ label: "GrowthEngine" }]
}
