'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AnnouncementBarProps {
    isHome?: boolean
}

export function AnnouncementBar({ isHome = false }: AnnouncementBarProps) {
    const [messages, setMessages] = useState(['FREE SHIPPING ON ALL ORDERS'])
    const [currentIndex, setCurrentIndex] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Fetch collections to populate the announcement bar
        fetch('/api/collections')
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const text = await res.text();
                if (!text) {
                    throw new Error('Empty response');
                }
                try {
                    return JSON.parse(text);
                } catch (parseError) {
                    throw new Error(`Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
                }
            })
            .then(data => {
                if (data.success && data.collections && data.collections.length > 0) {
                    const collectionMessages = data.collections.map((c: any) => c.name.toUpperCase())
                    setMessages(collectionMessages)
                }
            })
            .catch(err => console.error('Failed to fetch collections for announcement bar', err))
    }, [])

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    useEffect(() => {
        resetTimeout()
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length),
            4000
        )

        return () => {
            resetTimeout()
        }
    }, [currentIndex, messages.length])

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % messages.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)
    }

    const [isVisible, setIsVisible] = useState(true)

    // Scroll handler for visibility
    useEffect(() => {
        if (!isHome) return

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            // Hide whenever scrolled down past a small threshold
            setIsVisible(currentScrollY < 10)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isHome])

    useEffect(() => {
        if (isHome && messages.length > 0) {
            document.documentElement.style.setProperty('--announcement-height', isVisible ? '40px' : '0px')
        } else {
            document.documentElement.style.removeProperty('--announcement-height')
        }
        return () => {
            document.documentElement.style.removeProperty('--announcement-height')
        }
    }, [isHome, messages.length, isVisible])

    if (messages.length === 0) return null

    return (
        <div className={`${isHome ? 'fixed top-0 left-0 w-full' : 'relative'} ${!isVisible && isHome ? '-translate-y-full' : 'translate-y-0'} bg-black text-white text-[10px] md:text-xs font-bold tracking-[0.2em] z-[1000] overflow-hidden transition-all duration-300`}>
            <div className="max-w-[1400px] mx-auto px-4 relative h-10 flex items-center justify-between">

                {/* Left Arrow */}
                <button
                    onClick={prev}
                    className="z-10 p-1 hover:text-gray-300 transition-colors"
                    aria-label="Previous announcement"
                >
                    <ChevronLeft size={14} strokeWidth={2} />
                </button>

                {/* Messages Container */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <div className="relative w-full h-full">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-in-out transform ${index === currentIndex
                                    ? 'translate-x-0 opacity-100'
                                    : index < currentIndex
                                        ? '-translate-x-full opacity-0' // Slide out to left
                                        : 'translate-x-full opacity-0'  // Prepare on right
                                    }`}
                                aria-hidden={index !== currentIndex}
                            >
                                <span className="uppercase text-center whitespace-nowrap px-4 w-full">
                                    {msg}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={next}
                    className="z-10 p-1 hover:text-gray-300 transition-colors"
                    aria-label="Next announcement"
                >
                    <ChevronRight size={14} strokeWidth={2} />
                </button>
            </div>
        </div>
    )
}
