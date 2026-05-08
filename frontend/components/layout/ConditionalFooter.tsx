'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export function ConditionalFooter() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isCatalog = pathname?.startsWith('/catalog')
    const isSale = pathname?.startsWith('/sale')
    const isNewArrival = pathname?.startsWith('/new-arrival')
    const isUserPage = pathname?.startsWith('/wishlist') ||
        pathname?.startsWith('/profile') ||
        pathname?.startsWith('/address') ||
        pathname?.startsWith('/account') ||
        pathname?.startsWith('/orders') ||
        pathname?.startsWith('/track-order') ||
        pathname?.startsWith('/checkout')

    if (isAdmin || isSale || isNewArrival || isUserPage) {
        return null
    }

    return <Footer />
}
