'use client'

import { usePathname } from 'next/navigation'
import { AnnouncementBar } from './AnnouncementBar'

export function ConditionalAnnouncementBar() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) {
        return null
    }

    const isHome = pathname === '/'

    if (!isHome) {
        return null
    }

    return <AnnouncementBar isHome={isHome} />
}
