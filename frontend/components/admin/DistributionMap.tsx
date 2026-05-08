'use client'

import { useEffect, useState } from 'react'

interface RegionData {
  name: string
  percentage: string
  color: string
}

interface DashboardData {
  metrics: any[]
  topProducts: any[]
  customerData: any[]
  recentOrders: any[]
  salesData: any[]
  distributionData: RegionData[]
}

export function DistributionMap() {
  const [distributionData, setDistributionData] = useState<RegionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()
        if (data.success) {
          setDistributionData(data.data.distributionData)
        }
      } catch (error) {
        console.error('Failed to fetch distribution data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDistributionData()
  }, [])

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          Distribution Maps
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Geographic distribution
        </p>
      </div>

      {/* World Map Placeholder */}
      <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 sm:mb-6">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Asia */}
              <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-16 sm:w-20 sm:w-24 h-12 sm:h-16 sm:h-20 bg-black/30 rounded-lg border-2 border-black"></div>
              </div>

              {/* America */}
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 sm:w-16 h-16 sm:h-24 bg-gray-600/30 rounded-lg border-2 border-gray-600"></div>
              </div>

              {/* Europe */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 sm:w-12 h-6 sm:h-8 bg-gray-400/30 rounded-lg border-2 border-gray-400"></div>
              </div>

              {/* Others */}
              <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-300/30 rounded-lg border-2 border-gray-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Distribution by Region
        </h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          distributionData.map((region) => (
            <div key={region.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${region.color}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {region.name}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {region.percentage}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
