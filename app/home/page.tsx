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
 * /home 页：与根路径共用内容，仅挂载字体（步骤 3 去重）
 */
export default function HomePage() {
  return (
    <div className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-plus-jakarta)]`}>
      <LandingPageContent />
    </div>
  )
}
