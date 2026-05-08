'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 mt-8 flex items-center justify-center">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">PRIVACY POLICY</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Policy Summary */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-8 h-8 text-black" />
              <div>
                <h2 className="text-2xl font-light">Your Privacy Matters</h2>
                <p className="text-gray-600 mt-2">Butterfly Couture is committed to protecting your personal information and being transparent about our practices.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium mb-2">Secure</h3>
                <p className="text-gray-600 text-sm">256-bit encryption protection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium mb-2">Transparent</h3>
                <p className="text-gray-600 text-sm">Clear data practices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium mb-2">Compliant</h3>
                <p className="text-gray-600 text-sm">GDPR & CCPA compliant</p>
              </div>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Personal Information</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    When you make a purchase, create an account, or contact us, we collect information that identifies you personally.
                  </p>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>• Name, email address, and phone number</li>
                    <li>• Billing and shipping addresses</li>
                    <li>• Payment information (encrypted and processed securely)</li>
                    <li>• Shopping preferences and order history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Automatically Collected Information</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We automatically collect certain technical information when you visit our website.
                  </p>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>• IP address and browser type</li>
                    <li>• Device information and operating system</li>
                    <li>• Pages visited and time spent</li>
                    <li>• Clickstream data and interaction patterns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Cookies and Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We use cookies and similar technologies to enhance your experience and analyze site usage.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">How We Use Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">To Provide Services</h3>
                    <ul className="text-gray-600 space-y-2 text-sm">
                      <li>• Process and fulfill your orders</li>
                      <li>• Send order confirmations and updates</li>
                      <li>• Respond to your inquiries and requests</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">To Improve Our Services</h3>
                    <ul className="text-gray-600 space-y-2 text-sm">
                      <li>• Personalize your shopping experience</li>
                      <li>• Analyze site performance and usage</li>
                      <li>• Develop new products and features</li>
                      <li>• Prevent fraudulent activities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Information Sharing</h2>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-green-800">We Do Not Sell Your Information</h3>
                  <p className="text-green-700 leading-relaxed">
                    Butterfly Couture never sells, rents, or leases your personal information to third parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">When We Share Information</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We only share information under limited circumstances:
                  </p>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>• <span className="font-medium">Service Providers:</span> Payment processors, shipping companies</li>
                    <li>• <span className="font-medium">Legal Requirements:</span> When required by law or legal process</li>
                    <li>• <span className="font-medium">Business Transfers:</span> In connection with mergers, acquisitions, or asset sales</li>
                    <li>• <span className="font-medium">Safety:</span> To protect rights, property, or safety of Butterfly Couture or others</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Data Security</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Security Measures</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>• SSL/TLS encryption for all data transmissions</li>
                    <li>• Secure payment processing through PCI-compliant providers</li>
                    <li>• Regular security audits and vulnerability assessments</li>
                    <li>• Employee access controls and training</li>
                    <li>• Firewalls and intrusion detection systems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Data Retention</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We retain your information only as long as necessary to fulfill the purposes outlined in this policy, 
                    unless a longer retention period is required or permitted by law.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Your Rights</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Access and Correction</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You have the right to access, update, or correct your personal information. 
                    You can do this by logging into your account or contacting us.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Data Portability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can request a copy of your personal information in a structured, machine-readable format.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Opt-Out</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can opt out of marketing communications at any time by clicking the unsubscribe link 
                    in our emails or contacting us directly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Cookie Controls</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can control cookies through your browser settings. However, disabling cookies may 
                    affect your ability to use certain features of our website.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Children's Privacy</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-yellow-800 leading-relaxed">
                  <strong>Important:</strong> Butterfly Couture does not knowingly collect personal information from children under 13. 
                  If you are a parent or guardian and believe your child has provided us with personal information, 
                  please contact us immediately so we can delete such information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Policy Updates</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by:
                </p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• Emailing the address associated with your account</li>
                  <li>• Posting a prominent notice on our website</li>
                  <li>• Sending a notification through our mobile app</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Your continued use of our services after any changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <div className="bg-black text-white p-8 rounded-lg mt-12">
              <h3 className="text-xl font-light mb-4">Privacy Questions?</h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about this Privacy Policy, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors text-center">
                  Contact Privacy Team
                </Link>
                <Link href="mailto:privacy@butterflycouture.com" className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors text-center">
                  Email Privacy Officer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
