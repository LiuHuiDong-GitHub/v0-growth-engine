import Link from "next/link"
import { AppHeader } from "@/components/app-header"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader breadcrumbItems={[{ label: "Terms of Service" }]} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: 2026/01/26</p>
          
          <div className="prose prose-slate max-w-none space-y-8">
            <div>
              <p className="text-gray-700 leading-relaxed">
                Welcome to GrowthEngine ("we", "our", or "us"). Please read these Terms of Service ("Terms") carefully before accessing or using the GrowthEngine website and related services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By accessing, registering for, or using the Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must stop using the Service immediately.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Description of the Service</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                GrowthEngine is a platform that provides data analysis, growth tools, automation, and related technical services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility and User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-3">By using the Service, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You have full legal capacity to enter into this agreement</li>
                <li>Your use of the Service complies with applicable laws and regulations in your jurisdiction</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                If you are under the legal age, you may only use the Service with the consent of a legal guardian.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Account Registration and Security</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You must provide accurate, complete, and up-to-date information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are fully responsible for all activities that occur under your account</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Please notify us immediately if you suspect any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                When using the Service, you agree not to engage in any of the following activities:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing upon the rights of others, including intellectual property or privacy rights</li>
                <li>Submitting false, misleading, or unlawful content</li>
                <li>Attempting to gain unauthorized access to systems or data</li>
                <li>Interfering with or disrupting the security or integrity of the Service</li>
                <li>Using the Service for fraud, abuse, or malicious purposes</li>
                <li>Copying, reselling, sublicensing, reverse engineering, or exploiting the Service or its code without authorization</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We reserve the right to restrict, suspend, or terminate access for violations of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Platform Content</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                All content provided by GrowthEngine, including but not limited to text, graphics, logos, interfaces, software, and code, is owned by or licensed to us and is protected by applicable intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not use, reproduce, modify, distribute, or create derivative works from such content without prior written permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 User Content</h3>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of content you submit through the Service. However, you grant GrowthEngine a worldwide, non-exclusive, royalty-free license to use, host, store, reproduce, and display such content solely for the purpose of operating, improving, and providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Paid Services and Fees</h2>
              <p className="text-gray-700 leading-relaxed mb-3">If the Service includes paid features:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Pricing, billing cycles, and service details will be displayed on the relevant pages</li>
                <li>Fees are exclusive of taxes unless otherwise stated</li>
                <li>Payments are non-refundable unless required by law or explicitly stated otherwise</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We reserve the right to adjust pricing or introduce new fees at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The Service may integrate with or link to third-party websites or services. We do not control and are not responsible for the content, availability, or practices of such third parties.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your use of third-party services is at your own risk and subject to their respective terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-3">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The Service is provided on an "as is" and "as available" basis</li>
                <li>We make no warranties regarding uninterrupted, error-free, or secure operation</li>
                <li>We disclaim all warranties, express or implied, including fitness for a particular purpose</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You acknowledge that your use of the Service is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To the fullest extent permitted by law, GrowthEngine shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                In no event shall our total liability exceed the amount you paid to us (if any) for the Service during the applicable period.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Some jurisdictions do not allow certain liability limitations, so these limitations may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Suspension and Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We may suspend or terminate your access to the Service at any time if:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You violate these Terms</li>
                <li>Required by law or regulatory authorities</li>
                <li>Necessary for security, maintenance, or business reasons</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Upon termination, provisions relating to intellectual property, disclaimers, limitation of liability, and dispute resolution shall survive.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to These Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may update these Terms from time to time. Revised Terms will be posted on this page with an updated "Last Updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                These Terms shall be governed by and construed in accordance with applicable laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising out of or relating to these Terms shall be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to a court of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900 font-semibold">GrowthEngine</p>
                <p className="text-gray-700">Email: admin@GrowthEngine.world</p>
                <p className="text-gray-700">Website: GrowthEngine</p>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
