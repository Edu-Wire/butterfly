'use client'

import { DashboardHeader } from '@/components/admin/DashboardHeader'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, ChevronDown, Filter, X } from 'lucide-react'
import { Suspense } from 'react'
import { Product } from '@/lib/products'
import { showToast } from '@/lib/toast-utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Loading = () => <div className="p-8 text-center text-gray-500">Loading products...</div>

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState({
    categories: [] as string[],
    subCategories: [] as string[],
    inStock: 'all' as 'all' | 'inStock' | 'outOfStock'
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      console.log('Categories API response:', data)
      if (data.success && data.data) {
        console.log('Setting categories:', data.data)
        setCategories(data.data)
      } else {
        console.log('No categories found or API error')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success && data.products) {
        setProducts(data.products)
      } else {
        console.error('Invalid data structure:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    
    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchProducts()
        setSelectedProducts(prev => prev.filter(p => p !== productToDelete))
        showToast.success('Product deleted successfully')
      } else {
        showToast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast.error('Failed to delete product')
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const filteredProducts = products ? products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)
    
    const matchesSubCategory = filters.subCategories.length === 0 || 
                              (product.subCategory && filters.subCategories.includes(product.subCategory))
    
    const matchesStock = filters.inStock === 'all' || 
                        (filters.inStock === 'inStock' && product.inStock) ||
                        (filters.inStock === 'outOfStock' && !product.inStock)
    
    return matchesSearch && matchesCategory && matchesSubCategory && matchesStock
  }) : []

  const clearFilters = () => {
    setFilters({
      categories: [],
      subCategories: [],
      inStock: 'all'
    })
  }

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            Products
          </h1>
          <div className="flex gap-3 sm:gap-4">
            <Link
              href="/admin/products/bulk"
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Plus size={18} />
              Bulk Add
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus size={18} />
              New Product
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-black dark:text-white placeholder-gray-500"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter size={18} />
            Filter
            {(filters.categories.length > 0 || filters.subCategories.length > 0 || filters.inStock !== 'all') && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-black shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-black dark:text-white">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium text-black dark:text-white mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <label key={category.name} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, categories: [...prev.categories, category.name] }))
                                } else {
                                  setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category.name) }))
                                }
                              }}
                              className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                          </label>
                        ))
                      ) : (
                        // Fallback: Show categories from products
                        Array.from(new Set(products?.map(p => p.category).filter(Boolean))).map((category) => (
                          <label key={category} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, categories: [...prev.categories, category] }))
                                } else {
                                  setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
                                }
                              }}
                              className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sub Categories */}
                  <div>
                    <h3 className="text-sm font-medium text-black dark:text-white mb-3">Sub Categories</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(products?.map(p => p.subCategory).filter((sub): sub is string => Boolean(sub)))).map((subCategory) => (
                        <label key={subCategory} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.subCategories.includes(subCategory)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, subCategories: [...prev.subCategories, subCategory] }))
                              } else {
                                setFilters(prev => ({ ...prev, subCategories: prev.subCategories.filter(s => s !== subCategory) }))
                              }
                            }}
                            className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{subCategory}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <h3 className="text-sm font-medium text-black dark:text-white mb-3">Stock Status</h3>
                    <div className="space-y-2">
                      {['all', 'inStock', 'outOfStock'].map((status) => (
                        <label key={status} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="stock"
                            value={status}
                            checked={filters.inStock === status}
                            onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.value as any }))}
                            className="border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {status === 'all' ? 'All Products' : status === 'inStock' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Products Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>{selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected</span>
            <button className="px-3 py-1 text-red-600 font-medium hover:bg-red-50 rounded-sm transition-colors">
              Delete Selected
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0 bg-gray-100 dark:bg-gray-800 ${!product.imageUrl ? 'flex items-center justify-center' : ''}`}>
                            {product.imageUrl && (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            )}
                            {!product.imageUrl && (
                              <span className="text-xs text-gray-500">No image</span>
                            )}
                          </div>
                          <p className="font-medium text-black dark:text-white">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${!product.inStock
                          ? 'text-red-600'
                          : 'text-green-600'
                          }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-black dark:text-white">
                        ₹{product.price ? product.price.toLocaleString() : '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {product.inStock ? 'Active' : 'Allocated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`} className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
