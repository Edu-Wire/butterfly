'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { HelpCircle, Book, Mail, Phone, Shield, FileText } from 'lucide-react'

const helpCategories = [
  {
    title: 'Getting Started',
    icon: Book,
    articles: [
      'Dashboard Overview',
      'Managing Products',
      'Order Processing',
      'Customer Management'
    ]
  },
  {
    title: 'Account & Security',
    icon: Shield,
    articles: [
      'Password Security',
      'Two-Factor Authentication',
      'Privacy Settings',
      'Data Protection'
    ]
  },
  {
    title: 'Billing & Payments',
    icon: FileText,
    articles: [
      'Payment Methods',
      'Invoicing',
      'Refund Policy',
      'Tax Information'
    ]
  },
  {
    title: 'Contact Support',
    icon: Mail,
    articles: [
      'Email Support',
      'Phone Support',
      'Live Chat',
      'Ticket System'
    ]
  }
]

const faqs = [
  {
    question: 'How do I add a new product?',
    answer: 'Navigate to Products > Add New Product. Fill in the required information including name, description, price, and images.'
  },
  {
    question: 'How can I track my orders?',
    answer: 'Go to Orders > All Orders. You can filter orders by status, date range, or search for specific orders.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support Credit Card, PayPal, Bank Transfer, and Cash on Delivery payment methods.'
  },
  {
    question: 'How do I export my sales data?',
    answer: 'From the Dashboard, click Export Report. You can choose the date range and format (CSV, Excel, PDF).'
  }
]

export default function HelpPage() {
  return (
    <main className="flex-1">
      <DashboardHeader />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Help & Privacy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers to common questions and learn how to use the admin panel
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Book className="text-blue-600" size={20} />
              <span className="font-medium text-gray-900 dark:text-white">Documentation</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse our comprehensive guides
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-green-600" size={20} />
              <span className="font-medium text-gray-900 dark:text-white">Email Support</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get help via email
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="text-purple-600" size={20} />
              <span className="font-medium text-gray-900 dark:text-white">Phone Support</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Call us for immediate assistance
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-orange-600" size={20} />
              <span className="font-medium text-gray-900 dark:text-white">Privacy Policy</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learn about data protection
            </p>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {helpCategories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {article}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@ecomdash.com</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Response time: 24-48 hours</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">6009360597</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Mon-Fri: 9AM-6PM IST</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Average response: 2 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
