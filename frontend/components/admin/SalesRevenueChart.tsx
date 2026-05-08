'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SalesData {
  month: string
  revenue: number
  orders: number
}

interface DashboardData {
  metrics: any[]
  topProducts: any[]
  customerData: any[]
  recentOrders: any[]
  salesData: SalesData[]
}

const timeFilters = [
  { label: '1D', value: '1d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
]

export function SalesRevenueChart() {
  const [selectedFilter, setSelectedFilter] = useState('1y')
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()
        if (data.success) {
          setSalesData(data.data.salesData)
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [])

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-black dark:text-white">
            Sales Revenue
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Monthly sales overview
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${selectedFilter === filter.value
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm border border-gray-300 dark:border-gray-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 sm:h-56 lg:h-64">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse w-full">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: '#d1d5db' }}
                tickFormatter={(value) => `₹${(value / 1000)}k`}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#000000"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
