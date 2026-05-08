'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  X,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  LogOut,
  Layers,
  Clipboard,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: 'dynamic' },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Bulk Upload', href: '/admin/products/bulk', icon: Clipboard },
  { label: 'Inventory', href: '/admin/inventory', icon: Clipboard },
  { label: 'Collections', href: '/admin/collections', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Returns', href: '/admin/returns', icon: ShoppingCart },
  { label: 'Income', href: '/admin/income', icon: TrendingUp },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/contact')
        const data = await response.json()
        if (data.success) {
          const unreadMessages = data.data.filter((msg: any) => !msg.read)
          setUnreadCount(unreadMessages.length)
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    }

    fetchUnreadCount()
    // Set up interval to refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Listen for custom event from header
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsOpen(prev => !prev)
    }

    window.addEventListener('toggleSidebar', handleToggleSidebar)
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
    }
  }, [])

  // Helper variables for bottom links
  const isSettingsActive = pathname === '/admin/settings' || pathname.startsWith('/admin/settings/');
  const isHelpActive = pathname === '/admin/help' || pathname.startsWith('/admin/help/');

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] sm:w-80 lg:w-64 bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 flex flex-col lg:sticky lg:top-0 lg:translate-x-0 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-28 h-16 relative -ml-1">
              <Image
                src="/Logo 2.png"
                alt="Butterfly Couture"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </div>
          
          {/* Mobile Close Button (X) on the right */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            // Exact match for dashboard, partial match for sub-pages
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge === 'dynamic' ? unreadCount : item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="my-6 border-t border-gray-100 dark:border-gray-800" />

          {/* System Items */}
          <Link
            href="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
              isSettingsActive
                ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white font-medium'
            }`}
          >
            <Settings size={18} strokeWidth={isSettingsActive ? 2 : 1.5} />
            <span className="text-sm">Settings</span>
          </Link>

          <Link
            href="/admin/help"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
              isHelpActive
                ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white font-medium'
            }`}
          >
            <HelpCircle size={18} strokeWidth={isHelpActive ? 2 : 1.5} />
            <span className="text-sm">Help & Privacy</span>
          </Link>

        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-md transition-all duration-200 font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}