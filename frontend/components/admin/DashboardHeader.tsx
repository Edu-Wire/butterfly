'use client'

import Link from 'next/link'
import { Search, Bell, User, ChevronDown, Home, Menu } from 'lucide-react'
import { useState } from 'react'

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    // Dispatch custom event for sidebar to listen
    window.dispatchEvent(new CustomEvent('toggleSidebar'))
  }

  return (
    <header className="bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 px-2 sm:px-6 py-3 sm:py-4 pl-2 sm:pl-6 lg:pl-6 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Icon - Extreme Left */}
        <div className="flex-shrink-0 sm:hidden">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Greeting - Desktop Only */}
        <div className="flex-shrink-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-black dark:text-white">
            <span className="hidden sm:inline">Good Morning, </span>
            <span className="hidden sm:inline">Administrator</span>
          </h1>
        </div>

        {/* Search Bar - Different behavior for mobile vs desktop */}
        <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-xl sm:mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500 text-xs sm:text-sm"
          />
        </div>

        {/* Home Icon - Right */}
        <div className="flex-shrink-0">
          <Link href="/" className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Home size={16} />
          </Link>
        </div>
      </div>
    </header>
  )
}
