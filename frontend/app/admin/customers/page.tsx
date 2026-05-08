'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { useState, useEffect } from 'react'
import { Search, Mail, Eye } from 'lucide-react'
import { Suspense } from 'react'

const Loading = () => <div className="p-8 text-center text-gray-500">Loading customers...</div>

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [customers, setCustomers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/customers')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCustomers(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Suspense fallback={<Loading />}>
            <DashboardHeader />
            <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                            Customers
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage customer accounts</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Orders</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Total Spent</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Last Order</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Loading customers...
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-black dark:text-white">{customer.name}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.orders}</td>
                                            <td className="px-6 py-4 font-semibold text-black dark:text-white">${customer.spent?.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(customer.lastOrder).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button 
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                                        title="Email Customer"
                                                    >
                                                        <Mail size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}
