'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface Category {
  _id: string
  name: string
  subcategories?: string[]
}

interface CategoryDropdownProps {
  categories: Category[]
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category.name)
    setSelectedSubcategory('')
    setIsOpen(false)
  }

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors bg-white"
      >
        <span>
          {selectedCategory || selectedSubcategory || 'All Categories'}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <div key={category._id} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-medium text-black"
                >
                  {category.name}
                </button>
                
                {category.subcategories && category.subcategories.length > 0 && selectedCategory === category.name && (
                  <div className="pl-4 bg-gray-50">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        href={`/catalog/${subcategory.toLowerCase()}`}
                        onClick={() => handleSubcategorySelect(subcategory)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
