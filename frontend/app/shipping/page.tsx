'use client'

import Link from 'next/link'
import { ArrowLeft, Package, Truck, Clock, Shield, Globe } from 'lucide-react'

export default function ShippingPage() {
  const shippingInfo = [
    {
      method: 'Standard Shipping',
      timeframe: '5-7 Business Days',
      cost: 'Free on orders over $100',
      icon: Package
    },
    {
      method: 'Express Shipping',
      timeframe: '2-3 Business Days',
      cost: '$15 on orders under $200',
      icon: Truck
    },
    {
      method: 'International Shipping',
      timeframe: '7-14 Business Days',
      cost: 'Calculated at checkout',
      icon: Globe
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 mt-8 flex items-center justify-center">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">SHIPPING INFORMATION</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Shipping Overview */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Package className="w-8 h-8 text-black" />
              <div>
                <h2 className="text-2xl font-light">Fast & Reliable Delivery</h2>
                <p className="text-gray-600 mt-2">
                  We partner with trusted carriers to ensure your Butterfly Couture pieces arrive safely and on time.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Shield className="w-8 h-8 text-black mx-auto mb-3" />
                <h3 className="font-medium mb-2">Insured</h3>
                <p className="text-gray-600 text-sm">Full coverage</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Clock className="w-8 h-8 text-black mx-auto mb-3" />
                <h3 className="font-medium mb-2">Tracked</h3>
                <p className="text-gray-600 text-sm">Real-time updates</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Globe className="w-8 h-8 text-black mx-auto mb-3" />
                <h3 className="font-medium mb-2">Global</h3>
                <p className="text-gray-600 text-sm">Worldwide delivery</p>
              </div>
            </div>
          </div>

          {/* Shipping Options */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingInfo.map((option, index) => {
                const IconComponent = option.icon
                return (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{option.method}</h3>
                        <p className="text-gray-600 text-sm">{option.timeframe}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 font-medium">{option.cost}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Shipping Process */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Order Processing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Quality Packaging</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Each item is carefully packaged in our signature Butterfly Couture boxes with protective materials to ensure safe arrival.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Delivery & Signature</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Most orders require a signature upon delivery. You can track your package in real-time through our website or mobile app.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">International Shipping</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-blue-800">Global Delivery Available</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We ship to over 50 countries worldwide. International orders may be subject to customs fees and import duties.
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Customs & Duties:</span> Recipient's responsibility</p>
                  <p><span className="font-medium">Delivery Time:</span> 7-14 business days</p>
                  <p><span className="font-medium">Tracking:</span> Available for all international orders</p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Restrictions */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Shipping Restrictions</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-yellow-800">Important Notes</h3>
              <ul className="text-yellow-700 space-y-2">
                <li>• Some items may have shipping restrictions due to size, weight, or contents</li>
                <li>• Hazardous materials cannot be shipped via standard shipping</li>
                <li>• PO Box addresses accepted for standard shipping only</li>
                <li>• Military addresses may require additional processing time</li>
              </ul>
            </div>
          </section>

          {/* Customer Support */}
          <section>
            <h2 className="text-3xl font-light tracking-wide mb-8">Shipping Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Track Your Order</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Use your order number to track your package in real-time through our website.
                </p>
                <Link href="/track-order" className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                  Track Order
                </Link>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our shipping support team is available Monday-Friday, 9AM-6PM EST to assist with any shipping questions.
                </p>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> shipping@butterflycouture.com</p>
                  <p><span className="font-medium">Phone:</span> 1-555-SHIP-01</p>
                  <p><span className="font-medium">Live Chat:</span> Available on website</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className="bg-black text-white p-8 rounded-lg mt-12">
            <h3 className="text-xl font-light mb-4 text-center">Questions About Shipping?</h3>
            <p className="text-gray-300 mb-6 text-center">
              Our shipping team is here to ensure your Butterfly Couture pieces reach you safely and on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us" className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors">
                Contact Shipping Support
              </Link>
              <Link href="/faq" className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors">
                View Shipping FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
