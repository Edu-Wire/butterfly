'use client'

import Link from 'next/link'
import { ArrowLeft, Package, RotateCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">


      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Return Policy Overview */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Package className="w-8 h-8 text-black" />
              <div>
                <h2 className="text-2xl font-light">Easy Returns & Exchanges</h2>
                <p className="text-gray-600 mt-2">
                  We want you to love your Butterfly Couture pieces. If something isn't perfect, we're here to make it right.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">30</span>
                </div>
                <h3 className="font-medium mb-2">30-Day Window</h3>
                <p className="text-gray-600 text-sm">Hassle-free returns</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium mb-2">Free Exchanges</h3>
                <p className="text-gray-600 text-sm">Size or color swaps</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">🚚</span>
                </div>
                <h3 className="font-medium mb-2">Easy Process</h3>
                <p className="text-gray-600 text-sm">Simple steps online</p>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">How to Return</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Initiate Return</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Log into your account and go to "Order History" to start your return. Select the items you wish to return and choose your reason.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Print Return Label</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We'll email you a prepaid return shipping label. Print it and attach it to your package. No cost to you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Drop Off Package</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Drop off at any authorized shipping location. Keep your tracking receipt until we confirm receipt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Receive Refund</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Refunds are processed within 5-7 business days after we receive your return. You'll receive a confirmation email.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Exchange Process */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Exchanges</h2>
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-green-800">Free Size & Color Exchanges</h3>
              <div className="space-y-4">
                <p className="text-green-700 leading-relaxed mb-4">
                  Want the same item in a different size or color? We offer free exchanges within the 30-day return window.
                </p>
                <div className="space-y-2">
                  <p><span className="font-medium">Step 1:</span> Contact our customer service to request an exchange</p>
                  <p><span className="font-medium">Step 2:</span> We'll send you a prepaid label for the original item</p>
                  <p><span className="font-medium">Step 3:</span> Once we receive the original, we'll ship the new item to you</p>
                  <p><span className="font-medium">Step 4:</span> No additional shipping charges for exchanges</p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Conditions */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Return Conditions</h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-green-800">Eligible for Return</h3>
                    <ul className="text-green-700 space-y-2 mt-2">
                      <li>• Items within 30 days of delivery</li>
                      <li>• Unused and unworn condition</li>
                      <li>• Original tags and packaging intact</li>
                      <li>• No damage, stains, or alterations</li>
                      <li>• Proof of purchase required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-red-800">Non-Returnable Items</h3>
                    <ul className="text-red-700 space-y-2 mt-2">
                      <li>• Final sale items (marked as final sale)</li>
                      <li>• Intimate apparel and swimwear</li>
                      <li>• Customized or personalized items</li>
                      <li>• Items damaged due to customer misuse</li>
                      <li>• Items returned after 30-day window</li>
                      <li>• Gift cards and vouchers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Cases */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Special Cases</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-4">Damaged or Incorrect Items</h3>
                <p className="text-gray-600 leading-relaxed">
                  If you receive a damaged item or the wrong product, please contact us within 48 hours of delivery. 
                  We'll arrange for a replacement or full refund, including return shipping costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4">Lost Packages</h3>
                <p className="text-gray-600 leading-relaxed">
                  If your package is lost in transit, we'll work with the carrier to locate it. 
                  If it cannot be found, we'll issue a full refund or replacement.
                </p>
              </div>
            </div>
          </section>

          {/* Return Timeline */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Return Timeline</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Processing Time</p>
                    <p className="text-gray-600">5-7 business days after receipt</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Exchange Processing</p>
                    <p className="text-gray-600">3-5 business days after receipt</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Store Credit</p>
                    <p className="text-gray-600">Immediate processing</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <div className="bg-black text-white p-8 rounded-lg mt-12">
            <h3 className="text-xl font-light mb-4 text-center">Need Help with Returns?</h3>
            <p className="text-gray-300 mb-6 text-center">
              Our customer service team is here to help make your return or exchange as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                Contact Returns Team
              </Link>
              <Link href="/refund-policy" className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                View Full Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
