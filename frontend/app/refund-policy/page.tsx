'use client'

import Link from 'next/link'
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 mt-8 flex items-center justify-center">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">REFUND POLICY</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Policy Summary */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Package className="w-8 h-8 text-black" />
              <div>
                <h2 className="text-2xl font-light">Our Refund Promise</h2>
                <p className="text-gray-600 mt-2">We want you to love your Butterfly Couture pieces. If not, we're here to help.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">30</span>
                </div>
                <h3 className="font-medium mb-2">30-Day Returns</h3>
                <p className="text-gray-600 text-sm">Full refund within 30 days</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium mb-2">Easy Process</h3>
                <p className="text-gray-600 text-sm">Simple return procedure</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">💎</span>
                </div>
                <h3 className="font-medium mb-2">Quality Assured</h3>
                <p className="text-gray-600 text-sm">Premium guarantee</p>
              </div>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6" />
                Return Timeline
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">30-Day Window</h3>
                    <p className="text-gray-600 leading-relaxed">
                      You have 30 days from the delivery date to initiate a return. Items must be in their original condition with tags attached.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Extended Holiday Period</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Purchases made between November 15th and December 31st can be returned until January 15th of the following year.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Processing Time</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Refunds are processed within 5-7 business days after we receive your return. You'll receive a confirmation email once processed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Return Conditions</h2>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-green-800">Eligible for Return</h3>
                      <ul className="text-green-700 space-y-2 mt-2">
                        <li>• Unused and unworn items</li>
                        <li>• Original tags and packaging intact</li>
                        <li>• No damage, stains, or alterations</li>
                        <li>• Proof of purchase (receipt or order confirmation)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-red-800">Non-Returnable Items</h3>
                      <ul className="text-red-700 space-y-2 mt-2">
                        <li>• Final sale items (marked as final sale)</li>
                        <li>• Intimate apparel and swimwear</li>
                        <li>• Customized or personalized items</li>
                        <li>• Items damaged due to customer misuse</li>
                        <li>• Items returned after 30-day window</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">Refund Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Original Payment</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Refunds are issued to the original form of payment used for purchase.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Credit Card:</span> 5-7 business days</p>
                    <p><span className="font-medium">PayPal:</span> 3-5 business days</p>
                    <p><span className="font-medium">Bank Transfer:</span> 7-10 business days</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Store Credit</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Opt for store credit and receive an additional 10% bonus credit.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>• No expiration date</p>
                    <p>• Can be used online or in-store</p>
                    <p>• Valid on all items including sale items</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-light tracking-wide mb-6">How to Initiate a Return</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Contact Customer Service</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Email us at <span className="font-medium">returns@butterflycouture.com</span> or call <span className="font-medium">1-555-BUTTERFLY</span> to initiate your return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Receive Return Label</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We'll email you a prepaid return shipping label. Print and attach it to your package.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Drop Off Package</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Drop off at any authorized shipping location. Keep your tracking receipt until we confirm receipt.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <div className="bg-black text-white p-8 rounded-lg mt-12">
              <h3 className="text-xl font-light mb-4">Questions About Returns?</h3>
              <p className="text-gray-300 mb-6">
                Our customer service team is here to help with any questions about our refund policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors text-center">
                  Contact Support
                </Link>
                <Link href="/faq" className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors text-center">
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
