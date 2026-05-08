'use client';
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getAllProducts } from '@/lib/products'
import { Sliders, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { CatalogBanner } from '@/components/catalog/CatalogBanner'
import { FilterDrawer, FilterState } from '@/components/layout/FilterDrawer'
import { filterAndSortProducts, FilterOptions } from '@/lib/products'

const categories = ['All', 'Clothing', 'Shoes', 'Accessories']

export default function ShopPage() {
  const [productsState, setProductsState] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null)
  const [loading, setLoading] = useState(true)

  const allProducts = productsState

  const products = useMemo(() => {
    let options: FilterOptions = {
      categories: selectedCategory === 'All' ? [] : [selectedCategory],
    }

    if (activeFilters) {
      options = {
        ...options,
        sizes: activeFilters.sizes,
        colors: activeFilters.colors,
        genders: activeFilters.genders,
        priceRange: [
          Number(activeFilters.priceRange.min) || 0,
          Number(activeFilters.priceRange.max) || 10000000
        ],
        sortBy: activeFilters.sortBy
      }
    }

    return filterAndSortProducts(allProducts, options)
  }, [selectedCategory, activeFilters, allProducts])

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (data.success) {
          setProductsState(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-background">
        <CatalogBanner
          title="Shop Our Collection"
          subtitle="Discover our complete range of luxury fashion pieces"
          backgroundImage="/banners/b3.jpg"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-4">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-sm transition-colors uppercase tracking-wider ${selectedCategory === cat
                          ? 'font-bold text-black border-b border-black'
                          : 'text-gray-500 hover:text-black'
                          }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="w-full py-4 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <Sliders size={16} />
                  Advanced Filters
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-10 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="p-3 border border-gray-200 rounded-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2 lg:hidden"
                  >
                    <Sliders size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
                  </button>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Showing {products.length} Products
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort:</span>
                  <select
                    value={activeFilters?.sortBy || 'name'}
                    onChange={(e) => setActiveFilters(prev => ({
                      ...prev || { genders: [], sizes: [], colors: [], priceRange: { min: null, max: null }, sortBy: 'name' },
                      sortBy: e.target.value as any
                    }))}
                    className="text-xs font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="name">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="space-y-4 animate-pulse">
                      <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                      <div className="h-4 bg-gray-100 w-2/3" />
                      <div className="h-4 bg-gray-100 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Sliders size={48} strokeWidth={1} className="text-gray-200 mb-6" />
                  <h3 className="text-xl font-serif text-black mb-2">No products found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto text-sm">
                    Try adjusting your filters or search criteria to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All')
                      setActiveFilters(null)
                    }}
                    className="mt-8 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden aspect-[3/4] bg-[#F9F9F9] mb-6">
                        <img
                          src={product.images?.[0] || product.imageUrl || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.onSale && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                            Sale
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                            New
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors pr-4">
                            {product.name}
                          </h3>
                          <span className="text-xs font-bold text-black whitespace-nowrap">
                            INR {product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                          {product.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && products.length > 0 && products.length % 6 === 0 && (
                <div className="text-center mt-20 pt-10 border-t">
                  <button className="px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    Load More Pieces
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={(filters) => {
          setActiveFilters(filters)
          setIsFilterOpen(false)
        }}
        initialFilters={activeFilters || undefined}
      />

      <Footer />
    </div>
  )
}
