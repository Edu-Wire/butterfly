'use client'

import { X, Check, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// --- Types ---
interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    onApplyFilters: (filters: FilterState) => void
    onClearFilters?: () => void
    initialFilters?: FilterState
}

export interface FilterState {
    genders: string[]
    sizes: string[]
    priceRange: { min: number | string | null; max: number | string | null }
    colors: string[]
    sortBy: 'name' | 'price-low' | 'price-high' | 'rating'
}

export function FilterDrawer({ isOpen, onClose, onApplyFilters, onClearFilters, initialFilters }: FilterDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)

    // State
    const [selectedGenders, setSelectedGenders] = useState<string[]>(initialFilters?.genders || [])
    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialFilters?.sizes || [])
    const [priceRange, setPriceRange] = useState({
        min: initialFilters?.priceRange.min?.toString() || '',
        max: initialFilters?.priceRange.max?.toString() || ''
    })
    const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters?.colors || [])
    const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>(initialFilters?.sortBy || 'name')

    // Sync state
    useEffect(() => {
        if (initialFilters) {
            setSelectedGenders(initialFilters.genders)
            setSelectedSizes(initialFilters.sizes)
            setPriceRange({
                min: initialFilters.priceRange.min?.toString() || '',
                max: initialFilters.priceRange.max?.toString() || ''
            })
            setSelectedColors(initialFilters.colors)
            setSortBy(initialFilters.sortBy)
        }
    }, [initialFilters])

    // Body Scroll Lock
    useEffect(() => {
        const htmlElement = document.documentElement
        const bodyElement = document.body

        // Store original styles
        const originalHtmlOverflow = htmlElement.style.overflow
        const originalBodyOverflow = bodyElement.style.overflow
        const originalBodyMarginRight = bodyElement.style.marginRight

        // Calculate scrollbar width to prevent layout shift
        const getScrollbarWidth = () => {
            const temp = document.createElement('div')
            temp.style.cssText = 'position: absolute; top: -9999px; width: 100px; height: 100px; overflow: scroll; visibility: hidden;'
            document.body.appendChild(temp)
            const scrollbarWidth = temp.offsetWidth - temp.clientWidth
            document.body.removeChild(temp)
            return scrollbarWidth
        }

        if (isOpen) {
            const scrollbarWidth = getScrollbarWidth()
            htmlElement.style.overflow = 'hidden'
            bodyElement.style.overflow = 'hidden'
            bodyElement.style.marginRight = `${scrollbarWidth}px`
        } else {
            htmlElement.style.overflow = originalHtmlOverflow || ''
            bodyElement.style.overflow = originalBodyOverflow || ''
            bodyElement.style.marginRight = originalBodyMarginRight || ''
        }

        return () => {
            htmlElement.style.overflow = originalHtmlOverflow || ''
            bodyElement.style.overflow = originalBodyOverflow || ''
            bodyElement.style.marginRight = originalBodyMarginRight || ''
        }
    }, [isOpen])

    // Prevent background scrolling via events
    useEffect(() => {
        const preventBackgroundScroll = (e: Event) => {
            if (isOpen) {
                const drawerElement = drawerRef.current
                const isInsideDrawer = drawerElement && drawerElement.contains(e.target as Node)

                if (isInsideDrawer) {
                    e.stopPropagation()
                    return
                }

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
                    return
                }

                if (e.cancelable) {
                    e.preventDefault()
                }
                e.stopPropagation()
                return false
            }
        }

        if (isOpen) {
            document.addEventListener('wheel', preventBackgroundScroll, { passive: false, capture: true })
            window.addEventListener('wheel', preventBackgroundScroll, { passive: false, capture: true })
            document.addEventListener('touchmove', preventTouchMove, { passive: false, capture: true })
            window.addEventListener('touchmove', preventTouchMove, { passive: false, capture: true })
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

    // Handlers
    const toggleGender = (gender: string) => {
        setSelectedGenders(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender])
    }

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
    }

    const clearAllFilters = () => {
        setSelectedGenders([])
        setSelectedSizes([])
        setSelectedColors([])
        setPriceRange({ min: '', max: '' })
        setSortBy('name')
        onClearFilters?.()
    }

    const applyFilters = () => {
        onApplyFilters({
            genders: selectedGenders,
            sizes: selectedSizes,
            priceRange: {
                min: priceRange.min ? parseInt(priceRange.min) : null,
                max: priceRange.max ? parseInt(priceRange.max) : null
            },
            colors: selectedColors,
            sortBy
        })
        onClose()
    }

    // Animation Helpers
    // Staggered slide-up effect for internal content
    const getAnimationClass = (delayIndex: number) => {
        const baseClass = "transform transition-all duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
        const activeClass = isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        return `${baseClass} ${activeClass}`
    }

    const getDelayStyle = (index: number) => ({ transitionDelay: `${200 + (index * 50)}ms` })

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[10000] bg-black/40 backdrop-blur-[4px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Right Side Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed inset-y-0 right-0 z-[10001] w-full max-w-[420px]
                    bg-black/40 backdrop-blur-2xl 
                    border-l border-white/20 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]
                    font-sans text-white
                    flex flex-col
                    transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] 
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-multiply opacity-50" />

                {/* 1. Header */}
                <div className="relative flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg tracking-[0.25em] uppercase text-white font-medium drop-shadow-md">
                            Filters
                        </h2>
                        {(selectedGenders.length + selectedSizes.length + selectedColors.length) > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[10px] text-black font-bold">
                                {selectedGenders.length + selectedSizes.length + selectedColors.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="group p-2 text-white/60 hover:text-white transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
                    </button>
                </div>

                {/* 2. Scrollable Content */}
                <div className="relative flex-1 overflow-y-auto px-8 py-8 space-y-10">

                    {/* Sort By */}
                    <section className={getAnimationClass(0)} style={getDelayStyle(0)}>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 font-semibold">Sort By</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'name', label: 'Featured' },
                                { value: 'price-low', label: 'Low Price' },
                                { value: 'price-high', label: 'High Price' },
                                { value: 'rating', label: 'Top Rated' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value as any)}
                                    className={`px-3 py-3 text-[10px] uppercase tracking-widest border transition-all duration-300 text-center ${sortBy === option.value
                                        ? 'bg-white text-black border-white font-semibold'
                                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="h-px bg-white/5 w-full" />

                    {/* Collection (Gender) */}
                    <section className={getAnimationClass(1)} style={getDelayStyle(1)}>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 font-semibold">Collection</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {['Male', 'Female', 'Unisex'].map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => toggleGender(gender)}
                                    className={`px-2 py-3 text-[10px] uppercase tracking-widest border transition-all duration-300 ${selectedGenders.includes(gender)
                                        ? 'bg-white/10 text-white border-white/40'
                                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white'
                                        }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Size */}
                    <section className={getAnimationClass(2)} style={getDelayStyle(2)}>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 font-semibold">Size</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'OS'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => toggleSize(size)}
                                    className={`h-10 text-[10px] font-medium border transition-all duration-300 flex items-center justify-center ${selectedSizes.includes(size)
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Price Range */}
                    <section className={getAnimationClass(3)} style={getDelayStyle(3)}>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 font-semibold">Price Range</h3>
                        <div className="flex gap-4 items-center">
                            <div className="relative flex-1 group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/40 group-hover:text-white/60 transition-colors">Min</span>
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                    className="w-full bg-transparent border border-white/10 text-white text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white/40 transition-colors placeholder-transparent"
                                />
                            </div>
                            <span className="text-white/20">-</span>
                            <div className="relative flex-1 group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/40 group-hover:text-white/60 transition-colors">Max</span>
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                    className="w-full bg-transparent border border-white/10 text-white text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white/40 transition-colors placeholder-transparent"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Colors */}
                    <section className={getAnimationClass(4)} style={getDelayStyle(4)}>
                        <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 font-semibold">Colors</h3>
                        <div className="grid grid-cols-5 gap-4">
                            {['Black', 'White', 'Gray', 'Brown', 'Blue', 'Red', 'Navy', 'Cream', 'Gold', 'Green'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => toggleColor(color)}
                                    title={color}
                                    className={`group relative flex items-center justify-center aspect-square rounded-full hover:scale-110 transition-all`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full shadow-sm transition-all ${selectedColors.includes(color) ? 'ring-2 ring-white ring-offset-0' : ''}`}
                                        style={{
                                            backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                                color.toLowerCase() === 'black' ? '#000000' :
                                                    color.toLowerCase() === 'cream' ? '#F5F5DC' :
                                                        color.toLowerCase() === 'gold' ? '#FFD700' :
                                                            color.toLowerCase() === 'navy' ? '#000080' : color
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Spacer for bottom clearance */}
                    <div className="h-10" />
                </div>

                {/* 3. Footer Actions */}
                <div className="relative shrink-0 px-8 py-6 border-t border-white/10 bg-black/40 backdrop-blur-md flex gap-4">
                    <button
                        onClick={clearAllFilters}
                        className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:border-white/30 transition-all"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                    </button>

                    <button
                        onClick={applyFilters}
                        className="flex-[2] bg-white text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-transform active:scale-[0.98]"
                    >
                        View Results
                    </button>
                </div>
            </div>
        </>
    )
}