'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { useState, useEffect } from 'react'
import { Search, Mail, Eye, Package } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Suspense } from 'react'

const Loading = () => <div className="p-8 text-center text-gray-500">Loading return requests...</div>

export default function AdminReturnsPage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [returns, setReturns] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/returns')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setReturns(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    const handleStatusUpdate = async (returnId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/returns/${returnId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setReturns(prev => prev.map(r => r._id === returnId ? { ...r, status: newStatus } : r));
                toast({
                    title: "Status Updated",
                    description: `Return request status updated to ${newStatus}`,
                })
            } else {
                toast({
                    title: "Update Failed",
                    description: data.error || "Unknown error occurred",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "Failed to update return request status",
                variant: "destructive",
            })
        }
    };

    const filteredReturns = returns.filter((ret) =>
        ret.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.customerReason?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'approved': return 'bg-blue-100 text-blue-800'
            case 'received': return 'bg-purple-100 text-purple-800'
            case 'refunded': return 'bg-green-100 text-green-800'
            case 'rejected': return 'bg-red-100 text-red-800'
            case 'cancelled': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Suspense fallback={<Loading />}>
            <DashboardHeader />
            <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                            Return Requests
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage customer return requests</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search return requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Return Requests Table */}
                <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Reason</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                            Loading return requests...
                                        </td>
                                    </tr>
                                ) : filteredReturns.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                            No return requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReturns.map((ret) => (
                                        <tr key={ret._id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 font-medium text-black dark:text-white">{ret.orderId}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {ret.customer?.name || 'Unknown Customer'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        {ret.customer?.email || 'No email'}
                                                    </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {ret.items.map((item: any, i: number) => (
                                                        <div key={i} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm px-2 py-1">
                                                            <span className="text-sm font-medium text-black dark:text-white">{item.name}</span>
                                                            <span className="text-xs text-gray-500">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                {ret.customerReason}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(ret.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(ret.status)}`}>
                                                    {ret.status}
                                                </span>
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
                                                    <select
                                                        value={ret.status}
                                                        onChange={(e) => handleStatusUpdate(ret._id, e.target.value)}
                                                        className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approve</option>
                                                        <option value="rejected">Reject</option>
                                                        <option value="received">Received</option>
                                                        <option value="refunded">Refunded</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
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
