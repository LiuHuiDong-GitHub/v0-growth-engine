export interface BreadcrumbConfig {
  label: string
  href?: string
}

// Breadcrumb mapping for all routes in GrowthEngine
export const breadcrumbMap: Record<string, BreadcrumbConfig[]> = {
  // Auth Pages
  "/select-role": [{ label: "GrowthEngine" }, { label: "选择角色" }],
  "/register": [{ label: "GrowthEngine" }, { label: "注册" }],
  "/login": [{ label: "GrowthEngine" }, { label: "登录" }],
  "/forgot-password": [{ label: "GrowthEngine" }, { label: "重置密码" }],

  // Blogger Pages
  "/blogger-dashboard": [{ label: "GrowthEngine" }, { label: "创作者中心" }],
  "/blogger-verification": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/blogger-dashboard" },
    { label: "身份认证" },
  ],
  "/select-product": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/blogger-dashboard" },
    { label: "选择产品" },
  ],
  "/product/[id]": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/blogger-dashboard" },
    { label: "选择产品", href: "/select-product" },
    { label: "产品详情" },
  ],
  "/submit-video": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/blogger-dashboard" },
    { label: "提交视频" },
  ],
  "/blogger-video/[id]": [
    { label: "GrowthEngine" },
    { label: "创作者中心", href: "/blogger-dashboard" },
    { label: "视频详情" },
  ],

  // Seller/Product Pages
  "/my-product": [{ label: "GrowthEngine" }, { label: "商家中心" }],
  "/upload-product": [{ label: "GrowthEngine" }, { label: "商家中心", href: "/my-product" }, { label: "发布产品" }],
  "/my-promotions": [{ label: "GrowthEngine" }, { label: "商家中心", href: "/my-product" }, { label: "推广任务" }],
  "/product-details/[id]": [
    { label: "GrowthEngine" },
    { label: "商家中心", href: "/my-product" },
    { label: "推广任务", href: "/my-promotions" },
    { label: "任务详情" },
  ],

  // Other Pages
  "/message-board": [{ label: "GrowthEngine" }, { label: "消息中心" }],
}

export function getBreadcrumbs(pathname: string): BreadcrumbConfig[] {
  // Try exact match first
  if (breadcrumbMap[pathname]) {
    return breadcrumbMap[pathname]
  }

  // Try pattern match for dynamic routes [id]
  for (const [pattern, config] of Object.entries(breadcrumbMap)) {
    if (pattern.includes("[id]")) {
      const regexPattern = pattern.replace(/\[id\]/g, "[^/]+").replace(/\//g, "\\/")

      const regex = new RegExp(`^${regexPattern}$`)
      if (regex.test(pathname)) {
        return config
      }
    }
  }

  // Fallback to home
  return [{ label: "GrowthEngine" }]
}
