// 面包屑映射校验（符合 docs/URI_NAMING_GUIDELINES.md）
import { getBreadcrumbs } from "./breadcrumb-config"

const allRoutes = [
  "/",
  "/auth/role",
  "/auth/register",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-email",
  "/creator/dashboard",
  "/creator/verification",
  "/creator/products",
  "/products/123",
  "/creator/videos/new",
  "/videos/456",
  "/products",
  "/products/upload",
  "/promotions",
  "/promotions/789",
  "/messages",
  "/legal/privacy",
  "/legal/terms",
]

export function validateBreadcrumbs() {
  console.log("🔍 Breadcrumb Validation Results:\n")

  let errors = 0
  let warnings = 0

  for (const route of allRoutes) {
    const breadcrumbs = getBreadcrumbs(route)

    if (!breadcrumbs || breadcrumbs.length === 0) {
      console.warn(`⚠️  No breadcrumbs for route: ${route}`)
      warnings++
      continue
    }

    if (breadcrumbs[0].label !== "GrowthEngine") {
      console.error(`❌ First breadcrumb should be "GrowthEngine" for route: ${route}`)
      errors++
    }

    const lastItem = breadcrumbs[breadcrumbs.length - 1]
    if (lastItem.href) {
      console.warn(`⚠️  Last breadcrumb should not have href for route: ${route}`)
      warnings++
    }

    for (let i = 0; i < breadcrumbs.length - 1; i++) {
      if (!breadcrumbs[i].href && i > 0) {
        console.warn(`⚠️  Non-last breadcrumb missing href: ${breadcrumbs[i].label} (${route})`)
        warnings++
      }
    }

    console.log(`✅ ${route}`)
    breadcrumbs.forEach((b, i) => {
      console.log(`   └─ ${i}: ${b.label}${b.href ? ` → ${b.href}` : " (current)"}`)
    })
  }

  console.log(`\n📊 Results: ${errors} errors, ${warnings} warnings`)
  return { errors, warnings }
}
