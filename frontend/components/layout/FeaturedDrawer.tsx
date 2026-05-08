'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Star, Layers } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// --- Types ---
interface FeaturedDrawerProps {
    isOpen: boolean
    onClose: () => void
}

interface Collection {
    _id: string
    name: string
    slug: string
    description?: string
    products: any[]
    bannerImage?: string
    isFeatured: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// --- Components ---

const CollectionSkeleton = () => (
    <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-white/10 pb-2">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="space-y-1 ml-4">
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/3"></div>
                </div>
            </div>
        ))}
    </div>
)

export function FeaturedDrawer({ isOpen, onClose }: FeaturedDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()

    // State
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch featured collections
    useEffect(() => {
        if (collections.length === 0) {
            setLoading(true)
            fetch('/api/collections')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.collections) {
                        const featuredCollections = data.collections.filter((collection: Collection) =>
                            collection.isActive
                        )
                        setCollections(featuredCollections)
                    }
                })
                .catch(error => console.error('Failed to fetch featured collections:', error))
                .finally(() => setLoading(false))
        }
    }, [])

    // Body Scroll Lock - simplified version that doesn't interfere with homepage components
    useEffect(() => {
        const htmlElement = document.documentElement
        const bodyElement = document.body

        // Store original styles
        const originalHtmlOverflow = htmlElement.style.overflow
        const originalBodyOverflow = bodyElement.style.overflow
        const originalBodyPosition = bodyElement.style.position
        const originalBodyTop = bodyElement.style.top
        const originalBodyLeft = bodyElement.style.left
        const originalBodyWidth = bodyElement.style.width
        const originalBodyHeight = bodyElement.style.height
        const originalBodyMarginRight = bodyElement.style.marginRight

        // Calculate scrollbar width to prevent layout shift
        const getScrollbarWidth = () => {
            // Create a temporary element to measure scrollbar width
            const temp = document.createElement('div')
            temp.style.cssText = 'position: absolute; top: -9999px; width: 100px; height: 100px; overflow: scroll; visibility: hidden;'
            document.body.appendChild(temp)
            const scrollbarWidth = temp.offsetWidth - temp.clientWidth
            document.body.removeChild(temp)
            return scrollbarWidth
        }

        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY
            const scrollX = window.scrollX
            const scrollbarWidth = getScrollbarWidth()

            // Apply gentle lock styles - only prevent body scroll, don't interfere with other components
            htmlElement.style.overflow = 'hidden'
            bodyElement.style.overflow = 'hidden'
            bodyElement.style.marginRight = `${scrollbarWidth}px`

                // Store scroll positions for restoration
                ; (bodyElement as any).storedScrollY = scrollY
                ; (bodyElement as any).storedScrollX = scrollX
                ; (bodyElement as any).scrollbarWidth = scrollbarWidth
                ; (bodyElement as any).originalStyles = {
                    htmlOverflow: originalHtmlOverflow,
                    bodyOverflow: originalBodyOverflow,
                    bodyPosition: originalBodyPosition,
                    bodyTop: originalBodyTop,
                    bodyLeft: originalBodyLeft,
                    bodyWidth: originalBodyWidth,
                    bodyHeight: originalBodyHeight,
                    bodyMarginRight: originalBodyMarginRight
                }
        } else {
            // Restore scroll position and styles
            const storedScrollY = (bodyElement as any).storedScrollY || 0
            const storedScrollX = (bodyElement as any).storedScrollX || 0
            const storedStyles = (bodyElement as any).originalStyles || {}

            // Restore styles first
            htmlElement.style.overflow = storedStyles.htmlOverflow || ''
            bodyElement.style.overflow = storedStyles.bodyOverflow || ''
            bodyElement.style.position = storedStyles.bodyPosition || ''
            bodyElement.style.top = storedStyles.bodyTop || ''
            bodyElement.style.left = storedStyles.bodyLeft || ''
            bodyElement.style.width = storedStyles.bodyWidth || ''
            bodyElement.style.height = storedStyles.bodyHeight || ''
            bodyElement.style.touchAction = ''
            bodyElement.style.webkitUserSelect = ''
            bodyElement.style.userSelect = ''
            bodyElement.style.marginRight = storedStyles.bodyMarginRight || ''

            // Restore scroll position
            window.scrollTo(storedScrollX, storedScrollY)

            // Clean up stored data
            delete (bodyElement as any).storedScrollY
            delete (bodyElement as any).storedScrollX
            delete (bodyElement as any).scrollbarWidth
            delete (bodyElement as any).originalStyles
        }

        return () => {
            // Ensure cleanup on unmount
            const storedStyles = (bodyElement as any).originalStyles || {}
            htmlElement.style.overflow = storedStyles.htmlOverflow || ''
            bodyElement.style.overflow = storedStyles.bodyOverflow || ''
            bodyElement.style.position = storedStyles.bodyPosition || ''
            bodyElement.style.top = storedStyles.bodyTop || ''
            bodyElement.style.left = storedStyles.bodyLeft || ''
            bodyElement.style.width = storedStyles.bodyWidth || ''
            bodyElement.style.height = storedStyles.bodyHeight || ''
            bodyElement.style.touchAction = ''
            bodyElement.style.webkitUserSelect = ''
            bodyElement.style.userSelect = ''
            bodyElement.style.marginRight = storedStyles.bodyMarginRight || ''
            delete (bodyElement as any).storedScrollY
            delete (bodyElement as any).storedScrollX
            delete (bodyElement as any).scrollbarWidth
            delete (bodyElement as any).originalStyles
        }
    }, [isOpen])

    // Prevent background scrolling when drawer is open
    useEffect(() => {
        const preventBackgroundScroll = (e: Event) => {
            if (isOpen) {
                const drawerElement = drawerRef.current
                // Check if the event target is inside the drawer
                const isInsideDrawer = drawerElement && drawerElement.contains(e.target as Node)

                // If scrolling inside drawer, allow it but prevent it from bubbling to body
                if (isInsideDrawer) {
                    e.stopPropagation()
                    return
                }

                // If scrolling outside drawer, prevent it entirely
                e.preventDefault()
                e.stopPropagation()
                return false
            }
        }

        const preventTouchMove = (e: TouchEvent) => {
            if (isOpen) {
                const drawerElement = drawerRef.current
                const isInsideDrawer = drawerElement && drawerElement.contains(e.target as Node)

                if (isInsideDrawer) {
                    // Allow touch scrolling inside drawer
                    return
                }

                // Prevent touch scrolling outside drawer
                e.preventDefault()
                e.stopPropagation()
                return false
            }
        }

        if (isOpen) {
            // Prevent wheel events on document and window
            document.addEventListener('wheel', preventBackgroundScroll, { passive: false, capture: true })
            window.addEventListener('wheel', preventBackgroundScroll, { passive: false, capture: true })

            // Prevent touch events
            document.addEventListener('touchmove', preventTouchMove, { passive: false, capture: true })
            window.addEventListener('touchmove', preventTouchMove, { passive: false, capture: true })

            // Prevent scroll events
            document.addEventListener('scroll', preventBackgroundScroll, { capture: true })
            window.addEventListener('scroll', preventBackgroundScroll, { capture: true })
        }

        return () => {
            document.removeEventListener('wheel', preventBackgroundScroll, { capture: true })
            window.removeEventListener('wheel', preventBackgroundScroll, { capture: true })
            document.removeEventListener('touchmove', preventTouchMove, { capture: true })
            window.removeEventListener('touchmove', preventTouchMove, { capture: true })
            document.removeEventListener('scroll', preventBackgroundScroll, { capture: true })
            window.removeEventListener('scroll', preventBackgroundScroll, { capture: true })
        }
    }, [isOpen])

    // --- Animation Helper ---
    const getAnimationClass = (delayIndex: number) => {
        const baseClass = "transform transition-all duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
        const activeClass = isOpen && !loading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        return `${baseClass} ${activeClass}`
    }

    const getDelayStyle = (index: number) => ({ transitionDelay: `${150 + (index * 50)}ms` })

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[10000] bg-black/20 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Left Side Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 z-[10001] h-full w-full max-w-[320px] 
                    bg-black/40 backdrop-blur-2xl 
                    border-r border-white/20 shadow-[20px_0_50px_rgba(0,0,0,0.1)]
                    font-sans text-white
                    transition-transform duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                <div className="relative flex h-full flex-col px-6 pt-10 pb-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg tracking-[0.3em] uppercase text-white font-normal drop-shadow-md">
                            Collections
                        </h2>
                        <button
                            onClick={onClose}
                            className="group p-2 text-white/60 hover:text-white transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90 drop-shadow-sm" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto space-y-1 pr-4" style={{
                        scrollbarWidth: 'none',
                        scrollbarColor: 'transparent transparent',
                        '--webkit-scrollbar': 'none',
                        '--webkit-scrollbar-track': 'transparent',
                        '--webkit-scrollbar-thumb': 'transparent',
                        '--webkit-scrollbar-thumb:hover': 'transparent',
                        msOverflowStyle: 'none'
                    } as React.CSSProperties & {
                        '--webkit-scrollbar'?: string;
                        '--webkit-scrollbar-track'?: string;
                        '--webkit-scrollbar-thumb'?: string;
                        '--webkit-scrollbar-thumb:hover'?: string;
                        msOverflowStyle?: string;
                    }}>

                        {loading ? (
                            <CollectionSkeleton />
                        ) : collections.length > 0 ? (
                            <div className="space-y-1">
                                {collections.map((collection, index) => (
                                    <Link
                                        key={collection._id}
                                        href={`/collections/${collection.slug}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between py-4 border-b border-white/10 group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">

                                                    <span className="text-xs font-light uppercase tracking-[0.2em] text-white">
                                                        {collection.name}
                                                    </span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-white/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            </div>

                                            {collection.description && (
                                                <p className="text-[10px] text-white/40 leading-relaxed line-clamp-1 font-light tracking-wide mt-1">
                                                    {collection.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border border-white/10 border-dashed">
                                <Layers className="w-8 h-8 text-white/20 mb-4" />
                                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                                    No featured collections
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/10 mt-6">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6">
                                {!user && (
                                    <Link
                                        href="/account"
                                        onClick={onClose}
                                        className="text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
                                    >
                                        Log In / Sign Up
                                    </Link>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-50">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}