'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  review: number
  sold: number
  profit: string
}

interface DashboardData {
  metrics: any[]
  topProducts: Product[]
  customerData: any[]
  recentOrders: any[]
  salesData: any[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < Math.floor(rating)
              ? 'fill-gray-600 text-gray-600'
              : 'text-gray-300 dark:text-gray-600'
              }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
        {rating}
      </span>
    </div>
  )
}

export function TopProductsTable() {
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()
        if (data.success) {
          setTopProducts(data.data.topProducts)
        }
      } catch (error) {
        console.error('Failed to fetch top products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopProducts()
  }, [])

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Top Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Best performing products
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-xs sm:text-sm text-black dark:text-white hover:underline font-medium"
        >
          See All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
        <table className="w-full min-w-[500px] sm:min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="text-left py-2 sm:py-3 px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    No
              </th>
              <th className="text-left py-2 sm:py-3 px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Product Name
              </th>
              <th className="text-left py-2 sm:py-3 px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Review
              </th>
              <th className="text-left py-2 sm:py-3 px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sold
              </th>
              <th className="text-left py-2 sm:py-3 px-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Profit
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                  <td className="py-2 sm:py-3 px-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-2 sm:py-3 px-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </td>
                  <td className="py-2 sm:py-3 px-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-2 sm:py-3 px-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-2 sm:py-3 px-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : (
              topProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="py-2 sm:py-3 px-2">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2">
                    <StarRating rating={product.review} />
                  </td>
                  <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm text-gray-900 dark:text-white">
                    {product.sold}
                  </td>
                  <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {product.profit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
