'use client'

import { useEffect, useState } from 'react'
import { ButterflyLoader } from '@/components/ui/ButterflyLoader'
import { usePathname } from 'next/navigation'

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  // Ensure component is mounted and set initial loading state immediately
  useEffect(() => {
    // Set loading state immediately on mount
    setIsMounted(true)

    // Add loading class to html element immediately
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('loading-active')
    }
  }, [])

  // Handle initial page load and route changes
  useEffect(() => {
    if (!isMounted) return

    // For product pages, show loader even longer to ensure full animation plays
    const isProductPage = pathname?.startsWith('/product/')
    const loadTime = pathname === '/' ? 3500 : isProductPage ? 4000 : 2500

    // Show loader immediately when route changes
    setIsLoading(true)
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('loading-active')
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
      // Remove loading class when done
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('loading-active')
      }
    }, loadTime)

    // Also hide when page is fully loaded
    if (typeof window !== 'undefined') {
      const handleLoad = () => {
        setTimeout(() => {
          setIsLoading(false)
          document.documentElement.classList.remove('loading-active')
        }, 800)
      }

      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
        return () => {
          window.removeEventListener('load', handleLoad)
          clearTimeout(timer)
        }
      }
    }

    return () => {
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('loading-active')
      }
    }
  }, [pathname, isMounted])

  // Handle body scroll locking while loading
  useEffect(() => {
    if (isLoading) {
      document.documentElement.classList.add('loading-active')
    } else {
      document.documentElement.classList.remove('loading-active')
      document.documentElement.classList.remove('is-loading')
    }
    return () => {
      document.documentElement.classList.remove('loading-active')
    }
  }, [isLoading])

  // Don't render children until loading is complete
  if (!isMounted || isLoading) {
    return <ButterflyLoader isLoading={true} />
  }

  return (
    <>
      <ButterflyLoader isLoading={isLoading} />
      {children}
    </>
  )
}

