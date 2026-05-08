'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Pagination } from '@/components/ui/PaginationComponent'

const ITEMS_PER_PAGE = 12

// UI Loading state for Suspense fallback
function SearchLoading() {
  return (
    <main className="min-h-screen bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-5 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-black capitalize tracking-tight mb-2">
            Searching...
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
            Loading results...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
              <div className="h-4 bg-gray-100" />
              <div className="h-4 bg-gray-100 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

interface Product {
  _id: string
  name: string
  category: string
  subCategory: string
  gender: string
  brand: string
  price: number
  image?: string
  imageUrl?: string
  description?: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (query.trim().length < 2) {
      setProducts([])
      setLoading(false)
      return
    }

    const cacheKey = `search_cache_${query.trim()}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      setProducts(JSON.parse(cachedData));
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError(null)

    fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products || [])
          sessionStorage.setItem(cacheKey, JSON.stringify(data.products || []));
        } else {
          setError(data.message || 'Failed to fetch search results')
        }
      })
      .catch(err => {
        console.error('Search error:', err)
        setError('Failed to fetch search results')
      })
      .finally(() => {
        setLoading(false)
        setCurrentPage(1)
      })
  }, [query])

  if (loading) {
    return (
      <main className="min-h-screen bg-white w-full">
        <div className="max-w-[1400px] mx-auto px-5 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-black capitalize tracking-tight mb-2">
              Searching for "{query}"
            </h1>
            <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
              Loading results...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                <div className="h-4 bg-gray-100" />
                <div className="h-4 bg-gray-100 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white w-full">
        <div className="max-w-[1400px] mx-auto px-5 py-12">
          <div className="mb-12 flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-gray-200 mb-6" />
            <h3 className="text-xl font-serif text-black mb-2">Search Error</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm mb-6">
              {error}
            </p>
            <Link
              href="/catalog"
              className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-white w-full">
        <div className="max-w-[1400px] mx-auto px-5 py-12">
          <div className="mb-12 flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-gray-200 mb-6" />
            <h3 className="text-xl font-serif text-black mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm mb-6">
              No products found matching "{query}". Try different keywords.
            </p>
            <Link
              href="/catalog"
              className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-5 py-12">
        <div className="mb-12 flex justify-between items-center bg-gray-50 p-8 border-l-4 border-black">
          <div className="flex items-center gap-10">
            <div>
              <h1 className="text-4xl font-serif text-black capitalize tracking-tight">
                Search Results
              </h1>
              <p className="text-gray-500 mt-2 text-sm uppercase tracking-[0.2em]">
                {products.length} Results for "{query}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product: Product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="group block"
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-[#F9F9F9] mb-6">
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors pr-4">
                    {product.name}
                  </h3>
                  <span className="text-xs font-bold text-black whitespace-nowrap">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  {product.category}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(products.length / ITEMS_PER_PAGE)}
          onPageChange={(page) => {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="mt-12"
        />
      </div>
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  )
}
