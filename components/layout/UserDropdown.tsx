'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  User,
  LogOut,
  Settings,
  Package,
  ShieldCheck,
  Heart,
  LayoutDashboard
} from 'lucide-react'
import Link from 'next/link'

export function UserDropdown() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Check if we're on the homepage or catalog page (transparent header)
  const isHomePage = pathname === '/'
  const isCatalogPage = pathname === '/catalog'
  const shouldUseWhite = isHomePage || isCatalogPage

  return (
    <div className="relative">
      <DropdownMenu>
        {/* Trigger */}
        <DropdownMenuTrigger asChild>
          <button className={`transition-opacity flex items-center gap-1 hover:cursor-pointer outline-none text-white`}>
            <User size={20} strokeWidth={1.5} />
          </button>
        </DropdownMenuTrigger>

        {/* Glassmorphism Content */}
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="w-[260px] p-3 rounded-[24px] border border-white/40 shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5"
        >
          {user ? (
            <>
              {/* Profile Header */}
              <div className="flex items-center gap-3 px-2 py-2 mb-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/50 shadow-sm text-yellow-700/80 backdrop-blur-md">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Account
                  </span>
                </div>
              </div>

              {/* Glassy Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400/20 to-transparent mx-1 mb-2" />

              {/* Menu Items */}
              <div className="flex flex-col gap-1">
                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/60 focus:backdrop-blur-sm cursor-pointer py-2.5 px-3 text-gray-700 focus:text-black font-medium transition-all duration-200">
                  <Link href="/account" className="flex items-center w-full">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-gray-500" strokeWidth={2} />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/60 focus:backdrop-blur-sm cursor-pointer py-2.5 px-3 text-gray-700 focus:text-black font-medium transition-all duration-200">
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-3 h-4 w-4 text-gray-500" strokeWidth={2} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/60 focus:backdrop-blur-sm cursor-pointer py-2.5 px-3 text-gray-700 focus:text-black font-medium transition-all duration-200">
                  <Link href="/orders" className="flex items-center w-full">
                    <Package className="mr-3 h-4 w-4 text-gray-500" strokeWidth={2} />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/60 focus:backdrop-blur-sm cursor-pointer py-2.5 px-3 text-gray-700 focus:text-black font-medium transition-all duration-200">
                  <Link href="/wishlist" className="flex items-center w-full">
                    <Heart className="mr-3 h-4 w-4 text-gray-500" strokeWidth={2} />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>

                {user.role === 'admin' && (
                  // UPDATED: Added specific blue background/text on focus (hover)
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-blue-500/15 focus:text-blue-700 cursor-pointer py-2.5 px-3 text-blue-600 font-medium transition-all duration-200">
                    <Link href="/admin" className="flex items-center w-full">
                      <ShieldCheck className="mr-3 h-4 w-4 text-blue-500 group-hover:text-blue-600" strokeWidth={2} />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </div>

              {/* Logout Button */}
              <div className="mt-3">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 bg-[#1c2434]/90 hover:bg-[#1c2434] text-white py-3 rounded-xl transition-all font-semibold text-sm shadow-lg shadow-black/10 backdrop-blur-md"
                >
                  <LogOut size={16} strokeWidth={2} />
                  Log out
                </button>
              </div>
            </>
          ) : (
            // Logged Out View
            <div className="flex flex-col gap-2 p-1">
              <DropdownMenuItem asChild className="rounded-xl hover:bg-gray-100 focus:bg-gray-100 focus:text-black cursor-pointer py-2.5 justify-center font-medium text-gray-900">
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl bg-[#1c2434]/90 text-white focus:bg-[#1c2434] focus:text-white cursor-pointer py-2.5 justify-center font-semibold shadow-lg shadow-black/10">
                <Link href="/signup">Sign Up</Link>
              </DropdownMenuItem>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}