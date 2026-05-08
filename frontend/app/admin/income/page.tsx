'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { TrendingUp, DollarSign, CreditCard, Wallet } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const monthlyIncome = [
  { month: 'Jan', income: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', income: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', income: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', income: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', income: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', income: 67000, expenses: 40000, profit: 27000 },
  { month: 'Jul', income: 59000, expenses: 37000, profit: 22000 },
  { month: 'Aug', income: 62000, expenses: 39000, profit: 23000 },
  { month: 'Sep', income: 58000, expenses: 35000, profit: 23000 },
  { month: 'Oct', income: 64000, expenses: 41000, profit: 23000 },
  { month: 'Nov', income: 69000, expenses: 42000, profit: 27000 },
  { month: 'Dec', income: 72000, expenses: 45000, profit: 27000 },
]

const paymentMethods = [
  { method: 'Credit Card', amount: 285000, percentage: 45, color: 'bg-blue-500' },
  { method: 'PayPal', amount: 158000, percentage: 25, color: 'bg-green-500' },
  { method: 'Bank Transfer', amount: 127000, percentage: 20, color: 'bg-purple-500' },
  { method: 'Cash on Delivery', amount: 63000, percentage: 10, color: 'bg-orange-500' },
]

export default function IncomePage() {
  const totalIncome = monthlyIncome.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = monthlyIncome.reduce((sum, item) => sum + item.expenses, 0)
  const totalProfit = totalIncome - totalExpenses

  return (
    <main className="flex-1">
      <DashboardHeader />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Income & Revenue
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your earnings, expenses, and profit margins
          </p>
        </div>

        {/* Income Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Total Income
              </span>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalIncome.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 font-medium mt-2">
              +12.5% from last year
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Total Expenses
              </span>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <CreditCard className="text-red-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-red-600 font-medium mt-2">
              +8.3% from last year
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Net Profit
              </span>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalProfit.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 font-medium mt-2">
              +18.7% from last year
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Profit Margin
              </span>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Wallet className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {((totalProfit / totalIncome) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-green-600 font-medium mt-2">
              +2.4% from last year
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Income vs Expenses
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000)}k`} />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Trend Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profit Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000)}k`} />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Profit']} />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Payment Methods Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${method.color}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {method.method}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{method.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({method.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{method.method}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{method.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${method.color} rounded-full`}
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
