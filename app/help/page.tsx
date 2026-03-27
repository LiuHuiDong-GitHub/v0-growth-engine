import { Suspense } from "react"
import AppHeader from "@/components/app-header"
import HelpCenterPage from "./client-component"

export const metadata = {
  title: "帮助中心",
}

export default function HelpCenterPageWrapper() {
  return (
    <Suspense fallback={null}>
      <HelpCenterPage />
    </Suspense>
  )
}
