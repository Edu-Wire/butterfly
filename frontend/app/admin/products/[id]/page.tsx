'use client'

import { ProductForm } from '@/components/admin/ProductForm'
import { useEffect, useState, use } from 'react'
import { Product } from '@/lib/products'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProduct(data.data)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div>Loading...</div>
    if (!product) return <div>Product not found</div>

    return (
        <>
            <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-6">
                    <h1 className="font-serif text-3xl font-bold text-black">
                        Edit Product
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Update existing product details
                    </p>
                </div>
            </div>

            <div className="p-6">
                <ProductForm initialData={product} isEdit />
            </div>
        </>
    )
}
