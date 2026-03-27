"use client"

import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"
import LandingPageContent from "@/components/landing/landing-page-content"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

/**
 * 根路径首页：仅挂载字体与共用内容（步骤 3 与 /home 去重）
 */
export default function Page() {
  return (
    <div className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-plus-jakarta)]`}>
      <LandingPageContent />
    </div>
  )
}
