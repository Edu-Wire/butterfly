'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import { Inter } from 'next/font/google'

// Initialize Inter font at module scope (required by Next.js)
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function TermsAndConditionsPage() {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 mt-8 flex items-center justify-center">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">TERMS AND CONDITIONS</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Agreement Notice */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-6">
              <FileText className="w-8 h-8 text-black" />
              <div>
                <h2 className="text-2xl font-light">Your Agreement with Butterfly Couture</h2>
                <p className="text-gray-600 mt-2">
                  By accessing and using Butterfly Couture's website and services, you agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium mb-4">Last Updated: January 1, 2026</p>
              <p className="text-gray-600">Please review these terms carefully before using our services.</p>
            </div>
          </div>

          {/* Detailed Terms */}
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">1. General Terms</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Acceptance of Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing this website, you accept and agree to be bound by these Terms and Conditions. 
                    If you do not agree to these terms, please do not use our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Eligibility</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You must be at least 18 years of age to create an account and make purchases. 
                    By using this site, you represent and warrant that you are of legal age.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Modifications</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                    Your continued use of the site constitutes acceptance of any modifications.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">2. Products and Services</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Product Descriptions</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We strive to be as accurate as possible in our product descriptions. However, we do not warrant that 
                    product descriptions, colors, or other content are accurate, complete, reliable, current, or error-free.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Pricing and Availability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All prices are shown in USD and are subject to change without notice. We reserve the right to 
                    modify or discontinue products at any time without prior notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Order Acceptance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your receipt of an electronic order confirmation does not signify our acceptance of your order. 
                    We reserve the right to accept or decline your order for any reason.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">3. Payment Terms</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Payment Methods</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We accept various payment methods including credit cards, debit cards, PayPal, Apple Pay, and Google Pay. 
                    Payment must be received before orders are processed and shipped.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Security</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All payment transactions are encrypted and processed through secure payment gateways. 
                    We do not store or have access to your complete credit card information.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Billing Errors</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If we discover an error in the price or description of your order, we will notify you and 
                    give you the option to reconfirm or cancel your order.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">4. Shipping and Delivery</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Shipping Policy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Orders are processed within 1-2 business days. Standard shipping typically takes 5-7 business days. 
                    Express shipping options are available at checkout.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Risk of Loss</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All items purchased from Butterfly Couture are made pursuant to a shipment contract. 
                    This means that the risk of loss and title for such items pass to you upon our delivery to the shipping carrier.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">International Orders</h3>
                  <p className="text-gray-600 leading-relaxed">
                    International orders may be subject to customs fees and import duties. 
                    These charges are the responsibility of the recipient.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">5. Returns and Refunds</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Return Policy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our detailed return policy is outlined in our <Link href="/refund-policy" className="underline hover:text-black">Refund Policy</Link>. 
                    By placing an order, you agree to these terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Non-Returnable Items</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Certain items cannot be returned including final sale items, intimate apparel, and customized products.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">6. Intellectual Property</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Copyright and Trademarks</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All content on this website, including designs, text, graphics, logos, and images, 
                    is the property of Butterfly Couture and protected by international copyright laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Limited License</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We grant you a limited, non-exclusive, non-transferable license to access and use this website 
                    for personal, non-commercial purposes only.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Prohibited Use</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You may not use our intellectual property for any commercial purpose without our express written permission.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">7. User Conduct</h2>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-green-800">Acceptable Use</h3>
                  <ul className="text-green-700 space-y-2">
                    <li>• Use the site for lawful purposes only</li>
                    <li>• Respect the rights of other users</li>
                    <li>• Provide accurate and complete information</li>
                    <li>• Maintain the security of your account</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-red-800">Prohibited Activities</h3>
                  <ul className="text-red-700 space-y-2">
                    <li>• Using the site for fraudulent purposes</li>
                    <li>• Interfering with or disrupting the service</li>
                    <li>• Attempting to gain unauthorized access</li>
                    <li>• Posting harmful, offensive, or inappropriate content</li>
                    <li>• Violating applicable laws or regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">8. Privacy</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Please review our <Link href="/privacy-policy" className="underline hover:text-black">Privacy Policy</Link>, 
                  which also governs your use of this website, to understand our practices.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">9. Disclaimers</h2>
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-yellow-800">Important Disclaimers</h3>
                      <ul className="text-yellow-700 space-y-2">
                        <li>• Products are provided "as is" without warranties of any kind</li>
                        <li>• We are not liable for indirect, incidental, or consequential damages</li>
                        <li>• Use of this site is at your own risk</li>
                        <li>• We do not guarantee uninterrupted or error-free operation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Limitation of Liability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To the fullest extent permitted by law, Butterfly Couture shall not be liable for any indirect, 
                    incidental, special, or consequential damages resulting from your use or inability to use this website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">Indemnification</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You agree to indemnify and hold harmless Butterfly Couture from any claims arising from your 
                    violation of these terms or your violation of the rights of any third party.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">10. Governing Law</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the State of New York, 
                  United States, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Any disputes arising from these terms shall be resolved in the state or federal courts located in New York.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">11. Contact Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Questions about these Terms and Conditions should be sent to:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> legal@butterflycouture.com</p>
                    <p><span className="font-medium">Phone:</span> 6009360597</p>
                    <p><span className="font-medium">Address:</span> Opposite Mattei Building, KFC, Nongthymmai, Nongkhyriem, Shillong (Meghalaya) 793014</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Agreement Section */}
            <div className="bg-black text-white p-8 rounded-lg mt-12">
              <h3 className="text-xl font-light mb-4 text-center">Acknowledgment</h3>
              <p className="text-gray-300 leading-relaxed text-center">
                By continuing to use Butterfly Couture's website and services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and Conditions.
              </p>
              <div className="flex justify-center mt-6">
                <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                  Contact Legal Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
