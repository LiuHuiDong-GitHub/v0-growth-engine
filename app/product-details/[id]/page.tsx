import { Suspense } from "react"
import ProductDetailsContent from "./product-details-content"

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetailsContent />
    </Suspense>
  )
}
