'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isAuthPage = pathname === '/login' || pathname === '/signup'
    const isUserPage = pathname?.startsWith('/wishlist') ||
        pathname?.startsWith('/profile') ||
        pathname?.startsWith('/address') ||
        pathname?.startsWith('/account') ||
        pathname?.startsWith('/orders') ||
        pathname?.startsWith('/track-order') ||
        pathname?.startsWith('/checkout')

    if (isAdmin || isAuthPage || isUserPage) {
        return null
    }

    return <Header />
}
