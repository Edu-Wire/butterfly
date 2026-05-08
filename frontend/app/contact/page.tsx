'use client'

import React from "react"

import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { submitContactForm } from '@/lib/actions'
import { useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const result = await submitContactForm({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    })

    setLoading(false)

    if (result.success) {
      setMessage(result.message || 'Message sent successfully!')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      })
    } else {
      setError(result.error || 'Failed to send message')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-foreground/70">
              We'd love to hear from you. Contact us for any inquiries.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary mb-8">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                />
                {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
                {message && <div className="text-green-600 text-sm font-medium">{message}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-8">
                  Contact Information
                </h2>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-foreground/70">hello@butterflycouture.com</p>
                    <p className="text-foreground/70">support@butterflycouture.com</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Phone className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-foreground/70">6009360597</p>
                    <p className="text-sm text-foreground/60 mt-1">Monday - Saturday: 11:00 AM - 8:30 PM</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-foreground/70">
                      Opposite Mattei Building, KFC<br />
                      Nongthymmai, Nongkhyriem<br />
                      Shillong (Meghalaya) 793014<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Clock className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                    <p className="text-foreground/70">Monday - Saturday: 11:00 AM - 8:30 PM</p>
                    <p className="text-foreground/70">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 border-t border-border pt-20">
            <h2 className="font-serif text-4xl font-bold text-primary mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  q: 'What is your return policy?',
                  a: 'We offer free returns within 30 days of purchase. Items must be unworn with original tags.',
                },
                {
                  q: 'Do you offer international shipping?',
                  a: 'Yes, we ship worldwide. Shipping costs vary by location. Orders over $500 qualify for free shipping.',
                },
                {
                  q: 'How long does delivery take?',
                  a: 'Standard shipping takes 5-7 business days. Express shipping available for 2-3 business days.',
                },
                {
                  q: 'Can I customize my order?',
                  a: 'For custom orders, please contact our customer service team directly for more information.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-secondary border border-border rounded-sm p-6 space-y-3">
                  <h3 className="font-semibold text-foreground">
                    {item.q}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
