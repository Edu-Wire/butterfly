'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.success) {
          setSettings(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitMessage('Thank you for your message. We will get back to you soon!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitMessage('Failed to send message. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-[1400px] mx-auto px-6 mt-8 flex items-center justify-center">
          <h1 className="text-4xl font-light tracking-wide text-gray-900">CONTACT US</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-light tracking-wide mb-8">Get in Touch</h2>

              {submitMessage && (
                <div className={`p-4 rounded-lg mb-6 ${submitMessage.includes('Thank you')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-gray-600">{settings?.contactEmail || 'hello@butterflycouture.com'}</p>
                    <p className="text-gray-500 text-xs">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-gray-600">{settings?.contactPhone || '6009360597'}</p>
                    <p className="text-gray-500 text-xs">{settings?.businessHours?.weekday || 'Mon-Fri 9AM-6PM IST'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Headquarters</p>
                    {settings?.address ? (
                      <>
                        <p className="text-gray-600">{settings.address.line1}</p>
                        <p className="text-gray-600">{settings.address.line2}</p>
                        <p className="text-gray-600">{settings.address.city} ({settings.address.state}) {settings.address.pincode}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600">Opposite Mattei Building, KFC</p>
                        <p className="text-gray-600">Nongthymmai, Nongkhyriem</p>
                        <p className="text-gray-600">Shillong (Meghalaya) 793014</p>
                      </>
                    )}
                    <p className="text-gray-500 text-xs">{settings?.businessHours?.weekend || 'By appointment only'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Other Ways to Connect</h3>
              <div className="space-y-3">
                <Link href="/faq" className="block hover:opacity-80 transition-opacity">
                  Frequently Asked Questions →
                </Link>
                <Link href="/returns" className="block hover:opacity-80 transition-opacity">
                  Returns & Exchanges →
                </Link>
                <Link href="/shipping" className="block hover:opacity-80 transition-opacity">
                  Shipping Information →
                </Link>
                <Link href="/lookbook" className="block hover:opacity-80 transition-opacity">
                  Lookbook →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
