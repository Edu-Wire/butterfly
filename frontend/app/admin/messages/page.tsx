'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { MessageSquare, Mail, User, Loader2, AlertCircle, Search } from 'lucide-react'
import useSWR from 'swr'
import { formatDistanceToNow } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MessagesPage() {
  const { data, error, isLoading } = useSWR('/api/contact', fetcher)
  const [activeTab, setActiveTab] = useState<'all' | 'enquiry' | 'order'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allSubmissions = data?.success ? data.data : []

  const filteredSubmissions = useMemo(() => {
    let list = allSubmissions.map((s: any) => {
      const isOrder = s.subject?.toLowerCase().includes('order') || s.message?.toLowerCase().includes('order')
      return { ...s, category: isOrder ? 'order' : 'enquiry' }
    })

    if (activeTab !== 'all') {
      list = list.filter((s: any) => s.category === activeTab)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      list = list.filter((s: any) =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.subject.toLowerCase().includes(query) ||
        s.message.toLowerCase().includes(query)
      )
    }

    return list
  }, [allSubmissions, activeTab, searchQuery])

  return (
    <main className="flex-1 min-h-screen bg-white dark:bg-black">
      <DashboardHeader />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-6 border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all customer communications</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-gray-900 border border-transparent rounded-md text-sm focus:bg-white focus:border-gray-200 w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Simplified Stats */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total</span>
            <span className="text-2xl font-semibold dark:text-white">{isLoading ? '...' : allSubmissions.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Unread</span>
            <span className="text-2xl font-semibold text-blue-600 font-mono">
              {isLoading ? '...' : allSubmissions.filter((s: any) => !s.read).length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Customers</span>
            <span className="text-2xl font-semibold dark:text-white">
              {isLoading ? '...' : new Set(allSubmissions.map((s: any) => s.email)).size}
            </span>
          </div>
        </div>

        {/* Simplified Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-100 dark:border-gray-800">
          {['all', 'enquiry', 'order'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-medium transition-all relative capitalize ${activeTab === tab ? 'text-black dark:text-white underline underline-offset-8 decoration-2' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab === 'all' ? 'All' : tab === 'enquiry' ? 'Enquiries' : 'Orders'}
            </button>
          ))}
        </div>

        {/* Clean Data Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center text-gray-400">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500 text-sm">Failed to load data.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800 uppercase tracking-tighter">
                  <th className="py-4 font-normal">Sender</th>
                  <th className="py-4 font-normal">Type</th>
                  <th className="py-4 font-normal">Message</th>
                  <th className="py-4 font-normal text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredSubmissions.map((message: any) => (
                  <tr key={message._id} className="group">
                    <td className="py-6 pr-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{message.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{message.email}</div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-medium ${message.category === 'order'
                          ? 'border-emerald-200 text-emerald-600 bg-emerald-50/50'
                          : 'border-blue-200 text-blue-600 bg-blue-50/50'
                        }`}>
                        {message.category}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        <span className="font-medium text-gray-900 dark:text-gray-200 mr-1">{message.subject}:</span>
                        {message.message}
                      </div>
                    </td>
                    <td className="py-6 pl-4 text-right text-xs text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
