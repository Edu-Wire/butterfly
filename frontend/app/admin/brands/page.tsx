'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { Brand } from '@/lib/brands'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageCompression'
import Image from 'next/image'
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

export default function AdminBrandsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState('')

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.data)
        // Show form by default if no brands exist
        if (data.data.length === 0) {
          setShowForm(true)
        }
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isValidImageFile(file)) {
      showToast.error('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    setUploadingImage(true)
    setCompressionInfo('')

    try {
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800, // Logos don't need to be huge
        quality: 0.8,
        useWebWorker: true
      })

      const originalSize = formatFileSize(file.size)
      const compressedSize = formatFileSize(compressedFile.size)
      const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
      setCompressionInfo(`Original: ${originalSize} → Compressed: ${compressedSize} (${compressionRatio}% reduction)`)

      const formDataUpload = new FormData()
      formDataUpload.append('file', compressedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          logo: data.url
        }))
      } else {
        showToast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBrand
        ? `/api/brands/${editingBrand.id}`
        : '/api/brands'
      const method = editingBrand ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        fetchBrands()
        setShowForm(false)
        setEditingBrand(null)
        setFormData({ name: '', description: '', logo: '' })
      } else {
        showToast.error(data.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving brand:', error)
      showToast.error('Failed to save brand')
    }
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo: brand.logo || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    setBrandToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!brandToDelete) return
    
    try {
      const response = await fetch(`/api/brands/${brandToDelete}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchBrands()
        showToast.success('Brand deleted successfully')
      } else {
        showToast.error('Failed to delete brand')
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
      showToast.error('Failed to delete brand')
    } finally {
      setDeleteDialogOpen(false)
      setBrandToDelete(null)
    }
  }

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-full bg-background">
      <div className="bg-secondary border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold text-primary">
                Brands
              </h1>
              <p className="text-foreground/60 text-sm mt-1">
                Manage product brands
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingBrand(null)
                setFormData({ name: '', description: '', logo: '' })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              New Brand
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-background border border-border rounded-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-4">
              {editingBrand ? 'Edit Brand' : 'Create New Brand'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Brand Logo
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-sm transition-colors cursor-pointer disabled:opacity-50 text-sm font-medium"
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose Logo'}
                    </label>
                    {formData.logo && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, logo: '' })
                          setCompressionInfo('')
                        }}
                        className="px-4 py-2 border border-destructive/50 text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {compressionInfo && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded-sm inline-block">
                      {compressionInfo}
                    </div>
                  )}

                  {formData.logo && (
                    <div className="relative w-20 h-20 rounded-lg bg-gray-100 overflow-hidden border border-border">
                      <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs text-foreground/40 font-medium uppercase">Or enter URL manually</label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) =>
                        setFormData({ ...formData, logo: e.target.value })
                      }
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
                >
                  {editingBrand ? 'Update' : 'Create'} Brand
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBrand(null)
                    setFormData({ name: '', description: '', logo: '' })
                  }}
                  className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-background border border-border rounded-sm p-4 mb-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40"
            />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-background border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-foreground/60"
                    >
                      Loading brands...
                    </td>
                  </tr>
                ) : filteredBrands.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-foreground/60"
                    >
                      No brands found.
                    </td>
                  </tr>
                ) : (
                  filteredBrands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {brand.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/60">
                        {brand.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-2 text-primary hover:bg-secondary rounded-sm transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id)}
                            className="p-2 text-destructive hover:bg-secondary rounded-sm transition-colors"
                          >
                            <Trash2 size={18} />
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
            <AlertDialogTitle>Delete Brand?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this brand? This action cannot be undone.
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
    </div>
  )
}

