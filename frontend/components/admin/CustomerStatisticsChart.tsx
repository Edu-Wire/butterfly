'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useEffect, useState } from 'react'

interface CustomerData {
  name: string
  value: number
  percentage: number
}

interface DashboardData {
  metrics: any[]
  topProducts: any[]
  customerData: CustomerData[]
  recentOrders: any[]
  salesData: any[]
}

const COLORS = ['#000000', '#808080']

export function CustomerStatisticsChart() {
  const [customerData, setCustomerData] = useState<CustomerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()
        if (data.success) {
          setCustomerData(data.data.customerData)
        }
      } catch (error) {
        console.error('Failed to fetch customer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [])

  const totalCustomers = customerData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = () => {
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-900 dark:fill-white"
      >
        <tspan x="50%" dy="-0.5em" className="text-2xl font-bold text-black dark:text-white">100%</tspan>
        <tspan x="50%" dy="1.5em" className="text-sm text-gray-600">Total Customers</tspan>
      </text>
    )
  }

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-black dark:text-white">
          Customers Statistics
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Active vs Inactive customers
        </p>
      </div>

      {/* Donut Chart */}
      <div className="h-48 sm:h-56 lg:h-64">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          customerData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
