// This is a verification script to check all breadcrumb mappings are correct
// Run this in your test environment to validate the breadcrumb system

import { getBreadcrumbs } from "./breadcrumb-config"

const allRoutes = [
  "/",
  "/select-role",
  "/register",
  "/login",
  "/forgot-password",
  "/blogger-dashboard",
  "/blogger-verification",
  "/select-product",
  "/product/123",
  "/submit-video",
  "/blogger-video/456",
  "/my-product",
  "/upload-product",
  "/my-promotions",
  "/product-details/789",
  "/message-board",
  "/settings",
]

export function validateBreadcrumbs() {
  console.log("🔍 Breadcrumb Validation Results:\n")

  let errors = 0
  let warnings = 0

  for (const route of allRoutes) {
    const breadcrumbs = getBreadcrumbs(route)

    // Check if breadcrumbs exist
    if (!breadcrumbs || breadcrumbs.length === 0) {
      console.warn(`⚠️  No breadcrumbs for route: ${route}`)
      warnings++
      continue
    }

    // Check first item is always "GrowthEngine"
    if (breadcrumbs[0].label !== "GrowthEngine") {
      console.error(`❌ First breadcrumb should be "GrowthEngine" for route: ${route}`)
      errors++
    }

    // Check last item doesn't have href (current page)
    const lastItem = breadcrumbs[breadcrumbs.length - 1]
    if (lastItem.href) {
      console.warn(`⚠️  Last breadcrumb should not have href for route: ${route}`)
      warnings++
    }

    // Check all items except last have href for navigation
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
