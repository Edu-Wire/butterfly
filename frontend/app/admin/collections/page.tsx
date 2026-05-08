'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  X,
  Image as ImageIcon,
  Check,
  Loader2,
  LayoutGrid,
  ExternalLink,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
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
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageCompression'
import { AIBannerEnhancer } from '@/components/admin/AIBannerEnhancer'
import { AIVariant, BannerEnhancement } from '@/lib/ai-enhancement'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  inStock: boolean
}

interface Collection {
  _id: string
  name: string
  slug: string
  description?: string
  products: Product[]
  bannerImage?: string
  aiVariants?: AIVariant[]
  selectedVariant?: string | null
  aiEnhanced?: boolean
  isFeatured: boolean
  isActive: boolean
}

export default function AdminCollectionsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [collections, setCollections] = useState<Collection[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false)
  const [isSavingOrder, setIsSavingOrder] = useState(false)

  // Form State
  const [showForm, setShowForm] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    bannerImage: '',
    aiVariants: [] as AIVariant[],
    selectedVariant: null as string | null,
    aiEnhanced: false,
    isFeatured: false,
    isActive: true,
    products: [] as string[]
  })

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState('')
  const [showAIEnhancer, setShowAIEnhancer] = useState(false)

  useEffect(() => {
    if (token) {
      fetchCollections()
      fetchAllProducts()
    }
  }, [token])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setCollections(data.collections)
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setAllProducts(data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    setFormData({ ...formData, name, slug })
  }

  const moveReorder = (index: number, direction: 'up' | 'down') => {
    if (searchTerm) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === collections.length - 1) return

    const newCollections = [...collections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newCollections[index]
    newCollections[index] = newCollections[targetIndex]
    newCollections[targetIndex] = temp

    setCollections(newCollections)
    setHasUnsavedOrder(true)
  }

  const saveOrder = async () => {
    setIsSavingOrder(true)
    try {
      const response = await fetch('/api/collections/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds: collections.map(c => c._id) })
      })
      if (!response.ok) throw new Error('Failed to reorder')
      setHasUnsavedOrder(false)
      toast({ title: "Success", description: "Collection order saved" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save order", variant: "destructive" })
      fetchCollections()
    } finally {
      setIsSavingOrder(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isValidImageFile(file)) {
      toast({ title: "Invalid File", description: "Please use JPEG, PNG, or WebP", variant: "destructive" })
      return
    }

    setUploadingImage(true)
    try {
      const compressedFile = await compressImage(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 })
      const formDataUpload = new FormData()
      formDataUpload.append('file', compressedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, bannerImage: data.url, aiEnhanced: false, aiVariants: [] }))
        setShowAIEnhancer(true)
      }
    } catch (error) {
      toast({ title: "Upload Failed", description: "Image could not be uploaded", variant: "destructive" })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) return

    setIsSubmitting(true)
    try {
      const url = editingId ? `/api/collections/${editingId}` : '/api/collections'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        toast({ title: editingId ? "Updated" : "Created", description: `Collection "${formData.name}" saved.` })
        fetchCollections()
        resetForm()
      } else {
        throw new Error(data.message || 'Action failed')
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '', slug: '', description: '', bannerImage: '',
      aiVariants: [], selectedVariant: null, aiEnhanced: false,
      isFeatured: false, isActive: true, products: []
    })
  }

  const handleEdit = (col: Collection) => {
    setEditingId(col._id)
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || '',
      bannerImage: col.bannerImage || '',
      aiVariants: col.aiVariants || [],
      selectedVariant: col.selectedVariant || null,
      aiEnhanced: col.aiEnhanced || false,
      isFeatured: col.isFeatured,
      isActive: col.isActive,
      products: col.products.map(p => p._id)
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    setCollectionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!collectionToDelete) return
    
    try {
      const response = await fetch(`/api/collections/${collectionToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if ((await response.json()).success) {
        fetchCollections()
        showToast.success('Collection deleted successfully')
      } else {
        showToast.error('Failed to delete collection')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      showToast.error('Failed to delete collection')
    } finally {
      setDeleteDialogOpen(false)
      setCollectionToDelete(null)
    }
  }

  const filteredCollections = collections.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Collections</h1>
            <p className="text-sm text-gray-500">Manage your fashion collections</p>
          </div>
          <div className="flex gap-2">
            {hasUnsavedOrder && (
              <button
                onClick={saveOrder}
                disabled={isSavingOrder}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isSavingOrder ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                Save Order
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg"
            >
              <Plus size={18} /> New Collection
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border rounded-lg outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Collections Table */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Collection</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Products</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
                ) : filteredCollections.map((col, idx) => (
                  <tr key={col._id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden border">
                          {col.bannerImage && <img src={col.bannerImage} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div>
                          <p className="font-medium">{col.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{col.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{col.products?.length || 0} items</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${col.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {col.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => moveReorder(idx, 'up')} disabled={idx === 0} className="p-2 hover:bg-gray-100 rounded disabled:opacity-20"><ArrowUp size={16} /></button>
                        <button onClick={() => moveReorder(idx, 'down')} disabled={idx === collections.length - 1} className="p-2 hover:bg-gray-100 rounded disabled:opacity-20"><ArrowDown size={16} /></button>
                        <button onClick={() => handleEdit(col)} className="p-2 hover:bg-gray-100 rounded"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(col._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-xl bg-white dark:bg-black h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Collection' : 'Create Collection'}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <form id="collection-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 h-24 resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Banner Image</label>
                <div className="flex items-center gap-3">
                  <input type="file" id="upload" hidden onChange={handleImageUpload} />
                  <label htmlFor="upload" className="px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </label>
                  {formData.bannerImage && (
                    <button type="button" onClick={() => setFormData({ ...formData, bannerImage: '' })} className="text-red-600 text-sm font-medium">Remove</button>
                  )}
                </div>
                {formData.bannerImage && (
                   <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                      <img src={formData.bannerImage} className="object-cover w-full h-full" alt="Banner" />
                   </div>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  <span className="text-sm font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </form>

            <div className="p-6 border-t flex gap-3">
              <button type="button" onClick={resetForm} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                type="submit"
                form="collection-form"
                disabled={isSubmitting}
                className="flex-1 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                {editingId ? 'Update Collection' : 'Create Collection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection and remove it from our servers.
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