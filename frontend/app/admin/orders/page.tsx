'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { useState, useEffect } from 'react'
import { Search, ChevronDown, Filter, Eye } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'
import { showToast } from '@/lib/toast-utils'

const Loading = () => <div className="p-8 text-center text-gray-500">Loading orders...</div>

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Fetch all orders (no email param)
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === orderId || o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                showToast.error('Failed to update status: ' + data.error);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast.error('Failed to update status');
        }
    };

    const filteredOrders = orders.filter((order) =>
        (order.id || order._id)?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <DashboardHeader />
            <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                            Orders
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage customer orders</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order._id || order.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="px-6 py-4 font-medium text-black dark:text-white">{order._id || order.id}</td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-black dark:text-white">{order.customer?.name}</p>
                                                    <p className="text-xs text-gray-500">{order.customer?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-black dark:text-white">
                                                    ${order.total?.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id || order.id, e.target.value)}
                                                        className={`px-3 py-1 text-xs font-semibold rounded-lg border-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer ${
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                        }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
