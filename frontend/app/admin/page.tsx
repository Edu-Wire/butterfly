'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { MetricsCards } from '@/components/admin/MetricsCards'
import { SalesRevenueChart } from '@/components/admin/SalesRevenueChart'
import { CustomerStatisticsChart } from '@/components/admin/CustomerStatisticsChart'
import { DistributionMap } from '@/components/admin/DistributionMap'
import { TopProductsTable } from '@/components/admin/TopProductsTable'
import { ThemeTest } from '@/components/admin/ThemeTest'

export default function AdminDashboard() {
  return (
    <>
      <DashboardHeader />
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            Dashboard
          </h1>
        </div>

        <div className="mb-6 sm:mb-8">
          <MetricsCards />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <SalesRevenueChart />
          <CustomerStatisticsChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <DistributionMap />
          <TopProductsTable />
        </div>
      </div>
      <ThemeTest />
    </>
  )
}
