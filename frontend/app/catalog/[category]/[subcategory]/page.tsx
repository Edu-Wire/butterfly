'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer'

// --- ICONS FOR MOBILE VIEW ---
const SingleColumnIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" fill={active ? "black" : "#D1D5DB"} />
  </svg>
)

const DoubleColumnIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="6" height="16" fill={active ? "black" : "#D1D5DB"} />
    <rect x="13" y="4" width="6" height="16" fill={active ? "black" : "#D1D5DB"} />
  </svg>
)

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    subCategory: string;
    color: string;
    gender?: string;
    size: string[];
    rating: number;
    reviews: number;
    image?: string;
    imageUrl?: string;
    inStock: boolean;
    onSale?: boolean;
    salePrice?: number;
    isNew?: boolean;
}

export default function SubcategoryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    
    // --- NEW STATES FOR MOBILE ---
    const [mobileLayout, setMobileLayout] = useState<'1' | '2'>('2') // Default to 2 columns
    const [activeGender, setActiveGender] = useState<string | null>(null)
    const [gridView, setGridView] = useState<'3' | '4'>('4') // Desktop grid

    const params = useParams()
    const categoryName = params.category as string
    const subcategoryName = params.subcategory as string

    useEffect(() => {
        fetchSubcategoryProducts()
    }, [categoryName, subcategoryName])

    const fetchSubcategoryProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/products')
            const data = await response.json()
            
            if (data.success && data.products && Array.isArray(data.products)) {
                const subcategoryProducts = data.products.filter((p: Product) => {
                    const decodedCategoryName = decodeURIComponent(categoryName.toLowerCase())
                    const decodedSubcategoryName = decodeURIComponent(subcategoryName.toLowerCase())
                    const productCategory = p.category?.toLowerCase()
                    const productSubCategory = p.subCategory?.toLowerCase()
                    
                    return productCategory === decodedCategoryName && productSubCategory === decodedSubcategoryName
                })
                setProducts(subcategoryProducts)
                setFilteredProducts(subcategoryProducts)
            } else {
                setProducts([])
            }
        } catch (error) {
            console.error('Failed to fetch subcategory products:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = (filters: FilterState) => {
        let filtered = [...products]

        // Filter by gender
        if (filters.genders.length > 0) {
            filtered = filtered.filter(product => 
                product.gender && filters.genders.some(g => g.toLowerCase() === product.gender?.toLowerCase())
            )
        }

        // Filter by size
        const allSelectedSizes = [...new Set([...filters.sizes, ...selectedSizes])]
        if (allSelectedSizes.length > 0) {
            filtered = filtered.filter(product => 
                product.size && product.size.some(size => allSelectedSizes.includes(size))
            )
        }

        // Filter by price range
        if (filters.priceRange.min !== null) {
            const minPrice = typeof filters.priceRange.min === 'string' ? parseFloat(filters.priceRange.min) : filters.priceRange.min
            filtered = filtered.filter(product => 
                (product.salePrice || product.price) >= (minPrice ?? 0)
            )
        }
        if (filters.priceRange.max !== null) {
            const maxPrice = typeof filters.priceRange.max === 'string' ? parseFloat(filters.priceRange.max) : filters.priceRange.max
            filtered = filtered.filter(product => 
                (product.salePrice || product.price) <= (maxPrice ?? Infinity)
            )
        }

        // Filter by color
        if (filters.colors.length > 0) {
            filtered = filtered.filter(product => 
                product.color && filters.colors.some(color => 
                    product.color.toLowerCase() === color.toLowerCase()
                )
            )
        }

        // Sort products
        switch (filters.sortBy) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'price-low':
                filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
                break
            case 'price-high':
                filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
                break
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating)
                break
        }

        setFilteredProducts(filtered)
    }

    // Handle Quick Size Select
    const handleSizeSelect = (size: string) => {
        const newSelectedSizes = selectedSizes.includes(size) 
            ? selectedSizes.filter(s => s !== size) 
            : [...selectedSizes, size]
        setSelectedSizes(newSelectedSizes)
        
        applyFilters({
            genders: activeGender ? [activeGender] : [],
            sizes: newSelectedSizes,
            priceRange: { min: null, max: null },
            colors: [],
            sortBy: 'name'
        })
    }

    // Handle Drawer Apply
    const handleFilterApply = (filters: FilterState) => {
        setSelectedSizes(filters.sizes)
        // Sync mobile gender toggle if modified in drawer
        if(filters.genders.length === 1) {
            setActiveGender(filters.genders[0])
        } else {
            setActiveGender(null)
        }
        applyFilters(filters)
    }

    // --- NEW: Mobile Gender Toggle Logic ---
    const toggleMobileGender = (gender: string) => {
        const newGender = activeGender === gender ? null : gender
        setActiveGender(newGender)
        
        applyFilters({
            genders: newGender ? [newGender] : [],
            sizes: selectedSizes,
            priceRange: { min: null, max: null },
            colors: [],
            sortBy: 'name'
        })
    }

    const getBackgroundImage = (category: string, subcategory: string) => {
        // ... (Keep existing image logic)
        const subcategoryImages: { [key: string]: string } = {
            'jackets': '/banners/banner.jpeg',
            'coats': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1920&auto=format&fit=crop',
             // ... Add other mappings if needed
        };
        const subcategoryKey = subcategory.toLowerCase();
        if (subcategoryImages[subcategoryKey]) return subcategoryImages[subcategoryKey];
        return 'https://images.unsplash.com/photo-1441986300917-64674bd168d5?q=80&w=1920&auto=format&fit=crop';
    }

    return (
        <main className="min-h-screen bg-white w-full pb-20 md:pb-0"> 
            {/* Added padding-bottom on mobile to prevent content being hidden behind sticky button */}
            
            <CatalogBanner 
                title={decodeURIComponent(subcategoryName)}
                backgroundImage={getBackgroundImage(categoryName, subcategoryName)}
            />

            {/* --- MOBILE FILTER BAR (Top Sticky) --- */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between md:hidden shadow-sm">
                {/* Item Count */}
                <span className="text-xs font-medium text-black">
                    {filteredProducts.length} Items
                </span>

                {/* Gender Toggles */}
                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide">
                    <button 
                        onClick={() => toggleMobileGender('Male')}
                        className={`transition-colors ${activeGender?.toLowerCase() === 'male' ? 'text-black font-bold' : 'text-gray-300'}`}
                    >
                        Male
                    </button>
                    <button 
                         onClick={() => toggleMobileGender('Female')}
                        className={`transition-colors ${activeGender?.toLowerCase() === 'female' ? 'text-black font-bold' : 'text-gray-300'}`}
                    >
                        Female
                    </button>
                </div>

                {/* Layout Toggles */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setMobileLayout('1')}>
                        <SingleColumnIcon active={mobileLayout === '1'} />
                    </button>
                    <button onClick={() => setMobileLayout('2')}>
                        <DoubleColumnIcon active={mobileLayout === '2'} />
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 py-8 relative z-10">
                
                {/* --- DESKTOP FILTER BAR (Hidden on Mobile) --- */}
                <div className="hidden md:flex items-center justify-between mb-6 border-b pb-4">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-colors text-sm font-medium"
                    >
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="21" x2="4" y2="14"/>
                            <line x1="4" y1="10" x2="4" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12" y2="3"/>
                            <line x1="20" y1="21" x2="20" y2="16"/>
                            <line x1="20" y1="12" x2="20" y2="3"/>
                            <circle cx="4" cy="7" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="20" cy="9" r="1"/>
                        </svg>
                        FILTER & SORT
                    </button>
                    <div className="flex items-center gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                className={`px-4 py-2 border text-sm font-medium transition-colors ${
                                    selectedSizes.includes(size)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-300 hover:border-black'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                            {filteredProducts.length} Items
                        </span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setGridView('3')} className={`p-2 rounded ${gridView === '3' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                            </button>
                            <button onClick={() => setGridView('4')} className={`p-2 rounded ${gridView === '4' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="4" height="4"/><rect x="10" y="3" width="4" height="4"/><rect x="17" y="3" width="4" height="4"/><rect x="3" y="10" width="4" height="4"/><rect x="10" y="10" width="4" height="4"/><rect x="17" y="10" width="4" height="4"/><rect x="3" y="17" width="4" height="4"/><rect x="10" y="17" width="4" height="4"/><rect x="17" y="17" width="4" height="4"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-gray-600 text-lg mb-4">No products found matching your filters</p>
                            <button
                                onClick={() => {
                                    setFilteredProducts(products)
                                    setIsFilterOpen(true)
                                }}
                                className="inline-flex items-center justify-center px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide uppercase"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- PRODUCTS GRID ---
                    <div className={`grid gap-4 md:gap-8 
                        ${/* Mobile Layout Logic */ mobileLayout === '1' ? 'grid-cols-1' : 'grid-cols-2'} 
                        ${/* Desktop Layout Overrides */ gridView === '3' ? 'md:grid-cols-3' : 'md:grid-cols-4'}
                    `}>
                        {filteredProducts.map((product) => (
                            <Link
                                key={product._id}
                                href={`/product/${product._id}`}
                                className="group block"
                            >
                                <div className="bg-gray-50 rounded-lg overflow-hidden transition-shadow duration-300">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                        <div className={`w-full h-full ${product.imageUrl || 'bg-gradient-to-br from-pink-100 to-rose-100'} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
                                            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>}
                                            {product.onSale && <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">Sale</div>}
                                            {product.isNew && <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">New</div>}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-normal text-xs text-black text-left uppercase mb-2 font-inter truncate">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-black font-normal text-base font-inter">₹{product.salePrice || product.price}</p>
                                            {product.salePrice && (
                                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MOBILE FLOATING FILTER BUTTON (Bottom Sticky) --- */}
            <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center md:hidden pointer-events-none">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="pointer-events-auto bg-white text-black px-8 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                    Filter & Sort
                </button>
            </div>

            {/* Filter Drawer */}
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleFilterApply}
            />
        </main>
    )
}