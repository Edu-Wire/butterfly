'use client'

import { Users, DollarSign, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MetricData {
  title: string
  value: string
  change: number
  changeText: string
  icon: string
  color: string
}

interface DashboardData {
  metrics: MetricData[]
  topProducts: any[]
  customerData: any[]
  recentOrders: any[]
  salesData: any[]
}

interface MetricCardProps {
  title: string
  value: string
  change: number
  changeText: string
  icon: string
  color: string
}

function MetricCard({ title, value, change, changeText, icon, color }: MetricCardProps) {
  const isPositive = change > 0
  const isNegative = change < 0

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <Users size={20} className="text-black dark:text-white" />
      case 'dollar':
        return <DollarSign size={20} className="text-black dark:text-white" />
      case 'cart':
        return <ShoppingCart size={20} className="text-black dark:text-white" />
      default:
        return <Users size={20} className="text-black dark:text-white" />
    }
  }

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-gray-600 text-xs sm:text-sm font-medium">
          {title}
        </span>
        <div className={`p-1.5 sm:p-2 rounded-lg ${color}`}>
          {getIcon(icon)}
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xl sm:text-2xl font-bold text-black dark:text-white">
          {value}
        </p>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
            {isPositive ? <TrendingUp size={14} /> : isNegative ? <TrendingDown size={14} /> : null}
            {Math.abs(change)}%
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            {changeText}
          </span>
        </div>
      </div>
    </div>
  )
}

export function MetricsCards() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data.metrics)
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {loading ? (
        [...Array(3)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))
      ) : (
        metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeText={metric.changeText}
            icon={metric.icon}
            color={metric.color}
          />
        ))
      )}
    </div>
  )
}
