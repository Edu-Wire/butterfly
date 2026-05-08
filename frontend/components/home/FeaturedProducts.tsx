'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProductCard } from '@/components/product/ProductCard'

const products = [
  {
    id: '1',
    name: 'Silk Butterfly Gown',
    price: 1250,
    image: 'bg-gradient-to-br from-blue-100 to-purple-100',
    category: 'Evening Wear',
    size: ['S', 'M', 'L'],
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
  {
    id: '2',
    name: 'Crystal Embellished Dress',
    price: 980,
    image: 'bg-gradient-to-br from-pink-100 to-rose-100',
    category: 'Cocktail',
    size: ['S', 'M', 'L'],
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
  {
    id: '3',
    name: 'Ethereal Drape Jacket',
    price: 750,
    image: 'bg-gradient-to-br from-amber-50 to-orange-100',
    category: 'Jacket',
    size: ['S', 'M', 'L'],
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
  {
    id: '4',
    name: 'Luxe Structured Blazer',
    price: 890,
    image: 'bg-gradient-to-br from-slate-100 to-gray-100',
    category: 'Blazer',
    size: ['S', 'M', 'L'],
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
]

export function FeaturedProducts() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const { user } = useAuth()

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Collection
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Handpicked pieces from our latest luxury collection, crafted with meticulous attention to detail.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 border border-primary text-primary font-medium rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 h-screen">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 space-y-4 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-black">Login Required</h3>
            <p className="text-gray-600">Please login to add items to your wishlist.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-black rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Link
                href="/login"
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors text-center"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
