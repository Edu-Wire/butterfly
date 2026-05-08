'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Save, ArrowLeft, Loader2, Upload, ImageIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { compressImage, isValidImageFile } from '@/lib/imageCompression'
import { showToast } from '@/lib/toast-utils'

// Stable ID generator
let idCounter = 0
const generateStableId = () => {
    idCounter += 1
    return `temp-${idCounter}-${idCounter.toString(36).padStart(4, '0')}`
}

interface BulkProduct {
    tempId: string
    name: string
    brand: string
    price: number
    category: string
    collectionName: string
    subCategory: string
    gender: string
    colors: string // Comma separated for input simplicity
    sizes: string[]
    images: string[]
    stock: number
    description: string
    fabricComposition: string
    fit: string
    closure: string
    sleeveType: string
    washCare: string
    countryOfManufacture: string
    modelSize: string
    modelHeight: string
    shippingTime: string
    imageGradient: string
}

export default function BulkProductAddPage() {
    const router = useRouter()
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingRows, setUploadingRows] = useState<string[]>([])

    // Data for dropdowns
    const [collections, setCollections] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])

    const [products, setProducts] = useState<BulkProduct[]>([
        {
            tempId: generateStableId(),
            name: '',
            brand: 'Butterfly Couture',
            price: 0,
            category: '',
            collectionName: '',
            subCategory: '',
            gender: 'Female',
            colors: '',
            sizes: ['XS', 'S', 'M'],
            images: [],
            stock: 20,
            description: '',
            fabricComposition: '',
            fit: '',
            closure: '',
            sleeveType: '',
            washCare: '',
            countryOfManufacture: 'India',
            modelSize: '',
            modelHeight: '',
            shippingTime: '',
            imageGradient: '',
        }
    ])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch('/api/collections').then(res => res.json()),
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json())
        ]).then(([collectionsData, categoriesData, brandsData]) => {
            if (collectionsData.success) setCollections(collectionsData.collections || collectionsData.data || [])
            if (categoriesData.success) setCategories(categoriesData.data || [])
            if (brandsData.success) setBrands(brandsData.data || [])
        }).catch(error => {
            console.error('Error fetching dropdown data:', error)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const addRow = () => {
        setProducts([
            ...products,
            {
                tempId: generateStableId(),
                name: '',
                brand: 'Butterfly Couture',
                price: 0,
                category: '',
                collectionName: '',
                subCategory: '',
                gender: 'Female',
                colors: '',
                sizes: ['XS', 'S', 'M'],
                images: [],
                stock: 0,
                description: '',
                fabricComposition: '',
                fit: '',
                closure: '',
                sleeveType: '',
                washCare: '',
                countryOfManufacture: '',
                modelSize: '',
                modelHeight: '',
                shippingTime: '',
                imageGradient: '',
            }
        ])
    }

    const removeRow = (tempId: string) => {
        if (products.length === 1) return
        setProducts(products.filter(p => p.tempId !== tempId))
    }

    const updateProduct = (tempId: string, field: keyof BulkProduct, value: any) => {
        setProducts(products.map(p =>
            p.tempId === tempId ? { ...p, [field]: value } : p
        ))
    }

    const handleRowImageUpload = async (tempId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!isValidImageFile(file)) {
            showToast.error('Please select a valid image file')
            return
        }

        setUploadingRows(prev => [...prev, tempId])

        try {
            const compressedFile = await compressImage(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1200,
                quality: 0.8,
                useWebWorker: true
            })

            const formData = new FormData()
            formData.append('file', compressedFile)

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setProducts(prev => prev.map(p =>
                    p.tempId === tempId ? { ...p, images: [...(p.images || []), data.url] } : p
                ))
            } else {
                showToast.error(data.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Error uploading row image:', error)
            showToast.error('Failed to upload image')
        } finally {
            setUploadingRows(prev => prev.filter(id => id !== tempId))
        }
    }

    const removeRowImage = (tempId: string, index: number) => {
        setProducts(prev => prev.map(p =>
            p.tempId === tempId ? { ...p, images: (p.images || []).filter((_, i) => i !== index) } : p
        ))
    }

    const handleBulkSubmit = async () => {
        // Validation check removed to allow flexible entry, but optional warning could be added
        // const invalidProducts = products.filter(p => !p.name)

        setIsSubmitting(true)
        try {
            // Transform data for API: split string fields to arrays if needed
            const productsToSubmit = products.map(p => ({
                ...p,
                colors: p.colors.split(',').map(s => s.trim()).filter(Boolean),
            }))

            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ products: productsToSubmit })
            })

            const data = await response.json()
            if (data.success) {
                showToast.success(`Successfully added ${products.length} products`)
                router.push('/admin/products')
            } else {
                showToast.error(data.message || 'Failed to add products')
            }
        } catch (error) {
            console.error('Bulk submission error:', error)
            showToast.error('An error occurred during bulk submission')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/products"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-gray-900">Bulk Product Upload</h1>
                                <p className="text-sm text-gray-500">Add multiple products quickly - All fields optional</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addRow}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <Plus size={18} />
                                Add Row
                            </button>
                            <button
                                onClick={handleBulkSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save All Products
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="p-6">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left w-10">#</th>
                                    <th className="px-4 py-3 text-left min-w-[200px]">Product Name*</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Brand</th>
                                    <th className="px-4 py-3 text-left min-w-[120px]">Price (₹)</th>
                                    <th className="px-4 py-3 text-left min-w-[100px]">Stock</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Category</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Sub-Cat</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Collection</th>
                                    <th className="px-4 py-3 text-left min-w-[100px]">Gender</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Colors (comma sep)</th>
                                    <th className="px-4 py-3 text-left min-w-[200px]">Description</th>
                                    <th className="px-4 py-3 text-left min-w-[200px]">Fabric</th>
                                    <th className="px-4 py-3 text-left min-w-[100px]">Fit</th>
                                    <th className="px-4 py-3 text-left min-w-[100px]">Closure</th>
                                    <th className="px-4 py-3 text-left min-w-[100px]">Sleeve</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Wash Care</th>
                                    <th className="px-4 py-3 text-left min-w-[150px]">Country</th>
                                    <th className="px-4 py-3 text-left min-w-[120px]">Shipping Time</th>
                                    <th className="px-4 py-3 text-left min-w-[200px]">Image Gradient</th>
                                    <th className="px-4 py-3 text-left min-w-[300px]">Images</th>
                                    <th className="px-4 py-3 text-center w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.tempId} className="border-b border-gray-100 hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-sm text-gray-400 font-medium">{index + 1}</td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={product.name} onChange={(e) => updateProduct(product.tempId, 'name', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Name" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={product.brand} onChange={(e) => updateProduct(product.tempId, 'brand', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Brand" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={product.price} onChange={(e) => updateProduct(product.tempId, 'price', parseFloat(e.target.value))} className="w-full px-2 py-1 border rounded-sm" placeholder="Price" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={product.stock} onChange={(e) => updateProduct(product.tempId, 'stock', parseFloat(e.target.value))} className="w-full px-2 py-1 border rounded-sm" placeholder="Qty" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input list={`cat-${product.tempId}`} value={product.category} onChange={(e) => updateProduct(product.tempId, 'category', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Category" />
                                            <datalist id={`cat-${product.tempId}`}>{categories.map(c => <option key={`cat-${c.id || c.name}-${product.tempId}`} value={c.name} />)}</datalist>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input list={`sub-${product.tempId}`} value={product.subCategory} onChange={(e) => updateProduct(product.tempId, 'subCategory', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Sub-Cat" />
                                            <datalist id={`sub-${product.tempId}`}>
                                                {categories.find(c => c.name === product.category)?.subCategories?.map((s: string) => <option key={`sub-${s}-${product.tempId}`} value={s} />)}
                                            </datalist>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input list={`col-${product.tempId}`} value={product.collectionName} onChange={(e) => updateProduct(product.tempId, 'collectionName', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Collection" />
                                            <datalist id={`col-${product.tempId}`}>{collections.map(c => <option key={`col-${c.id || c.name}-${product.tempId}`} value={c.name} />)}</datalist>
                                        </td>
                                        <td className="px-2 py-2">
                                            <select value={product.gender} onChange={(e) => updateProduct(product.tempId, 'gender', e.target.value)} className="w-full px-2 py-1 border rounded-sm">
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>
                                                <option value="Unisex">Unisex</option>
                                            </select>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={product.colors} onChange={(e) => updateProduct(product.tempId, 'colors', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Red, Blue..." />
                                        </td>

                                        {/* New Spec fields */}
                                        <td className="px-2 py-2"><input value={product.description} onChange={(e) => updateProduct(product.tempId, 'description', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Desc" /></td>
                                        <td className="px-2 py-2"><input value={product.fabricComposition} onChange={(e) => updateProduct(product.tempId, 'fabricComposition', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Fabric" /></td>
                                        <td className="px-2 py-2"><input value={product.fit} onChange={(e) => updateProduct(product.tempId, 'fit', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Fit" /></td>
                                        <td className="px-2 py-2"><input value={product.closure} onChange={(e) => updateProduct(product.tempId, 'closure', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Closure" /></td>
                                        <td className="px-2 py-2"><input value={product.sleeveType} onChange={(e) => updateProduct(product.tempId, 'sleeveType', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Sleeve" /></td>
                                        <td className="px-2 py-2"><input value={product.washCare} onChange={(e) => updateProduct(product.tempId, 'washCare', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Wash" /></td>
                                        <td className="px-2 py-2"><input value={product.countryOfManufacture} onChange={(e) => updateProduct(product.tempId, 'countryOfManufacture', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="India" /></td>
                                        <td className="px-2 py-2"><input value={product.shippingTime} onChange={(e) => updateProduct(product.tempId, 'shippingTime', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="Time" /></td>
                                        <td className="px-2 py-2"><input value={product.imageGradient} onChange={(e) => updateProduct(product.tempId, 'imageGradient', e.target.value)} className="w-full px-2 py-1 border rounded-sm" placeholder="CSS Gradient" /></td>

                                        <td className="px-2 py-2">
                                            {/* Images logic same as before, condensed */}
                                            <div className="flex flex-wrap gap-2">
                                                {product.images.map((url, idx) => (
                                                    <div key={idx} className="w-8 h-8 relative"><img src={url} className="w-full h-full object-cover" /></div>
                                                ))}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id={`file-${product.tempId}`}
                                                    className="hidden"
                                                    onChange={(e) => handleRowImageUpload(product.tempId, e)}
                                                    disabled={uploadingRows.includes(product.tempId) || (product.images || []).length >= 5}
                                                />
                                                <label htmlFor={`file-${product.tempId}`} className="cursor-pointer text-xs border p-1 rounded-sm">+</label>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => removeRow(product.tempId)} className="text-red-500"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Footer Actions */}
                    <div className="p-4 bg-gray-50 flex gap-4">
                        <button onClick={addRow} className="flex items-center gap-2 text-sm font-semibold"><Plus size={16} /> Add Row</button>
                    </div>
                </div>
            </div>
            <div className="h-24"></div>
        </div>
    )
}
