'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { Category } from '@/lib/categories'
import { Brand } from '@/lib/brands'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageCompression'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Trash2, Loader2, Upload, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { showToast } from '@/lib/toast-utils'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Collection {
    id: number
    name: string
    description?: string
    categories?: string[]
}

interface ProductFormProps {
    initialData?: Product
    isEdit?: boolean
}

// -----------------------------------------------------------------------------
// Helper Component: Creatable Select (Combobox with "Add New")
// -----------------------------------------------------------------------------
function CreatableSelect({
    value,
    onChange,
    options,
    placeholder
}: {
    value: string
    onChange: (val: string) => void
    options: string[]
    placeholder?: string
}) {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    // Reset search value when closed or value changes? Usually resetting on open is cleaner.
    useEffect(() => {
        if (open) setSearchValue("")
    }, [open])

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchValue.toLowerCase())
    )

    const showCreate = searchValue && !options.some(opt => opt.toLowerCase() === searchValue.toLowerCase())

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal bg-background px-3 py-2 h-auto text-left"
                >
                    {value ? value : <span className="text-muted-foreground">{placeholder || "Select..."}</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search or create...`}
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        {filteredOptions.length === 0 && !showCreate && (
                            <CommandEmpty>No result found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {filteredOptions.map((opt) => (
                                <CommandItem
                                    key={opt}
                                    value={opt}
                                    onSelect={(currentValue) => {
                                        // onChange(currentValue === value ? "" : currentValue)
                                        onChange(opt)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === opt ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {opt}
                                </CommandItem>
                            ))}
                            {showCreate && (
                                <CommandItem
                                    value={searchValue}
                                    onSelect={() => {
                                        onChange(searchValue)
                                        setOpen(false)
                                    }}
                                    className="text-blue-600 font-medium"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create "{searchValue}"
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<Collection[]>([])
    const [styleCategories, setStyleCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: '',
            price: 0,
            category: '',
            collectionName: '',
            subCategory: '',
            gender: 'Unisex',
            brand: 'Butterfly Couture',
            colors: [],
            inStock: true,
            stock: 0,
            image: '', // Will store image URL
            imageUrl: '', // Additional field for uploaded images
            images: [], // Array for multiple images
            size: ['S', 'M', 'L'], // Default sizes
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
            videoUrl: '',
        }
    )
    const [uploadingImage, setUploadingImage] = useState(false)
    const [uploadingVideo, setUploadingVideo] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [compressionInfo, setCompressionInfo] = useState<string>('')

    const [colorInput, setColorInput] = useState('')


    useEffect(() => {
        // Fetch collections, categories (styles), and brands
        Promise.all([
            fetch('/api/collections').then(res => res.json()),
            fetch('/api/categories').then(res => res.json()),
            fetch('/api/brands').then(res => res.json())
        ]).then(([collectionsData, styleCategoriesData, brandsData]) => {
            if (collectionsData.success) {
                // Handle different API response formats
                setCollections(collectionsData.collections || collectionsData.data || [])
            }
            if (styleCategoriesData.success) {
                setStyleCategories(styleCategoriesData.data || [])
            }
            if (brandsData.success) {
                setBrands(brandsData.data || [])
            }
        }).catch(error => {
            console.error('Error fetching form data:', error)
        })
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (name === 'price' || name === 'stock') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleColorAdd = () => {
        if (colorInput.trim()) {
            setFormData(prev => ({
                ...prev,
                colors: [...(prev.colors || []), colorInput.trim()]
            }))
            setColorInput('')
        }
    }

    const removeColor = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            colors: (prev.colors || []).filter((_, i) => i !== idx)
        }))
    }

    const { token } = useAuth()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImage(true)
        setCompressionInfo('')

        try {
            const newImages: string[] = []
            for (const file of Array.from(files)) {
                if (!isValidImageFile(file)) {
                    showToast.warning(`${file.name} is not a valid image file. Skipping.`)
                    continue
                }

                // Compress the image before upload
                const compressedFile = await compressImage(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1200, // Reduced slightly for gallery efficiency
                    quality: 0.8,
                    useWebWorker: true
                })

                const uploadFormData = new FormData()
                uploadFormData.append('file', compressedFile)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                })

                const data = await response.json()
                if (data.success) {
                    newImages.push(data.url)
                }
            }

            if (newImages.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...newImages],
                    imageUrl: (prev.images || []).length === 0 ? newImages[0] : prev.imageUrl // Set primary if first
                }))
            }
        } catch (error) {
            console.error('Error uploading images:', error)
            showToast.error('Failed to upload some images')
        } finally {
            setUploadingImage(false)
        }
    }

    const removeImage = (index: number) => {
        setFormData(prev => {
            const updatedImages = (prev.images || []).filter((_, i) => i !== index)
            return {
                ...prev,
                images: updatedImages,
                imageUrl: updatedImages[0] || ''
            }
        })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEdit ? `/api/products/${initialData?.id}` : '/api/products'
            const method = isEdit ? 'PUT' : 'POST'

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
                router.push('/admin/products')
                router.refresh()
            } else {
                showToast.error(data.error || 'Something went wrong')
            }
        } catch (error) {
            console.error('Error saving product:', error)
            showToast.error('Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-background p-6 rounded-sm border border-border">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Brand</label>
                    <CreatableSelect
                        value={formData.brand || ""}
                        onChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}
                        options={brands.map(b => b.name)}
                        placeholder="Select or type brand"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        min="0"
                        step="1"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        min="0"
                        step="1"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                {/* Categorization */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Main Category</label>
                    <CreatableSelect
                        value={formData.category || ""}
                        onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                        options={styleCategories.map(c => c.name)}
                        placeholder="Select or type category"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Collection</label>
                    <CreatableSelect
                        value={formData.collectionName || ""}
                        onChange={(val) => setFormData(prev => ({ ...prev, collectionName: val }))}
                        options={collections.map(c => c.name)}
                        placeholder="Select or type collection"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sub-Category</label>
                    <CreatableSelect
                        value={formData.subCategory || ""}
                        onChange={(val) => setFormData(prev => ({ ...prev, subCategory: val }))}
                        options={
                            (styleCategories.find(c => c.name === formData.category)?.subCategories || []) as string[]
                        }
                        placeholder="Select or type sub-category"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender || 'Unisex'}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                {/* Colors & Sizes */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Colors</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            placeholder="Add color..."
                            className="flex-1 px-3 py-2 border border-border rounded-sm focus:outline-none bg-background text-foreground"
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleColorAdd())}
                        />
                        <button type="button" onClick={handleColorAdd} className="px-3 py-2 bg-secondary rounded-sm hover:bg-secondary/80">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.colors || []).map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-full flex items-center gap-1">
                                {c} <button type="button" onClick={() => removeColor(i)}><Trash2 size={12} /></button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'].map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => {
                                    const currentSizes = Array.isArray(formData.size) ? formData.size : []
                                    const newSizes = currentSizes.includes(size)
                                        ? currentSizes.filter(s => s !== size)
                                        : [...currentSizes, size]
                                    setFormData(prev => ({ ...prev, size: newSizes }))
                                }}
                                className={`px-4 py-2 rounded-sm font-medium transition-all border-2 ${(Array.isArray(formData.size) ? formData.size : []).includes(size)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'border-border text-foreground hover:border-primary bg-background'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-foreground/60">Click to select available sizes</p>
                </div>

                {/* Detailed Spec Fields */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Fabric Composition</label>
                    <input
                        type="text"
                        name="fabricComposition"
                        value={formData.fabricComposition}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Fit</label>
                    <input
                        type="text"
                        name="fit"
                        value={formData.fit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Closure</label>
                    <input
                        type="text"
                        name="closure"
                        value={formData.closure}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sleeve Type</label>
                    <input
                        type="text"
                        name="sleeveType"
                        value={formData.sleeveType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Wash Care</label>
                    <input
                        type="text"
                        name="washCare"
                        value={formData.washCare}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Country of Manufacture</label>
                    <input
                        type="text"
                        name="countryOfManufacture"
                        value={formData.countryOfManufacture}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Model Size</label>
                    <input
                        type="text"
                        name="modelSize"
                        value={formData.modelSize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Model Height</label>
                    <input
                        type="text"
                        name="modelHeight"
                        value={formData.modelHeight}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Shipping Time</label>
                    <input
                        type="text"
                        name="shippingTime"
                        value={formData.shippingTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Image Gradient (CSS)</label>
                    <input
                        type="text"
                        name="imageGradient"
                        value={formData.imageGradient}
                        onChange={handleChange}
                        placeholder="e.g. linear-gradient(45deg, #000, #444)"
                        className="w-full px-3 py-2 border border-border rounded-sm"
                    />
                </div>


                {/* Images */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Product Gallery (Add 4-5 images)</label>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            {(formData.images || []).map((url, index) => (
                                <div key={index} className="relative group w-32 h-32 border border-border rounded-sm overflow-hidden bg-secondary">
                                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center font-bold">
                                            MAIN
                                        </div>
                                    )}
                                </div>
                            ))}
                            {uploadingImage && (
                                <div className="w-32 h-32 border border-dashed border-primary rounded-sm flex items-center justify-center animate-pulse">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm cursor-pointer hover:bg-primary/90 transition-all shadow-sm"
                            >
                                <Plus size={18} />
                                <Upload size={18} />
                                Add Photos
                            </label>
                            <p className="text-xs text-foreground/50">Primary photo will be the first one.</p>
                        </div>
                    </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Product Video (Compressed to .webm at 32 CRF)</label>
                    <div className="space-y-4">
                        {formData.videoUrl && (
                            <div className="relative group w-full max-w-[300px] aspect-[3/4] border border-border rounded-sm overflow-hidden bg-secondary shadow-sm">
                                <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-sm backdrop-blur-sm">
                                    15s Preview
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    setUploadingVideo(true)
                                    setUploadProgress(0)
                                    try {
                                        const uploadFormData = new FormData()
                                        uploadFormData.append('file', file)

                                        const xhr = new XMLHttpRequest()

                                        // Track upload progress
                                        xhr.upload.onprogress = (event) => {
                                            if (event.lengthComputable) {
                                                const percentComplete = Math.round((event.loaded / event.total) * 100)
                                                setUploadProgress(percentComplete)
                                            }
                                        }

                                        const uploadPromise = new Promise((resolve, reject) => {
                                            xhr.onload = () => {
                                                if (xhr.status >= 200 && xhr.status < 300) {
                                                    resolve(JSON.parse(xhr.responseText))
                                                } else {
                                                    try {
                                                        const errorData = JSON.parse(xhr.responseText)
                                                        reject(new Error(errorData.error || 'Upload failed'))
                                                    } catch (e) {
                                                        reject(new Error('Upload failed'))
                                                    }
                                                }
                                            }
                                            xhr.onerror = () => reject(new Error('Network error during upload'))
                                            xhr.onabort = () => reject(new Error('Upload aborted'))
                                        })

                                        xhr.open('POST', '/api/upload')
                                        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
                                        xhr.send(uploadFormData)

                                        const data: any = await uploadPromise
                                        if (data.success) {
                                            setFormData(prev => ({ ...prev, videoUrl: data.url }))
                                        } else {
                                            showToast.error(data.error || 'Video upload failed')
                                        }
                                    } catch (err: any) {
                                        console.error('Video upload error:', err)
                                        showToast.error(err.message || 'Video upload failed')
                                    } finally {
                                        setUploadingVideo(false)
                                        setUploadProgress(0)
                                    }
                                }}
                                disabled={uploadingVideo}
                                className="hidden"
                                id="video-upload"
                            />
                            <label
                                htmlFor="video-upload"
                                className="flex items-center gap-2 px-6 py-2 bg-secondary text-secondary-foreground font-medium rounded-sm cursor-pointer hover:bg-secondary/80 transition-all shadow-sm"
                            >
                                {uploadingVideo ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                <Upload size={18} />
                                {uploadingVideo ? 'Compressing & Uploading...' : 'Add Product Video'}
                            </label>
                            <p className="text-xs text-foreground/50">Max size 500MB. Optimized for web.</p>
                        </div>

                        {uploadingVideo && (
                            <div className="space-y-2 w-full max-w-[300px]">
                                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-primary">
                                    <span>{uploadProgress < 100 ? 'Uploading...' : 'Processing & Compressing...'}</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                {uploadProgress === 100 && (
                                    <p className="text-[10px] text-foreground/40 italic">
                                        Note: Compression can take 1-2 minutes for large videos.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                    <input
                        type="checkbox"
                        name="inStock"
                        id="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="inStock" className="text-sm font-medium text-foreground cursor-pointer">In Stock</label>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border mt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-sm transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    )
}
