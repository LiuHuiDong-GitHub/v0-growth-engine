"use client"

import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export default function PrivacyPolicyPage() {
  return (
    <div className={`${plusJakarta.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-plus-jakarta)]`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <AppHeader />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 sm:p-12">
            {/* Header */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">Last updated: 2026/01/26</p>
            </div>

            {/* Introduction */}
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Welcome to GrowthEngine ("we", "our", or "us"). Your privacy is important to us. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit or use our website
                and services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                By accessing or using GrowthEngine, you agree to the collection and use of information in accordance with
                this Privacy Policy.
              </p>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect the following categories of information:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.1 Information You Provide to Us</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you use our Service, you may voluntarily provide information such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Account login information</li>
                  <li>Payment or billing-related information (processed via third-party providers)</li>
                  <li>Messages, inquiries, or feedback you submit to us</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.2 Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you access GrowthEngine, we may automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                  <li>Pages visited, time spent, and referring URLs</li>
                  <li>Usage patterns and interaction data</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This data helps us understand how users interact with our Service and improve performance and usability.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.3 Cookies and Tracking Technologies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Enable essential website functionality</li>
                  <li>Analyze traffic and usage trends</li>
                  <li>Improve user experience</li>
                  <li>Remember user preferences</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can control or disable cookies through your browser settings. However, some features of the Service
                  may not function properly if cookies are disabled.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">We use collected information for purposes including:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Providing, operating, and maintaining the Service</li>
                  <li>Creating and managing user accounts</li>
                  <li>Improving product features and user experience</li>
                  <li>Communicating with you, including support and service-related notices</li>
                  <li>Processing payments and transactions</li>
                  <li>Monitoring usage and preventing fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                </ul>
                <p className="text-gray-700 leading-relaxed font-semibold">We do not sell your personal information.</p>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Bases for Processing (GDPR)</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you are located in the European Economic Area (EEA), we process personal data under the following
                  legal bases:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Your consent</li>
                  <li>Performance of a contract</li>
                  <li>Compliance with legal obligations</li>
                  <li>Legitimate interests (such as improving and securing our Service)</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information only in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Service Providers</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We may share data with trusted third-party service providers who assist us with:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Hosting and infrastructure</li>
                  <li>Analytics</li>
                  <li>Payment processing</li>
                  <li>Customer support</li>
                  <li>Email delivery</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These providers are contractually obligated to protect your data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may disclose information if required to do so by law or in response to valid legal requests from
                  public authorities.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If GrowthEngine is involved in a merger, acquisition, or asset sale, your information may be transferred
                  as part of that transaction.
                </p>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We retain personal information only for as long as necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Fulfill the purposes outlined in this Policy</li>
                  <li>Comply with legal, accounting, or reporting obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When data is no longer required, we securely delete or anonymize it.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement reasonable administrative, technical, and organizational measures to protect your personal
                  data. However, no method of transmission over the Internet or electronic storage is 100% secure, and we
                  cannot guarantee absolute security.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your data</li>
                  <li>Restrict or object to processing</li>
                  <li>Withdraw consent at any time</li>
                  <li>Request data portability</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  California Residents (CCPA/CPRA)
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">If you are a California resident, you have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
                  <li>Know what personal information is collected</li>
                  <li>Request deletion of personal information</li>
                  <li>Opt out of the sale or sharing of personal data (we do not sell data)</li>
                  <li>Not be discriminated against for exercising your rights</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To exercise your rights, please contact us using the details below.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Service may contain links to third-party websites or services. We are not responsible for the privacy
                  practices or content of those third parties.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  GrowthEngine is not intended for use by individuals under the age of 13 (or the minimum legal age in your
                  jurisdiction). We do not knowingly collect personal data from children.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your own. We take appropriate
                  safeguards to ensure that personal data remains protected in accordance with this Privacy Policy.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
                  updated "Last updated" date. Your continued use of the Service after changes constitutes acceptance of
                  the updated Policy.
                </p>
              </section>

              {/* Section 12 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-gray-900 font-semibold mb-2">GrowthEngine</p>
                  <p className="text-gray-700">
                    Email:{" "}
                    <a href="mailto:admin@GrowthEngine.world" className="text-blue-600 hover:text-blue-700 underline">
                      admin@GrowthEngine.world
                    </a>
                  </p>
                  <p className="text-gray-700 mt-1">Website: GrowthEngine</p>
                </div>
              </section>
            </div>

            {/* Back to Home Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
